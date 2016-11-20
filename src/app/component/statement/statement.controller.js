(function() {
    'use strict';

    angular
		.module('app.statement')
		.controller('StatementController', StatementController);
	
	StatementController.$inject = ['fileReader'];
	
	function StatementController(fileReader) {
		var vm			=	this;
		vm.data			=	'';
		vm.uploadFile	=	uploadFile;
		
		function uploadFile() {
			var uploadedFile	=	document.getElementById('importFile').files[0];
			
			fileReader
				.read(uploadedFile)
				.then(function(result) {
					vm.data		=	result;
					
					//call back function to further process
					console.log(fileReader.CSVToArray(vm.data));
				});
		}
	}
})();
