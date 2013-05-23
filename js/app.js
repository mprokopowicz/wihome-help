'use strict';
window.addEventListener('load', function() {
	FastClick.attach(document.body);
}, false);


var app = {
	// Application Constructor


	initialize: function() {

		if ("PhoneGap" in window) {
			this.bindEvents();
		} else {
			angular.bootstrap(document, ['WihomeHelp']);
		}
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, true);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicity call 'app.receivedEvent(...);'
	onDeviceReady: function() {
		angular.bootstrap(document, ['WihomeHelp']);

		/* Toggle aside */
		document.addEventListener("menubutton", function() {
			Lungo.View.Aside.toggle("#indexAside");
		}, true);

		/* Go to search */
		document.addEventListener("searchbutton", app.goToSearch, true);
		document.addEventListener("backbutton", app.goToSearch, true);
	},
	goToSearch: function() {
		window.location = "#/";
	}
};

angular.module('WihomeHelp',
		['Centralway.lungo-angular-bridge',
			'BridgeExample.filters',
			'WihomeHelp.services',
			'WihomeHelp.directives'])

		.config(function($routeProvider, $compileProvider) {
	$routeProvider.when('/help/view/:id', {templateUrl: 'partials/help.html', controller: 'HelpController'});
	$routeProvider.when('/settings/main', {templateUrl: 'partials/settings.html', controller: 'SettingsController'});
	$routeProvider.when('/settings/language', {templateUrl: 'partials/settings.html', controller: 'SettingsController'});
	$routeProvider.otherwise({redirectTo: '/'});

	$compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
});
