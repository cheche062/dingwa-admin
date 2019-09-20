angular.module('MailNotifyService',["CommonService"])
.factory('MailNotifyService',['$http', '$q', 'ConfigService','DialogService',
    function($http, $q, ConfigService,DialogService) {
        return {
            //获取邮箱地址配置接口
            get: function(condition) {
                return $q(function(resolve, reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    };
                    $http.post(ConfigService.API + '/system/email/conf/search', req).then(function(res) {
                        if (res.data.code !== 0) {
                            if(res.data.msg != ''){
                                DialogService.alert(res.data.msg)
                            }
                            return reject(res.data.code);
                        }
                        return resolve(res.data);

                    }, function(res) {
                        return reject(0);
                    });
                });
            },
            //新增邮箱
            add: function(condition) {
                return $q(function(resolve, reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    };
                    $http.post(ConfigService.API + '/system/email/conf/add', req).then(function(res) {
                        if (res.data.code !== 0) {
                            return reject(res.data);
                        }
                        return resolve(res.data);
                    }, function(res) {
                        return reject(0);
                    });
                });
            },
            //编辑邮箱
            edit: function(condition) {
                return $q(function(resolve, reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    };
                    $http.post(ConfigService.API + '/system/email/conf/update', req).then(function(res) {
                        if (res.data.code !== 0) {
                            return reject(res.data);
                        }
                        return resolve(res.data);
                    }, function(res) {
                        return reject(0);
                    });
                });
            },
            //获取邮箱详情
            detail:function(condition) {
                return $q(function(resolve, reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    };
                    $http.post(ConfigService.API + '/system/email/conf/get', req).then(function(res) {
                        if (res.data.code !== 0) {
                            return reject(res.data);
                        }
                        return resolve(res.data);
                    }, function(res) {
                        return reject(0);
                    });
                });
            },
            delete:function(condition) {
                return $q(function(resolve, reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    };
                    $http.post(ConfigService.API + '/system/email/conf/delete', req).then(function(res) {
                        if (res.data.code !== 0) {
                            return reject(res.data);
                        }
                        return resolve(res.data);
                    }, function(res) {
                        return reject(0);
                    });
                });
            }

        }
    }
])
