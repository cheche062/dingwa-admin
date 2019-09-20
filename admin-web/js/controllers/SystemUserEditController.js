angular.module("SystemUserEditController",["CommonService","SystemUserService"])
.controller("SystemUserEditCtrl",["$scope","$state", "$stateParams", "SystemUserService","DictService","DialogService",
    function($scope, $state, $stateParams, SystemUserService, DictService,DialogService){
        var systemUserId = null
        $scope.info = {
            choosedEnterpriseLevel:null,
            basicEnterprise:[],
        }
        $scope.level = null
        $scope.edit = {
            enterprise_id:'',
            name:'',
            gender:'',
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
            type:''
        }
        $('#start-date-birthday').datepicker({
            language: 'zh-CN',
            startView: 0,
            format: 'yyyy-mm-dd',
            autoclose: true,
            todayBtn: false,
            todayHighlight: true
        })
        $scope.provinces = [];
        $scope.cities = [];
        $scope.districts = [];
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

        $scope.enterprise = {
            parent_id: ""
        };

        $scope.systemgroup = {
            id:''
        }
        $scope.role_arrayOpts = []

        $scope.filterSysGroup = []

        $scope.choosedlist = []

        function searchSysGroup(){
            //普通系统用户不需要传公司id,type为2时需要传$scope.edit.type == 2 ? 
            var condition = {
                type:'systemgroup',
                enterprise_id:$scope.enterprise.parent_id
            }
            DictService.search(condition).then(function(data) {
                $scope.filterSysGroup = data
            }, function(code) {});
        }
        function getEnterpriseList (){
                var condition = {
                    type: "enterprise"
                };
                DictService.search(condition).then(function(data) {
                    $scope.info.basicEnterprise = data
                    get()
                }, function(code) {});
        }

        $scope.selectAccountType = function(){
            if($scope.info.choosedEnterpriseLevel == 1){
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
            }
        }
        init()
        function init() {
            var id = $stateParams.id;
            var date = new Date().getTime();
            var res = date + ":" + id;
            var base = new Base64();
            var encodeId = base.encode(res)
            var finalId = ['system' , encodeId]
            systemUserId = finalId.join(' ')
            getEnterpriseList()
        }
        function get() {
            var condition = {
                id:systemUserId
            }
            SystemUserService.Detail(condition).then(function(data){
                $scope.provinceOption = {
                    id: data.province_id,
                    name: data.province
                };
                console.log($scope.provinceOption)
                var condition2 = {
                    type: 'city',
                    query: data.province_id
                };
                DictService.search(condition2).then(function(res) {
                    $scope.cities = res;
                    $scope.cityOption = {
                        id: data.city_id,
                        name: data.city
                    };
                }, function(code) {});

                var condition3 = {
                    type: 'city',
                    query: data.city_id
                };
                DictService.search(condition3).then(function(res) {
                    $scope.districts = res;
                    $scope.districtOption = {
                        id: data.district_id,
                        name: data.district
                    };
                }, function(code) {});
                $scope.systemUser = data
                $scope.enterprise.parent_id = data.enterprise_id
                $scope.edit.enterprise_id = $scope.enterprise.parent_id;
                for(var i in $scope.info.basicEnterprise){
                    if($scope.enterprise.parent_id == $scope.info.basicEnterprise[i].id){
                        $scope.info.choosedEnterpriseLevel = $scope.info.basicEnterprise[i].level
                        break
                    }
                }
                $scope.systemgroup.id = data.group_id      
                if($scope.info.choosedEnterpriseLevel == 1){
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
                            name:'其他账户'
                        }
                    ]
                }         
                for(var i in data.role_array){
                    for(var j in $scope.role_arrayOpts){
                        if($scope.role_arrayOpts[j].value == data.role_array[i]){
                            $scope.role_arrayOpts[j].checked = true
                        }
                    }
                }
                $scope.$watch("systemgroup.id", function(newValue,oldValue) {
                    if(newValue == oldValue){
                        return false
                    }
                    $scope.edit.group_id = $scope.systemgroup.id
                });
                $scope.edit = {
                    enterprise_id:data.enterprise_id,
                    name:data.name,
                    gender:String(data.gender),
                    group_id:data.group_id,
                    phone:data.phone,
                    email:data.email,
                    realname:data.realname,
                    birthday:data.birthday,
                    province_id:data.province_id,
                    city_id:data.city_id,
                    district_id:data.district_id,
                    country:data.country,
                    province:data.province,
                    city:data.city,
                    district:data.district,
                    address:data.address,
                    type:String(data.type),
                    transfer_account:data.transfer_account
                }
                searchSysGroup()
                $scope.$watch("enterprise.parent_id", function(newValue,oldValue){
                    $scope.edit.enterprise_id = $scope.enterprise.parent_id;
                    for(var i in $scope.info.basicEnterprise){
                        if($scope.enterprise.parent_id == $scope.info.basicEnterprise[i].id){
                            $scope.info.choosedEnterpriseLevel = $scope.info.basicEnterprise[i].level
                            console.log($scope.info.choosedEnterpriseLevel )
                        }
                    }
                });
                $scope.$watch("info.choosedEnterpriseLevel",function(newValue,oldValue){
                    if(newValue == oldValue ){
                        return false
                    }
                    $scope.selectAccountType()
                })
            })
        }
        $scope.goSystemList = function(){
            $state.go('main.systemuser/list',{},{
                reload:'main.systemuser/list'
            })
        }
        $scope.update = function() {
            $scope.choosedlist = []
            if($scope.edit.type == 1 || $scope.edit.type == 0){
                $scope.choosedlist = []
            }else if($scope.edit.type == 2){
                for(var i in $scope.role_arrayOpts){
                if($scope.role_arrayOpts[i].checked){
                    $scope.choosedlist.push($scope.role_arrayOpts[i].value)
                    }
                }
            }
            console.log($scope.choosedlist)
            if($scope.edit.parent_id == ''){
                DialogService.alert('请选择归属公司')
                return false
            }
            if($scope.edit.name == ''){
                DialogService.alert('请输入系统用户名')
                return false
            }
            if($scope.edit.group_id == ''){
                DialogService.alert('请选择归属用户组')
                return false
            }
            if($scope.edit.type == 2){
                if($scope.edit.transfer_account == undefined || $scope.edit.transfer_account == ''){
                    DialogService.alert('请输入银行账号')
                    return false
                }
            }
            if($scope.edit.phone == ''){
                DialogService.alert('请输入手机号')
                return false
            }
            if(!(/^[1][34587][0-9]{9}$/.test($scope.edit.phone))){
                DialogService.alert('手机号格式不正确')
                return false
            }
            if( $scope.cityOption === null ){
                $scope.cityOption = {
                    id:0,
                    name:'选择市'
                }
            }
            if( $scope.districtOption === null ){
                $scope.districtOption = {
                    id:0,
                    name:'选择区县'
                }
            }
            var condition = {
                id:$stateParams.id,
                enterprise_id:$scope.edit.enterprise_id,
                name:$scope.edit.name,
                gender:$scope.edit.gender,
                group_id:$scope.edit.group_id,
                phone:$scope.edit.phone,
                email:$scope.edit.email,
                realname:$scope.edit.realname,
                face:'',
                type:$scope.edit.type,
                birthday:$scope.edit.birthday,
                province_id:$scope.provinceOption.id,
                city_id:$scope.cityOption.id,
                district_id:$scope.districtOption.id,
                province:$scope.provinceOption.name,
                city:$scope.cityOption.name,
                district:$scope.districtOption.name,
                address:$scope.edit.address,
                role_array:$scope.choosedlist,
                transfer_account:$scope.edit.type == 2 ? $scope.edit.transfer_account : ''
            }
            SystemUserService.Update(condition).then(function(data){
                $state.go('main.systemuser/list',{},{
                    reload:'main.systemuser/list'
                })
            })
        }
    }
])
