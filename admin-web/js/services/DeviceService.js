angular.module('DeviceService', ["CommonService"])
.factory("DeviceService",["$http", "$q", "ConfigService",
    function($http, $q, ConfigService) {
        return {
        	add:function(condition){
        		return $q(function(resolve,reject){
        			var req = {
        				data:JSON.stringify(condition)
        			}
        			$http.post(ConfigService.API+'/device/device/add',req).then(function(res){
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
                    $http.post(ConfigService.API+'/device/device/update',req).then(function(res){
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
                    $http.post(ConfigService.API+'/device/device/delete',req).then(function(res){
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
                    $http.post(ConfigService.API+'/device/device/search',req).then(function(res){
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
                    $http.post(ConfigService.API+'/device/device/get',req).then(function(res){
                        if(res.data.code != 0){
                            reject(res.data)
                        }
                        return resolve(res.data)
                    },function(res){
                        return reject(0)
                    })
                })
            },
            //设备详情下的订单列表接口
            searchOrder:function(condition){
                return $q(function(resolve,reject){
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API+'/finance/device/search',req).then(function(res){
                        if(res.data.code != 0){
                            reject(res.data)
                        }
                        return resolve(res.data)
                    },function(res){
                        return reject(0)
                    })
                })
            },
            //广告详情
            advertget: function(id) {
                return $q(function(resolve, reject) {
                    var req = {
                        id: id
                    };
                    $http.post(ConfigService.API + '/station/device/get', req).then(function(resp) {
                        console.log(resp);
                        if (resp.data.code !== 0) {
                            return reject(resp.data.code);
                        }
                        return resolve(resp.data.data);
                    }, function(resp) {
                        return reject(0);
                    });
                });
            },
            //获取设备配置信息
            configGet:function(condition){
                return $q(function(resolve, reject) {
                    var req = {
                        data: JSON.stringify(condition)
                    };
                    $http.post(ConfigService.API + '/device/deviceConf/get', req).then(function(resp) {
                        console.log(resp);
                        if (resp.data.code !== 0) {
                            return reject(resp.data.code);
                        }
                        return resolve(resp.data);
                    }, function(resp) {
                        return reject(0);
                    });
                });
            },
            //设备配置信息设备
            configSet:function(condition){
                return $q(function(resolve, reject) {
                    var req = {
                        data: JSON.stringify(condition)
                    };
                    $http.post(ConfigService.API + '/device/deviceConf/set', req).then(function(resp) {
                        console.log(resp);
                        if (resp.data.code !== 0) {
                            return reject(resp.data.code);
                        }
                        return resolve(resp.data);
                    }, function(resp) {
                        return reject(0);
                    });
                });
            },
            //设备封禁,解除封禁
            forbid:function(condition){
                return $q(function(resolve, reject) {
                    var req = {
                        data: JSON.stringify(condition)
                    };
                    $http.post(ConfigService.API + '/device/device/forbid', req).then(function(resp) {
                        console.log(resp);
                        if (resp.data.code !== 0) {
                            return reject(resp.data.code);
                        }
                        return resolve(resp.data);
                    }, function(resp) {
                        return reject(0);
                    });
                });
            }
        }
    }
])
