angular.module('WihomeHelp.services', [])

.factory('HelpDocument', function($http, $q, LibraryIndex, Globalization) {
	function HelpDocument(content, title, language) {
		this.content = content;
		this.title = title;
		this.language = language;
	};

	HelpDocument.prototype.getContent = function() {
		return this.content;
	};
	HelpDocument.prototype.getTitle = function() {
		return this.title;
	};
	HelpDocument.prototype.getLanguage = function() {
		return this.language;
	};


	function HelpDocumentService() {

		function getMatches(string, regex) {
			var matches = [];
			var match;
			while (match = regex.exec(string)) {
				matches.push(match);
			}
			return matches;
		}
		
		this.getByIdHelp = function(idHelp) {
			var defered = $q.defer(),
					splitted = idHelp.split("."),
					path = "data/" + splitted[0] + "/" + idHelp + "/",
					htmlFile = path + splitted[1] + ".html",
					promises = [];

			promises.push($http.get(htmlFile));
			promises.push(Globalization.getLanguage());

			$q.all(promises).then(function(responses) {
				var documentHtml = responses[0].data,
					lang = responses[1],
					translationFile = path + splitted[1] + lang + ".json";
					
				$http.get(translationFile).then( function(translationResponse){
					documentHtml = documentHtml.replace(/\n/gm, " ");
					var matches = documentHtml.match(/<div id="strona">(.*)<\/body>/i);
					if (matches.length === 2) {
						var templateHtml = matches[1];

						/* Remove div#naglowek_leva and div#naglowek_prawa */
						var headersRegExp = /<div id="naglowek_lewa">.*<\/div>.*<div id="nazwa"><div id="xnazwa1"><\/div><\/div>/i;
						var headersHtml = templateHtml.match(headersRegExp)[0];

						templateHtml = templateHtml.replace(headersHtml, '');


						/* Convert translations jsonp to json */

						var langJsonp = translationResponse.data;
						langJsonp = langJsonp.substring( langJsonp.indexOf("\n") + 1 );

						if (langJsonp.lastIndexOf("\n") > 0) {
							langJsonp = langJsonp.substring(0, langJsonp.lastIndexOf("\n"));
						}

						var langObject = angular.fromJson(langJsonp);

						/* Apply translations */
						angular.forEach(langObject, function(translation, id){
							var translationRegExp = new RegExp('id="' + id + '">', 'g');
							templateHtml = templateHtml.replace(translationRegExp, 'id="' + id + '">' + translation);
						});
						
						/* Update links */
						var hrefRegExp = new RegExp('href=("|\')(\.\.\/){1,2}([0-9]{1,2}\/)?([0-9]{1,2}\.[0-9]{1,3})\/[0-9]{1,3}\.html(#[a-z0-9]+)?("|\')', 'gim');
						var matches = getMatches(templateHtml, hrefRegExp);
						angular.forEach(matches,function(match){
							var helpId = match[4],
								oldHref = match[0],
								anchor = match[5] ? match[5] : "",
								splitted = helpId.split("."),
								newHref = 'href="#/help/view/' + helpId +  anchor + '"';
							templateHtml = templateHtml.replace( new RegExp(oldHref, 'g'), newHref );
						});


						/* Update images paths */
						var imagesRegExp = new RegExp('src="', 'g');
						templateHtml = templateHtml.replace(imagesRegExp, 'src="' + path );

						var summaryItem = LibraryIndex.getById(idHelp);

						defered.resolve(new HelpDocument(templateHtml, summaryItem.name));
					} else {
						defered.reject("Can't find div #strona.");
					};
				});
					
		


			}, function() {
				alert("error");
			});


			return defered.promise;
		};
	}
	;


	return new HelpDocumentService();
})

.factory('LibraryIndex', function($http, $q, Globalization) {
	var LibraryIndexService = function() {

		var cache = false;

		function SummaryItem() {
			this.name;
			this.shortName;
			this.description;
			this.idHelp;
			this.subcategories = [];
		}
		;

		SummaryItem.prototype.setName = function(name) {
			this.name = name;
			var splitted = name.split(" - ");
			this.shortName = splitted[0];
			this.description = splitted[1];
		};

		SummaryItem.prototype.setIdHelp = function(href) {
			var splitted = href.split("/");
			this.idHelp = splitted[1];
		};

		SummaryItem.prototype.setSubcategories = function(subcategories) {
			this.subcategories = subcategories;
		};

		this.getIndex = function() {
			var result = [],
					promises = [],
					deferred = $q.defer();

			promises.push($http.get("data/summary.json"));
			promises.push(Globalization.getLanguage());
			
			$q.all(promises).then(function(responses) {
				var summary = responses[0].data.summary;
				var lang = responses[1];
				
				$http.get("data/summary_" + lang + ".json").then(function(translationResponse) {
					var translations = translationResponse.data;
					angular.forEach(summary, function(rootCategory, translationKey) {
						var summaryItem = new SummaryItem();
						summaryItem.setName(translations[translationKey]);

						var subcategories = [];
						angular.forEach(rootCategory, function(subcategory) {
							var childSummaryItem = new SummaryItem();
							childSummaryItem.setName(translations[subcategory.id]);
							childSummaryItem.setIdHelp(subcategory.href);
							subcategories.push(childSummaryItem);
						});
						summaryItem.setSubcategories(subcategories);

						result.push(summaryItem);
					});
					cache = result;
					deferred.resolve(result);
				});
				

			});

			return deferred.promise;
		};

		this.getById = function(idHelp) {
			var result = false;
			angular.forEach(cache, function(category) {
				angular.forEach(category.subcategories, function(summaryItem) {

					if (summaryItem.idHelp === idHelp) {
						result = summaryItem;
						return;
					}
				});
				if (result !== false)
					return;
			});

			return result;
		};

		this.searchByName = function(query) {
			var results = [];
			query = query.toUpperCase();
			angular.forEach(cache, function(category) {
				angular.forEach(category.subcategories, function(summaryItem) {
					var name = summaryItem.name.toUpperCase();
					if (name.indexOf(query) !== -1) {
						results.push(summaryItem);
					}
				});
			});

			return results;
		};

	};

	return new LibraryIndexService();
})

.factory('Globalization', function($q, $http) {
	
	var defualtLanguage = "en_US",
		supportedLanguages = [
			{
				name: "Polski",
				code: "pl_PL"
			},
			{
				name: "English",
				code: "en_US"
			}
		];
	
	function findSupportedLanguage( lang, searchBy) {
		if(!searchBy) searchBy = 'name';
		lang = lang.toLowerCase();
		for(var i = 0; i < supportedLanguages.length; i++ ) {
			var searchIn = supportedLanguages[i][searchBy].toLowerCase();
			if( searchIn.indexOf(lang) !== -1 ) {
				return supportedLanguages[i].code;
			}
		}
		return defualtLanguage;
	}
	
	function getLanguage() {
		var defered = $q.defer();
		if( "globalization" in navigator ) {
			//We are on phone gap
			navigator.globalization.getPreferredLanguage(function(language){
				defered.resolve( findSupportedLanguage(language.value, 'name') );
			});
		} else {
			//We are in standard browser
			defered.resolve( findSupportedLanguage(navigator.language, 'code'));
		}
		return defered.promise;
	}
	
	return {
		getLanguage: getLanguage,
		getSupportedLanguages: function() {
			return supportedLanguages;
		},
		getStrings: function() {
			var defered = $q.defer();
			getLanguage().then(function(locale){
				$http.get("data/" + locale + ".json").then(function(strings){
					defered.resolve(strings.data);
				});
			});
			return defered.promise;
			
		}
	};
});

