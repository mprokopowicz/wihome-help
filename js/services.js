angular.module('WihomeHelp.services', [])

.factory('LibraryIndex', function($http, $q){
	var LibraryIndexService = function() {
		
		var cache = false;
		
		function SummaryItem() {
			this.name;
			this.shortName;
			this.description;
			this.idHelp;
			this.subcategories = [];
		};
		
		SummaryItem.prototype.setName = function(name) {
			this.name = name;
			var splitted = name.split(" - ");
			this.shortName = splitted[0];
			this.description = splitted[1];
		};
		
		SummaryItem.prototype.setIdHelp = function(href) {
			var splitted = href.split("/");
			this.idHelp = splitted[1];
			console.log(this.idHelp);
		};
		
		SummaryItem.prototype.setSubcategories = function(subcategories) {
			this.subcategories = subcategories;
		};
		
		this.getIndex = function() {
			var result = [],
				promises = [],
				deferred = $q.defer();
			
			promises.push($http.get("data/summary.json")); 
			promises.push($http.get("data/summary_en_US.json"));
			$q.all(promises).then(function(responses) {
				var summary = responses[0].data.summary;
				var translations = responses[1].data;
				
				angular.forEach( summary, function(rootCategory, translationKey ){
					var summaryItem = new SummaryItem();
					summaryItem.setName( translations[translationKey] );
					
					var subcategories = [];
					angular.forEach(rootCategory, function(subcategory) {
						var childSummaryItem = new SummaryItem();
						childSummaryItem.setName( translations[subcategory.id] );
						childSummaryItem.setIdHelp( subcategory.href );
						subcategories.push(childSummaryItem);
					});
					summaryItem.setSubcategories(subcategories);
					
					result.push(summaryItem);
				});
				cache = result;
				deferred.resolve(result);
			});
			
			return deferred.promise;
		};
		
		this.getById = function(idHelp) {
			var result = false;
			angular.forEach(cache, function(category) {
				angular.forEach(category.subcategories, function(summaryItem){
					
					if( summaryItem.idHelp === idHelp ) {
						result = summaryItem;
						return;
					}
				});
				if( result !== false )
					return;
			});
			
			return result;
		};
		
		this.searchByName = function(query) {
			var results = [];
			query = query.toUpperCase();
			angular.forEach(cache, function(category) {
				angular.forEach(category.subcategories, function(summaryItem){
					console.log(summaryItem);
					var name = summaryItem.name.toUpperCase();
					if( name.indexOf(query) !== -1 ) {
						results.push(summaryItem);
					} 
				});
			});
			
			return results;
		}
		
	};
	
	return new LibraryIndexService();
	
});