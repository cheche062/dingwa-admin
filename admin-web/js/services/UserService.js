angular.module("UserService", ["CommonService"])
.factory("UserService", ["$http", "$q", "ConfigService",
    function($http, $q, ConfigService) {
        return {
        	add:function(condition){
        		return $q(function(resolve,reject){
        			var req = {
        				data:JSON.stringify(condition)
        			}
        			$http.post(ConfigService.API+'/user/user/add',req).then(function(res){
        				if(res.data.code != 0){
        					reject(res.data)
        				}
        				return resolve(res.data)
        			},function(res){
        				return reject(0)
        			})
        		})
        	},
        	search:function(condition) {
	            return $q(function(resolve,reject) {
	                var req = {
	                    data: JSON.stringify(condition)
	                };
	                $http.post(ConfigService.API + '/user/user/search',req).then(function(resp){
	                    if(resp.data.code != 0) {
	                        return reject(resp.data.code)
	                    }
	                    return resolve(resp.data)
	                },function(resp) {
	                    return reject(0)
	                })
	            });
        	},
        	get:function(condition){
                return $q(function(resolve,reject){
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API+'/user/user/get',req).then(function(res){
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
                    $http.post(ConfigService.API+'/user/user/delete',req).then(function(res){
                        if(res.data.code != 0){
                            return reject(res.data)
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
                    $http.post(ConfigService.API+'/user/user/update',req).then(function(res){
                        if(res.data.code != 0){
                            return reject(res.data)
                        }
                        return resolve(res.data)
                    },function(res){
                        return reject(0)
                    })
                })
            },
            //封禁
            forbid:function(condition){
                return $q(function(resolve,reject){
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API+'/user/user/forbid',req).then(function(res){
                        if(res.data.code != 0){
                            return reject(res.data)
                        }
                        return resolve(res.data)
                    },function(res){
                        return reject(0)
                    })
                })
            },
            //充值
            updatecash:function(condition){
                return $q(function(resolve,reject){
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API+'/user/user/updatecash',req).then(function(res){
                        if(res.data.code != 0){
                            return reject(res.data)
                        }
                        return resolve(res.data)
                    },function(res){
                        return reject(0)
                    })
                })
            },
            //查询用户余额流水明细
            searchcash:function(condition){
                return $q(function(resolve,reject){
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API+'/user/user/searchcash',req).then(function(res){
                        if(res.data.code != 0){
                            return reject(res.data)
                        }
                        return resolve(res.data)
                    },function(res){
                        return reject(0)
                    })
                })
            },
            // 清除用户绑定关系
            clear:function(condition){
                return $q(function(resolve,reject){
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API+'/user/user/clear',req).then(function(res){
                        if(res.data.code != 0){
                            return reject(res.data)
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
