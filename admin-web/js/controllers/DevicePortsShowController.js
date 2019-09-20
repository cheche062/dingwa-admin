angular.module("DevicePortsShowController", ["CommonService","DevicePortService"])
.controller("DevicePortsShowCtrl", ["$scope", "$state","DevicePortService","DialogService","DictService",
    function( $scope, $state,DevicePortService,DialogService,DictService) {
    	$scope.info = {
    		order_by:'created_at',
    		order:'desc',
    		offset:0,
    		limit:20,
    		total:0,
            pageCnt: 0,
            page: 1,
            port_status:'0',
            apply_type:'0',
            status:'0',
            provider:'0',
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
            },
            port_obj:{
                id:'',
                name:''
            },
            device_number:'',
            device_id:'',
            port_name:'',
            device:'',
            device_id:''

    	}
        $scope.devices = []
        $scope.ports = []
    	$scope.provinces = [];
        $scope.cities = [];
        $scope.districts = [];
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
        var fields = '/deviceport/list';

    	$scope.search = function(){
    		var condition = {
                port_status:$scope.info.port_status,
    			status:$scope.info.status,
    			province_id:$scope.provinceOption.id,
                city_id:$scope.cityOption.id,
                district_id:$scope.districtOption.id,
                station_obj:$scope.info.station_obj,
                enter_obj:$scope.info.enter_obj,
                device_obj:$scope.info.device_obj,
                port_obj:$scope.info.port_obj,
                offset:$scope.info.offset,
                limit:$scope.info.limit,
                order_by:$scope.info.order_by,
                order:$scope.info.order,
                total:$scope.info.total
    		}
    		DevicePortService.search(condition).then(function(res){
                sessionStorage.setItem(fields, JSON.stringify(condition));
                $scope.ports = res.data.list
                $scope.info.total = res.data.total
                $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
    		},function(res){
    			if(res.msg != ''){
    				DialogService.alert(res.msg)
    			}
    		})
    	}
        function searchDevice(){
            var condition = {
                type:'device',
                query:''
            }
            DictService.search(condition).then(function(res){
                $scope.devices = res
            },function(res){})
        }
    	init()
        function init(){
            let url = window.location.href;
            ut= url.split("#");
            url=ut[1];

            if((sessionStorage.getItem(url)) && (fields == url)){
                var session = JSON.parse(sessionStorage.getItem(url));
                console.log(session);
                $scope.info.port_status = session.port_status;
    			$scope.info.status = session.status;
    			$scope.provinceOption.id = session.province_id;
                $scope.cityOption.id = session.city_id;
                $scope.districtOption.id = session.district_id;
                $scope.info.station_obj = session.station_obj;
                $scope.info.enter_obj = session.enter_obj;
                $scope.info.device_obj = session.device_obj;
                $scope.info.port_obj = session.port_obj;
                $scope.info.offset = session.offset;
                $scope.info.limit = session.limit;
                $scope.info.order_by = session.order_by;
                $scope.info.order = session.order;
                $scope.info.total = session.total;

                var condition = {
                    type: "city",
                    query: session.province_id
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
                $scope.tree = false;
                $scope.info.page = 1;
                $scope.info.offset = 0;
            }
            $scope.search()
            searchDevice()
        }
        $scope.startPaging = function(){
            $scope.search()
        }
        $scope.goDetail = function(id){
        	console.log(id)
            $state.go('main.deviceport/detail',{id:id},{
                reload:'main.deviceport/detail'
            })
        }
        $scope.goEdit = function(id){
            $state.go('main.deviceport/edit',{id:id},{
                reload:true
            })
        }
        $scope.delete = function(id){
            var condition = {
                id:id
            }
            DialogService.confirm('确认要删除吗',function(){
                DevicePortService.delete(condition).then(function(res){
                    DialogService.alert('删除成功')
                    $scope.search()
                },function(res){
                    DialogServcie.alert(res.msg)
                })
            })
        }
        //添加端口号
        $scope.addPort = function(){
            $('#AddPortModal').modal('show')
        }
        $scope.confirmAddPort = function(){
            if($scope.info.device.device_number === ''){
                DialogService.alert('请输入桩号')
                return false
            }
            if($scope.info.port_name === ''){
                DialogService.alert('请输入端口号')
                return false
            }
            if($scope.info.port_name < 26 || $scope.info.port_name > 255){
                DialogService.alert('端口号需大于26小于255')
                return false
            }
            var condition = {
                device_number:$scope.info.device.name,
                device_id:$scope.info.device.id,
                port_name:$scope.info.port_name
            }
            DevicePortService.add(condition).then(function(res){
                DialogService.alert('添加成功')
                $scope.info.device.name = ''
                $scope.info.device.id = ''
                $scope.info.port_name = ''
                $scope.search()
            },function(res){
                if(res.msg != ''){
                    DialogService.alert(res.msg)
                }
            })
        }
        $scope.cancle = function(){
            $('#ChooseDevice').modal('hide')
        }

    }
])
