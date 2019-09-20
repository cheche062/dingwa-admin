angular.module('DataCenterCtrl',[])
       .controller('DataCenterController',['$scope','IndexService',function($scope,IndexService){
            $scope.my_data = null
            init()
            function init(){
                $scope.$emit('headerColor','blue')
                var condition1 = {
                    type:2
                }
                IndexService.search(condition1).then(function(res){
                    console.log(res)
                    $scope.my_data = res.data
                    var arr = []
                    var quantity_total = (Math.ceil($scope.my_data.quantity_total/1000)).toString()
                    for(var i =0;i<quantity_total.length;i++){
                        arr.push(quantity_total[i])
                    }
                    console.log(arr)
                    $scope.my_data.quantity_total = arr
                })
            }
            $scope.$on('$destroy',function(){
                $scope.$emit('headerColor','')
            })
       }])