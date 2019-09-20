angular.module("DeviceShowController", ["CommonService", "DeviceService"])
.controller("DeviceShowCtrl", ["$scope", "$state","$stateParams","$timeout","DeviceService",
    function($scope, $state,$stateParams,$timeout,DeviceService) {
    	$scope.info = {
    		apply_type:'0',
            status:'0',
            allowance_apply:'0',
            provider:'0',
            station_obj:{
                id:'',
                name:''
            },
            enter_obj:{
                id:'',
                name:''
            },
            device_obj:{
                id:'',
                name:''
            },
            offset:0,
            limit:20,
            order_by:'created_at',
            order:'desc',
            total:0
    	}

        init()
        function init(){
            var id = $stateParams.id
            var condition = {
                id:id
            }
            DeviceServcie.get(condition).then(function(res){
                console.log(res)
            },function(res){
                DialogService.alert(res.msg)
            })
        }
    }
])
