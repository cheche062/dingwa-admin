angular.module("UpgradePackageController", ['CommonService', 'UpgradeService'])
.controller("UpgradePackageCtrl", ['$scope', '$state','$timeout', 'UpgradeService', 'ConfigService', 'DialogService',  'DictService',
 function($scope, $state, $timeout,UpgradeService, ConfigService, DialogService,  DictService){
 	var now = new Date()
 	var storage = window.localStorage;
 	if (storage.getItem('UserAuth') !== null) {
 	    $scope.UserAuth = JSON.parse(storage.getItem('UserAuth'));
 	    console.log($scope.UserAuth)
 	}
    $scope.EnterpriseID = storage.getItem('EnterpriseID')
    $("input[id^='start-date']").datepicker({
    	language: 'zh-CN',
        startView: 0,
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayBtn: false,
        endDate: formatDate(now), //禁止选择当天之后的日期
        todayHighlight: true
    })
	$scope.info = {
		created_st:'',
		created_et:'',
		pack_name: "",
		pack_id:"",
		soft_version: "",
		model: "",
		offset: 0,
		limit: 20,
		order_by: "created_at",
		order: "desc",
		total: 0,
		pageCnt: 0,
		page: 1,
		upload_path: '',
		show_error: false,
		apply_version: '',
        current_id: ''
	};
    $scope.enterprise = {
        parent_id:''
    }
    $scope.fileDetail = {
        ver: "",
        model: "",
        apver: "",
        len: "",
        sum: "",
        dbytes: "",
        upmode: "TCP"
    }
    $scope.file = ''
	$scope.packages = [];
	$scope.manufacturerOption = {upgrade_id: '0', name: '全部'};
	init();
	function init() {
		loadPackages();
	};
	function loadPackages() {
		var condition = {
			created_st:$scope.info.created_st,
			created_et:$scope.info.created_et,
			pack_name:$scope.info.pack_name,
			pack_id:$scope.info.pack_id,
			soft_version:$scope.info.soft_version,
			model:$scope.info.model,
			offset: $scope.info.offset,
			limit: $scope.info.limit,
			order_by: $scope.info.order_by,
			order: $scope.info.order,
			total: $scope.info.total,
		};
		UpgradeService.searchPackage(condition).then(function(res){
			console.log(res.data.list)
			$scope.packages = res.data.list;
			$scope.info.total = res.data.total;
			$scope.info.pageCnt = Math.ceil(res.data.total / $scope.info.limit);
		}, function(res) {
			if(res.msg != ''){
				DialogService.alert(res.msg)
			}
		})
	}
	$scope.startPaging = function() {
	    loadPackages();
	};
	$scope.search = function(){
		$scope.info.offset = 0;
		$scope.info.page = 1;
		loadPackages();
	};



    // $("#addImgInput").uploadify({
    //     auto: false,
    //     swf: 'uploadify/uploadify.swf',
    //     uploader: ConfigService.API + '/station/device/newUpload',
    //     width: 150,
    //     height: 30,
    //     buttonText: "选择压缩包",
    //     queueSizeLimit: 1,
    //     fileTypeDesc: '请选择压缩包',
    //     fileTypeExts: '*.zip;*.rar',
    //     // fileSizeLimit: 100,
    //     // onSelect: function() {
    //     //     if ($scope.station_pics.length >= 3) {
    //     //         alert("最多选择3张图片");
    //     //         return false;
    //     //     };
    //     // },
    //     onUploadSuccess: function(file, data, response) {
    //         console.log(file)
    //         console.log(data)
    //         console.log(response)
    //         if (data == 'fail') {
    //             DialogService.alert("升级包上传失败\n"+"如果升级文件过大，建议先将升级文件手动上传到相应服务器");
    //             return false;
    //         };
    //         $scope.info.upload_path = data;

    //     },
    //     onUploadError: function(file, data, response) {
    //         DialogService.alert("升级包上传失败\n"+"如果升级文件过大，建议先将升级文件手动上传到相应服务器")

    //     },

    // });
    	var uploader
	  $(function () {
		var _$modal = $("#UploadPackage");
		_$modal.css('display','block');
		_$modal.addClass("webuploader-element-invisible");

		    $scope.uploader = WebUploader.create({
		    	auto:false,
			    // swf文件路径
			    swf: '/js/Uploader.swf',
			    accept:{
			    	title: 'Images',
				    extensions: 'bin',
				    mimeTypes: '*.bin',
			    },
			    // 文件接收服务端。
			    server: ConfigService.API+'/device/device/newupload',

			    // 选择文件的按钮。可选。
			    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
			    pick: '#filePickerBtn',

			    fileNumLimit:1,

			    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
			    resize: false
			});
			// 当有文件被添加进队列的时候
			$scope.uploader.on( 'fileQueued', function( file ) {
				var $list = $('#thelist')
			    var $li = $( '<div id="' + file.id + '" class="item">'+
			    	'<span id="'+file.id+'"><i class="iconfont icon-close"></i></span>'+
			        '<h4 class="fileinfo">' + file.name + '</h4>' +
			        '<p class="state">等待上传...</p>' +
			    '</div>' );
			    $list.append($li)
			    $li.on('click', '#'+file.id, function(){
                	$("#"+file.id).remove();
                    $scope.uploader.removeFile(file,true);
                })
			});
			$scope.uploader.on( 'uploadSuccess', function( file , response ) {
				console.log(response)
			    if(response.code == 0){
			    	$( '#'+file.id ).find('p.state').text('已上传');
			    	$scope.uploader.reset()
				    // $scope.$apply(function(){
				    // 	DialogService.alert('上传成功')
				    // })
                    $scope.path = response.data.path
				    // $scope.search()
			    }else{
			    	$scope.$apply(function(){
				    	DialogService.alert(response.msg)
				    })
			    }
			    // $timeout(function(){
			    // 	$('#UploadPackage').modal('hide')
			    // },1000)
			});

			$scope.uploader.on( 'uploadError', function( file ) {
			    $( '#'+file.id ).find('p.state').text('上传出错');
			    $scope.$apply(function(){
			    	DialogService.alert('上传出错')
			    })
			});
			// 其他错误
            $scope.uploader.on('error', function(type) {
                if ("Q_EXCEED_SIZE_LIMIT" == type) {
                    $scope.$apply(function(){
                        DialogService.alert("文件大小超出了限制");
                    })
                } else if ("Q_TYPE_DENIED" == type) {
                    $scope.$apply(function(){
                        DialogService.alert("文件类型不满足");
                    })
                } else if ("Q_EXCEED_NUM_LIMIT" == type) {
                    $scope.$apply(function(){
                        DialogService.alert("上传数量超过限制");
                    })
                } else if ("F_DUPLICATE" == type) {
                    $scope.$apply(function(){
                        DialogService.alert("压缩包选择重复");
                    })
                } else {
                    $scope.$apply(function(){
                        DialogService.alert("上传过程中出错");
                    })
                }
            });

			$scope.uploader.on( 'uploadComplete', function( file ) {
			    $( '#'+file.id ).find('.progress').fadeOut();
			});

		    _$modal.on("show.bs.modal", function () {
		        _$modal.removeClass("webuploader-element-invisible");
		    });
		});
	$scope.download = function(x){
		if (x.path_name == '' || x.file_name == '') {
			DialogService.alert("文件不存在！");

		}else {
			window.open(x.nfs_url)
		}
	}
	$scope.upload = function() {
		// if($scope.file == ''){
		// 	DialogService.alert('请选择压缩包')
		// 	return false
		// }
		$scope.uploader.upload()
	    // UpgradeService.newupload(condition).then(function(res){
	    // 	console.log(res)
	    // },function(res){
	    // 	if(res.code != 0){
	    // 		DialogService.alert(res.msg)
	    // 	}
	    // })
	};
    //上传成功后开始解压
    $scope.reduce = function(){
        if($scope.fileDetail.model == '') {
            DialogService.alert('请输入软件型号')
            return false
        }
        if($scope.fileDetail.ver == '') {
            DialogService.alert('请输入软件版本号')
            return false
        }
        if($scope.fileDetail.len <= 0) {
            DialogService.alert('请输入升级包大小')
            return false
        }
        if($scope.fileDetail.sum == '') {
            DialogService.alert('请输入升级包校验和')
            return false
        }
        if($scope.fileDetail.upmode == '') {
            DialogService.alert('请输入选择方式')
            return false
        }
        if($scope.fileDetail.dbytes <= 0) {
            DialogService.alert('请输入分段下载字节数')
            return false
        }
        if($scope.fileDetail.apver == '') {
            DialogService.alert('请输入适用版本号')
            return false
        }
        if($scope.enterprise.parent_id == ''){
            DialogService.alert('请选择归属公司')
            return false
        }
        if(!$scope.path){
            DialogService.alert('请先上传升级文件')
            return false
        }
        var condition = {
            path:$scope.path,
            enterprise_id:$scope.enterprise.parent_id,
            ver:$scope.fileDetail.ver,
            model:$scope.fileDetail.model,
            apver:$scope.fileDetail.apver,
            len: ''+$scope.fileDetail.len,
            sum:$scope.fileDetail.sum,
            dbytes: ''+$scope.fileDetail.dbytes,
            upmode:$scope.fileDetail.upmode
        }
        console.log(condition)

        UpgradeService.addpack(condition).then(function(res){
            console.log(res)
            $('#UploadPackage').modal('hide')
            $scope.search()
        })

    }
	// $scope.confirmUpload = function() {
	// 	if ($scope.info.upload_path !== '') {
 //            console.log($scope.enterprise.parent_id)
	// 		UpgradeService.uploadPackage($scope.info.upload_path,$scope.enterprise.parent_id).then(function(data){
	// 			DialogService.alert("上传成功");
	// 			$timeout(function(){
	// 				$state.go("main.upgrade/package", null, {reload: true});
	// 				$('.modal-backdrop').each(function(){
	// 				    $(this).removeClass("modal-backdrop")
	// 				})
	// 			}, 800)
	// 		}, function(code) {

	// 		})
	// 	} else{
	// 		DialogService.alert("请选择压缩包")

	// 	}
	// };
	$scope.editApplyVersion = function(){
		if ($scope.info.apply_version !==  '') {
			var condition = {
				id: $scope.info.current_id,
				apply_version: $scope.info.apply_version
			}
			UpgradeService.update(condition).then(function(data){
				loadPackages();
				$('#EditPackage').modal('hide');
			}, function(code){

			})
		}else{
			DialogService.alert('请输入适用软件版本')
		}
	}
}])
