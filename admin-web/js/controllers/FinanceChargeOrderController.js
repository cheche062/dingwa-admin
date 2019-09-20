angular.module('FinancesController', ['CommonService'])
    .controller("FinanceOrderCtrl", ["$scope", "$state", "$stateParams","$timeout","DictService", "DialogService","ChargeOrderService",
        function($scope, $state, $stateParams,$timeout,DictService, DialogService,ChargeOrderService) {
            var storage = window.localStorage;
            const fields = '/charge/orders';
            if (storage.getItem('UserAuth') !== null) {
                $scope.UserAuth = JSON.parse(storage.getItem('UserAuth'));
                console.log($scope.UserAuth)
            }
            $scope.EnterpriseID = storage.getItem('EnterpriseID')
            $scope.now = new Date();
            $scope.last_two_month = $scope.now.getTime() - 60 * 24 * 3600 * 1000;
            $scope.info = {
                created_st:formatDate($scope.last_two_month),
                created_et:formatDate($scope.now),
                pay_status:'0',
                order_status:'0',
                order_number:'',
                status:'0',
                station_obj:{
                    id:'',
                    name:''
                },
                device_obj:{
                    id:'',
                    name:''
                },
                user_obj:{
                    id:'',
                    name:''
                },
                port_obj:{
                    id:'',
                    name:''
                },
                offset: 0,
                limit: 20,
                total: 0,
                pageCnt: 0,
                page: 1,  
                order:'desc',
                order_by:'created_at'
            };
            $scope.statistics = {
                payment: 0,
                payment_recv: 0,
                refund: 0,
                duration: 0,
                ele_quantity: 0

            }  
            $scope.charge_orders = []
            $("#start-date").datepicker({
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
                $('#end-date').datepicker('setStartDate',startTime)
            })
            $("#end-date").datepicker({
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
                $('#start-date').datepicker('setEndDate',endTime)
            })
            $('#start-date').datepicker("setDate", formatDate($scope.last_two_month));
            $('#end-date').datepicker("setDate", formatDate($scope.now));
            $scope.searchOrders = function(){
                var condition = {
                    created_st:$scope.info.created_st,
                    created_et:$scope.info.created_et,
                    pay_status:$scope.info.pay_status,
                    order_status:$scope.info.order_status,
                    order_number:$scope.info.order_number,
                    status:$scope.info.status,
                    station_obj:$scope.info.station_obj,
                    device_obj:$scope.info.device_obj,
                    user_obj:$scope.info.user_obj,
                    port_obj:$scope.info.port_obj,
                    offset:$scope.info.offset,
                    limit:$scope.info.limit,
                    order:$scope.info.order,
                    order_by:$scope.info.order_by
                }
                ChargeOrderService.search(condition).then(function(res){
                    console.log(res)
                    sessionStorage.setItem(fields, JSON.stringify(condition));
                    $scope.charge_orders = res.data.list
                    $scope.info.total = res.data.total
                    $scope.info.pageCnt = Math.ceil($scope.info.total/$scope.info.limit)
                    $scope.statistics.duration = res.data.durations;
                    $scope.statistics.ele_quantity = res.data.elec_quantitys;
                    $scope.statistics.payment = res.data.payments;
                    $scope.statistics.refund = res.data.refund_acts;
                    $scope.statistics.payment_recv = res.data.payment_acts;
                    console.log($scope.statistics);
                    
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
                    $scope.info.created_st = session.created_st;
                    $scope.info.created_et = session.created_et;
                    $scope.info.pay_status = session.pay_status;
                    $scope.info.order_status = session.order_status;
                    $scope.info.order_number = session.order_number;
                    $scope.info.status = session.status;
                    $scope.info.station_obj = session.station_obj;
                    $scope.info.device_obj = session.device_obj;
                    $scope.info.user_obj = session.user_obj;
                    $scope.info.port_obj = session.port_obj;
                    $scope.info.offset = session.offset;
                    $scope.info.limit = session.limit;
                }

                $scope.searchOrders()
            }
            function check(){
                $scope.info.status_array = []
                for(var i = 0;i<$scope.order_status.length;i++){
                    if($scope.order_status[i].checked == true){
                        $scope.info.status_array.push($scope.order_status[i].name)
                    }
                }
                if($scope.info.status_array.length == 0){
                    $scope.info.status_array.push($scope.order_status[0].name)
                    $scope.order_status[0].checked = true;
                }
            }
            $scope.checkedAll = function(){
                if ($scope.info.checked_all) {
                    for (var i in $scope.charge_orders) {
                        if ($scope.charge_orders[i].status !== '异常' && $scope.charge_orders[i].status !== '已开票') {
                            $scope.charge_orders[i].checked = true;
                        } else {
                            $scope.charge_orders[i].checked = false;
                        }
                    }
                } else {
                    for (var x in $scope.charge_orders) {
                        $scope.charge_orders[x].checked = false;
                    }
                }
            };
            $scope.search = function() {
                $scope.info.offset = 0;
                $scope.info.page = 1;
                $scope.info.st = transTimes($scope.info.start_time);
                $scope.info.et = transTimes($scope.info.end_time);
                $scope.searchOrders()
            };
            function transTimes(str_time) {
                var trans_time = new Date(str_time);
                var yyy = trans_time.getFullYear();
                var mmm = trans_time.getMonth() + 1;
                var ddd = trans_time.getDate();
                mmm = mmm < 10 ? "0" + mmm : mmm;
                ddd = ddd < 10 ? "0" + ddd : ddd;
                return yyy + "-" + mmm + "-" + ddd;
            }
            //导出
            $scope.downExcel = function(){
                var condition = {
                    created_st:$scope.info.created_st,
                    created_et:$scope.info.created_et,
                    pay_status:$scope.info.pay_status,
                    order_status:$scope.info.order_status,
                    order_number:$scope.info.order_number,
                    status:$scope.info.status,
                    station_obj:$scope.info.station_obj,
                    device_obj:$scope.info.device_obj,
                    user_obj:$scope.info.user_obj,
                    port_obj:$scope.info.port_obj,
                    offset:$scope.info.offset,
                    limit:$scope.info.limit,
                    downexcel:1
                }
                DialogService.loading(true)
                ChargeOrderService.search(condition).then(function(res){
                    DialogService.loading(false)
                    console.log(res)
                    window.open(res.data.path)

                    // $scope.charge_orders = res.data.list
                    // $scope.info.total = res.data.total,
                    // $scope.info.pageCnt = Math.ceil($scope.info.total/$scope.info.limit)

                },function(res){
                    if(res.msg != ''){
                        DialogService.alert(res.msg)
                    }
                })
            }
            $scope.startPaging = function() {
                $scope.searchOrders()
            };
            $scope.order = {
                commit_value:0,
                remarks:'',
                pay_status:7
            }
            $scope.resetOrder = function(){
                $scope.order = {
                    commit_value:0,
                    remarks:'',
                    pay_status:7
                }
            }
            //处理订单
            $scope.deal = function(order){
                // var arr = [];
                // for(let order of $scope.charge_orders){
                //     if(order.checked){
                //         arr.push(order.id)
                //     }
                // }
                // if(arr.length == 0){
                //     DialogService.alert('请勾选需要处理的订单!')
                //     return
                // }
                $('#ChangeOrderStatusModal').modal('show');
                //确认更改订单状态
                $scope.confirmChangeStatus = function(){
                    var arr = [],
                        obj = {
                            order_id:order.id,
                            commit_value:$scope.order.commit_value,
                            remarks:$scope.order.remarks
                        }
                        arr.push(obj)
                    var condition = {
                        orders:arr,
                        pay_status:$scope.order.pay_status
                    }
                    ChargeOrderService.deal(condition).then(function(res){
                        DialogService.alert('处理成功')
                        $scope.search();
                    })
                }
            }
            $('#ChangeOrderStatusModal').on('hide.bs.modal',function(){
                $scope.resetOrder();
            })
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
