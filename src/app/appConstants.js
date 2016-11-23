(function() {
    'use strict';

	angular
		.module('app')
		.constant('appConstant', {
			
			//To validate file extenstion on upload
			EXT_CSV: 'csv',
			EXT_XML: 'xml',
			
			//Regex to extract extension from filename
			REGEX_EXT: /(?:\.([^.]+))?$/,
			
			//Reference for Json Keys
			RECORDS_INDEX : {
				accountNumber: 'Account Number',
				description: 'Description',
				endBalance: 'End Balance',
				mutation: 'Mutation',
				reference: 'Reference',
				startBalance: 'Start Balance'
			},
			
			//urls
			TYPE_CSV: 'csv',
			TYPE_XML: 'xml',
			URL_CSV: 'assets/content/records.csv',
			URL_XML: 'assets/content/records.xml'
		});
})();