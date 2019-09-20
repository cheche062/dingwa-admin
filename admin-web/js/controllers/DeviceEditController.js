angular.module("DeviceEditController", ["CommonService", "DeviceService"])
.controller("DeviceEditCtrl", ["$scope", "$state","$stateParams","$timeout","DeviceService","DialogService","DictService",
    function($scope, $state,$stateParams,$timeout,DeviceService,DialogService,DictService) {
        var now = new Date()
        $scope.info = {
           show_map:false,
           lnglat:''
        }
        $("input[id^='start-date']").datepicker({
            language: 'zh-CN',
            startView: 0,
            format: 'yyyy-mm-dd',
            autoclose: true,
            todayBtn: false,
            endDate: formatDate(now), //禁止选择当天之后的日期
            todayHighlight: true
        });
        $('#start-sim-date').datepicker({
            language: 'zh-CN',
            startView: 0,
            format: 'yyyy-mm-dd',
            autoclose: true,
            todayBtn: false,
            todayHighlight: true
        })
        $('#start-scrapped-date').datepicker({
            language: 'zh-CN',
            startView: 0,
            format: 'yyyy-mm-dd',
            autoclose: true,
            todayBtn: false,
            todayHighlight: true
        })
    	// $scope.device = {
    	// 	device_number:'',
    	// 	station_id:'',
    	// 	manufacturer_id:'',
    	// 	pic:[],
    	// 	port_cnt:'',
    	// 	apply_type:'1',
    	// 	allowance_apply:'1',
    	// 	lnglat:'',
    	// 	longitude:'',
    	// 	latitude:'',
    	// 	model:'',
    	// 	soft_version:'',
    	// 	elec_power:'',
    	// 	rated_voltage:'',
    	// 	sim_number:'',
    	// 	sim_expired_at:'',
    	// 	accepted_at:'',
    	// 	charge_type:'1',
    	// 	install_type:'',
    	// 	standard_type:'',
    	// 	plug_type:'1',
    	// 	assets_number:'',
    	// 	scrapped_at:'',
    	// 	serve_year:'',
    	// 	insurance_cost:'',
    	// 	parking_type:'',
    	// 	parking_num:'',
    	// 	alias_number:'',
    	// 	device_status:'1',
    	// 	open_forbusiness_date:'',
    	// 	version_input:'',
    	// 	remarks:''
    	// }
    	$scope.provinces = [];
        $scope.cities = [];
        $scope.districts = [];
        $scope.provinceOption = null;
        $scope.cityOption = null;
        $scope.districtOption = null;
        $scope.manufacturers = []
        $scope.station = {
            station_id:''
        }
        $scope.getMap = function() {
            if (!$scope.info.show_map) {
                $scope.info.show_map = true;
                initMap();
            };
        }
        //设备端口数下拉
        $scope.devicePort = [
            {value:10,name:'10口'},
            {value:12,name:'12口'},
            {value:20,name:'20口'}
        ]
        init()
        function init(){
            var id = $stateParams.id
            var condition = {
                id:id
            }
            DeviceService.get(condition).then(function(res){
                var condition1 = {
                    type:'manufacturer',
                    query:''
                }
                DictService.search(condition1).then(function(res){
                    $scope.manufacturers = res
                },function(res){})
                console.log(res)
                $scope.device = res.data
                $scope.station.station_id = res.data.station_id
                $scope.device.station_id = res.data.station_id
                $scope.device.apply_type = String(res.data.apply_type)
                $scope.device.allowance_apply = String(res.data.allowance_apply)
                $scope.device.charge_type = String(res.data.charge_type)
                $scope.device.plug_type = String(res.data.plug_type)
                $scope.device.device_status = String(res.data.device_status)
                $scope.device.lnglat = $scope.device.longitude + ',' + $scope.device.latitude;
                $scope.provinceOption = {
                    id: $scope.device.province_id,
                    name: $scope.device.province
                };
                var condition2 = {
                    type: 'city',
                    query: $scope.device.province_id
                };
                DictService.search(condition2).then(function(data) {
                    $scope.cities = data;
                    $scope.cityOption = {
                        id: $scope.device.city_id,
                        name: $scope.device.city
                    };
                }, function(code) {});

                var condition3 = {
                    type: 'city',
                    query: $scope.device.city_id
                };
                DictService.search(condition3).then(function(data) {
                    $scope.districts = data;
                    $scope.districtOption = {
                        id: $scope.device.district_id,
                        name: $scope.device.district
                    };
                }, function(code) {});
                //获取station_id后监听变化并自动获取经纬度
                $scope.$watch('station.station_id',function(newValue,oldValue){
                    if(newValue == oldValue){
                        return false
                    }
                    else{
                        for(var i in $scope.stations){
                            if(newValue == $scope.stations[i].id){
                                $scope.device.address = $scope.stations[i].address
                                $scope.device.lnglat = $scope.stations[i].longitude + ','+$scope.stations[i].latitude
                                $scope.provinceOption = {
                                    id: $scope.stations[i].province_id,
                                    name: $scope.stations[i].province
                                };
                                var condition2 = {
                                    type: 'city',
                                    query: $scope.stations[i].province_id
                                };
                                DictService.search(condition2).then(function(data) {
                                    $scope.cities = data;
                                    $scope.cityOption = {
                                        id: $scope.stations[i].city_id,
                                        name: $scope.stations[i].city
                                    };
                                }, function(code) {});

                                var condition3 = {
                                    type: 'city',
                                    query: $scope.stations[i].city_id
                                };
                                DictService.search(condition3).then(function(data) {
                                    $scope.districts = data;
                                    $scope.districtOption = {
                                        id: $scope.stations[i].district_id,
                                        name: $scope.stations[i].district
                                    };
                                }, function(code) {});
                                break
                            }
                        }
                    }
                })
            },function(res){
                DialogService.alert(res.msg)
            })
        }
        function initMap() {
            $timeout(function() {
                map = new BMap.Map("point");
                map.centerAndZoom(new BMap.Point(121.061884, 31.748181), 11);
                map.centerAndZoom('上海', 11);
                map.addEventListener("click", showInfo);
                map.enableScrollWheelZoom();
                map.enableContinuousZoom();
            }, 800);

            function showInfo(e) {
                $scope.$apply(function() {
                    $scope.device.lnglat = e.point.lng + "," + e.point.lat;
                    $('#LocationModal').modal('hide')
                })
            }
        }
        $scope.getCity = function() {
            if ($scope.info.city != "") {
                // 创建地址解析器实例
                var myGeo = new BMap.Geocoder();
                // 将地址解析结果显示在地图上,并调整地图视野
                myGeo.getPoint($scope.info.city, function(point) {
                    if (point) {
                        map.centerAndZoom(point, 16);
                        map.addOverlay(new BMap.Marker(point));
                    } else {
                        alert("您选择地址没有解析到结果!");
                    }
                }, "北京市");
            }
        }
        $scope.goDeviceList = function(){
        	$state.go('main.device/list',{},{
        		reload:'main.device/list'
        	})
        }
        $scope.submit = function(){
        	$scope.device.station_id = $scope.station.station_id
        	if($scope.device.device_number == ''){
        		DialogService.alert('请输入充电桩编号')
        		return false
        	}
        	if($scope.device.station_id == ''){
        		DialogService.alert('请输入归属站点')
        		return false
        	}
        	if($scope.device.manufacturer_id == ''){
        		DialogService.alert('请输入充电桩归属供应商')
        		return false
        	}
        	if($scope.device.port_cnt== ''){
        		DialogService.alert('请输入端口个数')
        		return false
        	}
        	if ($scope.provinceOption !== null) {
                
            } else {
                DialogService.alert('请选择省');
                $scope.info.loading = false;
                return false;
            }
            if ($scope.cityOption !== null && $scope.cityOption.id !== 0) {
                
            } else {
                DialogService.alert('请选择市');
                $scope.info.loading = false;
                return false;
            }
            if ($scope.districtOption !== null && $scope.districtOption.id !== 0) {
                
            }else{
                DialogService.alert('请选择区/县');
                $scope.info.loading = false;
                return false;
            }
            if ($scope.device.lnglat === '') {
                DialogService.alert('请输入经纬度');
                return false;
            }else{
                var parts = $scope.device.lnglat.split(',');
                $scope.device.longitude = parts[0];
                $scope.device.latitude = parts[1];
            }
            // if($scope.device.model == ''){
        	// 	DialogService.alert('请输入设备型号')
        	// 	return false
        	// }
        	if($scope.device.soft_version == ''){
        		DialogService.alert('请输入软件版本')
        		return false
        	}
        	// if($scope.device.elec_power == ''){
        	// 	DialogService.alert('请输入总额定功率')
        	// 	return false
        	// }
        	if($scope.device.rated_voltage == ''){
        		DialogService.alert('请输入额定电流')
        		return false
        	}
        	// if($scope.device.sim_number == ''){
        	// 	DialogService.alert('请输入sim卡号')
        	// 	return false
        	// }
        	// if($scope.device.sim_expired_at == ''){
        	// 	DialogService.alert('请输入sim到期时间')
        	// 	return false
        	// }
        	// if($scope.device.accepted_at == ''){
        	// 	DialogService.alert('请输入生效时间')
        	// 	return false
        	// }
         //    if($scope.device.address == ''){
         //        DialogService.alert('请输入详细地址')
         //        return false
         //    }
            if($scope.device.port_cnt > 1){
                $scope.device.plug_type = 3
            }else{
                $scope.device.plug_type = 1
            }
        	var condition = {
                id:$stateParams.id,
                device_number:$scope.device.device_number,
                station_id:$scope.device.station_id,
                manufacturer_id:$scope.device.manufacturer_id,
                pic:$scope.device.pic,
                port_cnt:$scope.device.port_cnt,
                apply_type:$scope.device.apply_type,
                allowance_apply:$scope.device.allowance_apply,
                province_id:$scope.provinceOption.id,
                city_id:$scope.cityOption.id,
                district_id:$scope.districtOption.id,
                province:$scope.provinceOption.name,
                city:$scope.cityOption.name,
                district:$scope.districtOption.name,
                longitude:$scope.device.longitude,
                latitude:$scope.device.latitude,
                // model:$scope.device.model,
                soft_version:$scope.device.soft_version,
                elec_power:$scope.device.elec_power,
                rated_voltage:$scope.device.rated_voltage,
                sim_number:$scope.device.sim_number,
                sim_expired_at:$scope.device.sim_expired_at,
                accepted_at:$scope.device.accepted_at,
                charge_type:$scope.device.charge_type,
                install_type:$scope.device.install_type,
                // standard_type:$scope.device.standard_type,
                plug_type:$scope.device.plug_type,
                assets_number:$scope.device.assets_number,
                scrapped_at:$scope.device.scrapped_at,
                serve_year:$scope.device.serve_year,
                insurance_cost:$scope.device.insurance_cost,
                // parking_type:$scope.device.parking_type,
                parking_num:$scope.device.parking_num,
                alias_number:$scope.device.alias_number,
                device_status:$scope.device.device_status,
                open_forbusiness_date:$scope.device.open_forbusiness_date,
                // version_input:$scope.device.version_input,
                remarks:$scope.device.remarks,
                address:$scope.device.address
            }
            DeviceService.update(condition).then(function(res){
                DialogService.alert('更新成功')
                $timeout(function(){
                    $state.go('main.device/list',{},{
                        reload:'main.device/list'
                    })
                },2000)
            },function(res){
                if(res.msg != ''){
                    DialogService.alert(res.msg)
                } 
            })
        }
    }
])
