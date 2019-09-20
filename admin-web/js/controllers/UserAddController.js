angular.module("UserAddController", ["CommonService","UserService"])
.controller("UserAddCtrl", ["$scope", "$state","$timeout","UserService","DialogService",
    function($scope, $state,$timeout,UserService,DialogService) {
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
        $scope.goUserList = function(){
        	$state.go('main.user/list',{},{
        		reload:'main.user/list'
        	})
        }
        $scope.submit = function(){
        	if($scope.info.phone == ''){
        		DialogService.alert('请输入手机号')
        		return false
        	}
        	if(!(/^[1][34587][0-9]{9}$/.test($scope.info.phone))){
        		DialogService.alert('手机号格式不正确')
        		return false
        	}
        	if ($scope.provinceOption !== null) {
                
            } else {
                DialogService.alert('请选择省');
                $scope.info.loading = false;
                return false;
            }
            if ($scope.cityOption !== null && $scope.cityOption.id !== 0) {
                
            } else {
                DialogService.alert('请选择市');
                $scope.info.loading = false;
                return false;
            }
            if ($scope.districtOption !== null && $scope.districtOption.id !== 0) {
                
            } else {
                DialogService.alert('请选择区/县');
                $scope.info.loading = false;
                return false;
            }
            if($scope.info.address == ''){
        		DialogService.alert('请输入详细地址')
        		return false
        	}
        	var condition = {
        		phone:$scope.info.phone,
        		gender:$scope.info.gender,
        		name:$scope.info.name,
        		email:$scope.info.email,
        		realname:$scope.info.realname,
        		birthday:$scope.info.birthday,
        		province_id:$scope.provinceOption.id,
                city_id:$scope.cityOption.id,
                district_id:$scope.districtOption.id,
                province:$scope.provinceOption.name,
                city:$scope.cityOption.name,
                district:$scope.districtOption.name,
                address:$scope.info.address
        	}
        	UserService.add(condition).then(function(res){
        		DialogService.alert('添加成功')
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
