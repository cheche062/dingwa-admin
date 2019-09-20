angular.module("DevicePortEditController", ["CommonService", "DevicePortService"])
.controller("DevicePortEditCtrl", ["$scope", "$state","$stateParams","$timeout","DevicePortService","DictService","DialogService",
    function($scope, $state,$stateParams,$timeout,DevicePortService,DictService,DialogService) {
        var now = new Date()
    	$scope.info = {
    		device_number:'',
            device_id:'',
            port_name:'',
            device:{
                name:'',
                id:''
            }
    	}
    	$scope.port = ''
        $scope.$watch('info.device_id',function(newValue,oldValue){
            if(newValue == oldValue){
                return false
            }
            else{
                for(var i in $scope.devices){
                    if($scope.devices[i].id == $scope.info.device_id){
                        $scope.info.device = $scope.devices[i]
                    }
                }
                console.log($scope.info.device)
            }
        })
        init()
        $scope.devices = []
        function init(){
            var condition = {
                type:'device',
                query:''
            }
            DictService.search(condition).then(function(res){
                console.log(res)
                $scope.devices = res
            },function(res){})
            var condition1 = {
                id:$stateParams.id
            }
            DevicePortService.get(condition1).then(function(res){
                console.log(res)
                $scope.port = res.data
                $scope.info.device_id = res.data.device_id
                $scope.info.device.name = res.data.name
                $scope.info.device.id = res.data.device_id
            },function(res){})

        }
        $scope.goDeviceList = function(){
        	$state.go('main.device/list',{},{
        		reload:true
        	})
        }
        $scope.submit = function(){
        	if($scope.port.device_number === ''){
        		DialogService.alert('请输入桩号')
        		return false
        	}
        	if($scope.port.port_name === ''){
        		DialogService.alert('请输入端口号')
        		return false
        	}
            if($scope.port.port_name < 26 || $scope.port.port_name > 255){
                DialogService.alert('端口号需大于26小于255')
                return false
            }
        	var condition = {
        		id:$stateParams.id,
                port_name:$scope.port.port_name
        	}
            DevicePortService.update(condition).then(function(res){
                DialogService.alert('修改成功')
                $timeout(function(){
                    $state.go('main.deviceport/list',{},{
                        reload:true
                    })
                },2000)
            },function(res){
                if(res.msg != ''){
                    DialogService.alert(res.msg)
                }
            })
        }
        $scope.cancle = function(){
            $scope.info.device_id == ''
            $('#ChooseDevice').modal('hide')
        }
    }
])
