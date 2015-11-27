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

/**
  * @breif  Get the Donator json format
  * @retval return a service function
  */
GeneralServices.factory('getDonator', ['$resource', 
	function($resource){
		return $resource('data/donate.json', {}, {
			get: {method: 'GET', cache: false, isArray: true}
		});
	}
]);

GeneralServices.factory('submitError', ['$resource', 
	function($resource, data){
		return $resource('https://redmine-enix.rhcloud.com/issues.json', {}, {
			post: {method: 'POST', cache: false, isArray: false}
		});
	}
]);