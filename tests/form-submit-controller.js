var formSubmitControllers = angular.module('formSubmitControllers', []);

formSubmitControllers.controller('MainCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
	$rootScope.customers = [
		{name: 'Enix Yu', phone: '13800000000', id: 1},
		{name: 'Figo Yu', phone: '13812300000', id: 2}
	];
	$rootScope.count = 2;
}]);


formSubmitControllers.controller('CustomerListCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
	$scope.customers = $rootScope.customers;
}]);

formSubmitControllers.controller('CustomerAddCtrl', ['$scope', '$rootScope', '$location', 
	function($scope, $rootScope, $location){
		$scope.submit = function(){
			$rootScope.count += 1;
			$rootScope.customers.push({name: $scope.cName, phone: $scope.cPhone, id: $rootScope.count});
			$location.path('/customerList/');
		}
	}
]);

formSubmitControllers.controller('CustomerDetailCtrl', ['$scope', '$routeParams', '$rootScope', 
	function($scope, $routeParams, $rootScope){
		for(var i = 0; i < $rootScope.customers.length; i ++){
			if($rootScope.customers[i].id == $routeParams.id){
				$scope.customer = $rootScope.customers[i];
				return;
			}
		}
		$scope.customer = null;
	}
]);

