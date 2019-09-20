angular.module('ProfitOrderController',['CommonService','SystemUserService','ProfitService'])
       .controller('ProfitOrderCtrl',['$scope','$state','$stateParams','$timeout','SystemUserService','ProfitService','DialogService',function($scope,$state,$stateParams,$timeout,SystemUserService,ProfitService,DialogService){
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
            $scope.orders = []
            init()
            function init(){
                var condition = {
                    id:$scope.info.id,
                    order_by:$scope.info.order_by,
                    order:$scope.info.order,
                    offset:$scope.info.offset,
                    limit:$scope.info.limit,
                    total:$scope.info.total,
                    downexcel:0
                }
                ProfitService.orderSearch(condition).then(function(res){
                    console.log(res)
                    $scope.orders = res.data.list
                    $scope.info.total = res.data.toal
                    $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
                })
            }
            //订单导出
            $scope.toExport = function(){
                var condition = {
                    id:$scope.info.id,
                    order_by:$scope.info.order_by,
                    order:$scope.info.order,
                    offset:$scope.info.offset,
                    limit:$scope.info.limit,
                    total:$scope.info.total,
                    downexcel:1
                }
                DialogService.loading(true)
                ProfitService.orderSearch(condition).then(function(res){
                DialogService.loading(false)
                    console.log(res)
                    window.open(res.data.path)
                })
            }
            $scope.startPaging = function(){
                init()
            }
       }])