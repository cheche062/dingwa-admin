angular.module('SystemUserService',['CommonService'])
.factory('SystemUserService', ['$http', '$q', 'ConfigService',
    function($http, $q, ConfigService) {
        return {
            Search:function(condition) {
                return $q(function(resolve,reject) {
                    var req = {
                        data: JSON.stringify(condition)
                    };
                    $http.post(ConfigService.API + '/system/user/search',req).then(function(resp){
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
                    $http.post(ConfigService.API + '/system/user/add', req).then(function(resp) {
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
                    $http.post(ConfigService.API + '/system/user/update',req).then(function(resp) {
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
                    $http.post(ConfigService.API + '/system/user/delete',req).then(function(resp) {
                        if(resp.data.code !== 0) {
                            return reject(resp.data.code)
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
                    $http.post(ConfigService.API + '/system/user/get',req).then(function(resp) {
                        if(resp.data.code !== 0) {
                            return reject(resp.data.code)
                        }
                        return resolve(resp.data.data)
                    },function(resp) {
                        return reject(0)
                    })
                })
            },
            //重置密码
            Reset:function(condition) {
                return $q(function(resolve,reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API + '/system/user/reset',req).then(function(resp) {
                        if(resp.data.code !== 0) {
                            return reject(resp.data.code)
                        }
                        return resolve(resp.data.data)
                    },function(resp) {
                        return reject(0)
                    })
                })
            },
            //获取当前登录用户信息
            GetCurrent: function() {
                return $q(function(resolve, reject) {
                    $http.post(ConfigService.API + '/system/user/getcurrent').then(function(resp) {
                        if (resp.data.code !== 0) {
                            return reject(resp.data.code);
                        }
                        return resolve(resp.data);
                    }, function(resp) {
                        return reject(0);
                    });
                });
            },
            //修改系统用户密码
            change:function(condition){
                return $q(function(resolve,reject){
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API+ '/system/pwd/update',req).then(function(res){
                        if(res.data.code !== 0){
                            return reject(res.data)
                        }
                        return resolve(res.data)
                    },function(res){
                        return reject(0)
                    })
                })
            }
        }
    }
])
