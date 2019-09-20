angular.module("StationEditController", ["CommonService", "StationService"])
.controller("StationEditCtrl", ["$scope", "$state","$stateParams", "$timeout","StationService","DialogService","DictService",
    function( $scope, $state,$stateParams,$timeout, StationService,DialogService,DictService) {
        var now = new Date()
        $scope.type = 'station'
        $("input[id^='start-date']").datepicker({
            language: 'zh-CN',
            startView: 0,
            format: 'yyyy-mm-dd',
            autoclose: true,
            todayBtn: false,
            endDate: formatDate(now), //禁止选择当天之后的日期
            todayHighlight: true
        });
        $("input[id^='start-date']").datepicker("setDate", formatDate(now));
        $("input[id^='open-date']").datetimepicker({
            language: 'zh-CN',
            startView: 0,
            format: 'hh:ii',
            autoclose: true,
            showMeridian: false
        });
        $scope.info = {
            level:2,
            url_site: '',
            current_pic_id: '',
            show_map: false,
            lng:'',
            lat:'',
            address:''
        };
        $scope.station = {}
        $scope.pic_ids = []
    	$scope.enterprise = {
    		parent_id:''
    	}
        $scope.fee_detail = {
            one_hour:'',
            two_hour:'',
            charge_full:''
        }
        var fee_rules = {};
        $scope.fee_rules_info = "";
        $scope.fee_rules_buf = [];
        $scope.fee_edit_warning = "";

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

        //初始化调get请求
        init()
        function init(){
            var id = $stateParams.id
            console.log(id)
        	var condition ={
        		id:id
        	}

        	StationService.get(condition).then(function(res){
        		$scope.station = res.data
                $scope.one_hour = res.data.fee_detail[3600]/100
                $scope.two_hour = res.data.fee_detail[7200]/100
                $scope.charge_full = res.data.fee_detail[36000]/100
                getFeeRules( res.data.fee_detail);
        		$scope.enterprise.parent_id = res.data.enterprise_id
                $scope.station.lnglat = $scope.station.longitude + ',' + $scope.station.latitude;
                var _arr = $scope.station.open_at.split('-');
                $scope.station.open_at_st = _arr[0]
                $scope.station.open_at_et = _arr[1]
                $scope.station.provider = String($scope.station.provider)
                $scope.station.status = String($scope.station.status)
                $scope.station.construction_site = String($scope.station.construction_site)
                $scope.station.type = String($scope.station.type)
                $scope.station.prime_cost = res.data.prime_cost/100;
                $scope.station.account_standard = String($scope.station.account_standard)
                $scope.provinceOption = {
                    id: $scope.station.province_id,
                    name: $scope.station.province
                };
                var condition2 = {
                    type: 'city',
                    query: $scope.station.province_id
                };
                DictService.search(condition2).then(function(data) {
                    $scope.cities = data;
                    $scope.cityOption = {
                        id: $scope.station.city_id,
                        name: $scope.station.city
                    };
                }, function(code) {});

                var condition3 = {
                    type: 'city',
                    query: $scope.station.city_id
                };
                DictService.search(condition3).then(function(data) {
                    $scope.districts = data;
                     $scope.districtOption = {
                        id: $scope.station.district_id,
                        name: $scope.station.district
                    };
                }, function(code) {});
                var condition4 = {
                    type:'ledger_account',
                    enterprise_id:$scope.enterprise.parent_id
                }
                DictService.search(condition4).then(function(res){
                    console.log(res)
                    $scope.frogList= res.frog_account
                    $scope.recommendList= res.recommend_account
                    $scope.copemateList= res.copemate_account
                    $scope.eleList= res.elec_account
                    $scope.otherList= res.other_account
                    if($scope.frogList.length >0){
                        $scope.Frog.user_id = $scope.frogList[0].user_id
                    }
                    if($scope.station.recommend_account_detail.length>0){
                        $scope.Recommend.user_id = $scope.station.recommend_account_detail[0].user_id
                    }
                    if($scope.station.elec_account_detail.length>0){
                        $scope.Elec.user_id = $scope.station.elec_account_detail[0].user_id
                    }
                    if($scope.station.copemate_account_detail.length>0){
                        $scope.Copemate.user_id = $scope.station.copemate_account_detail[0].user_id
                    }
                    if($scope.station.other_account_detail.length>0){
                        $scope.Other.user_id = $scope.station.other_account_detail[0].user_id
                    }
                },function(res){
                    if(res.msg != ''){
                        DialogService.alert(res.msg)
                    }
                })
                $scope.$watch('enterprise.parent_id',function(newValue,oldValue){
                    if(newValue == oldValue){
                        return false
                    }
                    var condition = {
                        type:'ledger_account',
                        enterprise_id:$scope.enterprise.parent_id
                    }
                    DictService.search(condition).then(function(res){
                        console.log(res)
                        $scope.frogList= res.frog_account
                        $scope.recommendList= res.recommend_account
                        $scope.copemateList= res.copemate_account
                        $scope.eleList= res.elec_account
                        $scope.otherList= res.other_account
                        if($scope.frogList.length >0){
                            $scope.Frog.user_id = $scope.frogList[0].user_id
                        }
                    },function(res){
                        if(res.msg != ''){
                            DialogService.alert(res.msg)
                        }
                    })
                })

        	},function(res){
                if(res.msg != ''){
        		  DialogService.alert(res.msg)
                }
        	})
        }

        function compare(obj1, obj2) {
            var val1 = obj1.hour;
            var val2 = obj2.hour;

            if(val1 < val2) {
                return -1;
            }else if (val1 > val2) {
                return 1;
            }else {
                return 0;
            }
        }

        function getFeeRules(obj){
            let keys = Object.keys(obj);

            $scope.fee_rules_info = "";
            $scope.fee_rules = "";
            if(keys) {
                for(keys in obj) {
                    keys /= 3600;
                    obj[keys] = obj[keys*3600]/100;
                    delete obj[keys*3600];
                    $scope.fee_rules_info += keys+"小时/"+obj[keys]+"元"+" ";
                    $scope.fee_rules_buf.push({hour: keys, fee: obj[keys]});
                }

                fee_rules = obj;
                // console.log(fee_rules);
            }else {
                $scope.fee_rules_info = "免费";
            }

            $scope.fee_edit_warning = "";
            // console.log($scope.fee_rules_buf);
            // console.log($scope.fee_rules_info);
        }

        $scope.$watch('fee_rules_buf',function(newValue,oldValue) {
            if(newValue == oldValue){
                return false
            }

            var buf = [];
            for(let x of $scope.fee_rules_buf) {
                if((x.hour>0)&&(x.fee!=null)){
                    for(let y of buf) {
                        if(x.hour == y.hour) {
                            $scope.fee_edit_warning = "规则重复！";
                            return;
                        }
                    }
                    buf.push(x);
                }
            }
            if(buf.length == 0){
                $scope.fee_edit_warning = "至少设置一条有效规则";
                return;
            }

            $scope.fee_edit_warning = "";
        }, true);

        $scope.fees_confirm = function() {
            var buf = [];
            for(let x of $scope.fee_rules_buf) {
                if((x.hour>0)&&(x.fee!=null)){
                    for(let y of buf) {
                        if(x.hour == y.hour) {
                            $scope.fee_edit_warning = "规则重复！";
                            return;
                        }
                    }
                    buf.push(x);
                }
            }
            if(buf.length == 0){
                $scope.fee_edit_warning = "至少设置一条有效规则";
                return;
            }

            $scope.fee_edit_warning = "";
            buf.sort(compare);

            $scope.fee_rules_buf = buf;
            $scope.fee_rules_info = "";
            fee_rules = {};
            // console.log(fee_rules);
            for(let i of $scope.fee_rules_buf) {
                $scope.fee_rules_info += i.hour+"小时/"+i.fee+"元"+" ";
                fee_rules[i.hour] = i.fee;
            }

            // console.log($scope.fee_rules_buf);
            // console.log(fee_rules);
            $('#ChooseFeeDetail').modal('hide')
        }

        $scope.fees_cancle = function() {
            let keys = Object.keys(fee_rules);

            $scope.fee_rules_buf = [];
            // console.log(fee_rules);

            for(keys in fee_rules) {
                $scope.fee_rules_buf.push({hour: parseInt(keys), fee: fee_rules[keys]});
            }

            // console.log($scope.fee_rules_buf);
            $scope.fee_edit_warning = "";
            $('#ChooseFeeDetail').modal('hide')
        }

        $scope.fee_rule_add = function () {
            $scope.fee_rules_buf.unshift({});
        };
        $scope.fee_rule_detele = function (index) {
            $scope.fee_rules_buf.splice(index, 1);
        };


    	$scope.getMap = function(){
            if (!$scope.info.show_map) {
               $scope.info.show_map = true;
            initMap();
            };

        }
        function initMap(){
            $timeout(function(){
                map = new BMap.Map("point");
                geoc = new BMap.Geocoder();
                map.centerAndZoom(new BMap.Point(121.061884,31.748181), 11);
                map.centerAndZoom('上海',11);
                map.addEventListener("click", showInfo);
                map.enableScrollWheelZoom();
                map.enableContinuousZoom();
            }, 800);
            function showInfo(e){
                $scope.$apply(function(){
                    map.clearOverlays();
                    // $scope.station.lnglat = e.point.lng + "," + e.point.lat;
                    $scope.info.lat = e.point.lat;
                    $scope.info.lng = e.point.lng;
                    var pt = e.point;
                    map.centerAndZoom(pt, 16);
                    map.addOverlay(new BMap.Marker(pt));
                    geoc.getLocation(pt,function(rs){
                        var addComp = rs.addressComponents;
                        $scope.$apply(function(){
                            $scope.info.address = addComp.province + addComp.city  + addComp.district  + addComp.street  + addComp.streetNumber;
                        })
                    })
                })
            }
        }
        $scope.getCity = function(){
                if($scope.info.address != ""){
                    // 创建地址解析器实例
                    var myGeo = new BMap.Geocoder();
                    // 将地址解析结果显示在地图上,并调整地图视野
                    myGeo.getPoint($scope.info.address, function(point) {
                        if (point) {
                        	$scope.$apply(function(){
	                            $scope.info.lat = point.lat;
	                            $scope.info.lng = point.lng;
	                            map.centerAndZoom(point, 16);
	                            map.addOverlay(new BMap.Marker(point));
                        	})
                        } else {
                            alert("您选择地址没有解析到结果!");
                        }
                    }, "北京市");
                }
        }
        $scope.AddressOk = function(){
            $scope.station.lnglat = $scope.info.lng + "," + $scope.info.lat;
        	$('#LocationModal').modal('hide')
        }
        $scope.goback = function(){
        	$state.go('main.station/list',{},{
        		reload:'main.station/list'
        	})
        }
        $scope.submit = function(){
            var frog = [],
                recommend = [],
                copemate = [],
                elec = [],
                other = []
            $scope.station.open_at = $scope.station.open_at_st + '-' + $scope.station.open_at_et
            if ($scope.station.name === '') {
                DialogService.alert('请输入站点名称');
                return false;
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
                return false;
            }
            if ($scope.enterprise.parent_id === '') {
                DialogService.alert('请选择归属公司');
                return false;
            }
            if ($scope.station.lnglat === '') {
                DialogService.alert('请输入经纬度');
                return false;
            }else{
                var parts = $scope.station.lnglat.split(',');
                $scope.station.longitude = parts[0];
                $scope.station.latitude = parts[1];
            }
            if ($scope.provinceOption !== null) {
                $scope.station.province_id = $scope.provinceOption.id;
                $scope.station.province = $scope.provinceOption.name;
            } else {
                DialogService.alert('请选择省');
                return false;
            }
            if ($scope.cityOption !== null && $scope.cityOption.id !== 0) {
                $scope.station.city_id = $scope.cityOption.id;
                $scope.station.city = $scope.cityOption.name;
            } else {
                DialogService.alert('请选择市');
                return false;
            }
            if ($scope.districtOption !== null && $scope.districtOption.id !== 0) {
                $scope.station.district_id = $scope.districtOption.id;
                $scope.station.district = $scope.districtOption.name;
            } else {
                DialogService.alert('请选择区/县');
                return false;
            }
            // if ($scope.station.address === '') {
            //     DialogService.alert('请输入详细地址');
            //     return false;
            // }
            // if ($scope.station.contacts === '') {
            //     DialogService.alert('请输入联系人');
            //     return false;
            // }
            // if ($scope.station.phone === '') {
            //     DialogService.alert('请输入联系电话');
            //     return false;
            // }
            if (!(/^[1][34587][0-9]{9}$/.test($scope.station.phone))) {
                DialogService.alert('联系电话格式不正确');
                return false;
            }
            // if ($scope.station.emergent_contacts === '') {
            //     DialogService.alert('请输入紧急联系人');
            //     return false;
            // }
            // if ($scope.station.emergent_phone === '') {
            //     DialogService.alert('请输入紧急联系电话');
            //     return false;
            // }
            if ($scope.station.status === '') {
                DialogService.alert('请选择站点状态');
                return false;
            }
            // if($scope.station.office_description === ''){
            //     DialogService.alert('请输入官方描述')
            //     return false
            // }
            // if($scope.station.construction_site === ''){
            //     DialogService.alert('请选择建筑场所')
            //     return false
            // }
            if($scope.station.prime_cost === ''){
                DialogService.alert('请输入电费成本')
                return false
            }
            if($scope.station.frog_account_ratio + $scope.station.recommend_account_ratio + $scope.station.copemate_account_ratio + $scope.station.other_account_ratio > 100){
                DialogService.alert('分账比例不能超过100')
                return false
            }
            for(var i in $scope.frogList){
                if($scope.frogList[i].user_id  == $scope.Frog.user_id){
                    frog.push($scope.frogList[i])
                    break
                }
            }
            for(var j in $scope.recommendList){
                if($scope.recommendList[i].user_id  == $scope.Recommend.user_id){
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
            var condition = {
                id:$scope.station.id,
                name:$scope.station.name,
                enterprise_id:$scope.enterprise.parent_id,
                fee_detail:{
                    // '3600':$scope.one_hour*100,
                    // '7200':$scope.two_hour*100,
                    // '36000':$scope.charge_full*100
                    },
                pic_ids:[],
                province_id:$scope.provinceOption.id,
                city_id:$scope.cityOption.id,
                district_id:$scope.districtOption.id,
                province:$scope.provinceOption.name,
                city:$scope.cityOption.name,
                district:$scope.districtOption.name,
                address:$scope.station.address,
                longitude:$scope.station.longitude,
                latitude:$scope.station.latitude,
                provider:$scope.station.provider,
                built_date:$scope.station.built_date,
                open_at:$scope.station.open_at,
                contacts:$scope.station.contacts,
                phone:$scope.station.phone,
                emergent_contacts:$scope.station.emergent_contacts,
                emergent_phone:$scope.station.emergent_phone,
                remarks:$scope.station.remarks,
                status:$scope.station.status,
                office_description:$scope.station.office_description,
                parking_fee:$scope.station.parking_fee,
                dc_costfee:$scope.station.dc_costfee,
                ac_costfee:$scope.station.ac_costfee,
                construction_site:$scope.station.construction_site,
                type:$scope.station.type,
                type_display:$scope.station.type_display,
                parking_desc:$scope.station.parking_desc,
                open_forbin_date:$scope.station.open_forbin_date,
                prime_cost:$scope.station.prime_cost,
                recommend_account_ratio:$scope.station.recommend_account_ratio,
                copemate_account_ratio:$scope.station.copemate_account_ratio,
                frog_account_ratio:$scope.station.frog_account_ratio,
                other_account_ratio:$scope.station.other_account_ratio,
                frog_account_detail:frog,
                recommend_account_detail:recommend,
                copemate_account_detail:copemate,
                elec_account_detail:elec,
                other_account_detail:other,
                account_standard:$scope.station.account_standard
            }

            for(let i of $scope.fee_rules_buf) {
                condition.fee_detail[i.hour*3600] = i.fee*100;
            }

            console.log(condition)
            StationService.update(condition).then(function(res){
                DialogService.alert('更新成功')
                $timeout(function(){
                    $state.go('main.station/list',{},{
                        reload:'main.station/list'
                    })
                },2000)
            },function(res){
                DialogService.alert(res.msg)
            })

        }
    }
])
