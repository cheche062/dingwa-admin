angular.module('SystemUsersShowController',["CommonService","SystemUserService"])
.controller("SystemUsersShowCtrl",["$scope","$state","$stateParams","SystemUserService","DialogService",
    function($scope, $state,$stateParams,SystemUserService, DialogService) {
        $scope.data = {
            
        }
        $scope.info = {
            order_by:'created_at',
            order:'desc',
            list:[],
            total:0,
            limit:20,
            offset:0,
            pageCnt:0,
            page:1,
            count:0,
            remarks:'',
            phone:''
        }

        $scope.systemuser = {
            name:'',
            id:''
        }

        $scope.systemGroup = {
            name:'',
            id:''
        }

        $scope.query = {
            group_obj:null,
        }
        init()
        function init() {
            console.log($stateParams)
            if($stateParams.name != null){
                $scope.systemGroup.name = $stateParams.name
                search()
            }else{
                search()
            }
        }

        $scope.searchList = function(){
            console.log($scope.systemuser)
            search()
        }

        function search() {
            var condition = {
                group_obj:$scope.systemGroup,
                user_obj:$scope.systemuser,
                order_by:$scope.info.order_by,
                order:$scope.info.order,
                offset:$scope.info.offset,
                limit:$scope.info.limit,
                phone:$scope.info.phone
            }
            SystemUserService.Search(condition).then(function(res) {
                $scope.info.list = res.data.list
                $scope.info.total = res.data.total
                $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
            },function(code) {})
        }

        $scope.startPaging = function(){
            search()
        }

        $scope.delete = function(id){
            var condition = {
                id: id
            }
            DialogService.confirm('确认要删除吗',function(){
                SystemUserService.Delete(condition).then(function(data){
                    if(data.code == 0){
                        DialogService.alert('删除成功')
                        search()
                    }
                })
            })
        }

        $scope.reset = function(id){
            var condition = {
                id:id
            }
            SystemUserService.Reset(condition).then(function(data){

                    DialogService.alert('密码重置成功！')
            })
        }
        //用户提现
        $scope.withDraw = function(id){
            $('#withDrawsModal').modal('show')
            $scope.confirmWithDraw = function(){
                if($scope.info.count == ''){
                    DialogService.alert('请输入提现金额')
                    return false
                }
                if($scope.info.remarks == ''){
                    DialogService.alert('请输入备注信息')
                    return false
                }

            }
        }
    }
])
