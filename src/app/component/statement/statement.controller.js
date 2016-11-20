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
		vm.uploadFile	=	uploadFile;
		
		function uploadFile() {
			var uploadedFile	=	document.getElementById('importFile').files[0];
			var ext				=	appConstant.REGEX_EXT.exec(uploadedFile.name.toLowerCase())[1];
				
			if(_validate(uploadedFile, ext))
			{
				fileReader
					.read(uploadedFile)
					.then(function(result) {
						vm.data	=	ext === appConstant.EXT_CSV
										? fileReader.CsvToJson(result)
										: fileReader.XmlToJson(result);

						//call back function to further process
						console.log(vm.data);
					});
			}
			
			_resetForm();
		}
		
		function _validate(file, ext) {
			var ret			=	true;
			
			try {
				if(typeof file.name === 'undefined' || file.name.length === 0)
					throw "Error Invalid file";
				
				if(ext !== appConstant.EXT_CSV && ext !== appConstant.EXT_XML)
					throw "Error Invalid file extension";
				
			} catch(err) {
				console.log(err);
				ret	=	false;
			}
			
			return ret;
		}
		
		function _resetForm() {
			vm.fileExt	=	'';
		}
	}
})();
