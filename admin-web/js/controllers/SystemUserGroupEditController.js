angular.module("SystemUserGroupEditController", ["CommonService", "SystemUserGroupService"])
.controller("SystemUserGroupEditCtrl", ["$scope","$stateParams", "$state", "SystemUserGroupService",
    function($scope, $stateParams, $state, SystemUserGroupService) {
        var storage = window.localStorage;
        var basicAuth = JSON.parse(storage.basicAuth)
        var basicAuthTwo = JSON.parse(storage.basicAuth)
        var choosedAuth = []
        $scope.edit = {
            name:'',
            remarks:'',
            enterprise_id:''
        }
        $scope.modules = []
        $scope.users = []
        $scope.enterprise = {
            parent_id: ""
        };

        $scope.$watch("enterprise.parent_id", function() {
            $scope.edit.enterprise_id = $scope.enterprise.parent_id;
        });
        $('#tablist a').click(function(e){
            e.preventDefault()
            $(this).tab('show')
        })
        
        get()
        function get(id){
            var condition = {
                id:$stateParams.id
            }
            SystemUserGroupService.Detail(condition).then(function(data){
                    $scope.edit.name = data.group.name
                    $scope.edit.enterprise_id = data.group.enterprise_id
                    $scope.edit.remarks = data.group.remarks
                    $scope.enterprise.parent_id  =$scope.edit.enterprise_id;

                    $scope.modules = data.modules
                    $scope.modules_render = JSON.parse(JSON.stringify(data.modules))
                    $scope.users = data.users
                    formatRightsHcf($scope.modules_render)
                    // formatRights($scope.modules)
            })
        }
        // 重新封装权限
        function formatRightsHcf(arr){
            var rights = arr

            var level_one = []
            var level_two = []
            var level_three = []
            var level_four = []

            for(var i in arr){
                if(arr[i].level == 1){
                    level_one.push(arr[i])
                }
                if(arr[i].level ==2 ){
                    level_two.push(arr[i])
                }
                if(arr[i].level ==3 ){
                    level_three.push(arr[i])
                }
                if(arr[i].level ==4 ){
                    level_four.push(arr[i])
                }
            }
            $scope.level_one = level_one
            $scope.level_two = level_two
            $scope.level_three = level_three
            $scope.level_four = level_four
            //各级权限找到父子级
            for(var i in $scope.level_two){
                if($scope.level_two[i].name == '充电桩管理'){
                    $scope.level_two[i].name = '充电枪管理'
                }
                $scope.level_two[i].child = []
                for(var j in $scope.level_three){
                    if($scope.level_three[j].parent_id == $scope.level_two[i].module_id){
                        $scope.level_two[i].child.push($scope.level_three[j])
                    }
                }
                for(var j in $scope.level_four){
                    if($scope.level_four[j].parent_id == $scope.level_two[i].module_id){
                        $scope.level_two[i].child.push($scope.level_four[j])
                    }
                }
            }
            for(var i in $scope.level_two){
                for(var k in $scope.level_two[i].child){
                    $scope.level_two[i].child[k].child = []
                    for(var j in $scope.level_four){
                        if($scope.level_four[j].parent_id == $scope.level_two[i].child[k].module_id){
                            $scope.level_two[i].child[k].child.push($scope.level_four[j])
                        }
                    }
                }
            }
            for(var i in $scope.level_one){
                $scope.level_one[i].child= []
                for(var j in $scope.level_two){
                    if($scope.level_two[j].parent_id == $scope.level_one[i].module_id){
                        $scope.level_one[i].child.push($scope.level_two[j])
                    }
                }
            }
            console.log($scope.level_one)
        }
        function formatRights(array){
            for(var a in arry){
                for(var b in basicAuth){
                    if(arry[a].id == basicAuth[b].id && arry[a].has_privilege){
                        basicAuth[b].checked = true
                    }
                }
            }
            var rights = basicAuth
            var rights = array

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

            for(var i in level_one){
                for(var j in level_two){
                    if(level_two[j].parent_id == level_one[i].id){
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
                        }else if(level_two[j].name == '邮箱提醒设置') {
                            level_two[j].frontRoute = 'main.mails/notify'
                        }
                        // if(level_two[j].name == '公司管理'){
                        //     level_two[j].frontRoute = 'main.enterprise/list'
                        // }else if(level_two[j].name == "站点管理"){
                        //     level_two[j].frontRoute = 'main.station/list'
                        // }else if(level_two[j].name == '设备管理'){
                        //     level_two[j].frontRoute = 'main.device/list'
                        // }else if(level_two[j].name == "用户管理"){
                        //     level_two[j].frontRoute = 'main.user/list'
                        // }else if(level_two[j].name == "充电桩管理"){
                        //     level_two[j].name = "充电枪管理"
                        //     level_two[j].frontRoute = 'main.deviceport/list'
                        // }else if(level_two[j].name == "远程升级"){
                        //     level_two[j].frontRoute = 'main.upgrade/package'
                        // }else if(level_two[j].name == "订单管理"){
                        //     level_two[j].frontRoute = 'main.charge/orders'
                        // }else if(level_two[j].key == "BenefitModule"){
                        //     level_two[j].frontRoute = 'main.profit/list'
                        // }
                        level_one[i].child.push(level_two[j])
                    }
                }
            }
            for(var m in level_two){
                for(var n in level_three){
                    if(level_three[n].parent_id == level_two[m].id){
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
                    if(level_four[x].parent_id == level_two[m].id){
                        level_two[m].buttonRights.push(level_four[x])
                    }
                }
            }

            for(var a in level_three){
                for(var b in level_four){
                    if(level_four[b].parent_id == level_three[a].id){
                        level_three[a].buttonRights.push(level_four[b])
                    }
                }
            }
            $scope.userAuth = level_one
            console.log($scope.userAuth)
        }
        $scope.firstChange = function(x){
            console.log(x)
            if(x.has_privilege){
                x.has_privilege = true
                for(var i in x.child){
                    x.child[i].has_privilege = true
                    for(var j in x.child[i].child){
                        x.child[i].child[j].has_privilege = true
                        if(x.child[i].child[j].child.length > 0){
                            for(var k in x.child[i].child[j].child){
                                x.child[i].child[j].child[k].has_privilege = true
                            }
                        }
                    }
                }
            }else{
                x.has_privilege = false
                for(var i in x.child){
                    x.child[i].has_privilege = false
                    for(var j in x.child[i].child){
                        x.child[i].child[j].has_privilege = false
                        if(x.child[i].child[j].child.length > 0){
                            for(var k in x.child[i].child[j].child){
                                x.child[i].child[j].child[k].has_privilege = false
                            }
                        }
                    }
                }
            }
        }
        $scope.secondChange = function(x){
            console.log(x)
            if(!x.has_privilege){
                x.has_privilege = false
                for(var i in x.child){
                    x.child[i].has_privilege = false
                    for(var j in x.child[i].child){
                        x.child[i].child[j].has_privilege = false
                    }
                }
            }else{
                x.has_privilege = true
                for(var m in $scope.level_one){
                    if(x.parent_id == $scope.level_one[m].module_id){
                        x.has_privilege = true
                        $scope.level_one[m].has_privilege = true
                    }
                }
                for(var i in x.child){
                    x.child[i].has_privilege = true
                    for(var j in x.child[i].child){
                        x.child[i].child[j].has_privilege = true
                    }
                }
            }
        }

        $scope.thirdChange = function(x){
            console.log(x)
            if(!x.has_privilege){
                x.has_privilege = false

            }else{
                x.has_privilege = true
                for(var i in $scope.level_one){
                    for(var j in $scope.level_one[i].child){
                        if(x.parent_id == $scope.level_one[i].child[j].module_id){
                            $scope.level_one[i].has_privilege = true
                            $scope.level_one[i].child[j].has_privilege = true
                        }
                    }
                }
                if(x.child.length > 0){
                    for(var i in x.child){
                        x.child[i].has_privilege = true
                    }
                }
            }
        }
        $scope.forthChange = function(x){
            if(x.has_privilege){
                x.has_privilege = true
                for(var i in $scope.level_three){
                    if(x.parent_id == $scope.level_three[i].module_id){
                        $scope.level_three[i].has_privilege = true
                    }
                }
                
            }else{
                x.has_privilege = false
            }
        }

        $scope.update =  function(){
            // var level_one = []
            // var level_two =[]
            // var level_three = []
            // var level_four = []
            // for(var i in $scope.userAuth) {
            //     // 判断二级菜单是否存在
            //     if($scope.userAuth[i].child.length != 0) {
            //         // 存在则遍历二级菜单
            //         for(var j in $scope.userAuth[i].child){
            //             // 判断三级菜单是否存在
            //             if($scope.userAuth[i].child[j].child.length != 0){
            //                 // 遍历三级菜单
            //                 for(var m in $scope.userAuth[i].child[j].child){
            //                     // 判断三级菜单是否存在按钮权限
            //                     if($scope.userAuth[i].child[j].child[m].buttonRights.length != 0) {
            //                         // 遍历三级菜单的按钮权限
            //                         for(var p in $scope.userAuth[i].child[j].child[m].buttonRights){
            //                             if($scope.userAuth[i].child[j].child[m].buttonRights[p].checked){
            //                                 for(var y in basicAuth){
            //                                     if($scope.userAuth[i].child[j].child[m].buttonRights[p].id = basicAuth[y].id){
            //                                         basicAuth[y].checked = true
            //                                     }
            //                                 }
            //                             }
            //                         }
            //                     }
            //                 }
            //             }
            //             //判断二级菜单对应的按钮权限是否存在
            //             if($scope.userAuth[i].child[j].buttonRights.length != 0){
            //                 // 遍历二级菜单的按钮权限
            //                 for(var n in $scope.userAuth[i].child[j].buttonRights){
            //                     if($scope.userAuth[i].child[j].buttonRights[n].checked){
            //                         for(var x in basicAuth){
            //                             if($scope.userAuth[i].child[j].buttonRights[n].id == basicAuth[x].id){
            //                                  basicAuth[x].checked = true
            //                             }
            //                         }
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // }

            // for(var a in basicAuth){
            //     if(basicAuth[a].level == 1){
            //         level_one.push(basicAuth[a])
            //     }else if(basicAuth[a].level == 2){
            //         level_two.push(basicAuth[a])
            //     }else if(basicAuth[a].level == 3){
            //         level_three.push(basicAuth[a])
            //     }else if(basicAuth[a].level = 4){
            //         level_four.push(basicAuth[a])
            //     }
            // }

            // for(var b in level_four){
            //     if(level_four[b].checked){
            //         for(var c in level_three){
            //             if(level_four[b].parent_id == level_three[c].id){
            //                 level_three[c].checked = true
            //                 for(var d in level_two){
            //                     if(level_three[c].parent_id == level_two[d].id){
            //                         level_two[d].checked = true
            //                         for(var e in level_one){
            //                             if(level_two[d].parent_id == level_one[e].id){
            //                                 level_one[e].checked = true
            //                             }
            //                         }
            //                     }
            //                 }
            //             }
            //         }
            //         for(var p in level_two){
            //             if(level_four[b].parent_id == level_two[p].id){
            //                 level_two[p].checked = true
            //             }
            //         }
            //         for(var q in level_three){
            //             if(level_four[b].parent_id == level_three[q].id){
            //                 level_three[q].checked = true
            //             }
            //         }
            //     }
            // }
            // for(var f in level_one){
            //     if(level_one[f].checked){
            //         choosedAuth.push(level_one[f])
            //     }
            // }
            // for(var g in level_two){
            //     if(level_two[g].checked){
            //         choosedAuth.push(level_two[g])
            //     }
            // }
            // for(var h in level_three){
            //     if(level_three[h].checked){
            //         choosedAuth.push(level_three[h])
            //     }
            // }
            // for(var k in level_four){
            //     if(level_four[k].checked){
            //         choosedAuth.push(level_four[k])
            //     }
            // }
            var module_arr = []
            for(var i in $scope.modules){
                for(var j in $scope.level_one){
                    if($scope.level_one[j].has_privilege){
                        if($scope.level_one[j].module_id == $scope.modules[i].module_id){
                            module_arr.push($scope.modules[i])
                        }
                    }
                }
                for(var j in $scope.level_one){
                    for(var k in $scope.level_one[j].child){
                        if($scope.level_one[j].child[k].has_privilege){
                            if($scope.level_one[j].child[k].module_id == $scope.modules[i].module_id){
                                module_arr.push($scope.modules[i])
                            }
                        }
                    }
                }
                for(var l in $scope.level_one){
                    for(var m in $scope.level_one[l].child){
                        for(var n in $scope.level_one[l].child[m].child){
                            if($scope.level_one[l].child[m].child[n].has_privilege){
                                if($scope.level_one[l].child[m].child[n].module_id == $scope.modules[i].module_id){
                                    module_arr.push($scope.modules[i])
                                }
                            }
                            if($scope.level_one[l].child[m].child[n].child.length > 0){
                                for(var o in $scope.level_one[l].child[m].child[n].child){
                                    if($scope.level_one[l].child[m].child[n].child[o].has_privilege){
                                        if($scope.level_one[l].child[m].child[n].child[o].module_id == $scope.modules[i].module_id){
                                            console.log($scope.level_one[l].child[m].child[n].child[o])
                                            module_arr.push($scope.modules[i])
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            console.log(module_arr)
            // return false
            // var arr = []
            // for(var i in $scope.level_three){
            //     for(var j in $scope.level_four){
            //         if($scope.level_four[j].has_privilege){
            //             if($scope.level_four[j].parent_id == $scope.level_three[i].module_id){
            //                 $scope.level_three[i].has_privilege = true
            //             }
            //         }
            //     }
            // }
            // for(var m in $scope.level_two){
            //     for(var k in $scope.level_four){
            //         if($scope.level_four[k].has_privilege){
            //             if($scope.level_four[k].parent_id == $scope.level_two[m].module_id){
            //                 $scope.level_two[m].has_privilege = true
            //             }
            //         }
            //     }
            // }
            // for(var o in $scope.level_two){
            //     for(var n in $scope.level_three){
            //         if($scope.level_three[n].has_privilege){
            //             if($scope.level_three[n].parent_id == $scope.level_two[o].module_id){
            //                 $scope.level_two[o].has_privilege = true
            //             }
            //         }
            //     }
            // }

            // for(var n in $scope.level_one){
            //     for(var k in $scope.level_two){
            //         if($scope.level_two.has_privilege = true){
            //             if($scope.level_two[k].parent_id == $scope.level_one[n].module_id){
            //                 $scope.level_one[n].has_privilege = true
            //                 break
            //             }
            //         }
            //     }
            // }
            
            // for(var i in $scope.modules){
            //     if($scope.modules[i].has_privilege){
            //         arr.push($scope.modules[i])
            //     }
            // }
            // console.log(arr)
            var condition = {
                id:$stateParams.id,
                enterprise_id:$scope.edit.enterprise_id,
                name:$scope.edit.name,
                users_in:[],
                users_out:[],
                // detail_module:choosedAuth,
                // modules:arr,
                modules:module_arr,
                remarks:$scope.edit.remarks
            }
            SystemUserGroupService.Update(condition).then(function(data){
                $state.go("main.systemusergroup/list",{},{
                    reload:'main.systemusergroup/list'
                })
            })
        }
    }
])
