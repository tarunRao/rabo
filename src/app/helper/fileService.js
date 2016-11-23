(function() {
    'use strict';

    angular
		.module('app')
		.service('fileReader', fileReader);

	//Inject dependency - promist and constants
	fileReader.$inject = ['$q', 'appConstant'];
	
	function fileReader($q, appConstant) {
		//init values
		var service			=	this;
		service.read		=	readFile;
		service.CsvToJson	=	CsvToJson;
		service.XmlToJson	=	XmlToJson;
		
		/*
		 * Function to read file
		 */
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
		
		/*
		 * Recursive Function to convert XML To JSON
		 */
		function XmlToJson(node) {
			var	data	=	{};
			
			//function to append data
			//----------------------------------->
			function Add(name, value) {
				if (data[name]) {
					if (data[name].constructor != Array) {
						data[name]	=	[data[name]];
					}
					data[name][data[name].length]	=	value;
				}
				else {
					data[name]	=	value;
				}
			};

			//check for node attributes
			//----------------------------------->
			if(typeof node.attributes !== 'undefined')
			{
				// element attributes
				var c, cn;
				for (c = 0; cn = node.attributes[c]; c++) {
					Add(cn.name, cn.value);
				}
			}

			//recursive check for child elements
			//----------------------------------->
			for (c = 0; cn = node.childNodes[c]; c++) {
				if (cn.nodeType == 1) {
					if (cn.childNodes.length == 1 && cn.firstChild.nodeType == 3) {
						// text value
						Add(cn.nodeName, cn.firstChild.nodeValue);
					}
					else {
						// sub-object
						Add(cn.nodeName, XmlToJson(cn));
					}
				}
			}

			return data;
		}
		
		/*
		 * Function to convert CSV To JSON
		 *  - default delimiter is comma(,)
		 */
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

			//Prasing CSV data to Array
			//--------------------------->
			var arrData		=	[[]];
			var arrMatches	=	null;
			
			while (arrMatches = objPattern.exec(strData)) {

				var strMatchedDelimiter	=	arrMatches[1];
				
				if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
					arrData.push([]);
				}
				
				var strMatchedValue;

				if (arrMatches[2]) {
					strMatchedValue	=	arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
				} else {
					strMatchedValue =	arrMatches[3];
				}

				arrData[ arrData.length - 1 ].push(strMatchedValue);
			}

			//Convert Array result to JSON
			//--------------------------->
			var jsonData	=	[];
			var headings	=	arrData.length > 0 ? arrData[0] : '';
			
			if(headings.length > 0)
			{
				var i, j, iLen, jLen, key, result;
				
				iLen		=	arrData.length;
				
				for(i = 1; i < iLen; i++) {
					result	=	{};
					jLen	=	arrData[i].length;
					
					if(typeof arrData[i][0] === 'undefined' || arrData[i][0].length === 0)
						continue;
					
					//using proper key names from constant
					for(j = 0; j < jLen; j++) {
						key			=	_getKeyByValue(appConstant.RECORDS_INDEX, headings[j]);
						result[key]	=	arrData[i][j];
					}
					
					jsonData.push(result);
				}
			}
			
			return jsonData;
		}
		
		/*
		 * Private function to get valid key
		 */
		function _getKeyByValue(obj, value) {
			var prop;
			
			for(prop in obj) {
				if(obj.hasOwnProperty(prop)) {
					if(obj[prop] === value )
						return prop;
				}
			}
		}
		
	}
})();
