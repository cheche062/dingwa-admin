angular.module('AdvertLssuedController',['CommonService','DeviceService','AdvertService'])
	   .controller('AdvertLssuedCtrl',['$scope','$state',"$stateParams", "DeviceService",'AdvertService','DictService','DialogService',function($scope,$state,$stateParams,DeviceService,AdvertService,DictService,DialogService){
                var now = new Date();
                // $("input[id^='start-date']").datepicker({
                //     language: 'zh-CN',
                //     format: 'yyyy-mm-dd',
                //     autoclose: true,
                //     todayBtn: false,
                //     endDate: '',
                //     todayHighlight: true
                // });
                $("input[id^='start-date']").datetimepicker({
                    language: 'zh-CN',
                    format: 'yyyy-mm-dd hh:ii',
                    autoclose: true,
                    todayBtn: false,
                    startDate:$scope.now,
                    endDate: '',
                    todayHighlight: true
                });
                // $("input[id^='start-date']").datetimepicker("setDate", formatDate(now));
                $scope.info = {
                    loading: false,
                    query: '',
                    total: 0,
                    pageCnt: 0,
                    page: 1,
                    offset: 0,
                    limit: 20,
                    order_by: 'created_at',
                    order: 'desc',
                    status: "全部",
                    charge_type: "全部",
                    station: "",
                    station_id: '',
                    show_another_screen: false,
                    device_number: "",
                    enterprise_name: '',
                    device_status: '全部',
                    pre_status: '全部',
                    checked_all:false,
                    soft_version:'',
                    version:'',
                };
                $scope.stations = [{
                    id: 0,
                    name: '全部'
                }];
                $scope.adverts = [];
                loadDevices();
                function loadDevices(){
                    AdvertService.typesearch().then(function(data){
                        $scope.standbys = data.data.data.standby;
                        $scope.unlocks = data.data.data.unlock;
                        $scope.unplugs = data.data.data.unplug;
                    })
                }
                function loadStations() {
                    var condition = {
                        type: 'station',
                        parents: '',
                        query: '',
                        limit: ''
                    };
                    DictService.search(condition).then(function(data){
                        $scope.stations = data;
                        $scope.info.station_id = data[0].id;
                        $scope.info.station_name = data[0].name;
                        loadsearch()
                    }, function(code){})
                }
                loadStations()
                function loadsearch(){
                    var condition1 = {
                        order_by: $scope.info.order_by,
                        order: $scope.info.order,
                        offset: $scope.info.offset,
                        station_id: $scope.info.station_id,
                        soft_version:$scope.info.soft_version,
                        version:$scope.info.version,
                        device_number:$scope.info.device_number,
                        total: $scope.info.total,
                        limit:$scope.info.limit
                    }
                    console.log(condition1)
                    AdvertService.devicesearch(condition1).then(function(data){
                        // $scope.info.pre_status = data.pre_status;
                        $scope.adverts = data.data.data.list;
                        $scope.info.total = data.data.data.total;
                        $scope.info.pageCnt = Math.ceil(data.data.data.total / $scope.info.limit);
                        $scope.info.page = 1;
                        // if (data.cur_page == 0) {
                        //     $scope.info.total = data.total;
                        //     $scope.info.pageCnt = Math.ceil(data.total / $scope.info.limit);
                        // }else{
                        //     $scope.info.total = data.cur_page;
                        //     $scope.info.page = data.cur_page;
                        //     $scope.info.pageCnt = data.cur_page;
                        //     $scope.info.offset = ($scope.info.pageCnt - 1) * 20;
                        // }

                    },function(err){})
                }
                $scope.startPaging = function() {
                     loadDevices();
                };
                $scope.checkedAll = function(){
                    if ($scope.info.checked_all) {
                    for (var i in $scope.adverts) {
                        if ($scope.adverts[i].status !== '异常' && $scope.adverts[i].status !== '已开票') {
                            $scope.adverts[i].checked = true;
                        } else {
                            $scope.adverts[i].checked = false;
                        }
                    }
                }else {
                    for (var x in $scope.adverts) {
                        $scope.adverts[x].checked = false;
                    }
                  }
                }
                $scope.search = function(){
                    console.log($scope.info.query)
                    $scope.info.offset = 0;
                    $scope.info.page = 1;
                    loadsearch();
                }
                $scope.searchStationList = function() {
                    if ($scope.info.station_name != '') {
                        $scope.info.show_station_list = true;
                        var condition = {
                            type: 'station',
                            query: $scope.info.station_name
                        }
                        DictService.search(condition).then(function(data){
                            console.log(data)
                            $scope.station_lists = data;
                        }, function(code){

                        })
                    }else {
                        $scope.info.show_station_list = false;
                    }
                };
                $scope.clickStationList = function(x) {
                    $scope.info.show_station_list = false;
                    $scope.info.station_name = x.name;
                    $scope.info.station_id = x.id;
                };
                $(document).click(function(){
                    $scope.$apply(function(){
                        $scope.info.show_station_list = false;
                    })
                })
                /*校验广告是否可以下发*/
                $scope.upgrade = function(id){
                    var deviceIds = [];
                    deviceIds.push(id)
                    $scope.deviceIds = deviceIds
                    var req ={
                        deviceIds:deviceIds
                    }
                    AdvertService.adupgrade(req).then(function(rep){
                        if(rep.data.code == 0){
                            $("#Modaladvert").modal("show")
                        }else{
                            DialogService.alert('此设备不可下发广告')
                        }
                    },function(err){})
                }
                /*广告批量下发*/
                $scope.upgrades = function(){
                    var deviceIds = []
                    for (var i = 0; i < $scope.adverts.length; i++) {
                        if($scope.adverts[i].checked == true){
                            deviceIds.push($scope.adverts[i].id)
                        }
                    }
                    $scope.deviceIds = deviceIds
                    if($scope.deviceIds.length == 0){
                        DialogService.alert('请选择要下发广告的设备!')
                    }else{
                        var req = {
                            deviceIds:deviceIds
                        }
                        AdvertService.adupgrade(req).then(function(rep){
                            if(rep.data.code == 0){
                                $("#Modaladvert").modal("show")
                            }else{
                                DialogService.alert('设备列表含有不可下发广告的设备')
                            }
                        })
                    }
                }
                /*广告下发窗口*/
                // $scope.confirmLssued = function(){
                //     if($scope.standby == undefined){
                //         if($scope.unlock == undefined){
                //             if($scope.unplug == undefined){
                //                 DialogService.alert('请至少选择一种广告!')
                //             }else{
                //                 var req = {
                //                     deviceIds:$scope.deviceIds,
                //                     broadcast_mode:$scope.broadcast_mode,
                //                     packs_object:[
                //                         {pack_id:$scope.unplug.id,expiry_time:$scope.unplugexpiry_time,type:$scope.unplug.type}],
                //                     delivery_mode:''
                //                 }
                //             }
                //         }else{
                //             if($scope.unplug == undefined){
                //                 var req = {
                //                     deviceIds:$scope.deviceIds,
                //                     broadcast_mode:$scope.broadcast_mode,
                //                     packs_object:[
                //                         {pack_id:$scope.unlock.id,expiry_time:$scope.unlockexpiry_time,type:$scope.unlock.type}],
                //                     delivery_mode:''
                //                 }
                //             }
                //         }
                //     }else{
                //         if($scope.unlock == undefined){
                //             if($scope.unplug == undefined){
                //                 var req = {
                //                     deviceIds:$scope.deviceIds,
                //                     broadcast_mode:$scope.broadcast_mode,
                //                     packs_object:[
                //                         {pack_id:$scope.standby.id,expiry_time:$scope.standbyexpiry_time,type:$scope.standby.type}],
                //                     delivery_mode:''
                //                 }
                //             }
                //         }else{
                //             if($scope.unplug == undefined){
                //                 var req = {
                //                     deviceIds:$scope.deviceIds,
                //                     broadcast_mode:$scope.broadcast_mode,
                //                     packs_object:[
                //                         {pack_id:$scope.standby.id,expiry_time:$scope.standbyexpiry_time,type:$scope.standby.type},
                //                         {pack_id:$scope.unlock.id,expiry_time:$scope.unlockexpiry_time,type:$scope.unlock.type}],
                //                     delivery_mode:''
                //                 }
                //             }else{
                //                 var req = {
                //                     deviceIds:$scope.deviceIds,
                //                     broadcast_mode:$scope.broadcast_mode,
                //                     packs_object:[
                //                         {pack_id:$scope.standby.id,expiry_time:$scope.standbyexpiry_time,type:$scope.standby.type},
                //                         {pack_id:$scope.unlock.id,expiry_time:$scope.unlockexpiry_time,type:$scope.unlock.type},
                //                         {pack_id:$scope.unplug.id,expiry_time:$scope.unplugexpiry_time,type:$scope.unplug.type}],
                //                     delivery_mode:''
                //                 }
                //             }
                //         }
                //     }
                //     console.log(req)
                //     AdvertService.beginupgrade(req).then(function(res){
                //         console.log(res.data.data)
                //         if(res.data.data != ''){
                //             DialogService.alert('该设备不支持广告下发')
                //         }else if(res.data.code == 1){
                //             DialogService.alert(res.data.msg)
                //         }else {
                //             DialogService.alert('广告下发成功')
                //             $('#Modaladvert').modal('hide')
                //         }
                //     },function(err){})
                // }
                $scope.confirmLssued = function(){
                    if($scope.standby == undefined){
                        DialogService.alert('请选择广告')
                        return false
                    }
                    if($scope.standbyexpiry_time == undefined){
                        DialogService.alert('请选择到期时间')
                        return false
                    }
                    var req = {
                        deviceIds:$scope.deviceIds,
                        broadcast_mode:$scope.broadcast_mode,
                        packs_object:[
                            {pack_id:$scope.standby.id,expiry_time:$scope.standbyexpiry_time,type:$scope.standby.type}],
                        delivery_mode:''
                    }
                    AdvertService.beginupgrade(req).then(function(res){
                        console.log(res.data.data)
                        if(res.data.data != ''){
                            DialogService.alert('该设备不支持广告下发')
                        }else if(res.data.code == 1){
                            DialogService.alert(res.data.msg)
                        }else {
                            DialogService.alert('广告下发成功')
                            $('#Modaladvert').modal('hide')
                        }
                    },function(err){})
                    
                }
                //停止下发
                $scope.stop = function(deviceId){
                    DialogService.confirm('确定停止下发广告?',function(){
                        var condition = {
                            device_number:deviceId
                        }
                        AdvertService.stop(condition).then(function(res){
                            DialogService.alert('停止下发成功')
                        },function(err){})
                    })
                }

	   }])

