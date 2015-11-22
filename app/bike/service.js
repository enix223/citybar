'use strict';

var MapServices = angular.module('MapServices', ['ngResource']);

MapServices.factory('getMapper', function(){
	return function(id){
		return new BMap.Map(id);
	}
});

MapServices.factory('getNavControl', function(){
	return function(){
		var navigationControl = new BMap.NavigationControl({
		    // 靠左上角位置
		    anchor: BMAP_ANCHOR_TOP_RIGHT,
		    // LARGE类型
		    type: BMAP_NAVIGATION_CONTROL_LARGE,
		    // 启用显示定位
		    enableGeolocation: true
	  	});
	  	return navigationControl;
	}
});

MapServices.factory('getGeolocationControl', function(){
	return function(fnSuccess, fnError){
		var geolocationControl = new BMap.GeolocationControl();
			geolocationControl.addEventListener("locationSuccess", fnSuccess);
			geolocationControl.addEventListener("locationError", fnError);

		return geolocationControl;
	};
});

MapServices.factory('getCurrentLocation',
	function(){

		return function(){
			var point = null;
			var geolocation = new BMap.Geolocation();
			geolocation.getCurrentPosition(function(r){
				if(this.getStatus() == BMAP_STATUS_SUCCESS){
					point = r.point
				}
			}, {enableHighAccuracy: true});

			return point;
		};
	}
);

/**
  * @breif  Get the bike data in json format
  * @retval return a service function
  */
MapServices.factory('getBikesData', ['$resource', 
	function($resource){
		return $resource('data/bike/map.json', {}, {
			get: {method: 'GET', cache: false, isArray: true}
		});
	}
]);