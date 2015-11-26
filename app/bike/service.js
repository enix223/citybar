'use strict';

var MapServices = angular.module('MapServices', ['ngResource']);

MapServices.factory('addAutoComplete', function(){
	return function(map, myPoint, autocompleId, searchResultPanelId, fnOnConfirm, pFnOnConfirm){
		var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
			{"input" : autocompleId
			,"location" : map
		});

		// 百度地图API功能
		function G(id) {
			return document.getElementById(id);
		}

		ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
			var str = "";
				var _value = e.fromitem.value;
				var value = "";
				if (e.fromitem.index > -1) {
					value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
				}    
				str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
				
				value = "";
				if (e.toitem.index > -1) {
					_value = e.toitem.value;
					value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
				}    
				str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
				G(searchResultPanelId).innerHTML = str;
		});

		var myValue;
		ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
			var _value = e.item.value;
			myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
			G(searchResultPanelId).innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
			
			setPlace();
		});

		function setPlace(){
			map.clearOverlays();    //清除地图上所有覆盖物
			function myFun(){
				myPoint.lat = local.getResults().getPoi(0).point.lat;    //获取第一个智能搜索的结果
				myPoint.lng = local.getResults().getPoi(0).point.lng;
				map.centerAndZoom(myPoint, 17);
				map.addOverlay(new BMap.Marker(myPoint));    //添加标注
				fnOnConfirm(pFnOnConfirm);  // Call on-confirm callback when location change
			}
			var local = new BMap.LocalSearch(map, { //智能搜索
			  onSearchComplete: myFun
			});
			local.search(myValue);
		}

		return ac;
	}
});

MapServices.factory('jsonSort', function(){
	return function(order, sortBy){
		var ordAlpah = (order == 'asc') ? '>' : '<';
	    var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + ' ? 1 : -1;');
	    return sortFun;
	}
});

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