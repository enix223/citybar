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
			walking.search($scope.myPoint, e.currentTarget.point);
  		}

  		/**
  		  * @brief  Reload the data points in current bound to the map
  		  * @param  e event
  		  * @retval None
  		  */ 
  		fnRefreshPoints = function(e){   			
  			for(var i = 0; i < $scope.dataPoints.length; i ++){
				var mkPoint = new BMap.Point($scope.dataPoints[i].longitude, $scope.dataPoints[i].latitude);

				// check if the data already loaded
				var isLoaded = ($scope.dataPoints[i].id in $scope.loadedPoints);

				// only shown the points in the current bounds and not loaed yet
				if(mapper.getBounds().containsPoint(mkPoint)){
					if(isLoaded){
						continue;
					}

					var myIcon = new BMap.Icon("static/img/fa-marker.png", new BMap.Size(48,48));
					var myMarker = new BMap.Marker(mkPoint, {icon:myIcon});  // 创建标注
						mapper.addOverlay(myMarker);
						myMarker.setAnimation(BMAP_ANIMATION_DROP); //跳动的动画
						myMarker.addEventListener("click", fnWalkRouting);
						myMarker.setTitle($scope.dataPoints[i].name);

						$scope.loadedPoints[$scope.dataPoints[i].id] = myMarker;
				} else {
					// Remove the loaed points from global array					
					if(isLoaded){
						mapper.removeOverlay($scope.loadedPoints[$scope.dataPoints[i].id]);
						delete $scope.loadedPoints[$scope.dataPoints[i].id];
					}
				}
			}
  		}

  		/**
  		  * @brief  Get JSON data success callback
  		  * @param  response, JSON call response
  		  * @retval None
  		  */
  		fnGetJsonDataSuccess = function(response){
			$scope.dataPoints = response;
			
			// Register map move end event listener after data loaded
			mapper.addEventListener('moveend', fnRefreshPoints);
			fnRefreshPoints(null); // load the data points
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

	  	/* auto complete */
	  	fnCreateAutoComplete = function(map, autocompleId, searchResultPanelId, fnOnConfirm){
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
					$scope.myPoint = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
					map.centerAndZoom($scope.myPoint, 16);
					map.addOverlay(new BMap.Marker($scope.myPoint));    //添加标注
					fnOnConfirm($scope.group);  // Call on-confirm callback when location change
				}
				var local = new BMap.LocalSearch(map, { //智能搜索
				  onSearchComplete: myFun
				});
				local.search(myValue);
			}
		}

	  	// Get the data group to be displayed
	 	$scope.group = $routeParams.group;
	 	$scope.loadedPoints = {};

		// mapper object
		var mapper = getMapper("mapper");		

		// walking route
		var walking = new BMap.WalkingRoute(mapper, {renderOptions:{map: mapper, autoViewport: true}});

		// init current point
		$scope.myPoint = new BMap.Point(113.2606120000,22.8461620000);
		mapper.centerAndZoom($scope.myPoint, 16);

		// Add navigation control
		$scope.navigationControl = getNavControl();
  		mapper.addControl($scope.navigationControl);
	  	
		$scope.geolocationControl = getGeolocationControl(fnGetLocationSuccess, fnGetLocationFail);
		mapper.addControl($scope.geolocationControl);

		// 开始定位
		$scope.geolocationControl.location();

		$scope.includeSearch = true;

		$scope.initAutoComplete = function(){
			fnCreateAutoComplete(mapper, 'searchInput', 'searchResultPanel', fnGetJsonData);
		}
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
				var distance = Math.round(mapper.getDistance($scope.point, dataPoint));
				response[i].distance = (typeof distance == 'number') ? distance : 99999;
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
