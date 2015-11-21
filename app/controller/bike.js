var BikeControllers = angular.module('BikeControllers', []);

BikeControllers.controller('BikeMainCtrl', ['$scope', function($scope){
	var map = new BMap.Map("mapper");
	var point = new BMap.Point(116.331398,39.897445);
	map.centerAndZoom(point,20);

	var navigationControl = new BMap.NavigationControl({
	    // 靠左上角位置
	    anchor: BMAP_ANCHOR_TOP_RIGHT,
	    // LARGE类型
	    type: BMAP_NAVIGATION_CONTROL_LARGE,
	    // 启用显示定位
	    enableGeolocation: true
  	});
  	map.addControl(navigationControl);

  	fnGetLocationSuccess = function(e){
  		// 定位成功事件
	    var address = '';
	    address += e.addressComponent.province;
	    address += e.addressComponent.city;
	    address += e.addressComponent.district;
	    address += e.addressComponent.street;
	    address += e.addressComponent.streetNumber;	    
  	}

  	fnGetLocationFail = function(e){
		// 定位失败事件
	    alert(e.message);
	}

  	var geolocationControl = new BMap.GeolocationControl();
		geolocationControl.addEventListener("locationSuccess", fnGetLocationSuccess);
		geolocationControl.addEventListener("locationError", fnGetLocationFail);

	map.addControl(geolocationControl);

	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
			var mk = new BMap.Marker(r.point);
		    map.removeOverlay();
			map.addOverlay(mk);
			map.panTo(r.point);
			alert('您的位置：'+r.point.lng+','+r.point.lat);
		}
		else {
			
		}        
	}, {enableHighAccuracy: true});
}]);