angular.module('ProfitStationController',['CommonService','SystemUserService','ProfitService'])
	   .controller('ProfitStationCtrl',['$scope','$state','$stateParams','$timeout','SystemUserService','ProfitService','DialogService',function($scope,$state,$stateParams,$timeout,SystemUserService,ProfitService,DialogService){
	   		$scope.info = {
       			id:$stateParams.id,
       			order_by:'created_at',
       			order:'desc',
                offset:0,
                limit:20,
                total:0,
                page:1,
                pageCnt:0
    	   	}
            $scope.stations = []
            init()
            function init(){
                var condition = {
                    id:$scope.info.id,
                    order_by:$scope.info.order_by,
                    order:$scope.info.order,
                    offset:$scope.info.offset,
                    limit:$scope.info.limit,
                    total:$scope.info.total
                }
                ProfitService.stationSearch(condition).then(function(res){
                    console.log(res)
                    $scope.stations = res.data.list
                    $scope.info.total = res.data.toal
                    $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
                })
            }
            $scope.startPaging = function(){
                init()
            }
            //跳转汇总设备页面
            $scope.goDetail = function(id){
                $state.go('main.profitDevice/list',{id:id})
            }
	   }])