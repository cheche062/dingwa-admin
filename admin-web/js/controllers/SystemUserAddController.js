angular.module("SystemUserAddController",["CommonService","SystemUserService"])
.controller("SystemUserAddCtrl",["$scope", "$state", "SystemUserService","DictService","DialogService",
    function($scope, $state, SystemUserService, DictService,DialogService) {
        function init() {
            console.log("test")
        }

        $scope.info = {
            choosedEnterpriseLevel:null,
            basicEnterprise:[]
        }
        $scope.level = null
        $scope.add = {
            enterprise_id:'',
            name:'',
            gender:'1',
            group_id:'',
            phone:'',
            email:'',
            realname:'',
            birthday:'',
            province_id:'',
            city_id:'',
            district_id:'',
            country:'',
            province:'',
            city:'',
            district:'',
            address:'',
            type:'1',
            role_array:'',
            transfer_account:''
        }

        $('#start-date-birthday').datepicker({
            language: 'zh-CN',
            startView: 0,
            format: 'yyyy-mm-dd',
            autoclose: true,
            todayBtn: false,
            todayHighlight: true
        })
        $scope.sysgroup = []

        $scope.choosedlist = []

        // $scope.provinceOption = {
        //     id: 0,
        //     name: '选择省'
        // };
        // $scope.cityOption = {
        //     id:0,
        //     name: '选择市'
        // };
        // $scope.districtOption = {
        //     id: 0,
        //     name: '选择区县'
        // };
        $scope.provinces = [];
        $scope.cities = [];
        $scope.districts = [];
        $scope.provinceOption = null;
        $scope.cityOption = null;
        $scope.districtOption = null;


        $scope.role_arrayOpts = []

        $scope.enterprise = {
            parent_id: ""
        };

        $scope.systemgroup = {
            id:''
        }

        $scope.account = []

        $scope.filterSysGroup = []

        $scope.has_frogAccount = null
        //判断当前登录的系统用户 有没有电蛙账户，如果有不能再次添加电蛙账户
        has_frog()
        function has_frog(){
            SystemUserService.GetCurrent().then(function(res){
                console.log(res)
                $scope.has_frogAccount = res.data.has_frog
            })
        }
        $scope.$watch("enterprise.parent_id", function() {
            $scope.add.parent_id = $scope.enterprise.parent_id;
            for(var i in $scope.info.basicEnterprise){
                if($scope.enterprise.parent_id == $scope.info.basicEnterprise[i].id){
                    $scope.info.choosedEnterpriseLevel = $scope.info.basicEnterprise[i].level
                }
            }
        });
        $scope.$watch("info.choosedEnterpriseLevel",function(newValue,oldValue){
            if(newValue == oldValue){
                return false
            }
            $scope.selectAccountType()
        })
        $scope.$watch("systemgroup.id", function() {
            $scope.add.group_id = $scope.systemgroup.id

        });



        getEnterpriseList()
        function getEnterpriseList (){
                var condition = {
                    type: "enterprise"
                };
                DictService.search(condition).then(function(data) {
                    $scope.info.basicEnterprise = data
                }, function(code) {});
        }

        $scope.selectAccountType = function(){
            if($scope.info.choosedEnterpriseLevel == 1){
                if($scope.has_frogAccount){
                    $scope.role_arrayOpts = [
                        {
                            value:2,
                            name:'引荐账户'
                        }
                    ]
                }else{
                    $scope.role_arrayOpts = [
                        {
                            value:1,
                            name:'电蛙账户'
                        },
                        {
                            value:2,
                            name:'引荐账户'
                        }
                    ]
                }
            }else if($scope.info.choosedEnterpriseLevel == 2){
                $scope.role_arrayOpts = [
                    {
                        value:3,
                        name:'合伙人账户'
                    },
                    {
                        value:4,
                        name:'电费账户'
                    },
                    {
                        value:5,
                        name:'备用账户'
                    }
                ]
            }else{
                $scope.add.type == '1'
            }
        }
        $scope.ChooseAccountType = function(){
            $scope.selectAccountType()
            $('#ChooseAccount').modal('show')
        }



        //click 确认 button
        $scope.submit = function(){
            if($scope.add.parent_id == ''){
                DialogService.alert('请选择归属公司')
                return false
            }
            if($scope.add.name == ''){
                DialogService.alert('请输入系统用户名')
                return false
            }
            if($scope.add.group_id == ''){
                DialogService.alert('请选择归属用户组')
                return false
            }
            if($scope.add.phone == ''){
                DialogService.alert('请输入手机号')
                return false
            }
            if(!(/^[1][34587][0-9]{9}$/.test($scope.add.phone))){
                DialogService.alert('手机号格式不正确')
                return false
            }
            if ($scope.provinceOption !== null) {
                
            } else {
                $scope.provinceOption = {}
                $scope.provinceOption.province_id = 0;
                $scope.provinceOption.province = '';
            }
            if ($scope.cityOption !== null && $scope.cityOption.id !== 0) {
                
            } else {
                $scope.cityOption = {}
                $scope.cityOption.city_id = 0;
                $scope.cityOption.city = '';
            }
            if ($scope.districtOption !== null && $scope.districtOption.id !== 0) {
                
            } else {
                $scope.districtOption = {}
                $scope.districtOption.district_id = 0;
                $scope.districtOption.district = '';
            }
            var condition = {
                enterprise_id:$scope.add.parent_id,
                name:$scope.add.name,
                gender:$scope.add.gender,
                group_id:$scope.add.group_id,
                phone:$scope.add.phone,
                email:$scope.add.email,
                realname:$scope.add.realname,
                birthday:$scope.add.birthday,
                province_id:$scope.provinceOption.id,
                city_id:$scope.cityOption.id,
                district_id:$scope.districtOption.id,
                country:$scope.add.country,
                province:$scope.provinceOption.name,
                city:$scope.cityOption.name,
                district:$scope.districtOption.name,
                address:$scope.add.address,
                type:$scope.add.type,
                role_array:$scope.choosedlist,
                transfer_account:$scope.add.transfer_account
            }
            SystemUserService.Add(condition).then(function(data) {
                $state.go('main.systemuser/list',{},{
                    reload:'main.systemuser/list'
                })
            })
        }

        //click 取消 button
        $scope.cancle = function() {
            console.log('cancle')
            $state.go('main.systemuser/list',{},{
                reload:'main.systemuser/list'
            })
        }
        //返回列表
        $scope.back = function(){
            console.log('back')
            $state.go('main.systemuser/list',{},{reload:'main.systemuser/list'})
        }


        $scope.chooseAccount = function() {
            $scope.choosedlist = []
            for(var i in $scope.role_arrayOpts){
                if($scope.role_arrayOpts[i].checked){
                    $scope.choosedlist.push($scope.role_arrayOpts[i].value)
                }
            }
            console.log($scope.choosedlist)
        }
    }
])
