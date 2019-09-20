angular.module('WithDrawService',["CommonService"])
.factory("WithDrawService",["$http", "$q", "ConfigService",
    function($http, $q, ConfigService) {
        return {
            //用户提交提现申请
            apply:function(condition){
                return $q(function(resolve,reject){
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API + '/finance/withdrawals/apply', req).then(function(res) {
                        if(res.data.code !== 0) {
                            return reject(res.data);
                        }
                        return resolve(res.data)
                    },function(resp) {
                        return rejcet(0)
                    })
                })
            },
            //获取提现申请列表
            search:function(condition){
                return $q(function(resolve,reject){
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API+'/finance/withdrawals/search',req).then(function(res){
                        if(res.data.code != 0){
                            return reject(res.data)
                        }
                        return resolve(res.data)
                    },function(res){
                        return reject(0)
                    })
                })
            },
            //系统用户处理提现申请
            deal:function(condition){
                return $q(function(resolve,reject){
                    var req = {
                        data:JSON.stringify(condition)
                    }
                    $http.post(ConfigService.API+'/finance/withdrawals/deal',req).then(function(res){
                        if(res.data.code != 0){
                            return reject(res.data)
                        }
                        return resolve(res.data)
                    },function(res){
                        return reject(0)
                    })
                })
            }
            // getrefund(condition) {
            //     return $q(function(resolve,reject){
            //         var req = {
            //             data:JSON.stringify(condition)
            //         }
            //         $http.post(ConfigService.API+'/finance/withdrawals/refund',req).then(function(res){
            //             if(res.data.code != 0){
            //                 return reject(res.data)
            //             }
            //             return resolve(res.data)
            //         },function(res){
            //             return reject(0)
            //         })
            //     })
            // }

        }
    }
])
