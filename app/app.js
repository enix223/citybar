'use strict';

var citybarApp = angular.module("citybarApp", [
	'ngRoute',
	'BikeControllers'
]);

citybarApp.config(['$routeProvider', '$locationProvider', 
	function($routeProvider, $locationProvider){
		$routeProvider
			.when('/', {
				templateUrl: 'templates/bike/main.html',
				controller: 'BikeMainCtrl'
			});
		$locationProvider.html5Mode(false).hashPrefix('!');
	}
]);