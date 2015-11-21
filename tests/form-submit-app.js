'use strict';

var formSubmitApp = angular.module('formSubmitApp', [
	'ngRoute', 
	'formSubmitControllers'
]);

formSubmitApp.config(['$routeProvider', '$locationProvider', 
	function($routeProvider, $locationProvider){
		$routeProvider.
			when('/', {
				templateUrl: 'partials/main.html',
				controller: 'MainCtrl'	
			}).when('/customer/:id', {
				templateUrl: 'partials/detail.html',
				controller: 'CustomerDetailCtrl'
			}).when('/addCustomer/', {
				templateUrl: 'partials/add.html',
				controller: 'CustomerAddCtrl'
			}).when('/customerList/', {
				templateUrl: 'partials/main.html',
				controller: 'CustomerListCtrl'
			});
		$locationProvider.html5Mode(false).hashPrefix('!');
	}
]);