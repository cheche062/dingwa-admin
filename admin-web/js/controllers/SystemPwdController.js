angular.module('SystemPwdController',['SystemUserService'])
       .controller('SystemPwdCtrl',['SystemUserService','$state','$scope','$timeout','DialogService',
        function(SystemUserService,$state,$scope,$timeout,DialogService){
            $scope.info = { 
                oldPwd: '', 
                newPwd: '', 
                confirm: ''
            };
            $scope.back = function(){
                $state.go('index',{},{
                    reload:'index'
                })
            }

            $scope.confirm = function(){
                if($scope.info.oldPwd == ''){
                    DialogService.alert('请输入原密码')
                    return false
                }
                if($scope.info.newPwd == ''){
                    DialogService.alert('请输入新密码')
                    return false
                }
                if(!(/^[a-zA-Z0-9]{6,16}$/.test($scope.info.newPwd))){
                    DialogService.alert('新密码格式不正确')
                    return false
                }
                if($scope.info.newPwd !== $scope.info.confirm){
                    DialogService.alert('两次输入密码不符')
                    return false
                }
                var condition = {
                    oldPwd:$scope.info.oldPwd,
                    newPwd:$scope.info.newPwd,
                    confirm:$scope.info.confirm
                }
                SystemUserService.change(condition).then(function(res){
                    console.log(res)
                    DialogService.alert('修改成功')
                    $timeout(function(){
                        $state.go('main.index',{},{
                            reload:'main.index'
                        })
                    },1000)

                },function(res){
                    if(res.data.msg !== ''){
                        DialogService.alert(res.msg)
                    }
                })
            }
       }])