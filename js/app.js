'use strict';

angular.module('WihomeHelp',
    ['Centralway.lungo-angular-bridge',
        'BridgeExample.filters',
        'WihomeHelp.services',
        'BridgeExample.directives'])

    .config(function($routeProvider, $compileProvider) {
        $routeProvider.when('/help/view/:id', {templateUrl: '/partials/help.html', controller: 'HelpController'});
        $routeProvider.otherwise({redirectTo: '/'});
		
		$compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    });