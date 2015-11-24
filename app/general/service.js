'use strict';

var GeneralServices = angular.module('GeneralServices', ['ngResource']);

/**
  * @breif  Get the group data in json format
  * @retval return a service function
  */
GeneralServices.factory('getGroupsData', ['$resource', 
	function($resource){
		return $resource('data/groups.json', {}, {
			get: {method: 'GET', cache: false, isArray: true}
		});
	}
]);


/**
  * @breif  Get the group data in json format
  * @retval return a service function
  */
GeneralServices.factory('getContributors', ['$resource', 
	function($resource){
		return $resource('data/contributors.json', {}, {
			get: {method: 'GET', cache: false, isArray: true}
		});
	}
]);