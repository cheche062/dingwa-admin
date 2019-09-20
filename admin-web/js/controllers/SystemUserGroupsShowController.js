angular.module("SystemUserGroupsShowController",["CommonService"])
.controller("SystemUserGroupsShowCtrl",["$scope", "$state","$stateParams","DialogService", "SystemUserGroupService",
    function($scope, $state,$stateParams,DialogService, SystemUserGroupService) {

        $scope.data = {
            
        }
        $scope.info = {
            list:[],
            total:0,
            pageCnt:0,
            page:1,
            order_by:'created_at',
            order:'desc',
            offset:0,
            limit:20
        }
        $scope.query = {
            system_group_obj:null,   
        }

        $scope.systemgroup = {
            name:'',
            id:''
        }

        init()
        function init(){

            search()
        }

        $scope.searchList = function(){
            search()
        }



        function search(){
            var condition = {
                system_group_obj:$scope.systemgroup,
                order_by:$scope.info.order_by,
                order:$scope.info.order,
                offset:$scope.info.offset,
                limit:$scope.info.limit
            }
            SystemUserGroupService.Search(condition).then(function(res){
                $scope.info.list  = res.data.list
                $scope.info.total = res.data.total
                $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
            })
        }
        $scope.startPaging = function(){
            search()
        }
        $scope.goDetail = function(x){
            console.log(x)
            $state.go('main.systemuser/list',{name:x.name})
        }
        // 删除系统用户组
        $scope.delete = function(id){
            var condition = {
                id:id
            }
            DialogService.confirm('确认要删除系统用户组？',function(){
                SystemUserGroupService.Delete(condition).then(function(data){
                    DialogService.alert('删除成功')
                    search()
                },function(res){
                    if(res.msg != ''){
                        DialogService.alert(res.msg)
                    }
                })
            })
        }
    }
])
