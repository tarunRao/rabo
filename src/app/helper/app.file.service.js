(function() {
    'use strict';

    angular
		.module('app')
		.service('fileReader', fileReader);

	fileReader.$inject = ['$q'];

	function fileReader($q) {
		this.read		=	readFile;
		this.CsvToJson	=	CsvToJson;
		
		function readFile(file) {
			var deferred	=	$q.defer(),
				reader		=	new FileReader();

			reader.onloadend	=	resolvePromise;

			reader.readAsBinaryString(file);
			
			return deferred.promise;
			
			function resolvePromise(e) {
				deferred.resolve(e.target.result);
			};
		}
		
		function CsvToJson(strData, strDelimiter) {
			strDelimiter	=	(strDelimiter || ',');

			var objPattern	=	new RegExp(
				(
					// Delimiters.
					"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

					// Quoted fields.
					"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

					// Standard fields.
					"([^\"\\" + strDelimiter + "\\r\\n]*))"
				),
				"gi"
				);

			//Format to Array
			var arrData		=	[[]];
			var arrMatches	=	null;
			
			while (arrMatches = objPattern.exec(strData)) {

				var strMatchedDelimiter	=	arrMatches[ 1 ];
				
				if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
					arrData.push([]);
				}
				
				var strMatchedValue;

				if (arrMatches[ 2 ]) {
					strMatchedValue	=	arrMatches[ 2 ].replace(new RegExp( "\"\"", "g" ), "\"");
				} else {
					strMatchedValue =	arrMatches[ 3 ];
				}

				arrData[ arrData.length - 1 ].push(strMatchedValue);
			}

			//Convert to JSON
			var jsonData	=	[];
			var headings	=	arrData.length > 0 ? arrData[0] : '';
			
			if(headings.length > 0)
			{
				var i, j, iLen, jLen, values;
				
				iLen		=	arrData.length;
				
				for(i = 1; i < iLen; i++) {
					values	=	{};
					jLen	=	arrData[i].length;
					
					if(typeof arrData[i][0] === 'undefined' || arrData[i][0].length === 0)
						continue;
					
					for(j = 0; j < jLen; j++) {
						values[headings[j]]	=	arrData[i][j];
					}
					
					jsonData.push(values);
				}
			}
			
			return jsonData;
		}
		
	}
})();
