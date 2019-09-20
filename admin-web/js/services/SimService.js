angular.module('SimsService',['CommonService'])
       .factory('SimsService',['$http','$q','ConfigService',function($http,$q,ConfigService){
            return {
                search:function(condition){
                    return $q(function(resolve,reject){
                        var req = {
                            data:JSON.stringify(condition)
                        }
                        $http.post(ConfigService.API + '/sim/sim/search',req).then(function(res){
                            if(res.data.code != 0){
                                return reject(res.data.code)
                            }
                            return resolve(res.data.data)
                        },function(err){
                            return reject(0)
                        })
                    })
                }
            }
       }])