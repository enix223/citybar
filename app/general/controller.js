var GeneralControllers = angular.module('GeneralControllers', []);

GeneralControllers.controller('DonateController', function(){
	$scope.account = 'figo223'
});

GeneralControllers.controller('AboutController', function(){
	
});


/**
 *  @brief Data point fix controller
 */
GeneralControllers.controller('ReportErrorCtrl', ['$scope', 'getGroupsData', 
	'getMapper', 'getContributors', 'getBikesData', 'getWifiApData',
	
	function($scope, getGroupsData, getMapper, getContributors, getBikesData, getWifiApData){

		// Amazeui widget init.
		$.AMUI.accordion.init();
		$('[data-am-selected]').selected({btnWidth: '100%', dropUp: 1});

		$scope.map = getMapper("mapper");		

		var geolocation = new BMap.Geolocation();
		geolocation.getCurrentPosition(function(r){
			if(this.getStatus() == BMAP_STATUS_SUCCESS){
				$scope.myPoint = r.point;
			}
			else {
				console.log('Get location failed, ' + this.getStatus());
			}        
		},{enableHighAccuracy: true});

		// Get groups
		getGroupsData.get({}, 
			function success(response){
				$scope.groups = response
			}, 
			function error(errorResponse){
				console.log('Get groups data failed, ' + JSON.stringify(errorResponse));
			}
		);

		// Get contributors
		getContributors.get({}, 
			function success(response){
				$scope.contributors = response;
			}, 
			function error(errorResponse){
				console.log('Get contributors failed, ' + JSON.stringify(errorResponse));
			}
		);

		$scope.dataChange = function(selectData){
			$scope.dataPoint = selectData;
		};

		$scope.groupChange = function(selectGroup){
			if(selectGroup == 1){
				// Get public bike data
				getBikesData.get({}, 
					function success(response){
						for(var i = 0; i < response.length; i ++){
							$scope.dataArr = response;
						}
					},
					function error(errorResponse){
						console.log('Error: ' + JSON.stringify(errorResponse));
					}
				);
			} else if(selectGroup == 2){
				// Get public wifi ap data
				getWifiApData.get({}, 
					function success(response){
						for(var i = 0; i < response.length; i ++){
							$scope.dataArr = response;
						}
					},
					function error(errorResponse){
						console.log('Error: ' + JSON.stringify(errorResponse));
					}
				);			
			}
		};

		
	}
]);
