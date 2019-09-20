angular.module('qqqqq', [])
    .controller('testCtrol', ['$scope', 'IndexService', "myTestFactory1", function ($scope, IndexService, myTestFactory1) {
        $scope.a = 1234
        console.log("IndexService====  ", myTestFactory1)

    }])


angular.module("mainGlobalMod", [])
    .factory("addService", function () {
        return {
            name: "addService"
        }
    })

angular.module("childMod1", ["mainGlobalMod"])
    .controller("controller1", function ($scope, addService, addService2) {
        console.log("我的测试1", addService);
        console.log("我的测试2", addService2);
    })
    .factory()