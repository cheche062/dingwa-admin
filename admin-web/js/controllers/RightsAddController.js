angular.module("RightsAddController",["CommonService","RightsService"])
.controller("RightsAddCtrl",["$scope", "RightsService","DialogService","RightsService", "DictService",
    function($scope,RightsService, DialogService, RightsService, DictService) {
        $scope.info = {
            show_parentsRights:true,//显示上级权限选择框
            rights_type_disabled:false,//权限类型选择disabled
            level_one:[],
            level_two:[],
            level_three:[],
            level_four:[]
        }

        $scope.add = {
            name:'',
            key:'',
            purchase_type:null,
            parent_right: {
                id: 0,
                name: ''
            },
            module_type:null,
            parent_id:'',
            level:null,
        }

        $scope.rights_levelOpts = [
            {
                value:1,
                name:'一级'
            },
            {
                value:2,
                name:'二级'
            },
            {
                value:3,
                name:'三级'
            },
            {
                value:4,
                name:'四级'
            }
        ]

        // 权限收费类型
        $scope.purchase_typeOpts = [
            {
                value:0,
                name:'选择收费类型'
            },
            {
                value:1,
                name:'免费'
            },
            {
                value:2,
                name:'收费'
            },
            {
                value:3,
                name:'试用'
            }
        ]
        // 权限类型
        $scope.module_typeOpts = [
            {
                value:0,
                name:'请选择权限类型'
            },
            {
                value:1,
                name:'菜单'
            },
            {
                value:2,
                name:'按钮'
            }
        ]

        //父级权限
        $scope.parent_rightsOpts = []   

        // 修改等级权限
        $scope.changeRightsLevel = function(){
            if($scope.add.level.value == 1) {
                $scope.info.show_parentsRights = false
                $scope.add.module_type = $scope.module_typeOpts[1]
            }else if($scope.add.level.value == 2 ||$scope.add.level.value == 3){
                $scope.add.module_type = $scope.module_typeOpts[1]
                $scope.info.show_parentsRights = true

            }
            else if($scope.add.level.value == 4){
                $scope.info.show_parentsRights = true
                $scope.add.module_type = $scope.module_typeOpts[2]
            }
            setParentRights()
            console.log($scope.parent_rightsOpts)
        }


        // 重新封装权限
        RightsFrommat()
        function RightsFrommat(){
            var allRights = []
            $scope.info.level_one = []
            $scope.info.level_two = []
            $scope.info.level_three = []
            $scope.info.level_four = []

            var condition = {
                type:'system_modules_new'
            }
            DictService.search(condition).then(function(data){
                console.log(data)
                allRights = data
                for(var i in allRights){
                    if(allRights[i].level == 1){
                        $scope.info.level_one.push(allRights[i])
                    } else if(allRights[i].level == 2) {
                        $scope.info.level_two.push(allRights[i])
                    } else if (allRights[i].level == 3) {
                        $scope.info.level_three.push(allRights[i])
                    }else if(allRights[i].level == 4){
                        $scope.info.level_four.push(allRights[i])
                    }
                }
            })
        }

        function setParentRights() {
            if($scope.add.level.value == 2){
                $scope.parent_rightsOpts = $scope.info.level_one
            }else if($scope.add.level.value == 3){
                $scope.parent_rightsOpts = $scope.info.level_two
            }else if($scope.add.level.value == 4){
                var parents = $scope.info.level_two.concat($scope.info.level_three)
                $scope.parent_rightsOpts = parents
            }
        }



        function frontCheck(obj){
            if(obj.level.value == ''){
                DialogService.alert('请选择权限级别')
                return false
            }

            if(obj.level.value != 1 && obj.parent_id == ''){
                DialogService.alert('请选择上级权限')
                return false
            }
            if(obj.module_type.value == ''){
                DialogService.alert('请选择权限类型')
                return false
            }
            if(obj.purchase_type.value){
                DialogService.alert('请选择权限计费类型')
                return false
            }
            if(obj.key == ''){
                DialogService.alert('请输入权限标识')
                return false
            }
            if(obj.name == ''){
                DialogService.alert('请输入权限名称')
                return false
            }
        }

        $scope.submit = function () {
            frontCheck($scope.add)
            var condition = {
                name:$scope.add.name,
                key:$scope.add.key,
                purchase_type:$scope.add.purchase_type.value,
                module_type:$scope.add.module_type.value,
                parent_id:$scope.add.parent_right.id,
                level:$scope.add.level.value,
            }
            RightsService.Add(condition).then(function(data) {
                DialogService.alert('添加成功')
                $scope.add = {
                    name:'',
                    key:'',
                    purchase_type:null,
                    module_type:null,
                    parent_id:'',
                    level:null,
                }
            })
        }

    }
])
