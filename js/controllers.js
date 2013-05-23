'use strict';

function MainController($scope, Globalization) {
	$scope.strings = Globalization.getStrings();
}

function SearchController($scope, LibraryIndex) {
	$scope.query = "";
	$scope.results = [];

	$scope.$watch('query', function() {
		if ($scope.query.length > 0) {
			$scope.results = LibraryIndex.searchByName($scope.query);
		} else {
			$scope.results = [];
		}
	});
}

function IndexAsideController($scope, LibraryIndex, Globalization) {
	

	var index = LibraryIndex.getIndex();
	$scope.libraryIndex = index;
	$scope.isRoot = true;

	$scope.testClick = function() {
		console.log("Click!", Date.now());
	};

	$scope.setCategories = function(category) {
		if (category.subcategories.length) {
			$scope.currentCategory = category;
			$scope.isRoot = false;
			$scope.libraryIndex = category.subcategories;
		} else {
			return;
		}
	};
	
	$scope.goBack = function() {
		$scope.currentCategory = false;
		$scope.libraryIndex = index;
		$scope.isRoot = true;
		
	};
}

function HelpController($scope, $routeParams, HelpDocument, $anchorScroll) {

	$scope.$on('$routeChangeSuccess', function() {
		if( $routeParams.id ) {
			$scope.helpDocument = HelpDocument.getByIdHelp($routeParams.id);
			$scope.helpDocument.then(function(){
				setTimeout(function(){
					$scope.$apply(function(){
						$anchorScroll();
					});
				},50);
			});
		}
	});

}