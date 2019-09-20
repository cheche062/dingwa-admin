angular.module('EnterprisesShowController',['CommonService', 'EnterpriseService'])
    .controller('EnterprisesShowCtrl',['$scope', '$state', '$timeout', 'EnterpriseService','DialogService','DictService',
        function($scope, $state, $timeout, EnterpriseService, DialogService,DictService) {
            $scope.info = {
                enter_obj:{
                    name:'',
                    id:''
                },
                province_id:'',
                city_id:'',
                district_id:'',
                parent_name:'',
                parent_id:'',
                code:'',
                level:'0',
                data:'',
                list:[],
                total: 0,
                pageCnt: 0,
                page: 1,
                offset: 0,
                limit: 20,
                order_by:'created_at',
                order:'desc'
            }

            $scope.enterprise = {
                name:'',
                id:''
            }

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

            var listInfo = $scope.info;
            const fields = '/enterprise/list';

            // setPageView()
            function setPageView() {
                var boxHeight = $('.dw-main-container').height()
                var pageNavHeight = $('.dw-page-nav').height()+30
                var pageFilterHeight = $('.dw-page-filter').height()+40
                var H = parseInt(boxHeight)  - parseInt(pageNavHeight)  -parseInt(pageFilterHeight)
                $('.dw-page-detail-container').css('height',H + 'px')
            }

            //公司树状
            $scope.tree = true;
            init();
            function init(){
                let url = window.location.href;
                ut= url.split("#");
                url=ut[1];

                if((sessionStorage.getItem(url)) && (url == fields)){
                    var session = JSON.parse(sessionStorage.getItem(url));
                    console.log(session);
                    $scope.enterprise = session.enter_obj;
                    $scope.provinceOption.id = session.province_id;
                    $scope.cityOption.id = session.city_id;
                    $scope.districtOption.id = session.district_id;
                    $scope.info.parent_id = session.parent_id;
                    $scope.info.code = session.code;
                    $scope.info.level = session.level;
                    $scope.info.data = session.data;
                    $scope.info.order_by = session.order_by;
                    $scope.info.order = session.order;
                    $scope.info.offset = session.offset;
                    $scope.info.limit = session.limit;

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

                    if((session.enter_obj.id!=0)||(session.province_id!=0)||(session.parent_id!=0)||(session.code!=0)||(session.level!=0)){
                        $scope.tree = false;
                        $scope.info.page = 1;
                        $scope.info.offset = 0;
                    }
                    else {
                        searchEnterprise()
                    }
                }
                else {
                    //获取当前系统用户下的公司列表
                    searchEnterprise()
                }
                search();
            }
            function searchEnterprise(){
                var condition = {
                    type:'enterprise',
                    query:'',
                    limit:'',
                    offset:0
                }
                DictService.search(condition).then(function(res){
                    // console.log(res)
                    $scope.treeEnterprises = res
                    treelist()
                },function(err){

                })
            }
            $scope.searchList = function(){
                search();
                $scope.tree = false;
                $scope.info.page = 1;
                $scope.info.offset = 0;
            }
            function treelist(){
                    //不管是几级公司
                        $scope.level1 = [];
                        $scope.level2 = [];
                        $scope.level3 = [];
                        $scope.level4 = [];
                        $scope.treeEnterprise = [];
                        if($scope.treeEnterprises != 0){
                            for(var i =0;i<$scope.treeEnterprises.length;i++){
                                if($scope.treeEnterprises[i].level == 1){
                                    $scope.level1.push($scope.treeEnterprises[i])
                                }else if($scope.treeEnterprises[i].level ==2){
                                    $scope.level2.push($scope.treeEnterprises[i])
                                }else if($scope.treeEnterprises[i].level ==3){
                                    $scope.level3.push($scope.treeEnterprises[i])
                                }else{
                                    $scope.level4.push($scope.treeEnterprises[i])
                                }
                            }
                        }
                        //当前登录系统用户为1级时
                        if($scope.level1.length > 0){
                            for(var j in $scope.level1){
                                $scope.level1[j].child = []
                                $scope.treeEnterprise.push($scope.level1[j])
                            }
                            if($scope.level2.length > 0 ){
                                for(var k in $scope.level2){
                                    $scope.level2[k].child = []
                                    $scope.treeEnterprise[0].child.push($scope.level2[k])
                                }
                            }
                            if($scope.level3.length > 0){
                                for(var l in $scope.treeEnterprise[0].child){
                                    for(var m in $scope.level3){
                                        $scope.level3[m].child = []
                                        if($scope.level3[m].parent_id == $scope.treeEnterprise[0].child[l].id){
                                            $scope.treeEnterprise[0].child[l].child.push($scope.level3[m])
                                        }
                                    }
                                }
                                if($scope.level4.length > 0){
                                    for(var o in $scope.level3){
                                        for(var n in $scope.level4){
                                            if($scope.level4[n].parent_id == $scope.level3[o].id){
                                                $scope.level3[o].child.push($scope.level4[n])
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        //当前登录系统用户为2级时
                        if($scope.level1.length == 0){
                            if($scope.level2.length > 0){
                                for(var i in $scope.level2){
                                    $scope.level2[i].child = []
                                    $scope.treeEnterprise.push($scope.level2[i])
                                }
                                if($scope.level3.length > 0){
                                    for(var j in $scope.treeEnterprise){
                                        for(var k in $scope.level3){
                                            $scope.level3[k].child = []
                                            if($scope.level3[k].parent_id == $scope.treeEnterprise[j].id){
                                                $scope.treeEnterprise[j].child.push($scope.level3[k])
                                                continue
                                            }
                                        }
                                    }
                                    if($scope.level4.length > 0){
                                        for(var o in $scope.level3){
                                            for(var n in $scope.level4){
                                                if($scope.level4[n].parent_id == $scope.level3[o].id){
                                                    $scope.level3[o].child.push($scope.level4[n])
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            //当前登录系统用户为3级时
                            if($scope.level2.length == 0){
                                if($scope.level3.length > 0){
                                    for(var i in $scope.level3){
                                        $scope.level3[i].child = []
                                        $scope.treeEnterprise.push($scope.level3[i])
                                    }
                                    if($scope.level4.length > 0){
                                        for(var o in $scope.level3){
                                            for(var n in $scope.level4){
                                                if($scope.level4[n].parent_id == $scope.level3[o].id){
                                                    $scope.level3[o].child.push($scope.level4[n])
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    console.log($scope.treeEnterprise)
            }
            // search enterprise list
            function search() {
                var condition = {
                    enter_obj:$scope.enterprise,
                    province_id:$scope.provinceOption.id,
                    city_id:$scope.cityOption.id,
                    district_id:$scope.districtOption.id,
                    parent_id:$scope.info.parent_id,
                    code:$scope.info.code,
                    level:$scope.info.level,
                    data:$scope.info.data,
                    order_by:$scope.info.order_by,
                    order:$scope.info.order,
                    offset:$scope.info.offset,
                    limit:$scope.info.limit
                }
                EnterpriseService.Search(condition).then(function(data) {
                    if ( data.code !== 0 ) {
                        if ( data.msg == '') {
                            DialogService.alert('请求错误，请联系管理员')
                        } else {
                            DialogService.alert(data.msg)
                        }
                    } else {
                        // let url = window.location.href;
                        // ut= url.split("#");
                        // url=ut[0];
                        // url = url+'#/'+$state.current.url;

                        window.sessionStorage.setItem(fields, JSON.stringify(condition));
                        $scope.info.list = data.data.list,
                        $scope.info.total = data.data.total,
                        $scope.info.pageCnt = Math.ceil($scope.info.total/$scope.info.limit)
                    }
                })

            }
            $scope.startPaging = function(){
                search()
            }
            //跳转公司详情
            $scope.goDetail = function(id){
                var id = id
                $state.go('main.enterprise/show',{id:id})
            }
            $scope.goEdit = function(id){
                var id = id
                $state.go('main.enterprise/edit',{id:id})
            }
            //删除公司
            $scope.delete = function(id){
                DialogService.confirm('确认要删除吗',function(){
                    var condition = {
                        id:id
                    }
                    EnterpriseService.Delete(condition).then(function(res){
                        DialogService.alert('删除成功')
                        search()
                    },function(code){})
                })
            }
        }
    ])
