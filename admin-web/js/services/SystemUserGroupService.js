angular.module("SystemUserGroupService",["CommonService"])
.factory("SystemUserGroupService", ["$http", "$q", "ConfigService",
function($http, $q, ConfigService) {
    return {
        Search:function(condition) {
            return $q(function(resolve,reject) {
                var req = {
                    data: JSON.stringify(condition)
                };
                $http.post(ConfigService.API + '/system/group/search',req).then(function(resp){
                    if(resp.data.code != 0) {
                        return reject(resp.data.code)
                    }
                    return resolve(resp.data)
                },function(resp) {
                    return reject(0)
                })
            });
        },
        // 添加
        Add:function(condition) {
            return $q(function(resolve, reject) {
                var req = {
                    data:JSON.stringify(condition)
                }
                $http.post(ConfigService.API + '/system/group/add', req).then(function(resp) {
                    if(resp.data.code !== 0) {
                        return reject(resp.data.code);
                    }
                    return resolve(resp.data.data)
                },function(resp) {
                    return rejcet(0)
                })
            })
        },
        //更新
        Update:function(condition) {
            return $q(function(resolve, reject) {
                var req = {
                    data:JSON.stringify(condition)
                }
                $http.post(ConfigService.API + '/system/group/update',req).then(function(resp) {
                    if(resp.data.code !== 0) {
                        return reject(resp.data.code);
                    }
                    return resolve(resp.data.data)
                },function(resp) {
                    return reject(0)
                })
            })
        },
        // 删除
        Delete:function(condition) {
            return $q(function(resolve, reject) {
                var req = {
                    data:JSON.stringify(condition)
                }
                $http.post(ConfigService.API + '/system/group/delete',req).then(function(resp) {
                    if(resp.data.code !== 0) {
                        return reject(resp.data)
                    }
                    return resolve(resp.data)
                },function(resp) {
                    return reject(0)
                })
            })
        },
        // 详情
        Detail:function(condition) {
            return $q(function(resolve,reject) {
                var req = {
                    data:JSON.stringify(condition)
                }
                $http.post(ConfigService.API + '/system/group/get',req).then(function(resp) {
                    if(resp.data.code !== 0) {
                        return reject(resp.data.code)
                    }
                    return resolve(resp.data.data)
                },function(resp) {
                    return reject(0)
                })
            })
        },
    }
}
])
