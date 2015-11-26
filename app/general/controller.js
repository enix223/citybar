var GeneralControllers = angular.module('GeneralControllers', []);

GeneralControllers.controller('DonateCtrl', function(){
	$scope.account = 'figo223'
});

GeneralControllers.controller('AboutCtrl', ['$scope', 'getContributors', 
	function($scope, getContributors){
		$.AMUI.accordion.init();
		
		// Get contributors
		getContributors.get({}, 
			function success(response){
				$scope.contributors = response;
			}, 
			function error(errorResponse){
				console.log('Get contributors failed, ' + JSON.stringify(errorResponse));
			}
		);
}]);


/**
 *  @brief Data point fix controller
 */
GeneralControllers.controller('ReportErrorCtrl', ['$scope', 'getGroupsData', 
	'getMapper', 'getContributors', 'getBikesData', 'getWifiApData', 'submitError',
	
	function($scope, getGroupsData, getMapper, getContributors, getBikesData, getWifiApData, submitError){

		// Amazeui widget init.
		$.AMUI.accordion.init();
		$('[data-am-selected]').selected({btnWidth: '100%', dropUp: 1});

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

		$scope.submit = function(){
			$scope.progress = true;
			$scope.message = '';
			var data = {
				project_id: 6,  // citybar
				status_id: 1,   // open
				priority_id: 4, // normal
    			subject: "GPS Submit Data - " + $scope.selectData,    			
    			description: $scope.author + "," + $scope.selectGroup + "," 
    				+ $scope.selectData + "," + $scope.myPoint.lat + "," + $scope.myPoint.lng
			};
			submitError.post({
				issue: data, 
				key: '7a74c72afa037d7fdb52bdd99b076f573ca5eead' 
			}, function success(response){
				$scope.message = '数据提交成功';
				$scope.result = 'success';
				$scope.progress = false;
			}, function error(response){
				console.log(JSON.stringify(response));
				$scope.message = '数据提交失败';
				$scope.result = 'danger';
				$scope.progress = false;
			});
		}
	}
]);
