(function() {
    'use strict';
	
    angular
		.module('app.statement')
		.directive('statementDirective', statementDirective);
	
	function statementDirective() {
		return {
            restrict : 'E',
            templateUrl : 'app/component/statement/statement.html',
			controller: 'StatementController',
            controllerAs: 'vm'
        };
	}
})();
