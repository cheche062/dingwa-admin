angular.module("DevicePortDetailController",["CommonService", "DevicePortService"])
.controller("DevicePortDetailCtrl", ["$scope","$state","$stateParams","DevicePortService","DialogService",
    function($scope, $state,$stateParams,DevicePortService,DialogService){
    	$scope.info = {

    	}
    	init()
    	function init(){
    		var id = $stateParams.id
    		var condition = {
    			id:id
    		}
    		DevicePortService.get(condition).then(function(res){
    			console.log(res)
                $scope.port = res.data
    		},function(res){
    			DialogService.alert(res.msg)
    		})
    	}
    }
])
