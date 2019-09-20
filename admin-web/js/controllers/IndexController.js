angular.module('IndexController',['CommonService','SystemUserService','LoginService', "headerModule"])
       .controller('IndexCtrl',['$scope','$rootScope','$state','$timeout','SystemUserService','LoginService','ConfigService','IndexService',
        function($scope,$rootScope,$state,$timeout,SystemUserService,LoginService,ConfigService,IndexService){
            var storage = window.localStorage
            $scope.info = {

            }
            $scope.frog_data = null
            $scope.my_data = null
            setSiderMenu()
            function setSiderMenu(){
                $timeout(function(){
                    if(storage.UserAuth){
                        $scope.userAuth = JSON.parse(storage.UserAuth)
                        authId()
                    }
                },500)
            }
            //封装权限id
            // authId()
            function authId(){
                var id_arr = []
                if(storage.basicAuth){
                    $scope.basicAuth = JSON.parse(storage.basicAuth)
                    for(var i in $scope.basicAuth){
                        id_arr.push($scope.basicAuth[i].module_id)
                    }
                    $scope.userAuthId = id_arr
                }
                console.log($scope.userAuthId)
                //判断有没有三级菜单，如果有等三级菜单循环完，没有只用等二级菜单循环完
                var has_Three = false
                for(var i in $scope.basicAuth){
                    if($scope.basicAuth[i].level == 3){
                        has_Three = true
                        break
                    }
                }
                if(has_Three){
                    hasThree()
                }else{
                    hasTwo()
                }
            }
            init()
            function init(){
                var condition = {
                    type:1
                }
                IndexService.search(condition).then(function(res){
                    console.log(res)
                    $scope.frog_data = res.data
                    $scope.frog_data.quantity_total = $scope.frog_data.quantity_total*20
                    $scope.frog_data.duration_total = $scope.frog_data.duration_total*20
                    $scope.frog_data.charge_total = $scope.frog_data.charge_total*20
                    $scope.frog_data.station_total = $scope.frog_data.station_total*20
                    $scope.frog_data.device_total = $scope.frog_data.device_total*20
                    $scope.frog_data.port_total = $scope.frog_data.port_total*20
                    var arr = []
                    var quantity_total = (Math.ceil($scope.frog_data.quantity_total/1000)).toString()
                    console.log(quantity_total)
                    for(var i =0;i<quantity_total.length;i++){
                        arr.push(quantity_total[i])
                    }
                    $scope.frog_data.quantity_total = arr
                })
                // var condition1 = {
                //     type:2
                // }
                // IndexService.search(condition1).then(function(res){
                //     console.log(res)
                //     $scope.my_data = res.data
                //     var arr = []
                //     var quantity_total = (Math.ceil($scope.my_data.quantity_total/1000)).toString()
                //     for(var i =0;i<quantity_total.length;i++){
                //         arr.push(quantity_total[i])
                //     }
                //     console.log(arr)
                //     $scope.my_data.quantity_total = arr
                // })
            }
                function hasThree(){
                    $scope.$on('repeatEnd',function(){
                        // $("#menu").metisMenu();
                            $("#menu").metisMenu({
                                toggle: true,
                                doubleTapToGo: false,
                                preventDefault: true,
                                activeClass: 'active',
                                collapseClass: 'collapse',
                                collapseInClass: 'in',
                                collapsingClass: 'collapsing',
                                onTransitionStart: false,
                                onTransitionEnd: false
                            });
                            $('.second_level li').on('click',function(e){
                                if($(this).find('ul').length>0){
                                    
                                }else{
                                    $('.second_level li').removeClass('sider_active')
                                    $(this).addClass('sider_active')
                                }
                            })
                            //一级菜单点击小箭头折叠展开
                            $('.first_level_a').on('click',function(){
                                if($(this).next('.second_level').attr('aria-expanded') == 'true'){
                                    $('.first_level_icon').removeClass('icon-arrow-down')
                                    $('.first_level_icon').addClass('icon-arrow-right')
                                    $(this).children('.first_level_icon').removeClass('icon-arrow-down')
                                    $(this).children('.first_level_icon').addClass('icon-arrow-right')
                                }
                                if($(this).next('.second_level').attr('aria-expanded') == 'false'){
                                    $('.first_level_icon').removeClass('icon-arrow-down')
                                    $('.first_level_icon').addClass('icon-arrow-right')
                                    $(this).children('.first_level_icon').removeClass('icon-arrow-right')
                                    $(this).children('.first_level_icon').addClass('icon-arrow-down')
                                }
                            })
                            //有三级菜单的二级菜单点击小箭折叠展开
                            $('.third_level_a').on('click',function(){
                                if($(this).parent().find('.third_level').attr('aria-expanded') == 'true'){
                                    $(this).parent().find('.second_level_icon').removeClass('icon-arrow-down')
                                    $(this).parent().find('.second_level_icon').addClass('icon-arrow-right')
                                }else{
                                    $(this).parent().find('.second_level_icon').removeClass('icon-arrow-right')
                                    $(this).parent().find('.second_level_icon').addClass('icon-arrow-down')
                                }
                            })
                    })
                    $scope.$on('repeatEndThird',function(){
                        //默认一级菜单折叠,只展示第一个一级菜单,否则侧边栏过长
                        $('.first_level').removeClass('active');
                        $('.first_level:first').addClass('active');
                        $('.first_level_icon').removeClass('icon-arrow-down')
                        $('.first_level_icon').addClass('icon-arrow-right')
                        $('.first_level:first').find('.first_level_icon').removeClass('icon-arrow-right');
                        $('.first_level:first').find('.first_level_icon').addClass('icon-arrow-down');
                        $('.second_level li').on('click',function(e){
                            if($(this).find('ul').length>0){
                                
                            }else{
                                $('.second_level li').removeClass('sider_active')
                                $(this).addClass('sider_active')
                            }
                        })
                    })            
                }
                function hasTwo(){
                    $scope.$on('repeatEndThird',function(){
                        $("#menu").metisMenu();
                            $('.second_level li').on('click',function(e){
                                if($(this).find('ul').length>0){
                                    
                                }else{
                                    $('.second_level li').removeClass('sider_active')
                                    $(this).addClass('sider_active')
                                }
                            })
                            //一级菜单点击小箭头折叠展开
                            $('.first_level_a').on('click',function(){
                                if($(this).next('.second_level').attr('aria-expanded') == 'true'){
                                    $('.first_level_icon').removeClass('icon-arrow-down')
                                    $('.first_level_icon').addClass('icon-arrow-right')
                                    $(this).children('.first_level_icon').removeClass('icon-arrow-down')
                                    $(this).children('.first_level_icon').addClass('icon-arrow-right')
                                }
                                if($(this).next('.second_level').attr('aria-expanded') == 'false'){
                                    $('.first_level_icon').removeClass('icon-arrow-down')
                                    $('.first_level_icon').addClass('icon-arrow-right')
                                    $(this).children('.first_level_icon').removeClass('icon-arrow-right')
                                    $(this).children('.first_level_icon').addClass('icon-arrow-down')
                                }
                            })
                            //有三级菜单的二级菜单点击小箭折叠展开
                            $('.third_level_a').on('click',function(){
                                if($(this).parent().find('.third_level').attr('aria-expanded') == 'true'){
                                    $(this).parent().find('.second_level_icon').removeClass('icon-arrow-down')
                                    $(this).parent().find('.second_level_icon').addClass('icon-arrow-right')
                                }else{
                                    $(this).parent().find('.second_level_icon').removeClass('icon-arrow-right')
                                    $(this).parent().find('.second_level_icon').addClass('icon-arrow-down')
                                }
                            })
                    })
                }
                SystemUserService.GetCurrent().then(function(res){
                    console.log(res)
                    window.localStorage.setItem('EnterpriseLevel',res.data.enterprise_level)
                    if(res.data != ''){
                        $rootScope.login_name = res.data.name
                        // 修改：登录人名下的公司
                        $rootScope.enterprise_name=res.data.enterprise_name;
                    }
                })

            
                // 退出
                $scope.loginOut = function(){
                    var condition = {}
                    LoginService.Logout(condition).then(function(data){
                        window.localStorage.removeItem('UserAuth')
                        window.localStorage.removeItem('basicAuth')
                        $state.go("login",{},{
                            reload:true
                        })
                    })
                }

                //修改系统用户密码
                $scope.edit_pwd = function(){
                    $state.go('main.system/pwd',{},{
                        reload:'main.system/pwd'
                    })
                }
                //controller销毁时传递
                $scope.$on('$destroy',function(){
                    console.log('销毁')
                    $scope.$emit('headerColor','')
                })
       }])