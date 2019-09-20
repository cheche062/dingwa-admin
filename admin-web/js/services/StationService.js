angular.module('StationService',["CommonService"])
.factory("StationService",["$http", "$q", "ConfigService",
    function($http, $q, ConfigService) {
        return {
        	add:function(condition){
                return $q(function(resolve,reject){
            		var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API + '/station/station/add', req).then(function(res) {
                        if(res.data.code !== 0) {
                            return reject(res.data);
                        }
                        return resolve(res.data)
                    },function(resp) {
                        return reject(0)
                    })
                })
        	},
            update:function(condition){
                return $q(function(resolve,reject){
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API+'/station/station/update',req).then(function(res){
                        if(res.data.code != 0){
                            return reject(res.data)
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
                    $http.post(ConfigService.API+'/station/station/delete',req).then(function(res){
                        if(res.data.code != 0){
                            return reject(res.data)
                        }
                        return resolve(res.data)
                    },function(res){
                        return reject(0)
                    })
                })
            },
            //获取站点列表
            search:function(condition){
                return $q(function(resolve,reject){
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API+'/station/station/search',req).then(function(res){
                        if(res.data.code != 0){
                            return reject(res.data)
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
                    $http.post(ConfigService.API+'/station/station/get',req).then(function(res){
                        if(res.data.code != 0){
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
