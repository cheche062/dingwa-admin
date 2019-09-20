angular.module('AdvertEditController',['DeviceService','AdvertService'])
	   .controller('AdvertEditCtrl',['$scope','$state','$stateParams','DeviceService','AdvertService',function($scope,$state,$stateParams,DeviceService,AdvertService){
	   	var now = new Date();
	   	$("input[id^='start-date']").datepicker({
            language: 'zh-CN',
            format: 'yyyy-mm-dd',
            autoclose: true,
            todayBtn: false,
            endDate: '',
            todayHighlight: true
        });
        $("input[id^='start-date']").datepicker("setDate", formatDate(now));
	   		$scope.info = {
	   			daiji_time:'',
	   			jiesuo_time:'',
	   			baqiang_time:'',
	   			total:0
	   		}
	    init()
	    function init() {
            var condition1 = {
                id:$stateParams.id
            }
            DeviceService.get(condition1).then(function(data) {
            	console.log(data)
                $scope.device = data.data;
            }, function(code) {});
            var condition = {
            	order_by: "created_at",
				order: "desc",
				offset: 0,
				device_id:$stateParams.id,
				total:$scope.info.total
            }
            /*广告详情*/
            AdvertService.detail(condition).then(function(res){
            	var standby = [],
            		unlock = [],
            		unplug = []
            	$scope.adverts = res.data.data.list
            	for (var i = 0; i < $scope.adverts.length; i++) {
            		if($scope.adverts[i].type == 'standby'){
            			standby.push($scope.adverts[i])
            		}else if($scope.adverts[i].type == 'unlock'){
            			unlock.push($scope.adverts[i])
            		}else{
            			unplug.push($scope.adverts[i])
            		}
            	}
            	console.log(standby,unlock,unplug)
            },function(err){
            	console.log(err)
            })

            /*广告汇总*/
            var condition1 = {
                device_id:$stateParams.id
            }
            AdvertService.collectdetail(condition1).then(function(res){
                console.log(res.data.data.list)
                $scope.collects = res.data.data.list
            })
            /*广告下发*/
            AdvertService.typesearch().then(function(data){
                console.log(data)
                $scope.standbys = data.data.data.standby;
                $scope.unlocks = data.data.data.unlock;
                $scope.unplugs = data.data.data.unplug;
            })
        }
        $scope.confirmUpload = function(){
        	console.log($scope.standby,$scope.unlock)
        }
        $('#tablist a').click(function(e){
            e.preventDefault()
            $(this).tab('show')
        })
	   }])