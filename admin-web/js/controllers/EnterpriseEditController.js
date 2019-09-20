angular.module('EnterpriseEditController',['CommonService', 'EnterpriseService'])
.controller('EnterpriseEditCtrl',['$scope','$state','$stateParams' ,'$q', 'EnterpriseService', 'DialogService','DictService',
    function($scope, $state,$stateParams,$q, EnterpriseService, DialogService,DictService) {
        $scope.info = {
            level:'',
            enterprises:[]
        }
        $scope.EnterpriseLevel = ''
        $scope.enterprise = {
            enterprises: [],
            parent_id:''
        }
        $scope.provinces = [];
        $scope.cities = [];
        $scope.districts = [];
        $scope.provinceOption = {
            id:0,
            name:'请选择'
        };
        $scope.enterpriseTypeOpts = [
            {
                value:1,
                name:'运营公司'
            },
            {
                value:2,
                name:'加盟公司'
            }
        ]
        $scope.cityOption = null;
        $scope.districtOption = null;

        $scope.Frog = {
            user_id:''
        }
        $scope.Recommend = {
            user_id:''
        }
        $scope.Copemate = {
            user_id:''
        }
        $scope.Elec = {
            user_id:''
        }
        $scope.Other = {
            user_id:''
        }
        $scope.$watch('Frog.user_id',function(newValue,oldValue){
            if(newValue == oldValue){
                return false
            }
            $scope.Frog.user_id = newValue
        })
        $scope.$watch('Recommend.user_id',function(newValue,oldValue){
            if(newValue == oldValue){
                return false
            }
            $scope.Recommend.user_id = newValue
        })
        $scope.$watch('Copemate.user_id',function(newValue,oldValue){
            if(newValue == oldValue){
                return false
            }
            $scope.Copemate.user_id = newValue
        })
        $scope.$watch('Elec.user_id',function(newValue,oldValue){
            if(newValue == oldValue){
                return false
            }
            $scope.Elec.user_id = newValue
        })
        $scope.$watch('Other.user_id',function(newValue,oldValue){
            if(newValue == oldValue){
                return false
            }
            $scope.Other.user_id = newValue
        })
        getDetail()
        function getDetail(){
            var condition = {
                id:$stateParams.id
            }
            EnterpriseService.Detail(condition).then(function(res){
                console.log(res)
                if(res.code != 0){
                    if(res.msg == ''){
                        DialogService.alert("请求错误，请联系管理员")
                    }else {
                        DialogService.alert(data.msg)
                    }
                } else {
                    $scope.edit = res.data
                    if(res.data.level != 1){
                        $scope.info.level = res.data.level-1
                    }
                    $scope.EnterpriseLevel = res.data.level
                    console.log($scope.EnterpriseLevel)
                    console.log($scope.edit)
                    // filterAccount()
                        if($scope.EnterpriseLevel == 2){
                                var condition = {
                                    type:'ledger_account',
                                    enterprise_id:$scope.edit.parent_id
                                }
                                DictService.search(condition).then(function(data){
                                    console.log(data)
                                    $scope.frogList = data.frog_account
                                    $scope.recommendList= data.recommend_account
                                }).then(function(){
                                    var condition1 = {
                                        type:'ledger_account',
                                        enterprise_id:$scope.edit.id
                                    }
                                    DictService.search(condition1).then(function(data){
                                        console.log(data)
                                        $scope.copemateList= data.copemate_account
                                        $scope.eleList= data.elec_account
                                        $scope.otherList= data.other_account
                                    }).then(function(){
                                        start()
                                    })
                                })
                        }
                        if($scope.EnterpriseLevel == 3){
                            var condition = {
                                type:'ledger_account',
                                enterprise_id:$scope.edit.parent_id
                            }
                            DictService.search(condition).then(function(data){
                                console.log(data)
                                $scope.frogList= data.frog_account
                                $scope.recommendList= data.recommend_account
                                $scope.copemateList= data.copemate_account
                                $scope.eleList= data.elec_account
                                $scope.otherList= data.other_account
                            }).then(function(){
                                start()
                            })
                        }
                    // var condition = {
                    //     type:'ledger_account',
                    //     enterprise_id:$scope.edit.parent_id
                    // }
                    // DictService.search(condition).then(function(data){
                        // console.log(data)
                        // $scope.frogList= data.frog_account
                        // $scope.recommendList= data.recommend_account
                        // $scope.copemateList= data.copemate_account
                        // $scope.eleList= data.elec_account
                        // $scope.otherList= data.other_account
                        function start(){
                            console.log($scope.frogList)
                            console.log($scope.edit.frog_account)
                            if($scope.EnterpriseLevel == 2){
                                // for(var i =0;i<$scope.edit.frog_account.length;i++){
                                        // if($scope.edit.frog_account[i].user_id == $scope.frogList[j].user_id){
                                    for(var j = 0;j<$scope.frogList.length;j++){
                                            $scope.frogList[j].checked = true
                                    }
                                        // }
                                // }
                                console.log($scope.frogList)
                                for(var i =0;i<$scope.edit.recommend_account.length;i++){
                                    for(var j = 0;j<$scope.recommendList.length;j++){
                                        if($scope.edit.recommend_account[i].user_id == $scope.recommendList[j].user_id){
                                            $scope.recommendList[j].checked = true
                                        }
                                    }
                                }
                                for(var i =0;i<$scope.edit.elec_account.length;i++){
                                    for(var j = 0;j<$scope.eleList.length;j++){
                                        if($scope.edit.elec_account[i].user_id == $scope.eleList[j].user_id){
                                            $scope.eleList[j].checked = true
                                        }
                                    }
                                }
                                for(var i =0;i<$scope.edit.copemate_account.length;i++){
                                    for(var j = 0;j<$scope.copemateList.length;j++){
                                        if($scope.edit.copemate_account[i].user_id == $scope.copemateList[j].user_id){
                                            $scope.copemateList[j].checked = true
                                        }
                                    }
                                }
                                for(var i =0;i<$scope.edit.other_account.length;i++){
                                    for(var j = 0;j<$scope.otherList.length;j++){
                                        if($scope.edit.other_account[i].user_id == $scope.otherList[j].user_id){
                                            $scope.otherList[j].checked = true
                                        }
                                    }
                                }
                                console.log($scope.copemateList)
                                
                            }
                            if($scope.EnterpriseLevel == 3){
                                if($scope.frogList.length>0){
                                    $scope.Frog.user_id = $scope.frogList[0].user_id
                                }
                                if($scope.edit.recommend_account.length>0){
                                    $scope.Recommend.user_id = $scope.edit.recommend_account[0].user_id
                                }
                                if($scope.edit.elec_account.length>0){
                                    $scope.Elec.user_id = $scope.edit.elec_account[0].user_id
                                }
                                if($scope.edit.copemate_account.length>0){
                                    $scope.Copemate.user_id = $scope.edit.copemate_account[0].user_id
                                }
                                if($scope.edit.other_account.length>0){
                                    $scope.Other.user_id = $scope.edit.other_account[0].user_id
                                }
                            }
                            $scope.edit.type = String(res.data.type)
                            $scope.enterprise.parent_id = res.data.parent_id
                            // getEnterpriseLevel()
                            var condition = {
                                type: "enterprise"
                            };
                            
                            $scope.provinceOption = {
                                id:$scope.edit.province_id
                            }
                            var condition1 = {
                                type: 'city',
                                query:$scope.edit.province_id
                            };
                            DictService.search(condition1).then(function(data) {
                                $scope.cities = data;
                            }, function(code) {});
                            $scope.cityOption = {
                                id:$scope.edit.city_id
                            }
                            var condition2 = {
                                type:'city',
                                query:$scope.edit.city_id
                            }
                            DictService.search(condition2).then(function(data) {
                                $scope.districts = data
                            }, function(code) {});
                            $scope.districtOption = {
                                id:$scope.edit.district_id
                            }
                            $scope.$watch("enterprise.parent_id", function(newValue,oldValue) {
                                if(newValue == oldValue){
                                    return false
                                }
                                $scope.edit.parent_id = $scope.enterprise.parent_id;
                                getEnterpriseLevel()
                            });
                        }
                    // })
                    
                }
            })
        }
        function filterAccount(){
            var condition = {
                type:'ledger_account',
                enterprise_id:$scope.edit.parent_id
            }
            DictService.search(condition).then(function(data){
                console.log(data)
                $scope.frogList= data.frog_account
                $scope.copematList= data.copemate_account
                $scope.eleList= data.elec_account
                $scope.otherList= data.other_account
                $scope.recommendList= data.recommend_account
            })
        }
        function getEnterpriseLevel(){
            var condition = {
                type: "enterprise"
            };
            DictService.search(condition).then(function(data) {
                console.log(data)
                $scope.info.enterprises =  data
                for(var i in $scope.info.enterprises){
                    if($scope.enterprise.parent_id == $scope.info.enterprises[i].id){
                        $scope.info.level = $scope.info.enterprises[i].level
                    }
                }

                if($scope.info.level == 1){

                    var condition = {
                        type:'ledger_account',
                        enterprise_id:$scope.edit.parent_id
                    }
                    DictService.search(condition).then(function(data){
                        console.log(data)
                        $scope.frogList = data.frog_account
                        $scope.recommendList= data.recommend_account
                        for(var i in $scope.recommendList){
                            $scope.recommendList[i].checked = false
                        }
                        if($scope.frogList.length > 0){
                            $scope.frogList[0].checked = true
                        }
                    }).then(function(){
                        var condition1 = {
                            type:'ledger_account',
                            enterprise_id:$scope.edit.id
                        }
                        DictService.search(condition1).then(function(data){
                            $scope.copemateList= data.copemate_account;
                            $scope.eleList= data.elec_account;
                            $scope.otherList= data.other_account;
                            //清空所有选择的分润账户
                            for(var j in $scope.copemateList){
                                $scope.copemateList[j].checked = false
                            }
                            for(var k in $scope.eleList){
                                $scope.eleList[k].checked = false
                            }
                            for(var l in $scope.otherList){
                                $scope.otherList[l].checked = false
                            }
                        })
                    })
                }
                if($scope.info.level == 2){
                    //变换公司后清空所有分润账户
                    $scope.Frog.user_id = '';
                    $scope.Recommend.user_id = '';
                    $scope.Copemate.user_id = '';
                    $scope.Elec.user_id = '';
                    $scope.Other.user_id = '';
                    var condition = {
                        type:'ledger_account',
                        enterprise_id:$scope.enterprise.parent_id
                    }
                    DictService.search(condition).then(function(data){
                        console.log(data)
                        $scope.frogList= data.frog_account
                        $scope.recommendList= data.recommend_account
                        $scope.copemateList= data.copemate_account
                        $scope.eleList= data.elec_account
                        $scope.otherList= data.other_account
                    })
                    if($scope.frogList.length > 0){
                        $scope.Frog.user_id = $scope.frogList[0].user_id
                    }
                }
            }, function(code) {});

        }

        //click 确认 button
        $scope.confirmEdit = function(){
            console.log($scope.frogList)
            var frog = [],
                recommend = [],
                copemate = [],
                elec = [],
                other = []
            if($scope.edit.parent_id == ''){
                DialogService.alert("请选择上级公司")
                return false
            }
            if($scope.edit.name == ''){
                DialogService.alert("请输入公司名称")
                return false
            }
            if($scope.edit.code == ''){
                DialogService.alert("请输入公司编码")
                return false
            }
            // if($scope.edit.contacts == ''){
            //     DialogService.alert("请输入联系人")
            //     return false
            // }
            // if($scope.edit.phone == ''){
            //     DialogService.alert("请输入联系电话")
            //     return false
            // }
            if (!(/^[1][356879][0-9]{9}$/.test($scope.edit.phone)) && $scope.edit.phone) {
                DialogService.alert('请输入正确的联系电话');
                return false;
            }
            // if($scope.edit.emergent_contacts == ''){
            //     DialogService.alert("请输入紧急联系人")
            //     return false
            // }
            // if($scope.edit.emergent_phone == ''){
            //     DialogService.alert("请输入紧急联系电话")
            //     return false
            // }
            // if (!(/^[1][356879][0-9]{9}$/.test($scope.edit.emergent_phone))) {
            //     DialogService.alert('请输入正确的紧急联系电话');
            //     return false;
            // }
            if($scope.edit.type == '') {
                DialogService.alert("请选择公司类型")
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
            if($scope.info.level == 1){
                for(var i in $scope.frogList){
                    if($scope.frogList[i].checked){
                        console.log($scope.frogList[i])
                        frog.push($scope.frogList[i])
                    }
                }
                for(var j in $scope.recommendList){
                    if($scope.recommendList[j].checked){
                        console.log($scope.recommendList[j])
                        recommend.push($scope.recommendList[j])
                    }
                }
                for(var k in $scope.copemateList){
                    if($scope.copemateList[k].checked){
                        console.log($scope.copemateList[k])
                        copemate.push($scope.copemateList[k])
                    }
                }
                for(var l in $scope.eleList){
                    if($scope.eleList[l].checked){
                        console.log($scope.eleList[l])
                        elec.push($scope.eleList[l])
                    }
                }
                for(var m in $scope.otherList){
                    if($scope.otherList[m].checked){
                        console.log($scope.otherList[m])
                        other.push($scope.otherList[m])
                    }
                }
            }
            if($scope.info.level == 2 ){
                for(var i in $scope.frogList){
                    if($scope.frogList[i].user_id  == $scope.Frog.user_id){
                        frog.push($scope.frogList[i])
                        break
                    }
                }
                for(var j in $scope.recommendList){
                    if($scope.recommendList[j].user_id  == $scope.Recommend.user_id){
                        console.log($scope.recommendList[j])
                        recommend.push($scope.recommendList[j])
                        break
                    }
                }
                for(var k in $scope.copemateList){
                    if($scope.copemateList[k].user_id == $scope.Copemate.user_id){
                        console.log($scope.copemateList[k])
                        copemate.push($scope.copemateList[k])
                        break
                    }
                }
                for(var l in $scope.eleList){
                    if($scope.eleList[l].user_id == $scope.Elec.user_id){
                        console.log($scope.eleList[l])
                        elec.push($scope.eleList[l])
                        break
                    }
                }
                for(var m in $scope.otherList){
                    if($scope.otherList[m].user_id == $scope.Other.user_id){
                        console.log($scope.otherList[m])
                        other.push($scope.otherList[m])
                        break
                    }
                }
            }
            var condition = {
                id:$stateParams.id,
                name:$scope.edit.name,
                parent_id:$scope.edit.parent_id,
                epr_logo_id:$scope.edit.epr_logo_id,
                code:$scope.edit.code,
                contacts:$scope.edit.contacts,
                phone:$scope.edit.phone,
                emergent_contacts:$scope.edit.emergent_contacts,
                emergent_phone:$scope.edit.emergent_phone,
                country:$scope.edit.country,
                province_id:$scope.provinceOption.id,
                city_id:$scope.cityOption.id,
                district_id:$scope.districtOption.id,
                province:$scope.provinceOption.name,
                city:$scope.cityOption.name,
                district:$scope.districtOption.name,
                address:$scope.edit.address,
                type:$scope.edit.type,
                remarks:$scope.edit.remarks,
                frog_account:frog,
                recommend_account:recommend,
                copemate_account:copemate,
                elec_account:elec,
                other_account:other,
                // is_cregroup:$scope.edit.is_cregroup,
                // cust_user_group:$scope.edit.cust_user_group,
                // manage_serve_discount:$scope.edit.manage_serve_discount,
                // recom_serve_discount:$scope.edit.recom_serve_discount,
                // part_serve_discount:$scope.edit.part_serve_discount,
                // other_serve_discount:$scope.edit.other_serve_discount,
            }
                console.log(condition)
            EnterpriseService.Update(condition).then(function(res){
                $state.go('main.enterprise/list', {}, {
                    reload: 'main.enterprise/list'
                });
            },function(err){})
        }

        //click 取消 button
        $scope.back = function (){
            $state.go('main.enterprise/list', {}, {
                reload: 'main.enterprise/list'
            });
        }
    }
])
