(function() {
    'use strict';

    angular
		.module('app.statement')
		.controller('StatementController', StatementController);
	
	StatementController.$inject = ['$scope', 'fileReader', 'appConstant'];
	
	function StatementController($scope, fileReader, appConstant) {
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
						vm.data		=	vm.fileExt === appConstant.EXT_CSV
											? fileReader.CsvToJson(result)
											: fileReader.XmlToJson(result);
						
						_validateRecords(vm.data);
					});
			}
		}
		
		function resetForm() {
			document.getElementById('importFile').value	=	null;
			_resetData();
		}
		
		function _validateRecords(data) {
			var i, record, idTransaction;
			var valueStart		=	0,
				valueEnd		=	0,
				valueMutated	=	0,
				indexes			=	appConstant.TRANSACTION_INDEXES;
			
			for(i in data)
			{
				try
				{
					record	=	data[i];

					//Validating Invalid Data Structure
					if( ! record[indexes.idTransaction] || typeof record[indexes.idTransaction] === 'undefined')
						throw "Reference not found";
					
					if( ! record[indexes.accountNo] || typeof record[indexes.accountNo] === 'undefined')
						throw "Account number not found";
					
					if( ! record[indexes.description] || typeof record[indexes.description] === 'undefined')
						throw "Description not found";
					
					if(typeof record[indexes.startBalance] === 'undefined')
						throw "Start Balance not found";
					
					if(typeof record[indexes.mutation] === 'undefined')
						throw "Mutation not found";
					
					if(typeof record[indexes.endBalance] === 'undefined')
						throw "End Balance not found";
					
					//Validating for Bad records
					idTransaction	=	record[indexes.idTransaction];
					valueStart		=	Number(record[indexes.startBalance]);
					valueStart		=	isNaN(valueStart) ? 0 : valueStart;
					valueEnd		=	Number(record[indexes.endBalance]);
					valueEnd		=	isNaN(valueEnd) ? 0 : valueEnd;
					valueMutated	=	Number(record[indexes.mutation]);
					valueMutated	=	isNaN(valueMutated) ? 0 : valueMutated;
					
					if( ! vm.transactions[idTransaction] && (valueStart + valueMutated) === valueEnd) {
						vm.transactions[idTransaction]	=	record;
					} else {
						vm.errors.push(record);
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
					throw "Error Invalid file extension";
				
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
