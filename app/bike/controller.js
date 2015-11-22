var BikeControllers = angular.module('BikeControllers', []);

BikeControllers.controller('BikeMapCtrl', 
	['$scope', 'getMapper', 'getCurrentLocation', 'getNavControl', 'getGeolocationControl',
	function BikeMapCtrl($scope, getMapper, getCurrentLocation, getNavControl, getGeolocationControl){
		$scope.map = getMapper("mapper");

		var point = new BMap.Point(116.331398,39.897445);
		$scope.map.centerAndZoom(point,20);

		$scope.navigationControl = getNavControl();
  		$scope.map.addControl($scope.navigationControl);

	  	fnGetLocationSuccess = function(e){
	  		// 定位成功事件
		    var address = '';
		    address += e.addressComponent.province;
		    address += e.addressComponent.city;
		    address += e.addressComponent.district;
		    address += e.addressComponent.street;
		    address += e.addressComponent.streetNumber;	    

		    var mk = new BMap.Marker(e.point);
			    $scope.map.removeOverlay();
				$scope.map.addOverlay(mk);
				$scope.map.panTo(e.point);
	  	}

	  	fnGetLocationFail = function(e){
			// 定位失败事件
		    console.log(e.message);
		}

	  	
		$scope.geolocationControl = getGeolocationControl(fnGetLocationSuccess, fnGetLocationFail);
		$scope.map.addControl($scope.geolocationControl);

		// 开始定位
		$scope.geolocationControl.location();
}]);


BikeControllers.controller('BikeListCtrl', 
	['$scope', 'getBikesData', 'getGeolocationControl',
	function BikeListCtrl($scope, getBikesData, getGeolocationControl){

		$scope.geolocationControl = getGeolocationControl();

		fnGetLocationSuccess = function(e){
			$scope.$apply(function(){
				// 定位成功事件
			    var address = '';
			    address += e.addressComponent.province;
			    address += e.addressComponent.city;
			    address += e.addressComponent.district;
			    address += e.addressComponent.street;
			    address += e.addressComponent.streetNumber;	    
			    $scope.address = address;
			});	  		
	  	}

	  	fnGetLocationFail = function(e){
			// 定位失败事件
		    console.log(e.message);
		}

		$scope.geolocationControl.addEventListener("locationSuccess", fnGetLocationSuccess);
		$scope.geolocationControl.addEventListener("locationError", fnGetLocationFail);

		// 开始定位
		$scope.geolocationControl.location();

		getBikesData.get({}, 
			function success(response){
				$scope.bikes = response;
			},
			function error(errorResponse){
				console.log('Error: ' + JSON.stringify(errorResponse));
			}
		);
	}
]);
