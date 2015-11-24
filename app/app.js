'use strict';

var citybarApp = angular.module("citybarApp", [
	'ngRoute',
	'MapControllers',
	'GeneralControllers',
	'MapServices',
	'GeneralServices',
	'WifiServices'
]);

citybarApp.config(['$routeProvider', '$locationProvider', 
	function($routeProvider, $locationProvider){
		$routeProvider
			.when('/mapMode/:group/', {
				templateUrl: 'templates/bike/map-mode.html',
				controller: 'MapModeCtrl'
			}).when('/listMode/:group/',{
				templateUrl: 'templates/bike/list-mode.html',
				controller: 'ListModeCtrl'
			}).when('/reportError/', {
				templateUrl: 'templates/general/report-error.html',
				controller: 'ReportErrorCtrl'
			}).when('/about/', {
				templateUrl: 'templates/general/about.html',
				controller: 'AboutCtrl'
			}).otherwise({
                redirectTo: '/mapMode/bikes/'
            });;
		$locationProvider.html5Mode(false).hashPrefix('!');
	}
]);