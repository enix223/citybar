var MapControllers = angular.module('MapControllers', []);

MapControllers.controller('MapModeCtrl', 
	['$scope', '$routeParams', 'getMapper', 'getCurrentLocation', 'getNavControl', 
	 'getGeolocationControl', 'getBikesData', 'addAutoComplete', 'getWifiApData',

	 function MapModeCtrl($scope, $routeParams, getMapper, getCurrentLocation, 
	 					  getNavControl, getGeolocationControl, 
	 					  getBikesData, addAutoComplete, getWifiApData){

	 	// Get the data group to be displayed
	 	$scope.group = $routeParams.group;

		$scope.map = getMapper("mapper");

		var point = new BMap.Point(113.2606120000,22.8461620000);
		$scope.map.centerAndZoom(point, 17);

		$scope.navigationControl = getNavControl();
  		$scope.map.addControl($scope.navigationControl);  		

  		fnGetJsonData = function(group){
  			if(group == "bikes"){
	  			getBikesData.get({}, 
					function success(response){
						for(var i = 0; i < response.length; i ++){
							var mkPoint = new BMap.Point(response[i].longitude, response[i].latitude);
	      					var myIcon = new BMap.Icon("static/img/fa-bicycle.png", new BMap.Size(30,30));
							var myMarker = new BMap.Marker(mkPoint, {icon:myIcon});  // 创建标注
	      					$scope.map.addOverlay(myMarker);
	      					myMarker.setAnimation(BMAP_ANIMATION_DROP); //跳动的动画
						}
					},
					function error(errorResponse){
						console.log('Error: ' + JSON.stringify(errorResponse));
					}
				);
  			} else if(group == "wifi"){
  				getWifiApData.get({}, 
					function success(response){
						for(var i = 0; i < response.length; i ++){
							var mkPoint = new BMap.Point(response[i].longitude, response[i].latitude);
	      					var myIcon = new BMap.Icon("static/img/fa-wifi.png", new BMap.Size(30,30));
							var myMarker = new BMap.Marker(mkPoint, {icon:myIcon});  // 创建标注
	      					$scope.map.addOverlay(myMarker);
	      					myMarker.setAnimation(BMAP_ANIMATION_DROP); //跳动的动画
						}
					},
					function error(errorResponse){
						console.log('Error: ' + JSON.stringify(errorResponse));
					}
				);
  			}
  		}

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

			fnGetJsonData($scope.group);
	  	}

	  	fnGetLocationFail = function(e){
			// 定位失败事件
		    console.log(e.message);
		}

	  	
		$scope.geolocationControl = getGeolocationControl(fnGetLocationSuccess, fnGetLocationFail);
		$scope.map.addControl($scope.geolocationControl);

		// 开始定位
		$scope.geolocationControl.location();

		// 添加autocomplete
		//addAutoComplete($scope.map, 'searchInput', 'searchResultPanel', fnGetBikesData);

		$scope.includeSearch = true;
}]);


MapControllers.controller('ListModeCtrl', 
	['$scope', '$routeParams', 'getBikesData', 'getGeolocationControl', 'getMapper', 'jsonSort', 'getWifiApData',
	function ListModeCtrl($scope, $routeParams, getBikesData, getGeolocationControl, getMapper, jsonSort, getWifiApData){

		$scope.map = getMapper("mapper");
		$scope.group = $routeParams.group;

		$scope.geolocationControl = getGeolocationControl();

		fnGetJsonData = function(group){
			if(group == "bikes"){
				getBikesData.get({}, 
					function success(response){
						for(var i = 0; i < response.length; i ++){
							var dataPoint = new BMap.Point(response[i].longitude, response[i].latitude);
							response[i].distance = Math.round($scope.map.getDistance($scope.point, dataPoint));
						}
						response.sort(jsonSort('asc', 'distance'));
						$scope.dataPoints = response;
					},
					function error(errorResponse){
						console.log('Error: ' + JSON.stringify(errorResponse));
					}
				);	
			} else if(group == "wifi"){
				getWifiApData.get({}, 
					function success(response){
						for(var i = 0; i < response.length; i ++){
							var dataPoint = new BMap.Point(response[i].longitude, response[i].latitude);							
							response[i].distance = Math.round($scope.map.getDistance($scope.point, dataPoint));
						}
						response.sort(jsonSort('asc', 'distance'));
						$scope.dataPoints = response;
					},
					function error(errorResponse){
						console.log('Error: ' + JSON.stringify(errorResponse));
					}
				);	
			}
			
		}

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
			    $scope.point = e.point;

			    fnGetJsonData($scope.group);
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
	}
]);
