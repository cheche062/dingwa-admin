 angular.module('EnterpriseAddController', ['CommonService', 'EnterpriseService'])
.controller('EnterpriseAddCtrl',['$scope', '$state',"$timeout",'DialogService','EnterpriseService','DictService',"ConfigService",
    function($scope, $state,$timeout, DialogService, EnterpriseService, DictService,ConfigService) {
        $scope.EnterpriseLevel = window.localStorage.getItem('EnterpriseLevel')
        setPageView()
        function setPageView() {
            var boxHeight = $('.dw-main-container').height()
            var pageNavHeight = $('.dw-page-nav').height()+30
            var pageFilterHeight = $('.dw-page-filter').height()+40
            var H = parseInt(boxHeight)  - parseInt(pageNavHeight)
            $('.dw-page-detail-container').css('height',H + 'px')
        }
        $scope.info = {
            enterprises: [],
            level:'',
        }
        $scope.enterpriseTypeOpts = [
            {
                value:2,
                name:'自运营公司'
            },
            {
                value:3,
                name:'加盟公司'
            }
        ]
        $scope.add = {
            parent_id:'',
            name:'',
            is_creuser:0,
            cust_user_group:'',
            code:'',
            contacts:'',
            phone:'',
            emergent_contacts:'',
            emergent_phone:'',
            country:'',
            province_id:'',
            city_id:'',
            district_id:'',
            province:'',
            city:'',
            district:'',
            address:'',
            type:$scope.enterpriseTypeOpts[0],
            remarks:'',
            epr_logo_id:'',
            frog_account:[],
            recommend_account:[],
            copemate_account:[],
            elec_account:[],
            other_account:[]
        }

        $scope.provinces = [];
        $scope.cities = [];
        $scope.districts = [];
        $scope.provinceOption = null;
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
            console.log(newValue)
            $scope.Recommend.user_id = newValue
        })
        $scope.$watch('Copemate.user_id',function(newValue,oldValue){
            if(newValue == oldValue){
                return false
            }
            console.log(newValue)
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

        $scope.enterprise = {
            parent_id: ""
        };

            //logo图片
            var upload = new $WebUpload("filePicker",ConfigService.API,ConfigService.API+'/enterprise/enterprise/add');
            var logoUpload = upload.init();
            //  文件上传成功，给item添加成功class, 用样式标记上传成功。
            logoUpload.on('uploadSuccess', function(file,response) {
                console.log(response)
                console.log(file)
                if(response.code == 0){
                    $scope.$apply(function(){
                        DialogService.alert("上传成功");
                    })
                    $( '#'+file.id).addClass('upload-state-done');
                }
                // $("#" + me.pictureId).val(response._raw);
            });
            // 文件上传失败，显示上传出错。
            logoUpload.on('uploadError', function(file) {
                var $li = $( '#'+file.id ),
                $error = $li.find('div.error');
                // 避免重复创建
                if ( !$error.length ) {
                    $error = $('<div class="error"></div>').appendTo( $li );
                }
                $error.text('上传失败');
            });
            $scope.upload = function() {
                $scope.logoUpload.upload()
            };
        $scope.$watch("enterprise.parent_id", function() {
            $scope.add.parent_id = $scope.enterprise.parent_id;
            filterAccount()
            // getEnterpriseLevel()
        });

        function getEnterpriseLevel(){
            var condition = {
                type: "enterprise"
            };
            DictService.search(condition).then(function(data) {
                $scope.info.enterprises =  data
            }, function(code) {});

            for(var i in $scope.info.enterprises){
                if($scope.enterprise.parent_id == $scope.info.enterprises[i].id){
                    $scope.info.level = $scope.info.enterprises[i].level
                }
            }
            if($scope.info.level == 1){
                for(var i in $scope.frogList){
                    $scope.frogList[i].checked = true
                }
            }
            if($scope.info.level == 2){
                if($scope.frogList.length >0){
                    $scope.Frog.user_id = $scope.frogList[0].user_id
                }
            }
        }
        function filterAccount(){
            var condition = {
                type:'ledger_account',
                enterprise_id:$scope.add.parent_id
            }
            DictService.search(condition).then(function(data){
                console.log(data)
                $scope.frogList= data.frog_account
                $scope.copemateList= data.copemate_account
                $scope.eleList= data.elec_account
                $scope.otherList= data.other_account
                $scope.recommendList= data.recommend_account
                getEnterpriseLevel()
                console.log($scope.copemateList)
                
            })
        }
        //click 确认 button
        $scope.submit = function () {
            var frog = [],
                recommend = [],
                copemate = [],
                elec = [],
                other = []
            if($scope.add.parent_id == ''){
                DialogService.alert("请选择上级公司")
                return false
            }
            if($scope.add.name == ''){
                DialogService.alert("请输入公司名称")
                return false
            }
            if($scope.add.code == ''){
                DialogService.alert("请输入公司编码")
                return false
            }
            // if($scope.add.contacts == ''){
            //     DialogService.alert("请输入联系人")
            //     return false
            // }
            // if($scope.add.phone == ''){
            //     DialogService.alert("请输入联系电话")
            //     return false
            // }
            if (!(/^[1][356879][0-9]{9}$/.test($scope.add.phone)) && $scope.add.phone) {
                DialogService.alert('请输入正确的联系电话');
                $scope.info.loading = false;
                return false;
            }
            // if($scope.add.emergent_contacts == ''){
            //     DialogService.alert("请输入紧急联系人")
            //     return false
            // }
            // if($scope.add.emergent_phone == ''){
            //     DialogService.alert("请输入紧急联系电话")
            //     return false
            // }
            // if (!(/^[1][356879][0-9]{9}$/.test($scope.add.emergent_phone))) {
            //     DialogService.alert('请输入正确的紧急联系电话');
            //     $scope.info.loading = false;
            //     return false;
            // }
            if($scope.add.type == '') {
                DialogService.alert("请选择公司类型")
                return false
            }
            if($scope.add.address == ''){
                DialogService.alert('请输入详细地址')
                return false
            }
            if ($scope.provinceOption !== null) {
                $scope.add.province_id = $scope.provinceOption.id;
                $scope.add.province = $scope.provinceOption.name;
            } else {
                DialogService.alert('请选择省');
                return false;
            }
            if ($scope.cityOption !== null && $scope.cityOption.id !== 0) {
                $scope.add.city_id = $scope.cityOption.id;
                $scope.add.city = $scope.cityOption.name;
            } else {
                DialogService.alert('请选择市');
                return false;
            }
            if ($scope.districtOption !== null && $scope.districtOption.id !== 0) {
                $scope.district_id = $scope.districtOption.id;
                $scope.district = $scope.districtOption.name;
            } else {
                DialogService.alert('请选择区/县');
                return false;
            }
            //上级公司为1级时
            if($scope.info.level == 1){
                for(var i in $scope.frogList){
                    if($scope.frogList[i].checked){
                        frog.push($scope.frogList[i])
                    }
                }
                for(var j in $scope.recommendList){
                    if($scope.recommendList[j].checked){
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
                        elec.push($scope.eleList[l])
                    }
                }
                for(var m in $scope.otherList){
                    if($scope.otherList[m].checked){
                        other.push($scope.otherList[m])
                    }
                }
            }
            //上级公司为2级时 ，角色账户只能单选 且 至少选择一个电蛙账户，合伙人账户，电费账户
            if($scope.info.level == 2 ){
                for(var i in $scope.frogList){
                    if($scope.frogList[i].user_id  == $scope.Frog.user_id){
                        frog.push($scope.frogList[i])
                        break 
                    }
                }
                for(var j in $scope.recommendList){
                    if($scope.recommendList[j].user_id  == $scope.Recommend.user_id){
                        recommend.push($scope.recommendList[j])
                        break
                    }
                }
                for(var k in $scope.copemateList){
                    if($scope.copemateList[k].user_id == $scope.Copemate.user_id){
                        copemate.push($scope.copemateList[k])
                        break
                    }
                }
                for(var l in $scope.eleList){
                    if($scope.eleList[l].user_id = $scope.Elec.user_id){
                        elec.push($scope.eleList[l])
                        break
                    }
                }
                for(var m in $scope.otherList){
                    if($scope.otherList[m].user_id == $scope.Other.user_id){
                        other.push($scope.otherList[m])
                        break
                    }
                }
            }
            if($scope.EnterpriseLevel == 1){
                if($scope.add.is_creuser == 0 ||$scope.add.is_creuser == false){
                    $scope.add.is_creuser = 0
                }else{
                    $scope.add.is_creuser = 1
                }
            }

            var condition = {
                parent_id:$scope.add.parent_id,
                name:$scope.add.name,
                is_cregroup:$scope.add.is_creuser,
                cust_user_group:$scope.add.cust_user_group,
                code:$scope.add.code,
                contacts:$scope.add.contacts,
                phone:$scope.add.phone,
                emergent_contacts:$scope.add.emergent_contacts,
                emergent_phone:$scope.add.emergent_phone,
                country:$scope.add.country,
                province_id:$scope.provinceOption.id,
                city_id:$scope.cityOption.id,
                district_id:$scope.districtOption.id,
                province:$scope.provinceOption.name,
                city:$scope.cityOption.name,
                district:$scope.districtOption.name,
                address:$scope.add.address,
                type:$scope.add.type.value,
                remarks:$scope.add.remarks,
                epr_logo_id:$scope.add.epr_logo_id,
                frog_account:frog,
                recommend_account:recommend,
                copemate_account:copemate,
                elec_account:elec,
                other_account:other
            }
            EnterpriseService.Add(condition).then(function(res){
                console.log(res)
                if(res.code != 0) {
                    if(res.msg == ''){
                        DialogService.alert('请求错误，请联系管理员')
                    } else {
                        DialogService.alert(data.msg)
                    }
                }else {
                    DialogService.alert('添加成功')
                    $timeout(function(){
                        $state.go('main.enterprise/list', {}, {
                            reload: 'main.enterprise/list'
                        });
                    },2000)
                }
            })
        }

        //click 取消 button
        $scope.cancle = function() {
            $scope.add = {
                parent_id:'',
                name:'',
                is_cregroup:'',
                cust_user_group:'',
                code:'',
                contacts:'',
                phone:'',
                emergent_contacts:'',
                emergent_phone:'',
                country:'',
                province_id:'',
                city_id:'',
                district_id:'',
                province:'',
                city:'',
                district:'',
                address:'',
                type:'',
                remarks:'',
                epr_logo_id:'',
                manage_serve_discount:'',
                recom_serve_discount:'',
                part_serve_discount:'',
                other_serve_discount:''
            }
        }
        $scope.back = function(){
            $state.go('main.enterprise/list',{},{
                reload:false
            })
        }

    }
])
