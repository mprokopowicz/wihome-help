'use strict';

/* Directives */

angular.module('WihomeHelp.directives', [])
		.directive('iscroll', function($rootScope) {
	return function(scope, elm, attrs) {
		var iscroll = false;
		setTimeout(function() {
			iscroll = new iScroll(angular.element(elm)[0]);
		}, 0);

		var clientHeight = 0;
		setInterval(function() {
			if (clientHeight !== elm[0].children[0].clientHeight) {
				clientHeight = elm[0].children[0].clientHeight;
				if (iscroll !== false) {
					iscroll.scrollTo(0, 0, 0);
					setTimeout(function() {
						iscroll.refresh();
					}, 0);
				}
			}
		}, 40);

	};
});

