angular.module("UsersShowController", ["CommonService","UserService"])
.controller("UsersShowCtrl", ["$scope", "$state","UserService","DialogService",'DictService',
    function($scope, $state,UserService,DialogService,DictService){
    	var now = new Date()
    	$scope.info = {
    		order_by:'created_at',
    		order:'desc',
    		offset:0,
    		limit:20,
    		total:0,
    		user_obj:{ "id" : '',"phone":''},
            created_st:'',
            created_et:'',
            pageCnt: 0,
            page: 1,
            count:'',
            remarks:''
    	}
        const fields = '/user/list';
    	$scope.users = []

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

        $("input[id^='start-date']").datepicker({
        	language: 'zh-CN',
            startView: 0,
            format: 'yyyy-mm-dd',
            autoclose: true,
            todayBtn: false,
            endDate: formatDate(now), //禁止选择当天之后的日期
            todayHighlight: true
        })
        $scope.search = function(){
            // console.log($scope.provinceOption)
    		var condition = {
    			user_obj:$scope.info.user_obj,
                created_st:$scope.info.created_st,
                created_et:$scope.info.created_et,
    			province_id:$scope.provinceOption.id,
                city_id:$scope.cityOption.id,
                district_id:$scope.districtOption.id,
                order_by:$scope.info.order_by,
                order:$scope.info.order,
                offset:($scope.info.page-1)*$scope.info.limit,
                limit:$scope.info.limit,
                total:$scope.info.total
    		}
    		UserService.search(condition).then(function(res){
    			console.log(res)
                sessionStorage.setItem(fields, JSON.stringify(condition));
                $scope.users = res.data.list
                $scope.info.total = res.data.total
                $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
    		},function(res){
    			DialogService.alert(res.msg)
    		})
    	}
    	init()
    	function init(){
            let url = window.location.href;
            ut= url.split("#");
            url=ut[1];

            if((sessionStorage.getItem(url)) && (fields == url)){
                var session = JSON.parse(sessionStorage.getItem(url));
                $scope.info.user_obj = session.user_obj;
                $scope.info.created_st = session.created_st;
                $scope.info.created_et = session.created_et;
                $scope.provinceOption.id = session.province_id;
                $scope.cityOption.id = session.city_id;
                $scope.districtOption.id = session.district_id;
                $scope.info.order_by = session.order_by;
                $scope.info.order = session.order;
                $scope.info.offset = session.offset;
                $scope.info.limit = session.limit;
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

    		$scope.search()
    	}
        $scope.goDetail = function(id){
            $state.go('main.user/show',{id:id},{
                reload:'main.user/show'
            })
        }
        $scope.goEdit = function(id){
            $state.go('main.user/edit',{id:id},{
                reload:'main.user/edit'
            })
        }
        //封禁用户
        $scope.forbid = function(id){
            var condition = {
                id:id
            }
            DialogService.confirm('确认要封禁用户吗',function(){
                UserService.forbid(condition).then(function(res){
                    DialogService.alert('封禁成功')
                },function(res){
                    if(res.msg != ''){
                        DialogService.alert(res.msg)
                    }
                })

            })
        }
        //充值
        $scope.go_recharge = function(id){
            $('#ChargeModal').modal('show')
            $scope.confirmRecharge = function(){
                if($scope.info.count == ''){
                    DialogService.alert('请输入充值金额')
                    return false
                }
                if(!(/^[0-9]+.?[0-9]*$/.test($scope.info.count)) ||$scope.info.count <= 0){
                    DialogService.alert('请输入正确的充值金额')
                    return false
                }
                if($scope.info.remarks == ''){
                    DialogService.alert('请输入充值说明')
                    return false
                }
                var condition = {
                    id:id,
                    count:$scope.info.count,
                    remarks:$scope.info.remarks
                }
                UserService.updatecash(condition).then(function(res){
                    DialogService.alert('充值成功')
                    $scope.info.count = ''
                    $scope.info.remarks = ''
                    $scope.search()
                },function(res){
                    if(res.msg != ''){
                        DialogService.alert(res.msg)
                    }
                })
            }
        }
        $scope.delete = function(id){
            var condition = {
                id:id
            }
            DialogService.confirm('确认要删除吗',function(){
                UserService.delete(condition).then(function(res){
                    DialogService.alert('删除成功')
                    $scope.search()
                },function(res){
                    DialogServcie.alert(res.msg)
                })
            })
        }
        $scope.startPaging = function(){
            $scope.search()
        }
        //清除
        $scope.clear = function(id){
            var condition = {
                id:id
            }
            DialogService.confirm('确定要清除绑定关系?',function(){
                UserService.clear(condition).then(function(res){
                    DialogService.alert('操作成功')
                })
            })
        }
        //包月时卡充值
        // 选择日期不能选择今天之前的
        $scope.cardTime = {
            deadline:formatDate(new Date().getTime()),
            count: 0,
            isRechargeBalance: false,
            remarks:''
        }
        $scope.resetCardTime = function(){
            $scope.cardTime = {
                deadline:formatDate(new Date().getTime()),
                count: 0,
                isRechargeBalance: false,
                remarks:''
            }
        }
        $("input[id='deadline']").datepicker({
            language: 'zh-CN',
            startView: 0,
            format: 'yyyy-mm-dd',
            autoclose: true,
            todayBtn: false,
            startDate:formatDate(new Date().getTime()),
            todayHighlight: true
        })
        $('#deadline').datepicker("setDate", formatDate(new Date().getTime()));
        $scope.cardType == '';
        $scope.rechargeByTime = function(card){
            $scope.cardType = card.type;
            $scope.resetCardTime();
            $('#ChargeModal-Card').modal('show')
            $scope.confirmByCard = function(){
                var condition = {
                    id:card.id,
                    count:''+$scope.cardTime.count.toFixed(2),
                    valid_date:$scope.cardTime.deadline,
                    remakrs:$scope.cardTime.remarks
                };
                if(!$scope.cardTime.isRechargeBalance) {
                    condition.count = '0';
                }
                console.log(condition)
                UserService.updatecash(condition).then(function(res){
                    DialogService.alert('充值成功')
                    $scope.search();
                    $('#ChargeModal-Card').modal('hide');
                })
            }
        }
        $scope.filterSearch = function(){
            $scope.info.page = 1;
            $scope.search();
        }
        // $('#ChargeModal-Card').on('hide.bs.modal',function(){
        //     $('#deadline').datepicker("setDate", formatDate(now));
        // })
    }
])
