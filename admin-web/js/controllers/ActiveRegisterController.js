angular.module('ActiveRegisterController',['CommonService','ActiveService'])
       .controller('ActiveRegisterCtrl',['$scope','DictService','ActiveService','DialogService',
        function($scope,DictService,ActiveService,DialogService){
            $scope.now = new Date()
            $scope.last_two_month = $scope.now.getTime() - 60 * 24 * 3600 * 1000;
            $scope.info = {
                name:'',
                status:'0',
                coupon_type:2,
                created_st:formatDate($scope.last_two_month),
                created_et:formatDate($scope.now),
                offset:0,
                limit:20,
                order_by:'created_at',
                order:'desc',
                total:0,
                page:1,
                pageCnt:0
            }
            //订单查询时间设置
            $("#start-date-start").datepicker({
                language: 'zh-CN',
                startView: 0,
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayBtn: false,
                startDate:'1970-01-01',
                endDate: formatDate($scope.now),
                todayHighlight: true
            }).on('changeDate',function(e){
                var startTime = e.date
                $('#start-date-end').datepicker('setStartDate',startTime)
            })
            $("#start-date-end").datepicker({
                language: 'zh-CN',
                startView: 0,
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayBtn: false,
                startDate:'1970-01-01',
                endDate: formatDate($scope.now),
                todayHighlight: true
            }).on('chageDate',function(e){
                var endTime = e.date
                $('#start-date-start').datepicker('setEndDate',endTime)
            })
            $('#start-date-start').datepicker("setDate", formatDate($scope.last_two_month));
            $('#start-date-end').datepicker("setDate", formatDate($scope.now));
            //创建活动时间设置
            $('#date-start').datetimepicker({
                format: 'yyyy-mm-dd',
                startDate:new Date($scope.now.getTime() + 24 * 3600 * 1000),
                minView: "month",//设置只显示到月份
                initialDate:new Date($scope.now.getTime() + 24 * 3600 * 1000),
            }).on('changeDate',function(ev){
                var startTime = $("#date-start").val();
                $("#date-end").datetimepicker('setStartDate',startTime);
                $('#date-start').datetimepicker('hide')
            })
            $('#date-end').datetimepicker({
                format: 'yyyy-mm-dd',
                startDate:new Date($scope.now.getTime() + 24 * 3600 * 1000),
                minView: "month",//设置只显示到月份
                initialDate:new Date($scope.now.getTime() + 24 * 3600 * 1000),
            }).on('changeDate',function(ev){
                var endTime = $('#date-end').val()
                $('#date-start').datetimepicker('setEndDate',endTime)
                $('#date-end').datetimepicker('hide')
            })
            //编辑活动时间设置
            $('#date-start-edit').datetimepicker({
                format: 'yyyy-mm-dd',
                startDate:new Date($scope.now.getTime() + 24 * 3600 * 1000),
                minView: "month",//设置只显示到月份
                initialDate:new Date($scope.now.getTime() + 24 * 3600 * 1000),
            }).on('changeDate',function(ev){
                var startTime = $("#date-start-edit").val();
                $("#date-end-edit").datetimepicker('setStartDate',startTime);
                $('#date-start-edit').datetimepicker('hide')
            })
            $('#date-end-edit').datetimepicker({
                format: 'yyyy-mm-dd',
                startDate:new Date($scope.now.getTime() + 24 * 3600 * 1000),
                minView: "month",//设置只显示到月份
                initialDate:new Date($scope.now.getTime() + 24 * 3600 * 1000),
            }).on('changeDate',function(ev){
                var endTime = $('#date-end-edit').val()
                $('#date-start-edit').datetimepicker('setEndDate',endTime)
                $('#date-end-edit').datetimepicker('hide')
            })
            //活动添加模板
            $scope.addContent = {
                name:'',
                payment_fix:'',
                appoint_station:1,
                appoint_date:1,
                status:1,
                applicable_object:'0',
                started_at:'',
                end_at:'',
                stationIds:[]
            }
            //活动编辑模板
            $scope.editContent = {
                id:'',
                coupon_name:'',
                payment_fix:'',
                appoint_station:1,
                appoint_date:1,
                status:1,
                applicable_object:'0',
                started_at:'',
                end_at:'',
                stationIds:[]
            }
            $scope.stationList = []
            $scope.chooseStationList = []
            $scope.activeList = []
            //查询列表
            $scope.search = function(){
                var condition = {
                    coupon_name:$scope.info.name,
                    coupon_type:2,
                    status:$scope.info.status,
                    created_st:$scope.info.created_st,
                    created_et:$scope.info.created_et,
                    offset:$scope.info.offset,
                    limit:$scope.info.limit,
                    order_by:$scope.info.order_by,
                    order:$scope.info.order,
                    total:$scope.info.total
                }
                ActiveService.search(condition).then(function(res){
                    console.log(res)
                    $scope.activeList = res.data.list;
                    $scope.info.total = res.data.total;
                    $scope.info.pageCnt = Math.ceil($scope.info.total/$scope.info.limit)
                },function(err){})
            }
            //init
            init()
            function init(){
                $scope.search()
            }
            $scope.searchStation = function(){
                if($scope.query == ''){
                    $scope.showDropdownFlag = false;
                    $scope.stationList = []
                }else{
                    var condition = {
                        type:'staton_coupon',
                        query:$scope.query,
                        activity:1
                    }
                    DictService.search(condition).then(function(res){
                        console.log(res)
                        $scope.showDropdownFlag = true;
                        $scope.stationList = res
                    },function(err){})
                }
            }
            $scope.clickStationItem = function(station){
                var exit = false
                for(var i in $scope.chooseStationList){
                    if($scope.chooseStationList[i].id === station.id){
                        exit = true
                    }else{

                    }
                }
                if(!exit){$scope.chooseStationList.push(station)}
                $scope.query = station.name
                $scope.showDropdownFlag = false;
            }
            $scope.clearStation = function(id){
                for(var i = 0;i<$scope.chooseStationList.length;i++){
                    if($scope.chooseStationList[i].id === id){
                        $scope.chooseStationList.splice(i,1)
                    }
                }
            }
            $scope.confirmChooseStation = function(){
                $('#ChooseStationModal').modal('hide')
            }
            $(document).click(function(){
                $scope.$apply(function(){
                    $scope.showDropdownFlag = false;
                })
            })

            $scope.$watch('addContent.appoint_station',function(newValue,oldValue){
                if(newValue == oldValue ){
                    return false
                }
                if(newValue == 1){
                    $scope.chooseStationList = []
                }
            })
            $scope.$watch('addContent.appoint_date',function(newValue,oldValue){
                if(newValue == oldValue ){
                    return false
                }
                if(newValue == 1){
                    $scope.addContent.started_at = null;
                    $scope.addContent.started_et = null;
                }
            })
            $scope.add = function(){
                $scope.addContent.payment_fix = Number($scope.addContent.payment_fix)
                if($scope.addContent.name == ''){
                    DialogService.alert('请输入活动名称')
                    return false
                }
                if($scope.addContent.payment_fix == ''){
                    DialogService.alert('请输入赠送金额')
                    return false
                }
                if($scope.addContent.appoint_station == 2){
                    if($scope.chooseStationList.length == 0){
                        DialogService.alert('请选择站点')
                        return false
                    }
                }else{
                    $scope.chooseStationList = []
                }
                if(!(/^\d+(\.\d{0,2})?$/).test($scope.addContent.payment_fix)){
                    DialogService.alert('请输入正确的赠送金额')
                    return false
                }
                if($scope.addContent.appoint_date == 2){
                    if($scope.addContent.started_at == ''){
                        DialogService.alert('请选择有效期起始时间')
                        return false
                    }
                    if($scope.addContent.end_at == ''){
                        DialogService.alert('请选择有效期截止时间')
                        return false
                    }
                    // if($scope.addContent.started_at == $scope.addContent.end_at){
                    //     DialogService.alert('起始日期不能与截止日期相同')
                    //     return false
                    // }
                }else{
                    $scope.addContent.started_at = null;
                    $scope.addContent.end_at = null;
                }
                var arr = []
                for(var i in $scope.chooseStationList){
                    arr.push($scope.chooseStationList[i].id)
                }
                var condition = {
                    coupon_type:$scope.info.coupon_type,
                    coupon_name:$scope.addContent.name,
                    payment_fix:$scope.addContent.payment_fix*100,
                    appoint_station:$scope.addContent.appoint_station,
                    appoint_date:$scope.addContent.appoint_date,
                    status:$scope.addContent.status,
                    applicable_object:$scope.addContent.applicable_object,
                    started_at:$scope.addContent.started_at == null?null:$scope.addContent.started_at+' 00:00:00',
                    end_at:$scope.addContent.end_at == null ?null:$scope.addContent.end_at+' 23:59:59',
                    stationIds:arr
                }
                console.log($scope.addContent)
                console.log(condition)
                ActiveService.add(condition).then(function(res){
                    DialogService.alert('添加成功')
                    $('#ContentAdd').modal('hide');
                    $scope.search();
                    $scope.addContent.name = '';
                    $scope.addContent.payment_fix = '';
                    $scope.addContent.appoint_station = 1;
                    $scope.addContent.appoint_date = 1;
                    $scope.addContent.status = 1;
                    $scope.addContent.applicable_object = '0';
                    $scope.addContent.started_at = '';
                    $scope.addContent.end_at = '';
                    $scope.addContent.stationIds = [];
                    $("#date-start").datetimepicker('setEndDate',null);
                    $("#date-end").datetimepicker('setEndDate',null);
                },function(err){})

            }
            //编辑活动
            $scope.edit = function(id){
                var condition = {
                    id:id
                }
                ActiveService.get(condition).then(function(res){
                    var x = res.data;
                    //深拷贝活动对象
                    $scope.singleActive = JSON.parse(JSON.stringify(res.data));
                    $scope.editContent.id = x.id;
                    $scope.editContent.coupon_name = x.coupon_name;
                    $scope.editContent.payment_fix = x.payment_fix;
                    $scope.editContent.appoint_station = x.appoint_station;
                    $scope.editContent.appoint_date = x.appoint_date;
                    $scope.editContent.status = x.status;
                    $scope.editContent.applicable_object = String(x.applicable_object);
                    $scope.editContent.started_at = x.started_at;
                    $scope.editContent.end_at = x.end_at;
                    $scope.oldStationList = JSON.parse(JSON.stringify(x.stationIds));
                    $scope.chooseStationList = x.stationIds;
                },function(err){})
            }
            $scope.update = function(){
                if($scope.editContent.coupon_name == ''){
                    DialogService.alert('请输入活动名称')
                    return false
                }
                if($scope.editContent.payment_fix == ''){
                    DialogService.alert('请输入赠送金额')
                    return false
                }
                // if($scope.editContent.appoint_station == 2){
                //     if($scope.chooseStationList.length == 0){
                //         DialogService.alert('请选择站点')
                //         return false
                //     }
                // }
                if(!(/^\d+(\.\d{0,2})?$/).test($scope.editContent.payment_fix)){
                    DialogService.alert('请输入正确的赠送金额')
                    return false
                }
                if($scope.editContent.appoint_date == 2){
                    if($scope.editContent.started_at == ''){
                        DialogService.alert('请选择有效期起始时间')
                        return false
                    }
                    if($scope.editContent.end_at == ''){
                        DialogService.alert('请选择有效期截止时间')
                        return false
                    }
                    // if($scope.editContent.started_at == $scope.editContent.end_at){
                    //     DialogService.alert('起始日期不能与截止日期相同')
                    //     return false
                    // }
                }else{
                    $scope.editContent.started_at = null;
                    $scope.editContent.end_at = null;
                }
                // var arr = []
                // for(var i in $scope.chooseStationList){
                //     arr.push($scope.chooseStationList[i].id)
                // }
                var station_out = [];
                var station_in = [];
                if($scope.oldStationList.length === 0){
                    for(var m in $scope.chooseStationList){
                        station_in.push($scope.chooseStationList[m].id)
                    }
                }else{
                    for(var o in $scope.chooseStationList){
                        station_in.push($scope.chooseStationList[o].id)
                    }
                    //筛选原来有的现在去掉的站点
                    for(var k in $scope.oldStationList){
                        var flag = true
                        for(var l in $scope.chooseStationList){
                            if($scope.chooseStationList[l].id === $scope.oldStationList[k].id){
                                flag = false
                            }
                        }
                        if(flag){
                            station_out.push($scope.oldStationList[k].id)
                        }
                    }
                }
                var condition = {
                    id:$scope.editContent.id,
                    coupon_type:$scope.info.coupon_type,
                    coupon_name:$scope.editContent.coupon_name,
                    payment_fix:$scope.editContent.payment_fix*100,
                    appoint_station:$scope.editContent.appoint_station,
                    appoint_date:$scope.editContent.appoint_date,
                    status:$scope.editContent.status,
                    applicable_object:$scope.editContent.applicable_object,
                    started_at:$scope.editContent.started_at == null ?null :$scope.editContent.started_at+' 00:00:00',
                    end_at:$scope.editContent.end_at == null?null:$scope.editContent.end_at+' 23:59:59',
                    station_out:station_out,
                    station_in:station_in
                }
                ActiveService.update(condition).then(function(res){
                    DialogService.alert('修改成功');
                    $('#ContentEdit').modal('hide');
                    $scope.search()
                },function(err){})
            }
            //删除活动
            $scope.delete = function(id){
                DialogService.confirm('确认要删除活动?',function(){
                    var condition = {
                        id:id
                    }
                    ActiveService.delete(condition).then(function(res){
                        DialogService.alert('删除成功')
                        $scope.search()
                    },function(err){})
                })
            }
       }])