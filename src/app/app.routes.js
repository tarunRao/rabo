/*(function() {
    'use strict';

    var app		=	angular.module('app', ['ngRoute']);
	
	app.config(function($routeProvider)
    {
        $routeProvider
			.when('/', {
				templateUrl: 'app/core/homeView.html'
			})
			.when('/error', {
				templateUrl: 'app/core/errorView.html'
			})
			.otherwise({redirectTo : '/error'});
    });
})();
*/