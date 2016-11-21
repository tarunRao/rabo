(function() {
    'use strict';

    angular
		.module('app.statement')
		.controller('StatementController', StatementController);
	
	StatementController.$inject = ['fileReader', 'appConstant'];
	
	function StatementController(fileReader, appConstant) {
		var vm			=	this;
		vm.data			=	'';
		vm.fileExt		=	'';
		vm.transactions	=	{};
		vm.errors		=	[];
		vm.canShowValid	=	false;
		vm.errorMessage	=	false;
		
		vm.uploadFile	=	uploadFile;
		vm.resetForm	=	resetForm;
		
		function uploadFile() {
			_resetData();
			
			var uploadedFile	=	document.getElementById('importFile').files[0];
			
			if(_validateFile(uploadedFile))
			{
				console.log(uploadedFile);
				fileReader
					.read(uploadedFile)
					.then(function(result) {
						if(vm.fileExt === appConstant.EXT_CSV) {
							vm.data		=	fileReader.CsvToJson(result);
							console.log(vm.data);
						} else {
							var parser	=	new DOMParser();
							result		=	parser.parseFromString(result, 'text/xml');
							vm.data		=	fileReader.XmlToJson(result);
							vm.data		=	typeof vm.data.records !== 'undefined' ? vm.data.records.record : '';
						}
						
						_validateRecords(vm.data);
					});
			}
		}
		
		function resetForm() {
			document.getElementById('importFile').value	=	null;
			_resetData();
		}
		
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
					
					if(typeof vm.transactions[record.reference] !== 'undefined') {
						
						//catch 1st duplicate
						vm.errors.push(record);
						vm.errors.push(vm.transactions[record.reference]);
						delete vm.transactions[record.reference];
						
						//store for next occurences
						duplicates.push(record.reference);
						
					} else if(duplicates.indexOf(record.reference) >= 0) {
						
						//cross check duplicate entries
						vm.errors.push(record);
						
					} else if((valueStart + valueMutated).toFixed(2) != valueEnd) {
						
						//wrong end balance
						vm.errors.push(record);
						
					} else {
						
						//good record
						vm.transactions[record.reference]	=	record;
					}
					
				} catch(err) {
					vm.errorMessage	=	err;
					break;
				}			
			}
			
			vm.canShowValid		=	Object.keys(vm.transactions).length > 0;
		}
		
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
		
		function _resetData() {
			vm.fileExt		=	'';
			vm.transactions	=	{};
			vm.errors		=	[];
			vm.canShowValid	=	false;
			vm.errorMessage	=	false;
		}
	}
})();
