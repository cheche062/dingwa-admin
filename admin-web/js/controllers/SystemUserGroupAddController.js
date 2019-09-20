angular.module("SystemUserGroupAddController",["CommonService", "SystemUserGroupService"])
.controller("SystemUserGroupAddCtrl",["$scope", "$state", "$timeout","SystemUserGroupService","DialogService",
    function($scope, $state, $timeout,SystemUserGroupService,DialogService) {
        var storage = window.localStorage;
        var basicAuth = JSON.parse(storage.basicAuth)
        var choosedAuth = []
        $scope.info = {
            modules:[]
        }
        $scope.info = {
            name:'',
            remarks:''
        }
        $scope.enterprise = {
            parent_id:''
        }

        $scope.userAuth = null
        $('#tablist a').click(function(e){
            e.preventDefault()
            $(this).tab('show')
        })


        //获取可添加的权限
        getAllrights()
        function getAllrights(){
            $scope.userAuth = JSON.parse(storage.UserAuth)
            $scope.user_render = JSON.parse(JSON.stringify(basicAuth))
            formatRightsHcf($scope.user_render)
        }
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

        $scope.firstChange = function(x){
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
        // 添加系统用户组
        $scope.add = function(){
            if($scope.info.name == ''){
                DialogService.alert('请输入系统用户组名称')
                return false
            }
            if($scope.enterprise.parent_id == ''){
                DialogService.alert('请选择归属公司')
                return false
            }
            if($scope.info.remarks == ''){
                DialogService.alert('请输入备注')
                return false
            }
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
            for(var i in basicAuth){
                for(var j in $scope.level_one){
                    if($scope.level_one[j].has_privilege){
                        if($scope.level_one[j].module_id == basicAuth[i].module_id){
                            module_arr.push(basicAuth[i])
                        }
                    }
                }
                for(var j in $scope.level_one){
                    for(var k in $scope.level_one[j].child){
                        if($scope.level_one[j].child[k].has_privilege){
                            if($scope.level_one[j].child[k].module_id == basicAuth[i].module_id){
                                module_arr.push(basicAuth[i])
                            }
                        }
                    }
                }
                for(var l in $scope.level_one){
                    for(var m in $scope.level_one[l].child){
                        for(var n in $scope.level_one[l].child[m].child){
                            if($scope.level_one[l].child[m].child[n].has_privilege){
                                if($scope.level_one[l].child[m].child[n].module_id == basicAuth[i].module_id){
                                    module_arr.push(basicAuth[i])
                                }
                            }
                            if($scope.level_one[l].child[m].child[n].child.length > 0){
                                for(var o in $scope.level_one[l].child[m].child[n].child){
                                    if($scope.level_one[l].child[m].child[n].child[o].has_privilege){
                                        if($scope.level_one[l].child[m].child[n].child[o].module_id == basicAuth[i].module_id){
                                            console.log($scope.level_one[l].child[m].child[n].child[o])
                                            module_arr.push(basicAuth[i])
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
            var condition = {
                name:$scope.info.name,
                enterprise_id:$scope.enterprise.parent_id,
                // detail_module:choosedAuth,
                detail_module:module_arr,
                remarks:$scope.info.remarks
            }
            SystemUserGroupService.Add(condition).then(function(data){
                DialogService.alert('添加成功')
                $timeout(function(){
                    $state.go('main.systemusergroup/list',{},{
                        reload:'main.systemusergroup/list'
                    })
                },2000)
            })

        }
    }
])
