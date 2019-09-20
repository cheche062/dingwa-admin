//活动管理
angular.module('ActiveService',['CommonService'])
       .factory('ActiveService', ['$q','$http','ConfigService',function($q,$http,ConfigService){
           return {
                //新增活动接口
                add:function(condition){
                    return $q(function(resolve,reject){
                        var req = {
                            data:JSON.stringify(condition)
                        }
                        $http.post(ConfigService.API + '/misc/activity/add',req).then(function(res){
                            if(res.data.code != ''){
                                return reject(res.data)
                            }
                            return resolve(res.data)
                        },function(err){
                            return reject(0)
                        })
                    })
                },
                //查询活动详情接口
                get:function(condition){
                    return $q(function(resolve,reject){
                        var req = {
                            data:JSON.stringify(condition)
                        }
                        $http.post(ConfigService.API + '/misc/activity/get',req).then(function(res){
                            if(res.data.code != ''){
                                return reject(res.data)
                            }
                            return resolve(res.data)
                        },function(err){
                            return reject(0)
                        })
                    })
                },
                //删除活动接口
                delete:function(condition){
                    return $q(function(resolve,reject){
                        var req = {
                            data:JSON.stringify(condition)
                        }
                        $http.post(ConfigService.API + '/misc/activity/delete',req).then(function(res){
                            if(res.data.code != ''){
                                return reject(res.data)
                            }
                            return resolve(res.data)
                        },function(err){
                            return reject(0)
                        })
                    })
                },
                //编辑活动接口
                update:function(condition){
                    return $q(function(resolve,reject){
                        var req = {
                            data:JSON.stringify(condition)
                        }
                        $http.post(ConfigService.API + '/misc/activity/update',req).then(function(res){
                            if(res.data.code != ''){
                                return reject(res.data)
                            }
                            return resolve(res.data)
                        },function(err){
                            return reject(0)
                        })
                    })
                },
                //查询活动接口
                search:function(condition){
                    return $q(function(resolve,reject){
                        var req = {
                            data:JSON.stringify(condition)
                        }
                        $http.post(ConfigService.API + '/misc/activity/search',req).then(function(res){
                            if(res.data.code != ''){
                                return reject(res.data)
                            }
                            return resolve(res.data)
                        },function(err){
                            return reject(0)
                        })
                    })
                },
           };
       }])