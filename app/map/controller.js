var MapControllers = angular.module('MapControllers', []);

MapControllers.controller('MapModeCtrl', 
	['$scope', '$routeParams', 'getMapper', 'getCurrentLocation', 'getNavControl', 
	 'getGeolocationControl', 'getBikesData', 'addAutoComplete', 'getWifiApData',

	 function MapModeCtrl($scope, $routeParams, getMapper, getCurrentLocation, 
	 					  getNavControl, getGeolocationControl, 
	 					  getBikesData, addAutoComplete, getWifiApData){	 	

  		/**
  		  * @brief  Walking route
  		  * @param  e  response
  		  * @retval None
  		  */
  		fnWalkRouting = function(e){  						
			walking.search($scope.myPoint, e.point);
  		}

  		/**
  		  * @brief  Get JSON data success callback
  		  * @param  response, JSON call response
  		  * @retval None
  		  */
  		fnGetJsonDataSuccess = function(response){
			for(var i = 0; i < response.length; i ++){
				var mkPoint = new BMap.Point(response[i].longitude, response[i].latitude);
				var myIcon = new BMap.Icon("static/img/fa-marker.png", new BMap.Size(48,48));
				var myMarker = new BMap.Marker(mkPoint, {icon:myIcon});  // 创建标注
					mapper.addOverlay(myMarker);
					myMarker.setAnimation(BMAP_ANIMATION_DROP); //跳动的动画
					myMarker.addEventListener("click", fnWalkRouting);
			}
		}

		/**
  		  * @brief  Get JSON data failed callback
  		  * @param  e  response
  		  * @retval None
  		  */
		fnGetDataFail = function(errorResponse){
			console.log('Error: ' + JSON.stringify(errorResponse));				
		}

		/**
  		  * @brief  Get location data failed callback
  		  * @param  e  response
  		  * @retval None
  		  */
		fnGetLocationFail = function(e){
		    console.log('Error: ' + e.message);
		}

		/**
  		  * @brief  Get the JSON data depends on group param
  		  * @param  group, which group data to be got, should be 'wifi' or 'bicycle'
  		  *                This parameter is from route param
  		  * @retval None
  		  */
  		fnGetJsonData = function(group){
  			if(group == "bicycle"){
	  			getBikesData.get({}, 			
					fnGetJsonDataSuccess,
					fnGetDataFail
				);
  			} else if(group == "wifi"){
  				getWifiApData.get({}, 
					fnGetJsonDataSuccess,
					fnGetDataFail
				);
  			}
  		}

  		/**
  		  * @brief  Get locaiton success call back
  		  * @param  e  response
  		  * @retval None
  		  */
	  	fnGetLocationSuccess = function(e){
	  		// 定位成功事件
		    var address = '';
		    address += e.addressComponent.province;
		    address += e.addressComponent.city;
		    address += e.addressComponent.district;
		    address += e.addressComponent.street;
		    address += e.addressComponent.streetNumber;	    

		    $scope.myPoint = e.point; // save my current point object
		    var mk = new BMap.Marker(e.point);
			    mapper.removeOverlay();
				mapper.addOverlay(mk);
				mapper.panTo(e.point);

			fnGetJsonData($scope.group);
	  	}

	  	// Get the data group to be displayed
	 	$scope.group = $routeParams.group;

		// mapper object
		var mapper = getMapper("mapper");

		// walking route
		var walking = new BMap.WalkingRoute(mapper, {renderOptions:{map: mapper, autoViewport: true}});

		// init current point
		$scope.myPoint = new BMap.Point(113.2606120000,22.8461620000);
		mapper.centerAndZoom($scope.myPoint, 17);

		// Add navigation control
		$scope.navigationControl = getNavControl();
  		mapper.addControl($scope.navigationControl);
	  	
		$scope.geolocationControl = getGeolocationControl(fnGetLocationSuccess, fnGetLocationFail);
		mapper.addControl($scope.geolocationControl);

		// 开始定位
		$scope.geolocationControl.location();

		// 添加autocomplete
		//addAutoComplete(mapper, 'searchInput', 'searchResultPanel', fnGetBikesData);

		$scope.includeSearch = true;
}]);


MapControllers.controller('ListModeCtrl', 
	['$scope', '$routeParams', 'getBikesData', 'getGeolocationControl', 'getMapper', 'jsonSort', 'getWifiApData',
	function ListModeCtrl($scope, $routeParams, getBikesData, getGeolocationControl, getMapper, jsonSort, getWifiApData){

		/**
  		  * @brief  Get JSON data success callback
  		  * @param  e  response
  		  * @retval None
  		  */
		fnGetJSONDataSuccess = function(response){
			for(var i = 0; i < response.length; i ++){
				var dataPoint = new BMap.Point(response[i].longitude, response[i].latitude);
				response[i].distance = Math.round(mapper.getDistance($scope.point, dataPoint));
			}
			response.sort(jsonSort('asc', 'distance'));
			$scope.dataPoints = response;
		}

		/**
  		  * @brief  Get JSON data failed callback
  		  * @param  e  response
  		  * @retval None
  		  */
		fnGetJSONDataFailed = function(errorResponse){
			console.log('Error: ' + JSON.stringify(errorResponse));
		}

		/**
  		  * @brief  Get JSON data failed callback
  		  * @param  e  response
  		  * @retval None
  		  */
		fnGetJsonData = function(group){
			if(group == "bicycle"){
				getBikesData.get({}, 
					fnGetJSONDataSuccess,
					fnGetJSONDataFailed
				);	
			} else if(group == "wifi"){
				getWifiApData.get({}, 
					fnGetJSONDataSuccess,
					fnGetJSONDataFailed
				);	
			}
			
		}

		/**
  		  * @brief  Get location success callback
  		  * @param  e  response
  		  * @retval None
  		  */
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

	  	/**
  		  * @brief  Get location failed callback
  		  * @param  e  response
  		  * @retval None
  		  */
	  	fnGetLocationFail = function(e){
			// 定位失败事件
		    console.log(e.message);
		}

		// Create mapper object
		var mapper = getMapper("mapper");

		// Get group param from route param
		$scope.group = $routeParams.group;

		// Get location control (for GPS location)
		$scope.geolocationControl = getGeolocationControl();		

		$scope.geolocationControl.addEventListener("locationSuccess", fnGetLocationSuccess);
		$scope.geolocationControl.addEventListener("locationError", fnGetLocationFail);

		// 开始定位
		$scope.geolocationControl.location();				

		$scope.getWalkRouting = function($event, point){
			var walkResultId = 'walk-rs-' + point.id;
			var walkRsDiv = angular.element($event.currentTarget).find('div');
			if(walkRsDiv.html() == ''){
				walkRsDiv.html(''); // clear all the walk result				
				var walking = new BMap.WalkingRoute(mapper, {renderOptions: {map: mapper, panel: walkResultId, autoViewport: true}});
				walking.search($scope.point, new BMap.Point(point.longitude, point.latitude));
				walkRsDiv.css('margin-top', '10px');
			} else {
				walkRsDiv.css('margin-top', '0');
				walkRsDiv.html(''); // clear all the walk result
			}
		}		
	}
]);
