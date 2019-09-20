angular.module('ProfitService',["CommonService"])
.factory('ProfitService',['$http', '$q', 'ConfigService','DialogService',
    function($http, $q, ConfigService,DialogService) {
        return {
            //每天统计用户汇总列表
            search: function(condition) {
                return $q(function(resolve, reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    };
                    $http.post(ConfigService.API + '/finance/userCollect/search', req).then(function(res) {
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
            //获取某个汇总下的站点统计
            stationSearch: function(condition) {
                return $q(function(resolve, reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    };
                    $http.post(ConfigService.API + '/finance/stationCollect/search', req).then(function(res) {
                        if (res.data.code !== 0) {
                            return reject(res.data);
                        }
                        return resolve(res.data);
                    }, function(res) {
                        return reject(0);
                    });
                });
            },
            //获取某个汇总下的设备统计
            deviceSearch: function(condition) {
                return $q(function(resolve, reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    };
                    $http.post(ConfigService.API + '/finance/deviceCollect/search', req).then(function(res) {
                        if (res.data.code !== 0) {
                            return reject(res.data);
                        }
                        return resolve(res.data);
                    }, function(res) {
                        return reject(0);
                    });
                });
            },
            //获取某个用户下的订单统计
            orderSearch:function(condition) {
                return $q(function(resolve, reject) {
                    var req = {
                        data:JSON.stringify(condition)
                    };
                    $http.post(ConfigService.API + '/finance/orderCollect/search', req).then(function(res) {
                        if (res.data.code !== 0) {
                            return reject(res.data);
                        }
                        return resolve(res.data);
                    }, function(res) {
                        return reject(0);
                    });
                });
            },

        }
    }
])
