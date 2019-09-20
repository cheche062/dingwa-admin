angular.module("UserShowController", ["CommonService", "UserService"])
.controller("UserShowCtrl", ["$scope", "$state","$stateParams","$timeout","UserService",
    function($scope, $state,$stateParams,$timeout,UserService) {
        $scope.now = new Date()
        $scope.last_two_month = $scope.now.getTime() - 7 * 24 * 3600 * 1000;
        $scope.balance_water = []
        $scope.info = {
            created_st:formatDate($scope.last_two_month),
            created_et:formatDate($scope.now),
            order_by:'created_at',
            order:'desc',
            offset:0,
            limit:20,
            total:0,
            page:1,
            pageCnt:0
        }
        $("#balance-start-date,#balance-end-date").datepicker({
            language: 'zh-CN',
            format: 'yyyy-mm-dd',
            autoclose: true,
            todayBtn: false,
            endDate: formatDate($scope.now), //禁止选择当天之后的日期
            todayHighlight: true
        });
        $("input[id$='start-date']").datepicker("setDate", formatDate($scope.last_two_month));
        $("input[id$='end-date']").datepicker("setDate", formatDate($scope.now));
        init()
        function init(){
            var id = $stateParams.id
            var date = new Date().getTime();
            var res = date + ":" + id;
            var base = new Base64();

            var encodeId = base.encode(res)

            var finalId = ['user' , encodeId]

            userId = finalId.join(' ')
            get()
            search()
            
        }
        function search(){
             var condition = {
                id:$stateParams.id,
                created_st:$scope.info.created_st,
                created_et:$scope.info.created_et,
                order_by:$scope.info.order_by,
                order:$scope.info.order,
                offset:$scope.info.offset,
                limit:$scope.info.limit,
                total:$scope.info.total
            }
            UserService.searchcash(condition).then(function(res){
                $scope.balance_water = res.data.list
                $scope.info.total = res.data.total
                $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
                console.log(res)
            })
        }
        function get(){
            var condition = {
                id:userId
            }
            UserService.get(condition).then(function(res){
                console.log(res)
                $scope.user = res.data
            },function(res){
                DialogService.alert(res.msg)
            })
        }
        $scope.startPaging = function(){
            search()
        }
        $scope.search = function(){
            search()
        }
    }
])
