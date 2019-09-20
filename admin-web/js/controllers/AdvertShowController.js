angular.module('AdvertShowController',['CommonService','AdvertService'])
       .controller('AdvertShowCtrl',['$scope','ConfigService','DialogService','AdvertService','$state',function($scope,ConfigService,DialogService,AdvertService,$state){
	   		var now = new Date();
            $scope.info = {
                start_time : '',
                end_time :'',
                type:'全部',
                order_by: 'created_at',
                order: 'desc',
                total:0,
                offset: 0,
                limit: 20,
                pageCnt:1
            }
	   		$("input[id^='start-date']").datepicker({
            language: 'zh-CN',
            format: 'yyyy-mm-dd',
            autoclose: true,
            todayBtn: false,
            endDate: formatDate(now),
            todayHighlight: true
        });
	   		$("input[id^='end-date']").datepicker({
            language: 'zh-CN',
            format: 'yyyy-mm-dd',
            autoclose: true,
            todayBtn: false,
            endDate: formatDate(now),
            todayHighlight: true
        });

        $("input[id^='start-date']").datepicker("setDate", formatDate(now));
        $("input[id^='end-date']").datepicker("setDate", formatDate(now));
        $scope.adverts = []
        $scope.search = function(){
              var condition = {
                 st : $scope.info.start_time,
                 et : $scope.info.end_time,
                 type : $scope.info.type,
                 order_by:$scope.info.order_by,
                 order:$scope.info.order,
                 total:$scope.info.total,
                 offset: $scope.info.offset,
                 limit: $scope.info.limit
              }
              console.log($scope.info)
              AdvertService.search(condition).then(function(data){   
                        $scope.adverts = data.data.list
              },function(err){  
                console.log(err)
              })

        }
        loadAdverts();
        function loadAdverts(){
           var condition = {
                 st : $scope.info.start_time,
                 et : $scope.info.end_time,
                 type : $scope.info.type,
                 order_by:$scope.info.order_by,
                 order:$scope.info.order,
                 total:$scope.info.total,
                 offset: $scope.info.offset,
                 limit: $scope.info.limit
              }
            AdvertService.search(condition).then(function(rep){
                    console.log(rep)
                    $scope.adverts = rep.data.list
                    $scope.info.total = rep.data.total;
                    $scope.info.pageCnt = Math.ceil(rep.data.total / $scope.info.limit);
                    $scope.info.page = 1;
              },function(err){  
                console.log(err)
              })
        }
        /*广告删除*/
        $scope.delete = function(id){
            var condition = {
                id:id
            }
            DialogService.confirm('确认要删除吗?',function(){
                    AdvertService.delete(condition).then(function(res){
                        $state.reload(true)
                        console.log(res)
                },function(err){
                    console.log(err)
                })
            }) 
        }
        /*翻页*/
        $scope.startPaging = function() {
            loadAdverts();
        };
	   }])