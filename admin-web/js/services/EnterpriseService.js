angular.module("EnterpriseService", ["CommonService"])

.factory("EnterpriseService",["$http", "$q", "ConfigService",
    function($http, $q, ConfigService) {
        return {
            // 查询列表
            Search:function(condition) {
                return $q(function(resolve,reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API + '/enterprise/enterprise/search',req)
                    .then(function(resp) {
                        if(resp.data.code !== 0) {
                            return reject(resp.data.code);
                        }
                        return resolve(resp.data)
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
                    $http.post(ConfigService.API + '/enterprise/enterprise/add', req).then(function(resp) {
                        if(resp.data.code !== 0) {
                            return reject(resp.data);
                        }
                        return resolve(resp.data)
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
                    $http.post(ConfigService.API + '/enterprise/enterprise/update',req).then(function(resp) {
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
                    $http.post(ConfigService.API + '/enterprise/enterprise/delete',req).then(function(resp) {
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
                    $http.post(ConfigService.API + '/enterprise/enterprise/get',req).then(function(resp) {
                        if(resp.data.code !== 0) {
                            return reject(resp.data)
                        }
                        return resolve(resp.data)
                    },function(resp) {
                        return reject(0)
                    })
                })
            }
        }
    }
])
