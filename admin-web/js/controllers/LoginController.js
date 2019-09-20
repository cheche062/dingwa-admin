angular.module('LoginController',['CommonService','LoginService','SystemUserService'])
.controller('LoginCtrl', ['$scope',"$rootScope", '$state', 'LoginService' ,'DialogService','SystemUserService',
    function ($scope, $rootScope,$state, LoginService,DialogService, SystemUserService) {
        var storage = window.localStorage;
        $scope.info = {
            name:'',
            pwd:''
        }

        // click 登录 button
        $scope.login = function () {

            if($scope.info.name === ''){
                DialogService.alert('请输入用户名');
                return false;
            }
            if($scope.info.pwd === ''){
                DialogService.alert('请输入密码')
            }

            console.log($scope.info.pwd)
            var base = new Base64();
            var date = new Date().getTime();
            var res = date + ':' + $scope.info.pwd
            var encodePwd = base.encode(res)
            var Pwd = ['system', encodePwd]
            $scope.info.pwd = Pwd.join(' ')

            var condition = {
                name:$scope.info.name,
                pwd:$scope.info.pwd
            }
            LoginService.Login(condition).then(function(data) {
                if(data.code !== 0){
                    if(data.msg == ''){
                        DialogService.alert('请求错误，请联系管理员')
                    }else {
                        DialogService.alert(data.data.msg)
                    }
                }else{
                    $scope.$emit('login',$scope.info.name)
                    var condition = {}
                    SystemUserService.GetCurrent(condition).then(function(data){
                        var rights = data.data.system_group_modules
                        storage.setItem('basicAuth', JSON.stringify(rights));

                        var level_one = []
                        var level_two = []
                        var level_three = []
                        var level_four = []
                        for(var i in rights){
                            if(rights[i].level == 1){
                                rights[i].child = []
                                rights[i].buttonRights = []
                                level_one.push(rights[i])
                            }else if(rights[i].level == 2){
                                rights[i].child = []
                                rights[i].frontRoute = null
                                rights[i].collapseName = null
                                rights[i].buttonRights = []
                                level_two.push(rights[i])
                            }else if(rights[i].level == 3) {
                                rights[i].child = []
                                rights[i].frontRoute = null
                                rights[i].buttonRights = []
                                level_three.push(rights[i])
                            }else if(rights[i].level == 4){
                                rights[i].child = []
                                rights[i].buttonRights = []
                                level_four.push(rights[i])
                            }
                        }
                        // for(var i in level_two){
                        //暂时不显示充电枪管理
                        //     if(level_two[i].key == 'ChargingStationModule'){
                        //         level_two.splice(i,1)
                        //     }
                        // }
                        for(var i in level_one){
                            for(var j in level_two){
                                if(level_two[j].parent_id == level_one[i].module_id){
                                    if(level_two[j].name == '公司管理'){
                                        level_two[j].frontRoute = 'main.enterprise/list'
                                    }else if(level_two[j].name == "站点管理"){
                                        level_two[j].frontRoute = 'main.station/list'
                                    }else if(level_two[j].name == '设备管理'){
                                        level_two[j].frontRoute = 'main.device/list'
                                    }else if(level_two[j].name == "用户管理"){
                                        level_two[j].frontRoute = 'main.user/list'
                                    }else if(level_two[j].name == "充电桩管理"){
                                        level_two[j].name = "充电枪管理"
                                        level_two[j].frontRoute = 'main.deviceport/list'
                                    }else if(level_two[j].name == "远程升级"){
                                        level_two[j].frontRoute = 'main.upgrade/package'
                                    }else if(level_two[j].name == "订单管理"){
                                        level_two[j].frontRoute = 'main.charge/orders'
                                    }else if(level_two[j].key == "BenefitModule"){
                                        level_two[j].frontRoute = 'main.profit/list'
                                    }else if(level_two[j].key == 'WithDrawMoneyModule'){
                                        level_two[j].frontRoute = 'main.withDraw/list'
                                    }else if(level_two[j].key == 'AdvertModule'){
                                        level_two[j].frontRoute = 'main.advert/show'
                                    }
                                    else if(level_two[j].key == 'ActiveModule'){
                                        level_two[j].frontRoute = 'main.active/station'
                                    }else if(level_two[j].name == '邮件提醒设置') {
                                        level_two[j].frontRoute = 'main.mails/notify'                                        
                                    }else if(level_two[j].key == 'CardMgt'){
                                        level_two[j].frontRoute = 'main.card/list'
                                    }else if(level_two[j].key == 'DataCenter'){
                                        level_two[j].frontRoute = 'main.data/center'
                                    }else if(level_two[j].key == 'simCardList'){
                                        level_two[j].frontRoute = 'main.simCard/list'
                                    }
                                    level_one[i].child.push(level_two[j])
                                }
                            }
                        }
                        for(var m in level_two){
                            for(var n in level_three){
                                if(level_three[n].parent_id == level_two[m].module_id){
                                    level_two[m].collapseName = "#"+level_two[m].key
                                    if(level_three[n].name == '系统用户管理'){
                                        level_three[n].frontRoute = 'main.systemuser/list'
                                    }else if(level_three[n].name == '系统用户组管理'){
                                        level_three[n].frontRoute = 'main.systemusergroup/list'
                                    }
                                    level_two[m].child.push(level_three[n])
                                }
                            }
                            for(var x in level_four) {
                                if(level_four[x].parent_id == level_two[m].module_id){
                                    level_two[m].buttonRights.push(level_four[x])
                                }
                            }

                            

                        }

                        for(var a in level_three){
                            for(var b in level_four){
                                if(level_four[b].parent_id == level_three[a].module_id){
                                    level_three[a].buttonRights.push(level_four[b])
                                }
                            }
                        }


                        storage.setItem('UserAuth', JSON.stringify(level_one));
                    })

                    $state.go('index', {}, {
                        reload: true
                    });
                }
            })
        }
        $scope.keyup = function(e){
            if(e.keyCode === 13){
                $scope.login()
            }
        }
    }
])
