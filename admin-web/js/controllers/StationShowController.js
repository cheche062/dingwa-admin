angular.module('StationShowController',['CommonService', 'StationService','DeviceService'])
       .controller('StationShowCtrl',['$scope','$state','$stateParams' , 'StationService', 'DeviceService','DialogService',
        function($scope, $state,$stateParams, StationService, DialogService){
            $scope.info = {}
            $scope.fee_rules_info = "";
            init()
            function getFeeRules(obj){
                let keys = Object.keys(obj);
                $scope.fee_rules_info = "";
                if(keys) {
                    for(keys in obj) {
                        $scope.fee_rules_info += keys/3600+"小时/"+obj[keys]/100+"元"+" ";
                    }
                }else {
                    $scope.fee_rules_info = "免费";
                }
            }

            function init(){
                console.log($stateParams)
                var condition = {
                    id:$stateParams.id
                }
                StationService.get(condition).then(function(res){
                    console.log(res)
                    $scope.station = res.data;
                    getFeeRules($scope.station.fee_detail);
                },function(code){

                })


            }
       }])
       .controller('LoadDevicesCtrl',['$scope','$state','$stateParams','DeviceService','DialogService',
        function($scope,$state,$stateParams,DeviceService,DialogService){
            $scope.info = {
                offset:0,
                limit:20,
                order_by:'created_at',
                order:'desc',
                total:0,
                page:1,
                pageCnt:0
            }
            init()
            //获取站点下的设备列表
            function init(){
                var id = $stateParams.id
                var condition = {
                    station_obj:{id:id,name:''},
                    offset:$scope.info.offset,
                    limit:$scope.info.limit,
                    order_by:$scope.info.order_by,
                    order:$scope.info.order,
                    total:$scope.info.total
                }
                DeviceService.search(condition).then(function(res){
                    console.log(res)
                    $scope.devices = res.data.list
                    $scope.info.total = res.data.total
                    $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
                },function(err){})
            }

            $scope.goDetail = function(id){
                $state.go('main.device/detail',{id:id},{
                    reload:'main.device/detail'
                })
            }
            $scope.goEdit = function(id){
                $state.go('main.device/edit',{id:id},{
                    reload:'main.device/edit'
                })
            }
            $scope.delete = function(id){
                var condition = {
                    id:id
                }
                DialogService.confirm('确认要删除吗',function(){
                    DeviceService.delete(condition).then(function(res){
                        DialogService.alert('删除成功')
                        $scope.search()
                    },function(res){
                        DialogServcie.alert(res.msg)
                    })
                })
            }
            $scope.startPaging = function(){
                init()
            }

       }])
