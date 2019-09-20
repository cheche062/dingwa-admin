angular.module("UserEditController", ["CommonService","UserService"])
.controller("UserEditCtrl", ["$scope", "$state","$stateParams","$timeout","UserService","DialogService",
    function($scope, $state,$stateParams,$timeout,UserService,DialogService) {
        var now = new　Date()
        $scope.info = {
            phone:'',
            gender:'',
            name:'',
            email:'',
            realname:'',
            birthday:'',
            address:''
        }
        $scope.provinces = [];
        $scope.cities = [];
        $scope.districts = [];
        $scope.provinceOption = null;
        $scope.cityOption = null;
        $scope.districtOption = null;

        $("input[id^='start-date']").datepicker({
            language: 'zh-CN',
            startView: 0,
            format: 'yyyy-mm-dd',
            autoclose: true,
            todayBtn: false,
            endDate: formatDate(now), //禁止选择当天之后的日期
            todayHighlight: true
        });
        init()
        function init(){
            var id = $stateParams.id
            var date = new Date().getTime();
            var res = date + ":" + id;
            var base = new Base64();

            var encodeId = base.encode(res)

            var finalId = ['user' , encodeId]

            userId = finalId.join(' ')
            var condition = {
                id:userId
            }
            UserService.get(condition).then(function(res){
                console.log(res)
                $scope.user = res.data
                $scope.provinceOption = {
                    id: $scope.user.province_id,
                    name: $scope.user.province
                };
                $scope.cityOption = {
                    id: $scope.user.city_id,
                    name: $scope.user.city
                };
                $scope.districtOption = {
                    id: $scope.user.district_id,
                    name: $scope.user.district
                };
            },function(res){
                DialogService.alert(res.msg)
            })
        }
        $scope.goUserList = function(){
            $state.go('main.user/list',{},{
                reload:'main.user/list'
            })
        }
        $scope.submit = function(){
            if($scope.user.phone == ''){
                DialogService.alert('请输入手机号')
                return false
            }
            if(!(/^[1][34587][0-9]{9}$/.test($scope.user.phone))){
                DialogService.alert('手机号格式不正确')
                return false
            }
            if ($scope.provinceOption !== null) {
                
            } else {
                DialogService.alert('请选择省');
                $scope.user.loading = false;
                return false;
            }
            if ($scope.cityOption !== null && $scope.cityOption.id !== 0) {
                
            } else {
                DialogService.alert('请选择市');
                $scope.user.loading = false;
                return false;
            }
            if ($scope.districtOption !== null && $scope.districtOption.id !== 0) {
                
            } else {
                DialogService.alert('请选择区/县');
                $scope.user.loading = false;
                return false;
            }
            if($scope.user.address == ''){
                DialogService.alert('请输入详细地址')
                return false
            }
            var condition = {
                id:$stateParams.id,
                phone:$scope.user.phone,
                gender:$scope.user.gender,
                name:$scope.user.name,
                email:$scope.user.email,
                realname:$scope.user.realname,
                birthday:$scope.user.birthday,
                province_id:$scope.provinceOption.id,
                city_id:$scope.cityOption.id,
                district_id:$scope.districtOption.id,
                province:$scope.provinceOption.name,
                city:$scope.cityOption.name,
                district:$scope.districtOption.name,
                address:$scope.user.address
            }
            UserService.update(condition).then(function(res){
                DialogService.alert('更新成功')
                $timeout(function(){
                    $state.go('main.user/list',{},{
                        reload:'main.user/list'
                    })
                },2000)
            },function(res){
                DialogService.alert(res.msg)
            })
        }
    }
])
