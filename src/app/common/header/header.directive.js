(function() {
    'use strict';
	
    angular
		.module('app')
		.directive('headerDirective', headerDirective);
	
	function headerDirective() {
		return {
            restrict : 'E',
            templateUrl : 'app/common/header/header.html'
        };
	}
})();
