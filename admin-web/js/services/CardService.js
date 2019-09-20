angular.module('CardService',['CommonService'])
       .factory('CardService',['$q','$http','ConfigService',function($q,$http,ConfigService){
            return {
                search:function(condition){  
                    return $q(function(resolve,reject){
                        var req = {
                            data:JSON.stringify(condition)
                        };
                        $http.post(ConfigService.API + '/card/card/search', req).then(function(resp){
                            if(resp.data.code !== 0) {
                                return reject(resp.data);
                            }
                            return resolve(resp.data)
                        },function(err){
                            console.log(err)
                            return reject(err)
                        })
                    })
                },
                add:function(condition){  
                    return $q(function(resolve,reject){
                        var req = {
                            data:JSON.stringify(condition)
                        };
                        $http.post(ConfigService.API + '/card/card/add', req).then(function(resp){
                            if(resp.data.code !== 0) {
                                return reject(resp.data);
                            }
                            return resolve(resp.data)
                        },function(err){
                            console.log(err)
                            return reject(err)
                        })
                    })
                },
                delete:function(condition){  
                    return $q(function(resolve,reject){
                        var req = {
                            data:JSON.stringify(condition)
                        };
                        $http.post(ConfigService.API + '/card/card/delete', req).then(function(resp){
                            if(resp.data.code !== 0) {
                                return reject(resp.data);
                            }
                            return resolve(resp.data)
                        },function(err){
                            console.log(err)
                            return reject(err)
                        })
                    })
                },
                forbid:function(condition){  
                    return $q(function(resolve,reject){
                        var req = {
                            data:JSON.stringify(condition)
                        };
                        $http.post(ConfigService.API + '/card/card/forbid', req).then(function(resp){
                            if(resp.data.code !== 0) {
                                return reject(resp.data);
                            }
                            return resolve(resp.data)
                        },function(err){
                            console.log(err)
                            return reject(err)
                        })
                    })
                },
                //编辑卡
                update:function(condition){
                    return $q(function(resolve,reject){
                        var req = {
                            data:JSON.stringify(condition)
                        };
                        $http.post(ConfigService.API + '/card/card/update', req).then(function(resp){
                            if(resp.data.code !== 0) {
                                return reject(resp.data);
                            }
                            return resolve(resp.data)
                        },function(err){
                            console.log(err)
                            return reject(err)
                        })
                    })
                },
                //修改：导入
                uploadFile:function(resultJson){
                    console.log("传参后"+resultJson)
                    return $q(function(resolve,reject){
                        var result = JSON.stringify(resultJson);
                        console.log("结果"+result);
                        $http.post('http://127.0.0.1:8086/card/cardImport',result).then(function(resp){
                            if(resp.data.code !== 0) {
                                return reject(resp.data);
                            }
                                return resolve(resp.data)
                            },function(err){
                                console.log(err)
                                return reject(err)
                            })
                        })
                }
            }
       }])
