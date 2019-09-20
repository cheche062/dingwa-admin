angular.module("Directive",["CommonService"])
// 模糊查询
.directive("fuzzySearch",[function($scope) {
    return {
        restrict:'AE',
        trabsclude:true,
        templateUrl:'templates/directives/directive-fuzzy-search.html',
        scope: {
            type: '@',
            query: '=',
            queryid: '=',
        },
        link: function($scope, attrs, element) {
        },
        controller: function($scope, DictService){
            switch ($scope.type) {
                case "enterprise":
                    $scope.placeholder = "公司名称";
                    break;
                case "station":
                    $scope.placeholder = "站点名称";
                    break;
                case "user":
                    $scope.placeholder = "用户";
                    break;
                case "usergroup":
                    $scope.placeholder = "用户组";
                    break;
                case "stationgroup":
                    $scope.placeholder = "站点组";
                    break;
                case "device":
                    $scope.placeholder = "设备号";
                    break;
                case "systemuser":
                    $scope.placeholder = "系统用户名";
                    break;
                case "systemgroup":
                    $scope.placeholder = "系统用户组名称";
                    break;
                case "score_cards":
                    $scope.placeholder = "批次备注";
                    break;
                case "systemuserPhone":
                    $scope.placeholder = '手机号';
                    break;
                case "port":
                    $scope.placeholder = '端口号';
                    break;
                case "packs":
                    $scope.placeholder = '包名';
                    break;
                case "card":
                    $scope.placeholder = '卡号';
                    break;
            }
            $scope.dropdownDatas = [];
            $scope.fuzzySearch = function() {
                $scope.queryid = '';
                console.log($scope.queryid)
                //用户可能点击下拉功能后直接输入，此时应让弹出框隐藏掉
                $scope.showDropdownFlag = false;
                if ($scope.query === '') {
                    $scope.showDropdownFlag = false;
                    $scope.queryid = '';
                    return false;
                };
                $scope.showDropdownFlag = true;
                if($scope.type != 'systemuserPhone'){
                    var condition = {
                        type: $scope.type,
                        query: $scope.query,
                    };
                    DictService.search(condition).then(function(data) {
                        $scope.dropdownDatas = data;
                        $scope.showDropdownFlag = true;
                    });
                }else{
                    var condition = {
                        type:'systemuser',
                        phone: $scope.query,
                    };
                    DictService.search(condition).then(function(data) {
                        $scope.dropdownDatas = data;
                        $scope.showDropdownFlag = true;
                    });
                }
            };
            $scope.showDropdownFlag = false;
            if($scope.type != 'user' && $scope.type != 'systemuserPhone'){
                $scope.clickDropdownItem = function(item) {
                    console.log(item)
                    $scope.query = item.name
                    $scope.queryid = item.id

                };
            }
            if($scope.type == 'user'){
                $scope.clickDropdownItem = function(item) {
                    $scope.query = item.phone
                    $scope.queryid = item.id
                }
            }
            if($scope.type == 'systemuserPhone'){
                $scope.clickDropdownItem = function(item) {
                    $scope.query = item.phone
                    $scope.queryid = item.id
                }
            }
            $(document).click(function() {
                $scope.$apply(function() {
                    $scope.showDropdownFlag = false;
                });
            });
        }
    }
}])
.directive("fuzzySearchProfit",[function($scope) {
    return {
        restrict:'AE',
        trabsclude:true,
        templateUrl:'templates/directives/directive-fuzzy-search-profit.html',
        scope: {
            type: '@',
            query: '=',
            queryid: '=',
        },
        link: function($scope, attrs, element) {
        },
        controller: function($scope, DictService){
            $scope.placeholder = "手机号";
            $scope.dropdownDatas = [];
            $scope.fuzzySearch = function() {
                $scope.queryid = '';
                console.log($scope.queryid)
                //用户可能点击下拉功能后直接输入，此时应让弹出框隐藏掉
                $scope.showDropdownFlag = false;
                if ($scope.query === '') {
                    $scope.showDropdownFlag = false;
                    $scope.queryid = '';
                    return false;
                };
                $scope.showDropdownFlag = true;
                var condition = {
                    type: $scope.type,
                    phone: $scope.query,
                    user_type:2
                };
                DictService.search(condition).then(function(data) {
                    $scope.dropdownDatas = data;
                    $scope.showDropdownFlag = true;
                });
            };
            $scope.showDropdownFlag = false;
            $scope.clickDropdownItem = function(item) {
                $scope.query = item.phone
                $scope.queryid = item.id
            };
            $(document).click(function() {
                $scope.$apply(function() {
                    $scope.showDropdownFlag = false;
                });
            });
        }
    }
}])
// .directive("fuzzySearchActive",[function($scope) {
//     return {
//         restrict:'AE',
//         trabsclude:true,
//         templateUrl:'templates/directives/directive-fuzzy-search-active.html',
//         scope: {
//             type: '@',
//             query: '=',
//             activity: '@',
//         },
//         link: function($scope, attrs, element) {

//         },
//         controller: function($scope, DictService){
//             switch($scope.type){
//                 case "staton_coupon":
//                     $scope.placeholder = '站点'
//                     break
//             }
//             $scope.dropdownDatas = [];
//             $scope.fuzzySearch = function() {
//                 $scope.queryid = '';
//                 console.log($scope.queryid)
//                 //用户可能点击下拉功能后直接输入，此时应让弹出框隐藏掉
//                 $scope.showDropdownFlag = false;
//                 if ($scope.query === '') {
//                     $scope.showDropdownFlag = false;
//                     $scope.queryid = '';
//                     return false;
//                 };
//                 $scope.showDropdownFlag = true;
//                 var condition = {
//                     type: $scope.type,
//                     query: $scope.query,
//                     activity:$scope.activity
//                 };
//                 DictService.search(condition).then(function(data) {
//                     $scope.dropdownDatas = data;
//                     $scope.showDropdownFlag = true;
//                 });
//             };
//             $scope.showDropdownFlag = false;
//             $scope.clickDropdownItem = function(item) {
//                 $scope.query = item
//             };
//             $(document).click(function() {
//                 $scope.$apply(function() {
//                     $scope.showDropdownFlag = false;
//                 });
//             });
//         }
//     }
// }])
// 省市区三级联动
.directive('areaChoose',[function($scope,DictService) {
    return {
        restrict:'AEMC',
        transclude:true,
        templateUrl:"templates/directives/directive-area-choose.html",
        link: function(scope, ele, attrs, DictService) {

        },
        controller: function($scope, DictService) {
            $scope.provinces = [{
                id:0,
                name:'全部'
            }];
            $scope.cities = [{
                id:0,
                name:'全部'
            }]
            var condition = {
                type:"province",
                query:""
            }
            DictService.search(condition).then(function(data) {
                $scope.provinces = $scope.provinces.concat(data)
                // $scope.provinces = data
            },function(code) {});
            $scope.loadCityDict = function () {

                $scope.cities = [{
                    id: 0,
                    name: '全部'
                }];
                $scope.districts = [{
                    id: 0,
                    name: '全部'
                }];
                $scope.cityOption = {
                    id:0,
                    name:'全部'
                }
                $scope.districtOption = {
                    id:0,
                    name:'全部'
                }
                var condition = {
                    type:'city',
                    query:$scope.provinceOption.id
                }
                if($scope.provinceOption.id != 0) {
                    DictService.search(condition).then(function(data) {
                        $scope.cities = $scope.cities.concat(data)
                        // $scope.cities = data
                    },function(code) {})
                }
            };
            $scope.loadDistrictDict = function() {
                $scope.districts = [{
                    id:0,
                    name:'选择区县'
                }]
                $scope.districtOption = {
                    id:0,
                    name:'选择区县'
                }
                if( $scope.cityOption === null ) {
                    return false
                }
                var condition = {
                    type:'city',
                    query:$scope.cityOption.id
                }
                if($scope.cityOption.id != 0) {
                    DictService.search(condition).then(function(data) {
                        $scope.districts = $scope.districts.concat(data)
                        // $scope.districts = data
                    },function(code) {})
                } else {
                    $scope.districtOption = {
                        id:0,
                        name:'选择区县'
                    }
                }
            }
        }
    }
}])
//归属公司选择
.directive("chooseEnterprise", [function($scope,SystemUserService) {
    return {
        restrict: "AE",
        transclude: true,
        templateUrl: "templates/directives/directive-choose-enterprise.html",
        link: function() {
            //
        },
        controller: function($scope, $timeout, DictService,SystemUserService) {
            $scope.enterprises = []
            var condition = {
                type: "enterprise"
            };
            DictService.search(condition).then(function(data) {
                $scope.enterprises =  data
                console.log($scope.enterprises)
            }, function(code) {});
            $scope.cancle = function(){
                $scope.enterprise.parent_id = '';
                $('#ChooseEnterprise').modal('hide')
            }
            $scope.confirm = function(){
                console.log($scope.enterprise.parent_id)
                $('#ChooseEnterprise').modal('hide')
            }
        }
    };
}])
//公司添加编辑时归属公司
.directive("chooseEnterprise2", [function($scope,SystemUserService) {
    return {
        restrict: "AE",
        transclude: true,
        templateUrl: "templates/directives/directive-choose-enterprise.html",
        link: function() {
            //
        },
        controller: function($scope, $timeout, DictService,SystemUserService) {
            $scope.enterprises = []
            var condition = {
                type: "enterprise"
            };
            DictService.search(condition).then(function(data) {
                // $scope.enterprises =  data
                var arr = []
                for(var i in data){
                    if(data[i].level<3){
                        arr.push(data[i])
                    }
                }
                $scope.enterprises = arr
                console.log($scope.enterprises)
            }, function(code) {});
            $scope.cancle = function(){
                $scope.enterprise.parent_id = '';
                $('#ChooseEnterprise').modal('hide')
            }
            $scope.confirm = function(){
                console.log($scope.enterprise.parent_id)
                $('#ChooseEnterprise').modal('hide')
            }
        }
    };
}])
//添加卡时选择归属公司(筛选出3级公司)
.directive("chooseEnterprise3", [function($scope,SystemUserService) {
    return {
        restrict: "AE",
        transclude: true,
        templateUrl: "templates/directives/directive-choose-enterprise.html",
        link: function() {
            //
        },
        controller: function($scope, $timeout, DictService,SystemUserService) {
            $scope.enterprises = []
            var condition = {
                type: "enterprise"
            };
            DictService.search(condition).then(function(data) {
                // $scope.enterprises =  data
                var arr = []
                for(var i in data){
                    if(data[i].level == 3){
                        arr.push(data[i])
                    }
                }
                $scope.enterprises = arr
                console.log($scope.enterprises)
            }, function(code) {});
            $scope.cancle = function(){
                $scope.enterprise.parent_id = '';
                $('#ChooseEnterprise').modal('hide')
            }
            $scope.confirm = function(){
                console.log($scope.enterprise.parent_id)
                $('#ChooseEnterprise').modal('hide')
            }
        }
    };
}])
//归属站点选择
.directive("chooseStation", [function($scope,SystemUserService) {
    return {
        restrict: "AE",
        transclude: true,
        // scope:{
        //     'type':'@'
        // },
        templateUrl: "templates/directives/directive-choose-station.html",
        link: function() {
            //
        },
        controller: function($scope, $timeout, DictService,SystemUserService) {
            $scope.searchValue = '';
            $scope.enter_name = '';
            $scope.searchValueChange = function(){
                init();
            }
            $scope.enterValueChange = function(){
                init();
            }
            init()
            function init(){
                var condition = {
                    type: "station",
                    query: $scope.searchValue,
                    enter_name: $scope.enter_name
                };
                DictService.search(condition).then(function(res) {
                    $scope.stations = res
                    // console.log($scope.stations)
                }, function(code) {});
            }
            $scope.cancle = function(){
                console.log('清空站点id')
                $scope.station.station_id = '';
                $('#ChooseStation').modal('hide')
            }
            $scope.confirm = function(){
                $('#ChooseStation').modal('hide')
                console.log($scope.station.station_id)
            }
        }
    };
}])
//添加编辑站点归属公司
.directive("chooseEnterpriseStation", [function($scope,SystemUserService) {
    return {
        restrict: "AE",
        transclude: true,
        // scope:{
        //     'type':'@'
        // },
        templateUrl: "templates/directives/directive-choose-enterprise.html",
        link: function() {
            //
        },
        controller: function($scope, $timeout, DictService,SystemUserService) {
            $scope.enterprises = []
            var condition = {
                type: "enterprise"
            };
            DictService.search(condition).then(function(data) {
                console.log($scope.type)
                var arr = []
                for(var i =0;i<data.length;i++){
                    if(data[i].level>=3){
                        arr.push(data[i])
                    }
                }
                $scope.enterprises = arr
                console.log(arr)
                // $scope.enterprises =  data
                // console.log($scope.enterprises)
            }, function(code) {});
            $scope.cancle = function(){
                $scope.enterprise.parent_id = '';
                $('#ChooseEnterprise').modal('hide')
            }
            $scope.confirm = function(){
                $('#ChooseEnterprise').modal('hide')
            }
        }
    };
}])
//过滤系统用户组选择
.directive("filterSystemusergroup", [function($scope,SystemUserService) {
    return {
        restrict: "AE",
        transclude: true,
        templateUrl: "templates/directives/directive-choose-enterprise.html",
        link: function() {
            //
        },
        controller: function($scope, $timeout, DictService,SystemUserService) {
            $scope.enterprises = []

            var condition = {
                type: "enterprise"
            };
            DictService.search(condition).then(function(data) {
                $scope.enterprises =  data
            }, function(code) {});
            $scope.cancle = function(){
                $scope.enterprise.parent_id = '';
                $('#ChooseEnterprise').modal('hide')
            }

            $scope.confirm = function() {
                var condition = {
                    type:'systemgroup',
                    enterprise_id:$scope.enterprise.parent_id
                }
                DictService.search(condition).then(function(data) {
                    console.log(data)
                    $scope.filterSysGroup = data
                }, function(code) {});
            }
        }
    };
}])
//归属系统用户组选择
.directive("chooseSystemusergroup", [function($scope,SystemUserService) {
    return {
        restrict: "AE",
        transclude: true,
        templateUrl: "templates/directives/directive-choose-system-group.html",
        link: function() {
            //
        },
        controller: function($scope, $timeout, DictService,SystemUserService) {
            console.log($scope.filterSysGroup)
        }
    };
}])
//计费规则
.directive('feeDetail',[function($scope){
    return {
        restric:'AE',
        transclude:true,
        scope: true,
        templateUrl:"templates/directives/directive-fee-detail.html",
        controller:function($scope){
            // $scope.fees_confirm = function(){
            //     let keys = Object.keys($scope.fee_rules);
            //     $scope.fee_rules_info = "";
            //     if(keys) {
            //         for(keys in $scope.fee_rules) {
            //             $scope.fee_rules_info += keys+"小时/"+$scope.fee_rules[keys]+"元"+" ";
            //         }
            //     }else {
            //         $scope.fee_rules_info = "免费";
            //     }
            //     console.log($scope.fee_rules);
            //     console.log($scope.fee_rules_info);
            //     $('#ChooseFeeDetail').modal('hide')
            // }
        }
    }
}])
//电蛙账户选择
.directive('chooseFrog',[function($scope){
    return {
        restrict:'AEC',
        transclude:true,
        templateUrl:"templates/directives/directive-choose-frog.html",
        link:function(){

        },
        controller:function($scope){
            console.log($scope.type)
            console.log($scope.frogList)
        }

    }
}])
.directive('chooseRecommend',[function($scope){
    return{
        restrict:'AEC',
        transclude:true,
        templateUrl:"templates/directives/directive-choose-recommend.html",
        link:function(){

        },
        controller:function($scope){
            // $scope.cancle = function(){
            //     console.log(123)
            //     $('#Chooserecommend').modal('hide')
            // }
        }
    }
}])
.directive('chooseCopemate',[function($scope){
    return {
        restrict:'AEC',
        transclude:true,
        templateUrl:"templates/directives/directive-choose-compemate.html",
        link:function(){

        },
        controller:function($scope){
            // $scope.cancle = function(){
            //     $('Choosecompemate').modal('hide')
            // }
        }
    }
}])
.directive('chooseElec',[function($scope){
    return {
        restrict:'AEC',
        transclude:true,
        templateUrl:"templates/directives/directive-choose-elec.html",
        link:function(){

        },
        controller:function($scope){
            // $scope.cancle = function(){
            //     $('Chooseelec').modal('hide')
            // }
        }
    }
}])
.directive('chooseOther',[function($scope){
    return {
        restrict:'AEC',
        transclude:true,
        templateUrl:"templates/directives/directive-choose-other.html",
        link:function(){

        },
        controller:function($scope){
            // $scope.cancle = function(){
            //     $('Chooseother').modal('hide')
            // }
        }
    }
}])
.directive('pageNation', [function($scope) {
        return {
            restrict: 'AE',
            transclude: true,
            scope: {
                info: "=info",
                startPaging: "&"
            },
            templateUrl: 'templates/directives/page-directive-page-nation.html',
            link: function(scope, ele, attrs) {
                scope.pages = [];
                scope.$watch("info.pageCnt", function() {
                    console.log(scope.info.pageCnt);
                    pagesPush();
                });

                // pagesPush();
                function pagesPush() {
                    scope.pages = [];
                    if (scope.info.pageCnt <= 5) {
                        for (var i = 1; i <= scope.info.pageCnt; i++) {
                            scope.pages.push(i);
                        }
                    } else {
                        var from = scope.info.pageCnt - scope.info.page >= 2 ? scope.info.page - 2 : scope.info.pageCnt - 4;
                        from = from < 1 ? 1 : from;
                        for (var s = from; s < from + 5; s++) {
                            scope.pages.push(s);
                        }
                    }
                }
                scope.changeLimit = function(limit) {
                    scope.info.limit = limit;
                    scope.info.page = 1;
                    pagesPush();
                    scope.info.offset = 0;
                    scope.startPaging();
                };
                scope.first = function() {
                    scope.info.page = 1;
                    pagesPush();
                    scope.info.offset = 0;
                    scope.startPaging();
                };
                scope.prev = function() {
                    if (scope.info.page <= 1) return;
                    scope.info.page--;
                    pagesPush();
                    scope.info.offset -= scope.info.limit;
                    scope.startPaging();
                };
                scope.next = function() {
                    if (scope.info.page >= scope.info.pageCnt) return;
                    scope.info.page++;
                    pagesPush();
                    scope.info.offset += scope.info.limit;
                    scope.startPaging();
                };
                scope.last = function() {
                    scope.info.page = scope.info.pageCnt;
                    pagesPush();
                    scope.info.offset = (scope.info.page - 1) * scope.info.limit;
                    scope.startPaging();
                };
                scope.jump = function(page) {
                    scope.info.page = page;
                    pagesPush();
                    scope.info.offset = (scope.info.page - 1) * scope.info.limit;
                    scope.startPaging();
                };
            }
        };

}])
.directive("repeatFinish",[function($scope){
    return{
        restrict:"A",
        link:function(scope,element,attr){
            if(scope.$last == true){
                scope.$emit('repeatEnd')
            }
        }
    }
}])
.directive("repeatFinishThird",[function($scope){
    return{
        restrict:"A",
        link:function(scope,element,attr){
            if(scope.$last == true){
                scope.$emit('repeatEndThird')
            }
        }
    }
}])
// .directive("chooseAccount",[function($scope){
//     return{
//         restrict:"AEC",
//         transcluede:true,
//         scope:{
//             'type':'@',
//             'enterprise':'=',
//             'name':'=',
//         },
//         templateUrl:"templates/directives/directive-choose-account.html",
//         link:function(scope){
//             // console.log(scope.enterprise.parent_id)
//         },
//         controller:function($scope,DictService){
//             $scope.name = [1,2,3]
//             console.log($scope.enterprise)
//             $scope.$watch('enterprise.parent_id',function(){
//                 var condition = {
//                     type:'ledger_account',
//                     enterprise_id:$scope.enterprise.parent_id
//                 }
//                 DictService.search(condition).then(function(data){
//                     switch($scope.type){
//                         case 'frog':
//                             $scope.frogList  =  data.frog_account;
//                             break;
//                         case 'recommend':
//                             $scope.recommendList  =  data.recommend_account;
//                             break;
//                         case 'copemate':
//                             $scope.copemateList  =  data.copemate_account;
//                             break;
//                         case 'elec':
//                             $scope.elecList  =  data.elec_account;
//                             break;
//                         case 'other':
//                             $scope.otherList  =  data.other_account;
//                             break;
//                     }
//                 })
//             })
//             $scope.cancle = function(){
//                 $('#ChooseAccount').modal('hide')
//             }
//         }
//     }
// }])
