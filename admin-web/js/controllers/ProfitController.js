angular.module('ProfitController',['CommonService','SystemUserService','ProfitService'])
	   .controller('ProfitCtrl',['$scope','$state','$timeout','SystemUserService','ProfitService','DialogService',function($scope,$state,$timeout,SystemUserService,ProfitService,DialogService){
	   		$scope.parent = {
	   			created_st:'',
	   			created_et:'',
	   			system_id:0,
	   			role_id:'',
	   			user_obj:{
	   				id:'',
	   				phone:''
	   			},
	   			order_by:'created_at',
	   			order:'desc',
                frog_systemid:'',
                recommend_systemid:'',
                copemate_systemid:'',
                elec_systemid:'',
                other_systemid:'',
	   		}
            $scope.statistics = {
                account_fee : {
                    frog: 0,
                    recommend: 0,
                    copemate: 0,
                    elec: 0,
                    other: 0
                },
                order_count: {
                    frog: 0,
                    recommend: 0,
                    copemate: 0,
                    elec: 0,
                    other: 0
                },
                order_payment: {
                    frog: 0,
                    recommend: 0,
                    copemate: 0,
                    elec: 0,
                    other: 0
                },
                apply_fee: {
                    frog: 0,
                    recommend: 0,
                    copemate: 0,
                    elec: 0,
                    other: 0
                },
                has_fee: {
                    frog: 0,
                    recommend: 0,
                    copemate: 0,
                    elec: 0,
                    other: 0
                }
            }   
               $scope.role_type = ''
	   		$scope.tab = 'frog'
	   		$scope.change_tab = function(str,num){
          		$scope.tab = str
          	}
	   		$("input[id^=start-date]").datepicker({
                language: 'zh-CN',
                startView: 0,
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayBtn: false,
                endDate: formatDate($scope.last_two_month),
                todayHighlight: true
            });

          	getRoleType()
          	function getRoleType(){
          		SystemUserService.GetCurrent().then(function(res){
          			console.log(res)
                    $scope.system_user = res.data
                    $scope.parent.system_id = res.data.id
                    console.log($scope.system_user)
          			$scope.role_type = res.data.type
                    if($scope.role_type == 2){
                        if($scope.system_user.frog_account.length == 0){
                            if($scope.system_user.recommend_account.length == 0){
                                if($scope.system_user.copemate_account.length==0){
                                    if($scope.system_user.elec_account.length==0){
                                        if($scope.system_user.other_account.length==0){
                                            
                                        }else{
                                            $scope.tab = 'other'
                                            $('.other_tab').addClass('active')
                                            $scope.parent.other_systemid = $scope.system_user.other_account[0].user_id
                                        }
                                    }else{
                                        $scope.tab = 'elec'
                                        $('.elec_tab').addClass('active')
                                        $scope.parent.elec_systemid = $scope.system_user.elec_account[0].user_id
                                    }
                                }else{
                                    $scope.tab = 'copemate'
                                    $('.copemate_tab').addClass('active')
                                    $scope.parent.copemate_systemid = $scope.system_user.copemate_account[0].user_id
                                }
                            }else{
                                $scope.tab = 'recommend'
                                $('.recommend_tab').addClass('active')
                                $scope.parent.recommend_systemid = $scope.system_user.recommend_account[0].user_id
                            }
                        }else{
                            $scope.tab = 'frog'
                            $('.frog_tab').addClass('active')
                            $scope.parent.frog_systemid = $scope.system_user.frog_account[0].user_id
                        }

                        if($scope.system_user.frog_account.length != 0){
                            $scope.parent.frog_systemid = $scope.system_user.frog_account[0].user_id
                        }
                        if($scope.system_user.recommend_account.length != 0){
                            $scope.parent.recommend_systemid = $scope.system_user.recommend_account[0].user_id
                        }
                        if($scope.system_user.copemate_account.length !=0){
                            $scope.parent.copemate_systemid = $scope.system_user.copemate_account[0].user_id
                        }
                        if($scope.system_user.elec_account.length !=0){
                            $scope.parent.elec_systemid = $scope.system_user.elec_account[0].user_id
                        }
                        if($scope.system_user.other_account.length !=0 ){
                            $scope.parent.other_systemid = $scope.system_user.other_account[0].user_id
                        }
                    }else{
                        $scope.tab = 'frog'
                        $('.frog_tab').addClass('active')
                    }
                    $scope.$broadcast('role_type',$scope.role_type)
          		},function(res){
          			if(res.msg != ''){
          				DialogService.alert(res.msg)
          			}
          		})
          	}

          	
	   }])
       .controller('FrogCtrl',['$scope','$state','$timeout','SystemUserService','ProfitService','DialogService',function($scope,$state,$timeout,SystemUserService,ProfitService,DialogService){
            $scope.role_type = ''
            $scope.info = {
                created_st:'',
                created_et:'',
                system_id:0,
                role_id:'',
                user_obj:{
                    id:'',
                    phone:''
                },
                order_by:'created_at',
                order:'desc',
                offset:0,
                limit:20,
                total:0,
                page:1,
                pageCnt:0,
                file_url:''
            }
            $scope.frog_list = []
            $scope.$on('role_type',function(event,data){
                $scope.role_type = data
                if($scope.role_type == 1 || $scope.role_type == 0){
                    var condition = {
                        created_st:$scope.info.created_st,
                        created_et:$scope.info.created_et,
                        system_id:$scope.info.system_id,
                        role_id:1,
                        user_obj:$scope.info.user_obj,
                        order_by:$scope.info.order_by,
                        order:$scope.info.order,
                        offset:$scope.info.offset,
                        limit:$scope.info.limit,
                        total:$scope.info.total
                    }
                    ProfitService.search(condition).then(function(res){
                        console.log(res)
                        $scope.frog_list = res.data.list
                        $scope.info.total = res.data.total
                        $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
                        $scope.statistics.account_fee['frog'] = res.data.account_fees;
                        $scope.statistics.order_count['frog'] = res.data.order_cnts;
                        $scope.statistics.order_payment['frog'] = res.data.order_payments;
                        $scope.statistics.apply_fee['frog'] = res.data.apply_fees;
                        $scope.statistics.has_fee['frog'] = res.data.has_fees;
                    },function(res){
                        if(res.msg != ''){
                            DialogService.alert(res.msg)
                        }
                    })
                }
                //role_type等于2，先判断frog_list是否为空，不为空则执行
                if($scope.role_type ==2 ){
                    if($scope.system_user.frog_account.length != 0){
                        var condition = {
                            created_st:$scope.info.created_st,
                            created_et:$scope.info.created_et,
                            system_id:$scope.parent.frog_systemid,
                            role_id:1,
                            user_obj:$scope.info.user_obj,
                            order_by:$scope.info.order_by,
                            order:$scope.info.order,
                            offset:$scope.info.offset,
                            limit:$scope.info.limit,
                            total:$scope.info.total
                        }
                        ProfitService.search(condition).then(function(res){
                            console.log(res)
                            $scope.frog_list = res.data.list
                            $scope.info.total = res.data.total
                            $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
                            $scope.statistics.account_fee['frog'] = res.data.account_fees;
                            $scope.statistics.order_count['frog'] = res.data.order_cnts;
                            $scope.statistics.order_payment['frog'] = res.data.order_payments;
                            $scope.statistics.apply_fee['frog'] = res.data.apply_fees;
                            $scope.statistics.has_fee['frog'] = res.data.has_fees;
                        },function(res){
                            if(res.msg != ''){
                                DialogService.alert(res.msg)
                            }
                        })
                    }
                }
            })
            $scope.search = function(){
                var condition = {
                    created_st:$scope.info.created_st,
                    created_et:$scope.info.created_et,
                    system_id:$scope.role_type == 2 ? $scope.parent.frog_systemid:$scope.info.system_id,
                    role_id:1,
                    user_obj:$scope.info.user_obj,
                    order_by:$scope.info.order_by,
                    order:$scope.info.order,
                    offset:$scope.info.offset,
                    limit:$scope.info.limit,
                    total:$scope.info.total
                }
                ProfitService.search(condition).then(function(res){
                    console.log(res)
                    $scope.frog_list = res.data.list
                    $scope.info.total = res.data.total
                    $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
                    $scope.statistics.account_fee['frog'] = res.data.account_fees;
                    $scope.statistics.order_count['frog'] = res.data.order_cnts;
                    $scope.statistics.order_payment['frog'] = res.data.order_payments;
                    $scope.statistics.apply_fee['frog'] = res.data.apply_fees;
                    $scope.statistics.has_fee['frog'] = res.data.has_fees;
                },function(res){
                    if(res.msg != ''){
                        DialogService.alert(res.msg)
                    }
                })
            }
            $scope.goDetail = function(id){
                $state.go('main.profitStation/list',{id:id})
            }
            //用户订单统计
            $scope.goOrder = function(id){
                $state.go('main.profitOrder/list',{id:id})
            }
            $scope.startPaging = function(){
                $scope.search()
            }
       }])
       .controller('RecommendCtrl',['$scope','$state','$timeout','SystemUserService','ProfitService','DialogService',function($scope,$state,$timeout,SystemUserService,ProfitService,DialogService){
            $scope.role_type = ''
            $scope.info = {
                created_st:'',
                created_et:'',
                system_id:0,
                role_id:'',
                user_obj:{
                    id:'',
                    phone:''
                },
                order_by:'created_at',
                order:'desc',
                offset:0,
                limit:20,
                total:0,
                page:1,
                pageCnt:0,
                file_url:''
            }
            $scope.recommend_list = []
            $scope.$on('role_type',function(event,data){
                $scope.role_type = data
                if($scope.role_type == 1 || $scope.role_type == 0){
                    var condition = {
                        created_st:$scope.info.created_st,
                        created_et:$scope.info.created_et,
                        system_id:$scope.info.system_id,
                        role_id:2,
                        user_obj:$scope.info.user_obj,
                        order_by:$scope.info.order_by,
                        order:$scope.info.order,
                        offset:$scope.info.offset,
                        limit:$scope.info.limit,
                        total:$scope.info.total
                    }
                    ProfitService.search(condition).then(function(res){
                        console.log(res)
                        $scope.recommend_list = res.data.list
                        $scope.info.total = res.data.total
                        $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
                        $scope.statistics.account_fee['recommend'] = res.data.account_fees;
                        $scope.statistics.order_count['recommend'] = res.data.order_cnts;
                        $scope.statistics.order_payment['recommend'] = res.data.order_payments;
                        $scope.statistics.apply_fee['recommend'] = res.data.apply_fees;
                        $scope.statistics.has_fee['recommend'] = res.data.has_fees;
                    },function(res){
                        if(res.msg != ''){
                            DialogService.alert(res.msg)
                        }
                    })
                }
                //role_type等于2，先判断recommend_list是否为空，不为空则执行
                if($scope.role_type ==2 ){
                    if($scope.system_user.recommend_account.length != 0){
                        var condition = {
                            created_st:$scope.info.created_st,
                            created_et:$scope.info.created_et,
                            system_id:$scope.parent.recommend_systemid,
                            role_id:2,
                            user_obj:$scope.info.user_obj,
                            order_by:$scope.info.order_by,
                            order:$scope.info.order,
                            offset:$scope.info.offset,
                            limit:$scope.info.limit,
                            total:$scope.info.total
                        }
                        ProfitService.search(condition).then(function(res){
                            console.log(res)
                            $scope.recommend_list = res.data.list
                            $scope.info.total = res.data.total
                            $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
                            $scope.statistics.account_fee['recommend'] = res.data.account_fees;
                            $scope.statistics.order_count['recommend'] = res.data.order_cnts;
                            $scope.statistics.order_payment['recommend'] = res.data.order_payments;
                            $scope.statistics.apply_fee['recommend'] = res.data.apply_fees;
                            $scope.statistics.has_fee['recommend'] = res.data.has_fees;
                        },function(res){
                            if(res.msg != ''){
                                DialogService.alert(res.msg)
                            }
                        })
                    }
                }
            })
            $scope.goDetail = function(id){
                $state.go('main.profitStation/list',{id:id})
            }
            //用户订单统计
            $scope.goOrder = function(id){
                $state.go('main.profitOrder/list',{id:id})
            }
            $scope.search = function(){
                var condition = {
                    created_st:$scope.info.created_st,
                    created_et:$scope.info.created_et,
                    system_id:$scope.role_type == 2?$scope.parent.recommend_systemid:$scope.info.system_id,
                    role_id:2,
                    user_obj:$scope.info.user_obj,
                    order_by:$scope.info.order_by,
                    order:$scope.info.order,
                    offset:$scope.info.offset,
                    limit:$scope.info.limit,
                    total:$scope.info.total
                }
                ProfitService.search(condition).then(function(res){
                    console.log(res)
                    $scope.recommend_list = res.data.list
                    $scope.info.total = res.data.total
                    $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
                    $scope.statistics.account_fee['recommend'] = res.data.account_fees;
                    $scope.statistics.order_count['recommend'] = res.data.order_cnts;
                    $scope.statistics.order_payment['recommend'] = res.data.order_payments;
                    $scope.statistics.apply_fee['recommend'] = res.data.apply_fees;
                    $scope.statistics.has_fee['recommend'] = res.data.has_fees;
                },function(res){
                    if(res.msg != ''){
                        DialogService.alert(res.msg)
                    }
                })
            }
            $scope.startPaging = function(){
                $scope.search()
            }
       }])
       .controller('CompemateCtrl',['$scope','$state','$timeout','SystemUserService','ProfitService','DialogService',function($scope,$state,$timeout,SystemUserService,ProfitService,DialogService){
            $scope.role_type = ''
            $scope.info = {
                created_st:'',
                created_et:'',
                system_id:0,
                role_id:'',
                user_obj:{
                    id:'',
                    phone:''
                },
                order_by:'created_at',
                order:'desc',
                offset:0,
                limit:20,
                total:0,
                page:1,
                pageCnt:0,
                file_url:''
            }
            console.log($scope.parent)
            $scope.compemate_list = []
            $scope.$on('role_type',function(event,data){
                $scope.role_type = data
                if($scope.role_type == 1 || $scope.role_type == 0){
                    var condition = {
                        created_st:$scope.info.created_st,
                        created_et:$scope.info.created_et,
                        system_id:$scope.info.system_id,
                        role_id:3,
                        user_obj:$scope.info.user_obj,
                        order_by:$scope.info.order_by,
                        order:$scope.info.order,
                        offset:$scope.info.offset,
                        limit:$scope.info.limit,
                        total:$scope.info.total
                    }
                    ProfitService.search(condition).then(function(res){
                        console.log(res)
                        $scope.compemate_list = res.data.list
                        $scope.info.total = res.data.total
                        $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
                        $scope.statistics.account_fee['copemate'] = res.data.account_fees;
                        $scope.statistics.order_count['copemate'] = res.data.order_cnts;
                        $scope.statistics.order_payment['copemate'] = res.data.order_payments;
                        $scope.statistics.apply_fee['copemate'] = res.data.apply_fees;
                        $scope.statistics.has_fee['copemate'] = res.data.has_fees;
                    },function(res){
                        if(res.msg != ''){
                            DialogService.alert(res.msg)
                        }
                    })
                }
                //role_type等于2，先判断recommend_list是否为空，不为空则执行
                if($scope.role_type ==2 ){
                    if($scope.system_user.copemate_account.length != 0){
                        var condition = {
                            created_st:$scope.info.created_st,
                            created_et:$scope.info.created_et,
                            system_id:$scope.parent.copemate_systemid,
                            role_id:3,
                            user_obj:$scope.info.user_obj,
                            order_by:$scope.info.order_by,
                            order:$scope.info.order,
                            offset:$scope.info.offset,
                            limit:$scope.info.limit,
                            total:$scope.info.total
                        }
                        ProfitService.search(condition).then(function(res){
                            console.log(res)
                            $scope.compemate_list = res.data.list
                            $scope.info.total = res.data.total
                            $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
                            $scope.statistics.account_fee['copemate'] = res.data.account_fees;
                            $scope.statistics.order_count['copemate'] = res.data.order_cnts;
                            $scope.statistics.order_payment['copemate'] = res.data.order_payments;
                            $scope.statistics.apply_fee['copemate'] = res.data.apply_fees;
                            $scope.statistics.has_fee['copemate'] = res.data.has_fees;
                        },function(res){
                            if(res.msg != ''){
                                DialogService.alert(res.msg)
                            }
                        })
                    }
                }
            })
            $scope.goDetail = function(id){
                $state.go('main.profitStation/list',{id:id})
            }
            //用户订单统计
            $scope.goOrder = function(id){
                $state.go('main.profitOrder/list',{id:id})
            }
            $scope.search = function(){
                var condition = {
                    created_st:$scope.info.created_st,
                    created_et:$scope.info.created_et,
                    system_id:$scope.role_type == 2?$scope.parent.copemate_systemid:$scope.info.system_id,
                    role_id:3,
                    user_obj:$scope.info.user_obj,
                    order_by:$scope.info.order_by,
                    order:$scope.info.order,
                    offset:$scope.info.offset,
                    limit:$scope.info.limit,
                    total:$scope.info.total
                }
                ProfitService.search(condition).then(function(res){
                    $scope.compemate_list = res.data.list
                    $scope.info.total = res.data.total
                    $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
                    $scope.statistics.account_fee['copemate'] = res.data.account_fees;
                    $scope.statistics.order_count['copemate'] = res.data.order_cnts;
                    $scope.statistics.order_payment['copemate'] = res.data.order_payments;
                    $scope.statistics.apply_fee['copemate'] = res.data.apply_fees;
                    $scope.statistics.has_fee['copemate'] = res.data.has_fees;
                },function(res){
                    if(res.msg != ''){
                        DialogService.alert(res.msg)
                    }
                })
            }
            $scope.startPaging = function(){
                $scope.search()
            }
       }])
       .controller('ElecCtrl',['$scope','$state','$timeout','SystemUserService','ProfitService','DialogService',function($scope,$state,$timeout,SystemUserService,ProfitService,DialogService){
            $scope.role_type = ''
            $scope.info = {
                created_st:'',
                created_et:'',
                system_id:0,
                role_id:'',
                user_obj:{
                    id:'',
                    phone:''
                },
                order_by:'created_at',
                order:'desc',
                offset:0,
                limit:20,
                total:0,
                page:1,
                pageCnt:0,
                file_url:''
            }
            $scope.elec_list = []
            $scope.$on('role_type',function(event,data){
                $scope.role_type = data
                if($scope.role_type == 1 || $scope.role_type == 0){
                    var condition = {
                        created_st:$scope.info.created_st,
                        created_et:$scope.info.created_et,
                        system_id:$scope.info.system_id,
                        role_id:4,
                        user_obj:$scope.info.user_obj,
                        order_by:$scope.info.order_by,
                        order:$scope.info.order,
                        offset:$scope.info.offset,
                        limit:$scope.info.limit,
                        total:$scope.info.total
                    }
                    ProfitService.search(condition).then(function(res){
                        console.log(res)
                        $scope.elec_list = res.data.list
                        $scope.info.total = res.data.total
                        $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
                        $scope.statistics.account_fee['elec'] = res.data.account_fees;
                        $scope.statistics.order_count['elec'] = res.data.order_cnts;
                        $scope.statistics.order_payment['elec'] = res.data.order_payments;
                        $scope.statistics.apply_fee['elec'] = res.data.apply_fees;
                        $scope.statistics.has_fee['elec'] = res.data.has_fees;
                    },function(res){
                        if(res.msg != ''){
                            DialogService.alert(res.msg)
                        }
                    })
                }
                //role_type等于2，先判断elec_list是否为空，不为空则执行
                if($scope.role_type ==2 ){
                    if($scope.system_user.elec_account.length != 0){
                        var condition = {
                            created_st:$scope.info.created_st,
                            created_et:$scope.info.created_et,
                            system_id:$scope.parent.elec_systemid,
                            role_id:4,
                            user_obj:$scope.info.user_obj,
                            order_by:$scope.info.order_by,
                            order:$scope.info.order,
                            offset:$scope.info.offset,
                            limit:$scope.info.limit,
                            total:$scope.info.total
                        }
                        ProfitService.search(condition).then(function(res){
                            console.log(res)
                            $scope.elec_list = res.data.list
                            $scope.info.total = res.data.total
                            $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
                            $scope.statistics.account_fee['elec'] = res.data.account_fees;
                            $scope.statistics.order_count['elec'] = res.data.order_cnts;
                            $scope.statistics.order_payment['elec'] = res.data.order_payments;
                            $scope.statistics.apply_fee['elec'] = res.data.apply_fees;
                            $scope.statistics.has_fee['elec'] = res.data.has_fees;
                        },function(res){
                            if(res.msg != ''){
                                DialogService.alert(res.msg)
                            }
                        })
                    }
                }
            })
            $scope.goDetail = function(id){
                $state.go('main.profitStation/list',{id:id})
            }
            //用户订单统计
            $scope.goOrder = function(id){
                $state.go('main.profitOrder/list',{id:id})
            }
            $scope.search = function(){
                var condition = {
                    created_st:$scope.info.created_st,
                    created_et:$scope.info.created_et,
                    system_id:$scope.role_type == 2?$scope.parent.elec_systemid:$scope.info.system_id,
                    role_id:4,
                    user_obj:$scope.info.user_obj,
                    order_by:$scope.info.order_by,
                    order:$scope.info.order,
                    offset:$scope.info.offset,
                    limit:$scope.info.limit,
                    total:$scope.info.total
                }
                ProfitService.search(condition).then(function(res){
                    $scope.elec_list = res.data.list
                    $scope.info.total = res.data.total
                    $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
                    $scope.statistics.account_fee['elec'] = res.data.account_fees;
                    $scope.statistics.order_count['elec'] = res.data.order_cnts;
                    $scope.statistics.order_payment['elec'] = res.data.order_payments;
                    $scope.statistics.apply_fee['elec'] = res.data.apply_fees;
                    $scope.statistics.has_fee['elec'] = res.data.has_fees;
                },function(res){
                    if(res.msg != ''){
                        DialogService.alert(res.msg)
                    }
                })
            }
            $scope.startPaging = function(){
                $scope.search()
            }
       }])
       .controller('OtherCtrl',['$scope','$state','$timeout','SystemUserService','ProfitService','DialogService',function($scope,$state,$timeout,SystemUserService,ProfitService,DialogService){
            $scope.role_type = ''
            $scope.info = {
                created_st:'',
                created_et:'',
                system_id:0,
                role_id:'',
                user_obj:{
                    id:'',
                    phone:''
                },
                order_by:'created_at',
                order:'desc',
                offset:0,
                limit:20,
                total:0,
                page:1,
                pageCnt:0,
                file_url:''
            }
            $scope.other_list = []
            $scope.$on('role_type',function(event,data){
                $scope.role_type = data
                if($scope.role_type == 1 || $scope.role_type == 0){
                    var condition = {
                        created_st:$scope.info.created_st,
                        created_et:$scope.info.created_et,
                        system_id:$scope.info.system_id,
                        role_id:5,
                        user_obj:$scope.info.user_obj,
                        order_by:$scope.info.order_by,
                        order:$scope.info.order,
                        offset:$scope.info.offset,
                        limit:$scope.info.limit,
                        total:$scope.info.total
                    }
                    ProfitService.search(condition).then(function(res){
                        console.log(res)
                        $scope.other_list = res.data.list
                        $scope.info.total = res.data.total
                        $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
                        $scope.statistics.account_fee['other'] = res.data.account_fees;
                        $scope.statistics.order_count['other'] = res.data.order_cnts;
                        $scope.statistics.order_payment['other'] = res.data.order_payments;
                        $scope.statistics.apply_fee['other'] = res.data.apply_fees;
                        $scope.statistics.has_fee['other'] = res.data.has_fees;
                    },function(res){
                        if(res.msg != ''){
                            DialogService.alert(res.msg)
                        }
                    })
                }
                //role_type等于2，先判断other_list是否为空，不为空则执行
                if($scope.role_type ==2 ){
                    if($scope.system_user.other_account.length != 0){
                        var condition = {
                            created_st:$scope.info.created_st,
                            created_et:$scope.info.created_et,
                            system_id:$scope.parent.other_systemid,
                            role_id:5,
                            user_obj:$scope.info.user_obj,
                            order_by:$scope.info.order_by,
                            order:$scope.info.order,
                            offset:$scope.info.offset,
                            limit:$scope.info.limit,
                            total:$scope.info.total
                        }
                        ProfitService.search(condition).then(function(res){
                            console.log(res)
                            $scope.other_list = res.data.list
                            $scope.info.total = res.data.total
                            $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
                            $scope.statistics.account_fee['other'] = res.data.account_fees;
                            $scope.statistics.order_count['other'] = res.data.order_cnts;
                            $scope.statistics.order_payment['other'] = res.data.order_payments;
                            $scope.statistics.apply_fee['other'] = res.data.apply_fees;
                            $scope.statistics.has_fee['other'] = res.data.has_fees;
                        },function(res){
                            if(res.msg != ''){
                                DialogService.alert(res.msg)
                            }
                        })
                    }
                }
            })
            $scope.goDetail = function(id){
                $state.go('main.profitStation/list',{id:id})
            }
            //用户订单统计
            $scope.goOrder = function(id){
                $state.go('main.profitOrder/list',{id:id})
            }
            $scope.search = function(){
                var condition = {
                   created_st:$scope.info.created_st,
                   created_et:$scope.info.created_et,
                   system_id:$scope.role_type == 2? $scope.parent.other_systemid : $scope.info.system_id,
                   role_id:5,
                   user_obj:$scope.info.user_obj,
                   order_by:$scope.info.order_by,
                   order:$scope.info.order,
                   offset:$scope.info.offset,
                   limit:$scope.info.limit,
                   total:$scope.info.total
               }
                ProfitService.search(condition).then(function(res){
                    console.log(res)
                    $scope.other_list = res.data.list
                    $scope.info.total = res.data.total
                    $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
                    $scope.statistics.account_fee['other'] = res.data.account_fees;
                    $scope.statistics.order_count['other'] = res.data.order_cnts;
                    $scope.statistics.order_payment['other'] = res.data.order_payments;
                    $scope.statistics.apply_fee['other'] = res.data.apply_fees;
                    $scope.statistics.has_fee['other'] = res.data.has_fees;
                },function(res){
                   if(res.msg != ''){
                       DialogService.alert(res.msg)
                   }
                })
            }
            $scope.startPaging = function(){
                $scope.search()
            }
       }])

