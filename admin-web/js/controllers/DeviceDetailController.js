angular.module("DeviceDetailController",["CommonService", "DeviceService"])
.controller("DeviceDetailCtrl", ["$scope","$state","$stateParams","DeviceService","DialogService",
    function($scope, $state,$stateParams,DeviceService,DialogService){
    	$scope.info = {

    	}
    	init()
    	function init(){
    		var id = $stateParams.id
    		var condition = {
    			id:id
    		}
    		DeviceService.get(condition).then(function(res){
    			console.log(res)
                $scope.device = res.data
                $scope.device.lng  = res.data.longitude+','+res.data.latitude
    		},function(res){
    			DialogService.alert(res.msg)
    		})
    	}
    }
])
.controller('LoadPortsCtrl',['$scope','$state','$stateParams','DevicePortService','DialogService',
    function($scope,$state,$stateParams,DevicePortService,DialogService){
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
        function init(){
            var id = $stateParams.id
            var condition = {
                device_obj:{id:id,name:''},
                offset:$scope.info.offset,
                limit:$scope.info.limit,
                order_by:$scope.info.order_by,
                order:$scope.info.order,
                total:$scope.info.total
            }
            DevicePortService.search(condition).then(function(res){
                console.log(res)
                $scope.ports = res.data.list
                $scope.info.total = res.data.total
                $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
            },function(err){})
        }
        $scope.goDetail = function(id){
            $state.go('main.deviceport/detail',{id:id},{
                reload:'main.deviceport/detail'
            })
        }
        $scope.startPaging = function(){
            init()
        }
}])
.controller('LoadChargeOrdersCtrl',['$scope','$state','$stateParams','DeviceService','DialogService',
    function($scope,$state,$stateParams,DeviceService,DialogService){
        $scope.now = new Date();
        $scope.last_two_month = $scope.now.getTime() - 60 * 24 * 3600 * 1000;
        $scope.info = {
            offset:0,
            limit:20,
            order_by:'created_at',
            order:'desc',
            total:0,
            page:1,
            pageCnt:0,
            created_st:formatDate($scope.last_two_month),
            created_et:formatDate($scope.now)
        }
        $("#start-date").datepicker({
                language: 'zh-CN',
                startView: 0,
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayBtn: false,
                startDate:'1970-01-01',
                endDate: formatDate($scope.now),
                todayHighlight: true
            }).on('changeDate',function(e){
                var startTime = e.date
                $('#end-date').datepicker('setStartDate',startTime)
            })
        $("#end-date").datepicker({
            language: 'zh-CN',
            startView: 0,
            format: 'yyyy-mm-dd',
            autoclose: true,
            todayBtn: false,
            startDate:'1970-01-01',
            endDate: formatDate($scope.now),
            todayHighlight: true
        }).on('chageDate',function(e){
            var endTime = e.date
            $('#start-date').datepicker('setEndDate',endTime)
        })
        $('#start-date').datepicker("setDate", formatDate($scope.last_two_month));
        $('#end-date').datepicker("setDate", formatDate($scope.now));
        init()
        function init(){
            var id = $stateParams.id
            var condition = {
                created_st:$scope.info.created_st,
                created_et:$scope.info.created_et,
                id:id,
                offset:$scope.info.offset,
                limit:$scope.info.limit,
                downexcel:0
            }
            DeviceService.searchOrder(condition).then(function(res){
                console.log(res)
                $scope.charge_orders = res.data.list
                $scope.info.total = res.data.total,
                $scope.info.pageCnt = Math.ceil($scope.info.total/$scope.info.limit)
            })
        }
        $scope.startPaging = function(){
            init()
        }

        $scope.search = function(){
            init()
        }
        $scope.export = function(){
            var condition = {
                created_st:$scope.info.created_st,
                created_et:$scope.info.created_et,
                id:$stateParams.id,
                offset:$scope.info.offset,
                limit:$scope.info.limit,
                downexcel:1
            }
            DeviceService.searchOrder(condition).then(function(res){
                window.open(res.data.path)
            })
        }
}])
