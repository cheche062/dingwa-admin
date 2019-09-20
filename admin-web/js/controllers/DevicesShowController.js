angular.module("DevicesShowController", ["CommonService","DeviceService"])
.controller("DevicesShowCtrl", ["$scope", "$state", "DeviceService","DialogService","DictService",
    function( $scope, $state, DeviceService,DialogService,DictService) {
    	$scope.info = {
    		order_by:'created_at',
    		order:'desc',
    		offset:0,
    		limit:20,
    		total:0,
            pageCnt: 0,
            page: 1,
            apply_type:'0',
            status:'0',
            device_status:'0',
            allowance_apply:'0',
            provider:'0',
            soft_version:'',
            station_obj:{
            	id:'',
            	name:''
            },
            enter_obj:{
            	id:'',
            	name:''
            },
            device_obj:{
            	id:'',
            	name:''
            }

    	}
    	$scope.provinces = [];
        $scope.cities = [];
        $scope.districts = [];
        $scope.manufacturers = []
        $scope.provinceOption = {
            id: 0,
            name: '选择省'
        };
        $scope.cityOption = {
            id:0,
            name: '选择市'
        };
        $scope.districtOption = {
            id: 0,
            name: '选择区县'
        };
    	$scope.devices = []
        var fields = '/device/list';

    	$scope.search = function(){
            console.log($scope.provinceOption)
    		var condition = {
    			apply_type:$scope.info.apply_type,
    			status:$scope.info.status,
                device_status:$scope.info.device_status,
    			allowance_apply:$scope.info.allowance_apply,
    			manufacturer_id:$scope.manufacturer_id,
    			provider:$scope.info.provider,
    			province_id:$scope.provinceOption.id,
                city_id:$scope.cityOption.id,
                district_id:$scope.districtOption.id,
                station_obj:$scope.info.station_obj,
                enter_obj:$scope.info.enter_obj,
                device_obj:$scope.info.device_obj,
                soft_version:$scope.info.soft_version,
                offset:$scope.info.offset,
                limit:$scope.info.limit,
                order_by:$scope.info.order_by,
                order:$scope.info.order,
                total:$scope.info.total
    		}
    		DeviceService.search(condition).then(function(res){
                sessionStorage.setItem(fields, JSON.stringify(condition));
    			console.log(res)
                $scope.devices = res.data.list
                $scope.info.total = res.data.total
                $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
    		},function(res){
    			if(res.msg != ''){
    				DialogService.alert(res.msg)
    			}
    		})
    	}
    	init()
        function init(){
            let url = window.location.href;
            ut= url.split("#");
            url=ut[1];

            if((sessionStorage.getItem(url)) && (fields == url)){
                var session = JSON.parse(sessionStorage.getItem(url));
                $scope.info.apply_type = session.apply_type;
    			$scope.info.status = session.status;
                $scope.info.device_status = session.device_status;
    			$scope.info.allowance_apply = session.allowance_apply;
    			$scope.manufacturer_id = session.manufacturer_id;
    			$scope.info.provider = session.provider;
    			$scope.provinceOption.id = session.province_id;
                $scope.cityOption.id = session.city_id;
                $scope.districtOption.id = session.district_id;
                $scope.info.station_obj = session.station_obj;
                $scope.info.enter_obj = session.enter_obj;
                $scope.info.soft_version = session.soft_version;
                $scope.info.device_obj = session.device_obj;
                $scope.info.offset = session.offset;
                $scope.info.limit = session.limit;
                $scope.info.order_by = session.order_by;
                $scope.info.order = session.order;
                $scope.info.total = session.total;

                var condition = {
                    type: "city",
                    query: $scope.provinceOption.id
                };

                if (session.province_id != 0) {
                    DictService.search(condition).then(function(data) {
                        console.log(data)
                        $scope.cities = data;
                    }, function(code) {});
                }
                condition.query = session.city_id;

                if (session.city_id !=0) {
                    DictService.search(condition).then(function(data) {
                        console.log(data)
                        $scope.districts = data;
                    }, function(code) {});
                }
            }
            var condition = {
                type:'manufacturer',
                query:''
            }
            DictService.search(condition).then(function(res){
                $scope.manufacturers = res
            })
            $scope.search()
        }
        $scope.startPaging = function(){
            $scope.search()
        }
        $scope.goDetail = function(id){
            $state.go('main.device/detail',{id:id},{
                reload:'main.device/detail'
            })
        }
        $scope.goEdit = function(id){
            $state.go('main.device/edit',{id:id},{
                reload:'main.device/edit'
            })
        }
        $scope.delete = function(id){
            var condition = {
                id:id
            }
            DialogService.confirm('确认要删除吗',function(){
                DeviceService.delete(condition).then(function(res){
                    DialogService.alert('删除成功')
                    $scope.search()
                },function(res){
                    DialogServcie.alert(res.msg)
                })
            })
        }

        $scope.setting = function(id){
            $state.go('main.device/setting',{id:id})
        }
        $scope.forbid = function(device){
            var condition = {
                id:device.id
            }
            var str = device.forbid_status == 1 ? '确认要封禁?' : device.forbid_status == 2 ? '确认要解封?' : '确认要进行操作?'
            DialogService.confirm(str,function(){
                DeviceService.forbid(condition).then(function(res){
                    DialogService.alert('操作成功')
                    $scope.search();
                })
            })
        }
        //列表排序
        //根据不同字段正序或倒序
        $scope.sort = function(type){
            console.log(type)
            if($scope.info.order_by !== type){
                $scope.info.order_by = type;
                $scope.info.order = 'desc'
            }else{
                $scope.info.order = $scope.info.order == 'desc' ? 'asc' : 'desc'; 
            }
            $scope.search();
        }
    }
])
