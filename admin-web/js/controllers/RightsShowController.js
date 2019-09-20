angular.module("RightsShowController",["CommonService","RightsService",'SystemUserService'])
.controller("RightsShowCtrl",["$scope", "$state", "RightsService", "DialogService","SystemUserService",
    function($scope, $state, RightsService, DialogService,SystemUserService) {

        $scope.info ={
            list:[]
        }
        search()
        function search() {
            var condition = {

            }
            SystemUserService.GetCurrent(condition).then(function(data){
                $scope.info.list = data.system_group_modules
            })

        }
    }
])
