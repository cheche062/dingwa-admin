angular.module("DevicePortAddController", ["CommonService", "DevicePortService"])
.controller("DevicePortAddCtrl", ["$scope", "$state","$timeout","DevicePortService","DictService","DialogService",
    function($scope, $state,$timeout,DevicePortService,DictService,DialogService) {
        var now = new Date()
    	$scope.info = {
    		device_number:'',
            device_id:'',
            port_name:'',
            device:'',
            device_id:''
    	}
        $scope.devices = []
        init()
        function init(){
            var condition = {
                type:'device',
                query:''
            }
            DictService.search(condition).then(function(res){
                console.log(res)
                $scope.devices = res
            },function(res){})
        }
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
        $scope.goDevicePortList = function(){
        	$state.go('main.deviceport/list',{},{
        		reload:true
        	})
        }
        $scope.submit = function(){
        	if($scope.info.device.device_number === ''){
        		DialogService.alert('请输入桩号')
        		return false
        	}
        	if($scope.info.port_name === ''){
        		DialogService.alert('请输入端口号')
        		return false
        	}
            if($scope.info.port_name < 26 || $scope.info.port_name > 255){
                DialogService.alert('端口号需大于26小于255')
                return false
            }
        	var condition = {
        		device_number:$scope.info.device.name,
        		device_id:$scope.info.device.id,
                port_name:$scope.info.port_name

        	}
            DevicePortService.add(condition).then(function(res){
                DialogService.alert('添加成功')
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
            $('#ChooseDevice').modal('hide')
        }
    }
])
