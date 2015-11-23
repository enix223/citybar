var MapControllers = angular.module('MapControllers', []);

MapControllers.controller('BikeMapCtrl', 
	['$scope', '$routeParams', 'getMapper', 'getCurrentLocation', 'getNavControl', 
	 'getGeolocationControl', 'addBicycle', 'getBikesData', 'addAutoComplete', 'getWifiApData',

	 function MapModeCtrl($scope, $routeParams, getMapper, getCurrentLocation, 
	 					  getNavControl, getGeolocationControl, 
	 					  addBicycle, getBikesData, addAutoComplete){

	 	// Get the data group to be displayed
	 	$scope.group = $routeParams.group;

		$scope.map = getMapper("mapper");

		var point = new BMap.Point(116.331398,39.897445);
		$scope.map.centerAndZoom(point, 17);

		$scope.navigationControl = getNavControl();
  		$scope.map.addControl($scope.navigationControl);

  		fnGetJsonData = function(group){
  			if(group == "bikes"){
	  			getBikesData.get({}, 
					function success(response){
						for(var i = 0; i < response.length; i ++){
							var bikePoint = new BMap.Point(response[i].longitude, response[i].latitude);						
	      					var myCompOverlay = addBicycle($scope.map, bikePoint, response[i].name);
	      					$scope.map.addOverlay(myCompOverlay);
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
							var bikePoint = new BMap.Point(response[i].longitude, response[i].latitude);						
	      					var myCompOverlay = addBicycle($scope.map, bikePoint, response[i].name);
	      					$scope.map.addOverlay(myCompOverlay);
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

			fnGetJsonData();
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


MapControllers.controller('BikeListCtrl', 
	['$scope', '$routeParams', 'getBikesData', 'getGeolocationControl', 'getMapper', 'jsonSort',
	function ListModeCtrl($scope, $routeParams, getBikesData, getGeolocationControl, getMapper, jsonSort){

		$scope.map = getMapper("mapper");
		$scope.group = $routeParams.group;

		$scope.geolocationControl = getGeolocationControl();

		fnGetJsonData = function(group){
			if(group == "bikes"){
				getBikesData.get({}, 
					function success(response){
						for(var i = 0; i < response.length; i ++){
							var bikePoint = new BMap.Point(response[i].longitude, response[i].latitude);
							response[i].distance = Number(($scope.map.getDistance($scope.point, bikePoint)).toFixed(2));
						}
						response.sort(jsonSort('asc', 'distance'));
						$scope.bikes = response;
					},
					function error(errorResponse){
						console.log('Error: ' + JSON.stringify(errorResponse));
					}
				);	
			} else if(group == "wifi"){
				getWifiApData.get({}, 
					function success(response){
						for(var i = 0; i < response.length; i ++){
							var bikePoint = new BMap.Point(response[i].longitude, response[i].latitude);
							response[i].distance = Number(($scope.map.getDistance($scope.point, bikePoint)).toFixed(2));
						}
						response.sort(jsonSort('asc', 'distance'));
						$scope.bikes = response;
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
