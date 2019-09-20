angular.module('DevicePortService', ["CommonService"])
.factory("DevicePortService",["$http", "$q", "ConfigService",
    function($http, $q, ConfigService) {
        return {
            add:function(condition){
                return $q(function(resolve,reject){
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API+'/device/deviceport/add',req).then(function(res){
                        if(res.data.code != 0){
                            reject(res.data)
                        }
                        return resolve(res.data)
                    },function(res){
                        return reject(0)
                    })
                })
            },
            update:function(condition){
                return $q(function(resolve,reject){
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API+'/device/deviceport/update',req).then(function(res){
                        if(res.data.code != 0){
                            reject(res.data)
                        }
                        return resolve(res.data)
                    },function(res){
                        return reject(0)
                    })
                })
            },
            delete:function(condition){
                return $q(function(resolve,reject){
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API+'/device/deviceport/delete',req).then(function(res){
                        if(res.data.code != 0){
                            reject(res.data)
                        }
                        return resolve(res.data)
                    },function(res){
                        return reject(0)
                    })
                })
            },
            get:function(condition){
                return $q(function(resolve,reject){
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API+'/device/deviceport/get',req).then(function(res){
                        if(res.data.code != 0){
                            reject(res.data)
                        }
                        return resolve(res.data)
                    },function(res){
                        return reject(0)
                    })
                })
            },
            search:function(condition){
                return $q(function(resolve,reject){
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API+'/device/deviceport/search',req).then(function(res){
                        if(res.data.code != 0){
                            reject(res.data)
                        }
                        return resolve(res.data)
                    },function(res){
                        return reject(0)
                    })
                })
            },
        }
    }
])
