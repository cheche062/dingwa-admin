angular.module('AdvertService',['CommonService'])
	   .factory('AdvertService',['$q', '$http','ConfigService',function($q,$http,ConfigService){
	   		return{
	   			/*广告查询*/
	   			search:function(condition){  
	   				return $q(function(resolve,reject){
	   					var req = {
	   						data:JSON.stringify(condition)
	   					};
	   					$http.post(ConfigService.API + '/system/ad/search', req).then(function(resp){
	   						console.log(resp)
	   						return resolve(resp.data)
	   					},function(err){
	   						console.log(err)
	   						return reject(err)
	   					})
	   				})
	   			},
	   			/*广告添加*/
	   			add:function(condition){
	   				return $q(function(resolve,reject){
	   					var req = {
	   						data:JSON.stringify(condition)
	   					};
	   					$http.post(ConfigService.API + '/system/ad/add', req).then(function(resp){
	   						console.log(resp)
	   						return resolve(resp)
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
	   					console.log(req)
	   					$http.post(ConfigService.API + '/system/ad/remove',req).then(function(resp){
	   						return resolve(resp)
	   					},function(err){
	   						return reject(err)
	   					})
	   				})
	   			},
	   			get:function(condition){
	   				return $q(function(resolve,reject){
		   				var req = {
		   					data:JSON.stringify(condition)
		   				}
	   					$http.post(ConfigService.API + '/system/ad/get',req).then(function(resp){
	   						return resolve(resp)
	   					},function(err){
	   						return reject(err)
	   					})
	   				})
	   			},
	   			update:function(condition){
	   				return $q(function(resolve,reject){
	   					var req = {
	   						data:JSON.stringify(condition)
	   					}
	   					console.log(req)
	   					$http.post(ConfigService.API + '/system/ad/update',req).then(function(resp){
	   						return resolve(resp)
	   					},function(err){
	   						return reject(err)
	   					})
	   				})
	   			},
	   			/*广告下发获取广告类型*/
	   			typesearch:function(){
	   				return $q(function(resolve,reject){
	   					$http.post(ConfigService.API + '/system/ad/typesearch ').then(function(resp){
	   						return resolve(resp)
	   					},function(err){
	   						return reject(err)
	   					})
	   				})
	   			},
	   			devicesearch:function(condition){
	   				return $q(function(resolve,reject){
	   					var req = {
	   						data:JSON.stringify(condition)
	   					}
	   					$http.post(ConfigService.API + '/system/ad/device/search',req).then(function(resp){
	   						return resolve(resp)
	   					},function(err){
	   						return reject(err)
	   					})
	   				})
	   			},
	   			adupgrade:function(condition){
	   				return $q(function(resolve,reject){
	   					var req = {
	   						data:JSON.stringify(condition)
	   					}
	   					console.log(req)
	   					$http.post(ConfigService.API + '/system/ad/check/upgrade',req).then(function(resp){
	   						console.log(resp)
	   						return resolve(resp)
	   					},function(err){
	   						return reject(err)
	   					})
	   				})
	   			},
	   			beginupgrade:function(condition){
	   				return $q(function(resolve,reject){
	   					var req = {
	   						data:JSON.stringify(condition)
	   					}
	   					$http.post(ConfigService.API + '/system/ad/begin/upgrade',req).then(function(resp){
	   						return resolve(resp)
	   					},function(err){
	   						return reject(err)
	   					})
	   				})
	   			},
	   			detail:function(condition){
	   				return $q(function(resolve,reject){
	   					var req={
	   						data:JSON.stringify(condition)
	   					}
	   					$http.post(ConfigService.API + '/system/ad/pack/detail',req).then(function(resp){
	   						return resolve(resp)
	   					},function(err){
	   						return reject(err)
	   					})
	   				})
	   			},
	   			/*广告汇总*/
	   			collectdetail:function(condition){
	   				return $q(function(resolve,reject){
	   					var req = {
	   						data:JSON.stringify(condition)
	   					}
	   					$http.post(ConfigService.API + '/system/ad/pack/collectdetail',req).then(function(resp){
	   						return resolve(resp)
	   					},function(err){
	   						return reject(err)
	   					})
	   				})
	   			},
	   			//停止广告
	   			stop:function(condition){
	   				return $q(function(resolve,reject){
	   					var req = JSON.stringify(condition);
	   					$http.post(ConfigService.API + '/system/ad/stop/upgrade',req).then(function(resp){
	   						return resolve(resp)
	   					},function(err){
	   						return reject(err)
	   					})
	   				})
	   			}
	   		}
	   }])