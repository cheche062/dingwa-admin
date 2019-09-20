angular.module('LoginService',["CommonService"])
.factory('LoginService',['$http', '$q', 'ConfigService','DialogService',
    function($http, $q, ConfigService,DialogService) {
        return {
            Login: function(condition) {
                return $q(function(resolve, reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    };
                    $http.post(ConfigService.API + '/system/user/login', req).then(function(resp) {
                        if (resp.data.code !== 0) {
                            if(resp.data.msg != ''){
                                DialogService.alert(resp.data.msg)
                            }
                            return reject(resp.data.code);
                        }
                        console.log(resp.data)
                        return resolve(resp.data);

                    }, function(resp) {
                        return reject(0);
                    });
                });
            },
            Logout: function(condition) {
                return $q(function(resolve, reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    };
                    $http.post(ConfigService.API + '/system/user/logout', req).then(function(resp) {
                        if (resp.data.code !== 0) {
                            return reject(resp.data.code);
                        }
                        return resolve(resp.data.data);
                    }, function(resp) {
                        return reject(0);
                    });
                });
            },

        }
    }
])
