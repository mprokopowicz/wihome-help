'use strict';

function toggleRightAside() {
	Lungo.View.Aside.toggle('#rightaside');
}

function AppCtrl($scope) {
	$scope.name = "Some name";
	/**
	 * A short cut to manually refresh the application from the example/ directory
	 */
	$scope.refreshApplication = function() {
		window.location = '/examples/simple/index.html';
	}


	scope.$on('$routeChangeStart', function(next, current) {
		console.log(arguments);
	});


	console.log('AppCtrl::AppCtrl() - Instantiated');

	$scope.triggerAside = function() {
		console.log('triggering aside');
		Lungo.Router.aside('main', 'aside1');
	}

	$scope.triggerRightAside = toggleRightAside;
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

function IndexAsideController($scope, LibraryIndex) {

	var index = LibraryIndex.getIndex();
	$scope.libraryIndex = index;
	$scope.title = "Library";
	$scope.isRoot = true;

	$scope.setCategories = function(category) {
		if (category.subcategories.length) {
			$scope.isRoot = false;
			$scope.title = category.name;
			$scope.libraryIndex = category.subcategories;
		} else {
			return;
		}
	};

	$scope.goBack = function() {
		$scope.libraryIndex = index;
		$scope.isRoot = true;
		$scope.title = "Library";
	};

}

function MainController($scope, $location) {

}

function HelpController($scope, $routeParams, LibraryIndex) {

	$scope.$on('$routeChangeSuccess', function() {
		$scope.idHelp = $routeParams.id;
		$scope.help = LibraryIndex.getById($routeParams.id);
	});

}
