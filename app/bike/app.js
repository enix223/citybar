'use strict';

var citybarApp = angular.module("citybarApp", [
	'ngRoute',
	'BikeControllers',
	'MapServices'
]);

citybarApp.config(['$routeProvider', '$locationProvider', 
	function($routeProvider, $locationProvider){
		$routeProvider
			.when('/', {
				templateUrl: 'templates/bike/map-mode.html',
				controller: 'BikeMapCtrl'
			}).when('/listMode',{
				templateUrl: 'templates/bike/list-mode.html',
				controller: 'BikeListCtrl'
			});
		$locationProvider.html5Mode(false).hashPrefix('!');
	}
]);