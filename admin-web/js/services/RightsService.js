angular.module("RightsService",["CommonService"])
.factory("RightsService",["$http", "$q", "ConfigService",
    function($http, $q, ConfigService) {
        return {
            Search:function(condition) {
                return $q(function(resolve,reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API + '/system/purchased/search',req).then(function(resp) {
                        if(resp.data.code !== 0) {
                            return reject(resp.data.code);
                        }
                        return resolve(resp.data.data)
                    },function(resp) {
                        return reject(0)
                    })

                })
            },
            // 添加
            Add:function(condition) {
                return $q(function(resolve, reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API + '/system/purchased/add', req).then(function(resp) {
                        if(resp.data.code !== 0) {
                            return reject(resp.data.code);
                        }
                        return resolve(resp.data.data)
                    },function(resp) {
                        return rejcet(0)
                    })
                })
            }
        }
    }
])
