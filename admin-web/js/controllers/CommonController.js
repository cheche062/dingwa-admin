angular.module('CommonController',['SystemUserService','LoginService','headerModule'])
.controller('MainCtrl', 
    ['$scope',"$rootScope", '$state', '$location', '$timeout','SystemUserService','LoginService',
    function($scope,$rootScope,$state, $location,$timeout,SystemUserService,LoginService) {
        var storage = window.localStorage;
        $scope.userAuth = null
        $scope.basicAuth = null
        $scope.userAuthId = [];
        //存储权限key值
        $scope.authKey = [];
        // setPageView()
        function setPageView() {
            var pageHeight = document.body.clientHeight
            var headerHeight = $('.dw-header').height()
            var pageNavHeight = $('.dw-page-nav').height()
            var pageFilterHeight = $('.dw-page-filter').height()
            var H = parseInt(pageHeight) - parseInt(headerHeight) - parseInt(pageNavHeight)  -parseInt(pageFilterHeight)
            $('.dw-page-detail-container').css('height',H + 'px')
        }
        setSiderMenu()
        function setSiderMenu(){
            $timeout(function(){
                if(storage.UserAuth){
                    $scope.userAuth = JSON.parse(storage.UserAuth)
                    authId()   
                }
                console.log($scope.userAuth)
            },500)
        }
        //封装权限id
        // authId()
        function authId(){
            var id_arr = [],
                key_arr = [];
            if(storage.basicAuth){
                $scope.basicAuth = JSON.parse(storage.basicAuth)
                for(var i in $scope.basicAuth){
                    id_arr.push($scope.basicAuth[i].module_id)
                    key_arr.push($scope.basicAuth[i].key)
                }
                $scope.userAuthId = id_arr
                $scope.authKey = key_arr;
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
        $scope.headerColor = '';
        //接收header-color
        $rootScope.$on('headerColor',function($event,data){
            $scope.headerColor = data;
        })
    }
])
.factory("myTestFactory1", function() {
    return "myTestFactory1";
})
