angular.module("SystemUserDetailController",["CommonService","SystemUserService"])
.controller("SystemUserDetailCtrl",["$scope","$stateParams", "SystemUserService",
    function($scope, $stateParams, SystemUserService) {
        var systemUserId = null
        $scope.detail = null
        init()
        function init() {
            // var random_id = $stateParams.id;
            var id = $stateParams.id;
            var date = new Date().getTime();
            var res = date + ":" + id;
            var base = new Base64();

            var encodeId = base.encode(res)

            var finalId = ['system' , encodeId]

            systemUserId = finalId.join(' ')
            get()
        }

        function get() {
            var condition = {
                id:systemUserId
            }
            SystemUserService.Detail(condition).then(function(data){
                $scope.detail = data
            })
        }


    }
])
