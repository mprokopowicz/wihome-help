'use strict';
window.addEventListener('load', function() {
    FastClick.attach(document.body);
}, false);

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, true);
		document.addEventListener("menubutton", this.showAside, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['WihomeHelp']);
        });
    },
	showAside: function() {
		Lungo.View.Aside.toggle("#indexAside");
	}
};

angular.module('WihomeHelp',
    ['Centralway.lungo-angular-bridge',
        'BridgeExample.filters',
        'WihomeHelp.services',
        'BridgeExample.directives'])

    .config(function($routeProvider, $compileProvider) {
        $routeProvider.when('/help/view/:id', {templateUrl: 'partials/help.html', controller: 'HelpController'});
        $routeProvider.otherwise({redirectTo: '/'});
		
		$compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    });