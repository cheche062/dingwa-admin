angular.module('WithDrawListController',['CommonService','SystemUserService','WithDrawService'])
	   .controller('WithDrawListCtrl',['$scope','$state','$timeout','WithDrawService','DialogService','SystemUserService',
        function($scope,$state,$timeout,WithDrawService,DialogService,SystemUserService){
            var now = new Date()
	   		$scope.info = {
	   			created_st:'',
                created_et:'',
                status:'0',
                filter_type:'0',
                type:'2',
                order_by:'created_at',
                order:'desc',
                offset:0,
                limit:20,
                total:0,
                count:'',
                remarks:'',
                page:1,
                pageCnt:0,
                deal_remarks:'',
                deal_status:'2',
                transfer_account:''	   		}
            $("input[id^='start-date']").datepicker({
                language: 'zh-CN',
                startView: 0,
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayBtn: false,
                endDate: formatDate(now), //禁止选择当天之后的日期
                todayHighlight: true
            })
            $scope.refundList = {
                offset:0,
                limit:10,
                total:0,
                count:'',
                remarks:'',
                page:1,
                pageCnt:0,
                list: []
            }
            $scope.balance = null
            $scope.systemUser = null
            $scope.withDrawList = []
            init()
            function init(){
                SystemUserService.GetCurrent().then(function(res){
                    console.log(res)
                    $scope.systemUser = res.data;
                },function(res){
                    if(res.msg != ''){
                        DialogService.alert(res.msg)
                    }
                })
                search()
            }
            function search(){
                var condition = {
                    created_st:$scope.info.created_st,
                    created_et:$scope.info.created_et,
                    status:$scope.info.status,
                    type:$scope.info.filter_type,
                    order_by:$scope.info.order_by,
                    order:$scope.info.order,
                    offset:$scope.info.offset,
                    limit:$scope.info.limit,
                    total:$scope.info.total
                }
                WithDrawService.search(condition).then(function(res){
                    console.log(res)
                    $scope.withDrawList = res.data.list
                    $scope.info.total = res.data.total
                    $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
                })
            }
            $scope.search = function(){
                // $scope.info.page = 1
                $scope.offset = 0
                search()
            }
            // $scope.startPagingRefund = function() {
            //     $scope.getRefund(2);
            // }
            // $scope.getRefund = function(type) {
            //     var condition = {
            //         id: $scope.systemUser.id,
            //         req_type: type,
            //         order_by: '',
            //         order: '',
            //         offset: $scope.refundList.offset,
            //         limit: $scope.refundList.limit,
            //         total: $scope.refundList.total
            //     }
            //     switch(type) {
            //         case 1:
            //         {
            //             WithDrawService.getrefund(condition).then(function(res){
            //                 console.log(res)
            //                 $('#withDrawsModal').modal('show')
            //                 $scope.systemUser.refund = res.data.refund_acts;
            //             },function(res){
            //                 if(res.msg != ''){
            //                     DialogService.alert(res.msg)
            //                 }
            //             })
            //         } break;
            //         case 2:
            //         {
            //             console.log(condition)

            //             WithDrawService.getrefund(condition).then(function(res){
            //                 console.log(res)
            //                 $('#fixBalanceDetailModal').modal('show')
            //                 $scope.refundList.list = res.data.list;
            //                 $scope.refundList.total = res.data.total;
            //                 $scope.refundList.pageCnt = Math.ceil($scope.refundList.total/$scope.refundList.limit);
            //             },function(res){
            //                 if(res.msg != ''){
            //                     DialogService.alert(res.msg)
            //                 }
            //             })
            //         }
            //     }
            // }
            $scope.withDrawHand = function() {
                if($scope.systemUser.transfer_account) {
                    $('#withDrawsModal').modal('show');
                }else{
                    DialogService.alert('提现账号为空，请先配置系统用户提现账号！')
                }
            }
            //提现申请
            $scope.withDraw = function(){
                // if($scope.info.transfer_account == ''){
                //     DialogService.alert('请输入提账户')
                //     return false
                // }
                // if(!(/^[0-9]+.?[0-9]*$/.test($scope.info.count)) ||$scope.info.count <= 0 || $scope.info.count == ''){
                //     DialogService.alert('请输入正确的提现金额')
                //     return false
                // }
                // if($scope.info.count < 200){
                //     DialogService.alert('提现最小金额200元')
                //     return false
                // }
                // if($scope.info.count > $scope.systemUser.balance/100){
                //     DialogService.alert('提现金额不能大于当前余额')
                //     return false
                // }
                // if($scope.info.remarks == ''){
                //     DialogService.alert('请输入提现备注')
                //     return false
                // }
                var condition = {
                    type:$scope.info.type,
                    // transfer_account:$scope.info.transfer_account,
                    transfer_account:$scope.systemUser.transfer_account,
                    remarks:$scope.info.remarks,
                    count:$scope.systemUser.balance
                }
                WithDrawService.apply(condition).then(function(res){
                    console.log(res)
                    search()
                    $scope.info.type = '2'
                    $scope.info.count = ''
                    $scope.info.remarks = ''
                },function(res){
                    if(res.msg != ''){
                        DialogService.alert(res.msg)
                    }
                })
                $('#withDrawsModal').modal('hide');
            }
            //提现申请处理
            $scope.deal = function(item){
                $('#withDrawsDealModal').modal()
                $scope.confirmWithDraw = function(){
                    if($scope.info.deal_remarks == ''){
                        DialogService.alert('请输入处理备注')
                        return false
                    }
                    if($scope.systemUser.id === item.system_user_id){
                        DialogService.alert('只有1级账户才能处理提现申请')
                        return false
                    }
                    var condition = {
                        id:item.id,
                        status:$scope.info.deal_status,
                        deal_remarks:$scope.info.deal_remarks
                    }
                    WithDrawService.deal(condition).then(function(res){
                        $('#withDrawsDealModal').modal('hide')
                        DialogService.alert('处理成功')
                        $scope.info.deal_status = '2'
                        $scope.info.deal_remarks = ''
                        $timeout(function(){
                            search()
                        },1000)
                    },function(res){
                        if(res.msg != ''){
                            DialogService.alert(res.msg)
                        }
                    })
                }
            }

            $scope.startPaging = function(){
                $scope.search()
            }
	   }])