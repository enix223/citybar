var citybarApp = angular.module("citybarApp", []);

var bikeMapService = angular.module("bikeMapService", ['ngResource']);

bikeMapService.factory('Bike', ['$resource', 
	function($resource){
		return $resource('data/bike/map.json', {});
	}
]);

citybarApp.controller('BikeMainCtrl', [], function($scope){
	$scope
});