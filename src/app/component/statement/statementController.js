(function() {
    'use strict';

    angular
		.module('app.statement')
		.controller('StatementController', StatementController);
	
	//Inject dependency - http service, fileReader service, constant
	StatementController.$inject = ['$http', 'fileReader', 'appConstant'];
	
	function StatementController($http, fileReader, appConstant) {
		//init values
		var vm				=	this;
		vm.data				=	'';
		vm.fileExt			=	'';
		vm.validRecords		=	{};
		vm.invalidRecords	=	[];
		vm.canShowValid		=	false;
		vm.errorMessage		=	false;
		vm.appConstant		=	appConstant;
		
		//public functions
		vm.loadFile		=	loadFile;
		vm.uploadFile	=	uploadFile;
		vm.resetForm	=	resetForm;
		
		/*
		 * Function to load CSV / XML via $http service
		 */
		function loadFile(type) {
			_resetData();
			
			var url		=	type === appConstant.TYPE_CSV ? appConstant.URL_CSV : appConstant.URL_XML;
			
			$http({method: 'GET', url: url})
				.success(function(result, status, headers, config) {
					//throw if error
					if( ! result)
					{
						vm.errorMessage	=	'Empty records found';
						return;
					}
					
					//parse file based on type
					if(type === appConstant.TYPE_CSV)
					{
						vm.data	=	fileReader.CsvToJson(result);
					}
					else
					{
						var parser	=	new DOMParser();
						result		=	parser.parseFromString(result, 'text/xml');
						vm.data		=	fileReader.XmlToJson(result);
						vm.data		=	typeof vm.data.records !== 'undefined' ? vm.data.records.record : '';
					}
					
					//validate records to match our criteria
					_validateRecords(vm.data);
				})
				.error(function(data, status, headers, config) {
					vm.errorMessage	=	'Error occurred while loading';
				});
		}
		
		/*
		 * Function to upload file & parse
		 */
		function uploadFile() {
			_resetData();
			
			var uploadedFile	=	document.getElementById('importFile').files[0];
			
			if(_validateFile(uploadedFile))
			{
				fileReader
					.read(uploadedFile)
					.then(function(result) {
						
						if(vm.fileExt === appConstant.EXT_CSV) {
							vm.data		=	fileReader.CsvToJson(result);
						} else {
							var parser	=	new DOMParser();
							result		=	parser.parseFromString(result, 'text/xml');
							vm.data		=	fileReader.XmlToJson(result);
							vm.data		=	typeof vm.data.records !== 'undefined' ? vm.data.records.record : '';
						}
						
						//validating records
						_validateRecords(vm.data);
					});
			}
		}
		
		/*
		 * Function to reset form
		 */
		function resetForm() {
			document.getElementById('importFile').value	=	null;
			_resetData();
		}
		
		/*
		 * Private function to validate records
		 *  - check all fields exist
		 *  - check unique reference
		 *  - check end balance tally
		 */
		function _validateRecords(data) {
			var i, record;
			var valueStart		=	0,
				valueEnd	=	0,
				valueMutated	=	0,
				duplicates	=	[];
			
			for(i in data)
			{
				try
				{
					record	=	data[i];

					//Validating Invalid Data Structure
					if( ! record.reference || typeof record.reference === 'undefined')
						throw "Reference not found";
					
					if( ! record.accountNumber || typeof record.accountNumber === 'undefined')
						throw "Account number not found";
					
					if( ! record.description || typeof record.description === 'undefined')
						throw "Description not found";
					
					if(typeof record.startBalance === 'undefined')
						throw "Start Balance not found";
					
					if(typeof record.mutation === 'undefined')
						throw "Mutation not found";
					
					if(typeof record.endBalance === 'undefined')
						throw "End Balance not found";
					
					//Validating for Bad records
					valueStart		=	Number(record.startBalance);
					valueStart		=	isNaN(valueStart) ? 0 : valueStart;
					valueEnd		=	Number(record.endBalance);
					valueEnd		=	isNaN(valueEnd) ? 0 : valueEnd;
					valueMutated	=	Number(record.mutation);
					valueMutated	=	isNaN(valueMutated) ? 0 : valueMutated;
					
					if(typeof vm.validRecords[record.reference] !== 'undefined') {
						
						//catch 1st duplicate
						vm.invalidRecords.push(record);
						vm.invalidRecords.push(vm.validRecords[record.reference]);
						delete vm.validRecords[record.reference];
						
						//store for next occurences
						duplicates.push(record.reference);
						
					} else if(duplicates.indexOf(record.reference) >= 0) {
						
						//cross check duplicate entries
						vm.invalidRecords.push(record);
						
					} else if((valueStart + valueMutated).toFixed(2) != valueEnd) {
						
						//wrong end balance
						vm.invalidRecords.push(record);
						
					} else {
						
						//good record
						vm.validRecords[record.reference]	=	record;
					}
					
				} catch(err) {
					vm.errorMessage	=	err;
					break;
				}			
			}
			
			vm.canShowValid		=	Object.keys(vm.validRecords).length > 0;
		}
		
		/*
		 * Private function to validate uploaded file
		 */
		function _validateFile(file) {
			var ret	=	true;
			
			try {
				if(typeof file === 'undefined')
					throw "Error file not found";
					
				if(typeof file.name === 'undefined' || file.name.length === 0)
					throw "Error invalid file";
				
				var ext	=	appConstant.REGEX_EXT.exec(file.name.toLowerCase())[1];
				
				if(ext !== appConstant.EXT_CSV && ext !== appConstant.EXT_XML)
					throw "Error Invalid file type";
				
				vm.fileExt	=	ext;
				
			} catch(err) {
				vm.errorMessage	=	err;
				ret	=	false;
			}
			
			return ret;
		}
		
		/*
		 * Private function to reset data
		 */
		function _resetData() {
			vm.fileExt		=	'';
			vm.validRecords	=	{};
			vm.invalidRecords		=	[];
			vm.canShowValid	=	false;
			vm.errorMessage	=	false;
		}
	}
})();
