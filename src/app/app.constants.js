(function() {
    'use strict';

	angular
		.module('app')
		.constant('appConstant', {
			'EXT_CSV': 'csv',
			'EXT_XML': 'xml',
			'REGEX_EXT': /(?:\.([^.]+))?$/,
			'TRANSACTION_INDEXES' : {
				'accountNumber': 'Account Number',
				'description': 'Description',
				'endBalance': 'End Balance',
				'mutation': 'Mutation',
				'reference': 'Reference',
				'startBalance': 'Start Balance'
			}
		});
})();