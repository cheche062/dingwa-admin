angular.module('DeviceSettingController',['CommonService','DeviceService'])
       .controller('DeviceSettingCtrl',['$scope','$state','$stateParams','DialogService','DeviceService',
        function($scope,$state,$stateParams,DialogService,DeviceService){
            $scope.device = {
                cur_limit:0,
                cur_limit_status_name:'',
                end_limit:0,
                end_limit_status_name:'',
                full_limit:0,
                full_limit_status_name:'',
                over_limit:0,
                over_limit:'',
                over_voltage:0,
                over_voltage_status_name:'',
                single_limit:0,
                single_limit_status_name:'',
                start_limit:0,
                start_limit_status_name:''
            }
            init()
            function init(){
                var condition = {
                    id: $stateParams.id,
                    type:0
                }
                DeviceService.configGet(condition).then(function(res){
                    console.log(res)
                    $scope.device = JSON.parse(JSON.stringify(res.data));
                    $scope.preStatus = JSON.parse(JSON.stringify(res.data));
                })
            }
            $scope.setting = function(){
                if($scope.device.over_voltage === ''){
                    DialogService.alert('请输入过欠压比率')
                    return false
                }
                if($scope.device.cur_limit === ''){
                    DialogService.alert('请输入限流值')
                    return false
                }
                if($scope.device.cur_limit !== '' && $scope.device.over_limit !== ''){
                    if($scope.device.cur_limit >= $scope.device.over_limit){
                        DialogService.alert('限流值必须小于过流保护值')
                        return false
                    }
                }
                if($scope.device.start_limit === ''){
                    DialogService.alert('请输入启动电流下限值')
                    return false
                }
                if($scope.device.full_limit === ''){
                    DialogServie.alert('请输入充满电流上限值')
                    return false
                }
                if($scope.device.single_limit === ''){
                    DialogService.alert('请输入单路过流保护下限值')
                    return false
                }
                if($scope.device.end_limit === ''){
                    DialogService.alert('请输入结束电流上限值')
                    return false
                }
                if(Number($scope.device.start_limit) > Number($scope.device.full_limit) || Number($scope.device.start_limit) < Number($scope.device.end_limit)){
                    DialogService.alert('启动电流下限值必须小于充满电流,大于等于结束电流')
                    return false;
                }
                if(Number($scope.device.full_limit) <= Number($scope.device.start_limit)){
                    DialogService.alert('充满电流上限值应大于启动电流下限值')
                    return false;
                }
                if(Number($scope.device.end_limit) > Number($scope.device.start_limit)){
                    DialogService.alert('结束电流上限值应小于等于启动电流下限值')
                    return false;
                }
                var condition = {}
                if($scope.device.over_voltage !== $scope.preStatus.over_voltage){
                    condition.over_voltage = Number($scope.device.over_voltage)
                }
                if($scope.device.cur_limit !== $scope.preStatus.cur_limit){
                    condition.cur_limit = Number($scope.device.cur_limit)
                }
                if($scope.device.over_limit !== $scope.preStatus.over_limit){
                    condition.over_limit = Number($scope.device.over_limit)
                }
                if($scope.device.start_limit !== $scope.preStatus.start_limit){
                    condition.start_limit = Number($scope.device.start_limit)
                }
                if($scope.device.full_limit !== $scope.preStatus.full_limit){
                    condition.full_limit = Number($scope.device.full_limit)
                }
                if($scope.device.single_limit !== $scope.preStatus.single_limit){
                    condition.single_limit = Number($scope.device.single_limit)
                }
                if($scope.device.end_limit !== $scope.preStatus.end_limit){
                    condition.end_limit = Number($scope.device.end_limit)
                }
                console.log(condition)
                condition.id = $stateParams.id;
                DialogService.loading(true)
                DeviceService.configSet(condition).then(function(res){
                    DialogService.loading(false);
                    console.log(res);
                    // $state.go('main.device/list')
                    DialogService.alert('操作成功');
                    init();
                },function(err){
                    DialogService.loading(false)
                })
            }
            $scope.goDeviceList = function(){
                $state.go('main.device/list')
            }
            $scope.get = function(){
                var condition = {
                    id: $stateParams.id,
                    type:1
                }
                DialogService.loading(true)
                DeviceService.configGet(condition).then(function(res){
                    DialogService.loading(false)
                    console.log(res)
                    DialogService.alert('操作成功')
                    $scope.device = JSON.parse(JSON.stringify(res.data));
                    $scope.preStatus = JSON.parse(JSON.stringify(res.data));
                },function(err){
                    DialogService.loading(false)
                })
            }
       }])