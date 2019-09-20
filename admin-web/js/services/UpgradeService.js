angular.module("UpgradeService",["CommonService"])
.factory("UpgradeService",["$http", "$q", "ConfigService",
    function($http, $q, ConfigService) {
        return {
            //远程升级包查询接口
            searchPackage:function(condition) {
                return $q(function(resolve,reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API + '/device/packs/search',req).then(function(resp) {
                        if(resp.data.code !== 0) {
                            return reject(resp.data);
                        }
                        return resolve(resp.data)
                    },function(resp) {
                        return reject(0)
                    })

                })
            },
            //包上传接口
            newupload:function(condition) {
                return $q(function(resolve,reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API + '/device/device/newupload',req,{headers:{'Content-Type':'multipart/form-data;'}}).then(function(resp) {
                        if(resp.data.code !== 0) {
                            return reject(resp.data);
                        }
                        return resolve(resp.data)
                    },function(resp) {
                        return reject(0)
                    })

                })
            },
            //更新升级包适用版本接口
            update:function(condition) {
                return $q(function(resolve,reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API + '/device/packs/update',req).then(function(resp) {
                        if(resp.data.code !== 0) {
                            return reject(resp.data);
                        }
                        return resolve(resp.data)
                    },function(resp) {
                        return reject(0)
                    })

                })
            },
            //远程升级获取桩列表接口
            search:function(condition) {
                return $q(function(resolve,reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API + '/device/deviceInfos/search',req).then(function(resp) {
                        if(resp.data.code !== 0) {
                            return reject(resp.data);
                        }
                        return resolve(resp.data)
                    },function(resp) {
                        return reject(0)
                    })

                })
            },
            //远程升级获取升级报告列表接口
            searchReport:function(condition) {
                return $q(function(resolve,reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API + '/device/deviceInfos/searchReport',req).then(function(resp) {
                        if(resp.data.code !== 0) {
                            return reject(resp.data);
                        }
                        return resolve(resp.data)
                    },function(resp) {
                        return reject(0)
                    })

                })
            },
            //远程升级包确定解压接口
            addpack:function(condition) {
                return $q(function(resolve,reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API + '/device/device/addpack',req).then(function(resp) {
                        if(resp.data.code !== 0) {
                            return reject(resp.data);
                        }
                        return resolve(resp.data)
                    },function(resp) {
                        return reject(0)
                    })

                })
            },
            //升级前桩校验接口
            checkUpgrade:function(condition) {
                return $q(function(resolve,reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API + '/device/deviceInfos/checkUpgrade',req).then(function(resp) {
                        if(resp.data.code !== 0) {
                            return reject(resp.data);
                        }
                        return resolve(resp.data)
                    },function(resp) {
                        return reject(0)
                    })

                })
            },
            //开始升级接口
            beginUpgrade:function(condition) {
                return $q(function(resolve,reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API + '/device/deviceInfos/beginUpgrade',req).then(function(resp) {
                        if(resp.data.code !== 0) {
                            return reject(resp.data);
                        }
                        return resolve(resp.data)
                    },function(resp) {
                        return reject(0)
                    })

                })
            },
        }
    }
])
