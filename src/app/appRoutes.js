(function() {
    'use strict';

    angular.module('app')
		.config(function($stateProvider, $urlRouterProvider)
		{
			//states to handle content
			$stateProvider
				.state('index', {
					url: '',
					views: {
						header: {
							templateUrl: 'app/common/header/header.html',
						},
						content: {
							templateUrl: 'app/component/statement/statement.html',
							controller: 'StatementController as statement'
						}
					}
				})
				.state('error', {
					views: {
						header: {
							templateUrl: 'app/common/header/header.html',
						},
						content: {
							templateUrl: 'app/common/error/404.html'
						}
					}
				});

			//Redirect to error page
			$urlRouterProvider.otherwise(function($injector, $location){
				var state = $injector.get('$state');
				state.go('error');
				return $location.path();
			});

		});
})();