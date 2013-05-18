'use strict';

angular.module('WihomeHelp',
    ['Centralway.lungo-angular-bridge',
        'BridgeExample.filters',
        'WihomeHelp.services',
        'BridgeExample.directives'])

    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider.when('/help/view/:id', {templateUrl: '/partials/help.html', controller: 'HelpController'});
        $routeProvider.otherwise({redirectTo: '/'});
    }]);