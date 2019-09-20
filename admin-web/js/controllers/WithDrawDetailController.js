angular.module('WithDrawDetailController',['CommonService','WithDrawService'])
.controller('WithDrawDetailCtrl',['$scope','$state','$stateParams' , 'WithDrawService', 'DeviceService','DialogService',
function($scope, $state,$stateParams, WithDrawService, DialogService){
    var condition = {
        id:$stateParams.id
    }
    init();
    function init(){
        
        WithDrawService.search(condition).then(function(res){
            console.log(res)
            $scope.withDraw = res.data;
        },function(code){

        })
    }
}])