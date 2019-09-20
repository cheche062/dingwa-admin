angular.module('CommonService', [])

.factory('ConfigService', function() {
    var _API = 'http://dev.chargedot.com:18888/admin/v1';   //测试
    // var _API = 'http://admin.chargedot.com:18888/admin/v1';  //正式

    return {
        API:_API
    }
})
.factory('IndexService',["$http", "$q", "ConfigService",function($http,$q,ConfigService){
    return{
        search:function(condition){
            return $q(function(resolve,reject){
                var req = {
                    data:JSON.stringify(condition)
                }
                $http.post(ConfigService.API + '/system/index/search', req).then(function(res){
                    if(res.data.code !== 0) {
                        return reject(res.data);
                    }
                    return resolve(res.data)
                },function(resp) {
                    return reject(0)
                })
            })
        },
    }
}])
.run(['$rootScope', '$location', function ($rootScope, $location) {
    $rootScope.$on('$locationChangeStart', locationChangeStart);
    // var storage = window.localStorage
    // if(storage.basicAuth){
    //     var arr_id = []
    //     var basicAuth = JSON.parse(storage.getItem('basicAuth'))
    //     for(var i in basicAuth){
    //         arr_id.push(basicAuth[i].id)
    //     }
    //     console.log(arr_id)
    // }
    function locationChangeStart(event) {
        $('.modal-backdrop').each(function(){
            $(this).removeClass("modal-backdrop")
        })
        $('.modal').modal('hide')
    }
}])
.factory('HttpRequestInterceptor', ['$q', '$injector', 'ConfigService', 'DialogService', function($q, $injector, ConfigService, DialogService) {
    return {
        request: function(config) {
            // if (config.url.indexOf('data')>0||config.url.indexOf('device/beginUpgrade')>0) {
            //     DialogService.loading(true);
            // };
            if (config.method === 'POST') {
                config.timeout = 600000;
                if (config.data === undefined) {
                    config.data = {
                        nologin: 999
                    };
                } else {
                    config.data.nologin = 999;
                }
            }
            return config;
        },
        requestError: function(rejection) {
            DialogService.loading(false);
            DialogService.alert('发送请求失败，请检查网络');
            return $q.reject(rejection);
        },
        response: function(resp) {
            DialogService.loading(false);
            if (resp.data.code !== undefined && resp.data.code !== 0) {
                if (resp.data.code === 5003) {
                    var stateService = $injector.get('$state');
                    stateService.go('login', {}, {
                        reload: true
                    });
                } else {
                    DialogService.alert(resp.data.msg);
                }
            }
            return resp;
        },
        responseError: function(rejection) {
            console.log(rejection)
            // DialogService.loading(false);
            if (rejection.status === 0) {
                DialogService.alert('请求响应错误，请检查网络');
            } else if (rejection.status === 500) {
                DialogService.alert('服务器出错');
            } else {
                DialogService.alert('请求失败，请检查网络');
            }
            return $q.reject(rejection);
        }
    };
}])
.factory('DialogService', ['$rootScope', '$timeout', function($rootScope, $timeout) {
    $rootScope.root = {
        msg: '',
        loading: false
    };
    $rootScope.$on('$locationChangeStart',function(){
    })
    $rootScope.$on('$locationChangeSuccess',function(){
    })
    return {
        alert: function(msg) {
            $rootScope.root.msg = msg;
            $('#AlertDialog').modal('show');

        },
        confirm: function(msg, resolve) {
            $rootScope.root.msg = msg;
            $rootScope.root.confirm = resolve;
            $('#ConfirmDialog').modal('show');
        },

        loading: function(flag) {
            $rootScope.root.loading = flag;
        }
    };
}])
.factory("DictService", ['$http', '$q', 'ConfigService', function($http, $q, ConfigService) {
        return {
            search: function(condition) {
                return $q(function(resolve, reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    };
                    $http.post(ConfigService.API + '/util/util/search', req).then(function(resp) {
                        if (resp.data.code !== 0) {
                            return reject(resp.data.code);
                        }
                        if (condition.type == 'enterprise') {
                            var firstLevels = [];
                            var secondLevels = [];
                            var thirdLevels = [];
                            var fourthLevels = [];
                            var idx = 0,
                                i = 0,
                                j = 0,
                                k = 0;
                            var data = resp.data.data;
                            var enterprises = [];
                            for (idx in data) {
                                if (data[idx].level == 1) {
                                    firstLevels.push(data[idx]);
                                } else if (data[idx].level == 2) {
                                    secondLevels.push(data[idx]);
                                } else if (data[idx].level == 3) {
                                    thirdLevels.push(data[idx]);
                                } else if (data[idx].level == 4) {
                                    fourthLevels.push(data[idx]);
                                }
                            }
                            if (firstLevels.length > 0) {
                                for (idx in firstLevels) {
                                    enterprises.push(firstLevels[idx]);
                                    for (i in secondLevels) {
                                        if (secondLevels[i].parent_id == firstLevels[idx].id) {
                                            enterprises.push(secondLevels[i]);
                                            for (j in thirdLevels) {
                                                if (thirdLevels[j].parent_id == secondLevels[i].id) {
                                                    enterprises.push(thirdLevels[j]);
                                                    for (k in fourthLevels) {
                                                        if (fourthLevels[k].parent_id == thirdLevels[j].id) {
                                                            enterprises.push(fourthLevels[k]);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            } else if (secondLevels.length > 0) {
                                for (i in secondLevels) {
                                    enterprises.push(secondLevels[i]);
                                    for (j in thirdLevels) {
                                        if (thirdLevels[j].parent_id == secondLevels[i].id) {
                                            enterprises.push(thirdLevels[j]);
                                            for (k in fourthLevels) {
                                                if (fourthLevels[k].parent_id == thirdLevels[j].id) {
                                                    enterprises.push(fourthLevels[k]);
                                                }
                                            }
                                        }
                                    }
                                }
                            } else if (thirdLevels.length > 0) {
                                for (j in thirdLevels) {
                                    enterprises.push(thirdLevels[j]);
                                    for (k in fourthLevels) {
                                        if (fourthLevels[k].parent_id == thirdLevels[j].id) {
                                            enterprises.push(fourthLevels[k]);
                                        }
                                    }
                                }
                            } else {
                                for (k in fourthLevels) {
                                    enterprises.push(fourthLevels[k]);
                                }
                            }
                            return resolve(enterprises);
                        } else {
                            return resolve(resp.data.data);
                        }
                    }, function(resp) {
                        return reject(0);
                    });
                });
            },
            download: function(condition, type) {
                return $q(function(resolve, reject) {
                    var req = {data: JSON.stringify(condition), object_type: type};
                    $http.post(ConfigService.API + '/util/data/download', req).then(function(resp) {
                        if (resp.data.code !== 0) {
                            return reject(resp.data.code);
                        }
                        return resolve(resp.data.data);
                    }, function(resp) {
                        return reject(0);
                    });
                });
            },
        };
    }])
    .factory('GetItem', [function() {
        return {
            UserItem: {
                phone: "",
                id: ""
            },
            DeviceItem: {
                device_number: "",
                id: ""
            },
            StationItem: {
                name: "",
                id: ""
            },
            StationGroup: {
                id: "",
                name: ""
            },
            UserGroup: {
                id: "",
                name: ""
            }
        }
    }])
    .factory('DirectiveDataTransfer', [function() {
        return {
            condition: {
                enterprise_id: "",
                station_id: "",
                show_type: "", //下拉菜单指令要用
                count: 0 //下拉菜单指令要用
            }
        }
    }])

    // 获取验证码
    .factory('IdentifyCodeService',['$q','$http','ConfigService',
    function($q,$http,ConfigService){

        return{
            getIdentifyCode:function(){
                return $q(function(resolve,reject){
                    var random = '';
                    for(var i = 0 ;i<6;i++){
                        random += Math.floor(Math.random()*10)
                    }
                    $http.post(ConfigService.API +'/system/user/captcha/' + random).then(function(resp) {
                        console.log(resp);
                        if (resp.data.code !== 0) {
                            return reject(resp.data.code);
                        }
                        return resolve(resp.data.data);
                    }, function(resp) {
                        return reject(0);
                    });
                    // $http({
                    //     // url: 'http://' + '192.168.0.214:7080/api/v1/system/user/captcha/' + random,
                    //     url: ConfigService.API +'/api/v1/system/user/captcha/' + random,
                    //     method:'get',
                    //     dataType:'JSON',
                    //     headers:{
                    //         'Content-Type':'application/json'
                    //     },
                    //     data:JSON.stringify({}),
                    //     withCredentials: true
                    // }).then(function(resp){
                    //     return resolve(resp);
                    // },function(resp){
                    //     return reject(0);
                    // });

                });
            },
        };
    }])
