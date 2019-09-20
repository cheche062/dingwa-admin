angular.module("StationAddController", ["CommonService", "StationService"])
.controller("StationAddCtrl", ["$scope", "$state", "$timeout","StationService","DialogService","DictService","ConfigService",
    function( $scope, $state,$timeout, StationService,DialogService,DictService,ConfigService) {
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
            show_map:false,
            name:'',
            fee_detail:{
            	'3600':'',
            	'7200':'',
            	'36000':''
            },
            pic:'',
            address:'',
            lng:'',
            lat:'',
            provider:'1',
            built_date:'',
            open_at:'',
            contacts:'',
            phone:'',
            emergent_contacts:'',
            emergent_phone:'',
            remarks:'',
            status:'1',
            office_description:'',
            parking_fee:'',
            dc_costfee:'',
            ac_costfee:'',
            logo_id:'',
            logo_app_id:'',
            construction_site:'1',
            type:'1',
            type_display:'0',
            parking_desc:'',
            open_forbin_date:'',
            prime_cost:0,
            recommend_account_ratio:0,
            copemate_account_ratio:0,
            frog_account_ratio:0,
            other_account_ratio:0,
            recommend_account_detail:'',
            copemate_account_detail:'',
            elec_account_detail:'',
            frog_account_detail:'',
            other_account_detail:'',
            open_at_st: '00:00',
            open_at_et: '23:59',
            longitude:'',
            latitude:'',
            lnglat:'',
            detail_address:'',
            account_standard:'1'

        }
    	$scope.enterprise = {
    		parent_id:''
    	}

        var fee_rules = {10: 2};
        $scope.fee_rules_info = "10小时/2元";
        $scope.fee_rules_buf = [{hour: 10, fee: 2}];
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
            $scope.info.lnglat = $scope.info.lng + "," + $scope.info.lat;
        	$('#LocationModal').modal('hide')
        }
        $scope.goback = function(){
        	$state.go('main.station/list',{},{
        		reload:'main.station/list'
        	})
        }
        $scope.$watch('enterprise.parent_id',function(newValue,oldValue){
            if(newValue == oldValue){
                return false
            }
            getEnterpriseLevel()
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

        function getEnterpriseLevel(){
            var condition = {
                type: "enterprise"
            };
            DictService.search(condition).then(function(data) {
                $scope.Enterprises =  data
            }, function(code) {});

            // for(var i in $scope.Enterprises){
            //     if($scope.enterprise.parent_id == $scope.Enterprises[i].id){
            //         $scope.EnterpriseLevel = $scope.Enterprises[i].level
            //     }
            // }
        }

            // (function(){
            //     var $WebUpload = function(pictureId) {
            //         this.pictureId = pictureId;
            //         this.uploadBtnId = pictureId + "Btn";
            //         this.uploadPreId = pictureId + "List";
            //         this.uploadUrl = ConfigService.API + '/user/upload';
            //         this.fileSizeLimit = 10 * 1024 * 1024;
            //         this.picWidth = 100;
            //         this.picHeight = 100;
            //         this.fileNumLimit = 2;
            //         this.name = pictureId
            //     };

            //     $WebUpload.prototype = {
            //         /*** 初始化webUploader*/
            //         init : function(){
            //             var uploader = this.create();
            //             this.bindEvent(uploader);
            //             return uploader;
            //         },
            //          /*** 创建webuploader对象*/
            //          create : function() {
            //                 var webUploader = WebUploader.create({
            //                     auto : true,
            //                     pick : {
            //                         id : '#' + this.uploadBtnId,
            //                         multiple : false,// 只上传一个
            //                     },
            //                     accept : {
            //                         title : 'Images',
            //                         extensions : 'gif,jpg,jpeg,bmp,png',
            //                         mimeTypes: 'image/jpg,image/jpeg,image/bmp,image/png'
            //                     },
            //                     swf : ConfigService.API + '/static/css/plugins/webuploader/Uploader.swf',
            //                     disableGlobalDnd : true,
            //                     duplicate : true,
            //                     server : this.uploadUrl,
            //                     fileSingleSizeLimit : this.fileSizeLimit,
            //                     fileNumLimit:this.fileNumLimit
            //                 })
            //                 return webUploader;
            //          },
            //          /*** 绑定事件*/
            //          bindEvent : function(bindedObj) {
            //                 var me =  this;
            //                 bindedObj.on('fileQueued', function(file) {
            //                     // var $li = $('<div><span id="'+file.id+'"><i class="fa fa-times"></i></span>'+
            //                     //     '<img width="100px" height="100px"></div>');
            //                     // var $img = $li.find('img');

            //                     // $("#" + me.uploadPreId).html($li);
            //                     var $li = $(
            //                             '<div id="' + file.id + '" class="file-item thumbnail" style="position:relative">' +
            //                             '<span id="'+file.id+'"><i class="fa fa-times"></i></span>'+
            //                                 '<img width="100px" height="100px">' +
            //                                 '<div class="info">' + file.name + '</div>' +
            //                             '</div>'
            //                             ),
            //                         $img = $li.find('img'),
            //                         // $list = $('#fileList')
            //                         $list = $('#'+me.pictureId+'List')
            //                         $list.append( $li );
            //                         $li.on('click', '#'+file.id, function(){
            //                         $("#"+file.id).remove();
            //                             bindedObj.removeFile(file,true);
            //                         })
            //                     // 生成缩略图
            //                     bindedObj.makeThumb(file, function(error, src) {
            //                         if (error) {
            //                             $img.replaceWith('<span>不能预览</span>');
            //                             return;
            //                         }
            //                         $img.attr('src', src);
            //                     }, me.picWidth, me.picHeight);
            //                 });

            //                 // 文件上传过程中创建进度条实时显示。
            //                 bindedObj.on('uploadProgress', function(file, percentage) {

            //                 });

            //                 // 其他错误
            //                 bindedObj.on('error', function(type) {
            //                     if ("Q_EXCEED_SIZE_LIMIT" == type) {
            //                         $scope.$apply(function(){
            //                             DialogService.alert("文件大小超出了限制");
            //                         })
            //                     } else if ("Q_TYPE_DENIED" == type) {
            //                         $scope.$apply(function(){
            //                             DialogService.alert("文件类型不满足");
            //                         })
            //                     } else if ("Q_EXCEED_NUM_LIMIT" == type) {
            //                         $scope.$apply(function(){
            //                             DialogService.alert("上传数量超过限制");
            //                         })
            //                     } else if ("F_DUPLICATE" == type) {
            //                         $scope.$apply(function(){
            //                             DialogService.alert("图片选择重复");
            //                         })
            //                     } else {
            //                         $scope.$apply(function(){
            //                             DialogService.alert("上传过程中出错");
            //                         })
            //                     }
            //                 });

            //                 // 完成上传完了，成功或者失败
            //                 bindedObj.on('uploadComplete', function(file) {

            //                 });
            //          },
            //     }
            //     window.$WebUpload = $WebUpload;
            // }());
            //站点图片
            var upload = new $WebUpload("filePicker",ConfigService.API);
            var upload1 = upload.init();
            //  文件上传成功，给item添加成功class, 用样式标记上传成功。
            upload1.on('uploadSuccess', function(file,response) {
                $scope.$apply(function(){
                    DialogService.alert("上传成功");
                })
                // $("#" + me.pictureId).val(response._raw);
                $( '#'+me.picturedId).addClass('upload-state-done');
            });
            // 文件上传失败，显示上传出错。
            upload1.on('uploadError', function(file) {
                var $li = $( '#'+file.id ),
                $error = $li.find('div.error');
                // 避免重复创建
                if ( !$error.length ) {
                    $error = $('<div class="error"></div>').appendTo( $li );
                }

                $error.text('上传失败');
                // DialogService.alert("上传失败");
            });
            //app图片
            var appUpload = new $WebUpload("appPicker",ConfigService.API);
            var upload2 = appUpload.init();
               //  文件上传成功，给item添加成功class, 用样式标记上传成功。
                upload2.on('uploadSuccess', function(file,response) {
                    $scope.$apply(function(){
                        DialogService.alert("上传成功");
                    })
                    // $("#" + me.pictureId).val(response._raw);
                    $( '#'+me.picturedId).addClass('upload-state-done');
                });

               //  // 文件上传失败，显示上传出错。
               upload2.on('uploadError', function(file) {
                    var $li = $( '#'+file.id ),
                    $error = $li.find('div.error');
                    // 避免重复创建
                    if ( !$error.length ) {
                        $error = $('<div class="error"></div>').appendTo( $li );
                    }

                    $error.text('上传失败');
                    // DialogService.alert("上传失败");
                });
        $scope.submit = function(){
            var frog = [],
                recommend = [],
                copemate = [],
                elec = [],
                other = []
            $scope.info.open_at = $scope.info.open_at_st + '-' + $scope.info.open_at_et
            if ($scope.info.name === '') {
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
                $scope.info.loading = false;
                return false;
            }
            if ($scope.enterprise.parent_id === '') {
                DialogService.alert('请选择归属公司');
                return false;
            }
            if ($scope.info.lnglat === '') {
                DialogService.alert('请输入经纬度');
                return false;
            }else{
                var parts = $scope.info.lnglat.split(',');
                $scope.info.longitude = parts[0];
                $scope.info.latitude = parts[1];
            }
            if ($scope.provinceOption !== null) {
                $scope.info.province_id = $scope.provinceOption.id;
                $scope.info.province = $scope.provinceOption.name;
            } else {
                DialogService.alert('请选择省');
                return false;
            }
            if ($scope.cityOption !== null && $scope.cityOption.id !== 0) {
                $scope.info.city_id = $scope.cityOption.id;
                $scope.info.city = $scope.cityOption.name;
            } else {
                DialogService.alert('请选择市');
                return false;
            }
            if ($scope.districtOption !== null && $scope.districtOption.id !== 0) {
                $scope.info.district_id = $scope.districtOption.id;
                $scope.info.district = $scope.districtOption.name;
            } else {
                DialogService.alert('请选择区/县');
                return false;
            }
            // if ($scope.info.detail_address === '') {
            //     DialogService.alert('请输入详细地址');
            //     return false;
            // }
            // if ($scope.info.contacts === '') {
            //     DialogService.alert('请输入联系人');
            //     return false;
            // }
            // if ($scope.info.phone === '') {
            //     DialogService.alert('请输入联系电话');
            //     return false;
            // }
            if ($scope.info.phone !== '' && !(/^[1][34587][0-9]{9}$/.test($scope.info.phone))) {
                DialogService.alert('联系电话格式不正确');
                return false;
            }
            // if ($scope.info.emergent_contacts === '') {
            //     DialogService.alert('请输入紧急联系人');
            //     return false;
            // }
            // if ($scope.info.emergent_phone === '') {
            //     DialogService.alert('请输入紧急联系电话');
            //     return false;
            // }
            if ($scope.info.status === '') {
                DialogService.alert('请选择站点状态');
                return false;
            }
            // if($scope.info.office_description === ''){
            //     DialogService.alert('请输入官方描述')
            //     return false
            // }
            // if($scope.info.construction_site === ''){
            //     DialogService.alert('请选择建筑场所')
            //     return false
            // }
            // if($scope.info.construction_site === ''){
            //     DialogService.alert('请选择建筑场所')
            //     return false
            // }
            // if($scope.info.parking_desc == ''){
            //     DialogService.alert('请输入停车费详情')
            //     return false
            // }
            if($scope.info.frog_account_ratio + $scope.info.recommend_account_ratio + $scope.info.copemate_account_ratio + $scope.info.other_account_ratio > 100){
                DialogService.alert('分账比例不能超过100')
                return false
            }
            if($scope.info.prime_cost === ''){
                DialogService.alert('请输入电费成本')
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
                name:$scope.info.name,
                enterprise_id:$scope.enterprise.parent_id,
                fee_detail:{
                    // '3600':$scope.one_hour*100,
                    // '7200':$scope.two_hour*100,
                    // '36000':$scope.charge_full*100
                    },
                province_id:$scope.provinceOption.id,
                city_id:$scope.cityOption.id,
                district_id:$scope.districtOption.id,
                province:$scope.provinceOption.name,
                city:$scope.cityOption.name,
                district:$scope.districtOption.name,
                address:$scope.info.detail_address,
                longitude:$scope.info.longitude,
                latitude:$scope.info.latitude,
                provider:$scope.info.provider,
                built_date:$scope.info.built_date,
                open_at:$scope.info.open_at,
                contacts:$scope.info.contacts,
                phone:$scope.info.phone,
                emergent_contacts:$scope.info.emergent_contacts,
                emergent_phone:$scope.info.emergent_phone,
                remarks:$scope.info.remarks,
                status:$scope.info.status,
                office_description:$scope.info.office_description,
                parking_fee:$scope.info.parking_fee,
                dc_costfee:$scope.info.dc_costfee,
                ac_costfee:$scope.info.ac_costfee,
                construction_site:$scope.info.construction_site,
                type:$scope.info.type,
                type_display:$scope.info.type_display,
                parking_desc:$scope.info.parking_desc,
                open_forbin_date:$scope.info.open_forbin_date,
                prime_cost:$scope.info.prime_cost,
                frog_account_ratio:$scope.info.frog_account_ratio,
                recommend_account_ratio:$scope.info.recommend_account_ratio,
                copemate_account_ratio:$scope.info.copemate_account_ratio,
                other_account_ratio:$scope.info.other_account_ratio,
                frog_account_detail:frog,
                recommend_account_detail:recommend,
                copemate_account_detail:copemate,
                elec_account_detail:elec,
                other_account_detail:other,
                account_standard:$scope.info.account_standard

            }

            for(let i of $scope.fee_rules_buf) {
                condition.fee_detail[i.hour*3600] = i.fee*100;
            }

            console.log(condition)
            StationService.add(condition).then(function(res){
                DialogService.alert('添加成功')
                $timeout(function(){
                    $state.go('main.station/list',{},{
                        reload:'main.station/list'
                    })
                },2000)
            },function(res){
                if(res.msg != ''){
                    DialogService.alert(res.msg)
                }
            })


        }
    }
])
