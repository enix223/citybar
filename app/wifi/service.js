'use strict';

var WifiServices = angular.module('WifiServices', ['ngResource']);

/**
  * @breif  Get the wifi ap data in json format
  * @retval return a service function
  */
WifiServices.factory('getWifiApData', ['$resource', 
	function($resource){
		return $resource('data/wifi/map.json', {}, {
			get: {method: 'GET', cache: false, isArray: true}
		});
	}
]);