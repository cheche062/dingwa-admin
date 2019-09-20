angular.module('EnterpriseShowController',['CommonService', 'EnterpriseService'])
	   .controller('EnterpriseShowCtrl',['$scope','$state','$stateParams' , 'EnterpriseService', 'DialogService',
	   	function($scope, $state,$stateParams, EnterpriseService, DialogService){
	   		$scope.info = {}
	   		init()
	   		function init(){
	   			console.log($stateParams)
	   			var condition = {
	   				id:$stateParams.id
	   			}
	   			EnterpriseService.Detail(condition).then(function(res){
	   				console.log(res)
	   				$scope.enterprise = res.data
	   			},function(code){

	   			})
	   		}
	   }])