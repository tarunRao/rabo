(function() {
    'use strict';

	angular
		.module('app')
		.constant('appConstant', {
			'EXT_CSV': 'csv',
			'EXT_XML': 'xml',
			'REGEX_EXT': /(?:\.([^.]+))?$/
		});
})();