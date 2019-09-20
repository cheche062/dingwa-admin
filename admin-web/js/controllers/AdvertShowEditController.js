angular.module('AdvertShowEditController',['CommonService','AdvertService'])
	   .controller('AdvertShowEditCtrl',['$scope','$state','$stateParams','AdvertService','ConfigService','DialogService',function($scope,$state,$stateParams,AdvertService,ConfigService,DialogService){
	   	/*提交修改*/
	   	$scope.submit = function(){
	   		var condition = {
	   			id:$scope.info.id,
	   			name:$scope.info.name,
	   			type:$scope.info.type,
	   			rotation:$scope.info.rotation,
	   			standby:$scope.info.standby,
	   			pic_ids:$scope.imgarr
	   		}
            if(condition.pic_ids.length == 0){
                DialogService.alert('请选择图片')
                return false
            }
            else{
    	   		AdvertService.update(condition).then(function(rep){
    	   			console.log(rep)
    	   			$state.go('main.advert/show') 
    	   		},function(err){
    	   			console.log(err)
    	   		})     
            }
	   	}
        $scope.delete = function($event){
            var parent = $event.target.parentElement.parentElement
            var id = $event.target.id
            parent.remove()
            if($scope.imgarr.length >1){
                $scope.imgarr = $scope.imgarr.filter(function(index) {
                    return index != id;
                });
            }else{
                $scope.imgarr = []
            }
            console.log($scope.imgarr)

        }
	   	$scope.imgarr = []
	   	init()
	    function init() {
	    	condition = {
	    		id:$stateParams.id
	    	}
            AdvertService.get(condition).then(function(rep) {
            	console.log(rep)
            	$scope.info = rep.data.data
            	for (var i = 0; i < $scope.info.pics.length; i++) {
			   		$scope.imgarr.push($scope.info.pics[i].id)
			   	}
            }, function(code) {});
        }
        /*上传图片*/
        var pic_ids = []
	   	var BASE_URL = './Webuploader.Uploader.swf';
        var uploader = new WebUploader.Uploader({
            auto: true,
            swf: BASE_URL + '/js/Uploader.swf',
            server: ConfigService.API + '/system/ad/upload',
            pick: '#filePicker',
            fileNumLimit:3,
            multiple:false,
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/jpg,image/jpeg,image/bmp,image/png'
            }
        });
        uploader.on('fileQueued',function(file,num) {
            var $li = $(
                    '<div id="' + file.id + '" class="file-item thumbnail" style="position:relative">' +
                    '<span id="'+file.id+'"><i class="fa fa-times"></i></span>'+
                        '<img>' +
                        '<div class="info">' + file.name + '</div>' +
                       
                    '</div>'
                    ),
                $img = $li.find('img');
            var $list = $('#fileList')
            
            $list.append( $li );
            $li.on('click', '#'+file.id, function(){
            $("#"+file.id).remove();
            uploader.removeFile(file,true);
            })
            
            uploader.makeThumb( file, function( error, src ){
                if ( error ) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }

                $img.attr( 'src', src );
            }, 100, 100 );
        });
        /*上传前判断文件数*/
        uploader.on('beforeFileQueued',function(handle){
        	if($scope.imgarr.length == 3){
        		$scope.$apply(function(){
        			DialogService.alert('最多只能上传三张图片')
        		})
        	   return false
            }
        })
        // 文件上传过程中创建进度条实时显示。
        uploader.on( 'uploadProgress', function( file, percentage ) {
            var $li = $( '#'+file.id ),
                $percent = $li.find('.progress');
            $('#filePicker input').attr({
                disabled: true,
            });

            // 避免重复创建
            if ( !$percent.length ) {
                $percent = $('<p class="progress"></p>')
                        .appendTo( $li )
                        .find('span');
            }
            $percent.css( 'width', percentage * 100 + '%' );
        });

        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
        uploader.on( 'uploadSuccess', function( file,rep) {
            // pic_ids.push(rep.pic_id)
            $scope.imgarr.push(rep.pic_id)
            $( '#'+file.id ).addClass('upload-state-done');
            $('#filePicker input').attr({disabled: false,});
            $('.webuploader-pick').text('继续上传')
        });

        // 文件上传失败，显示上传出错。
        uploader.on( 'uploadError', function( file ) {
            $('#filePicker input').attr({disabled: false,});
            var $li = $( '#'+file.id ),
                $error = $li.find('div.error');
                uploader.removeFile(file,true);
                $('.webuploader-pick').text('重新上传')

            // 避免重复创建
            if ( !$error.length ) {
                $error = $('<div class="error"></div>').appendTo( $li );
            }
            $error.text('上传失败');
        });
        uploader.on('error',function(type){
            if(type == 'Q_EXCEED_NUM_LIMIT'){
                $scope.$apply(function(){
                    DialogService.alert('最多只能选择三张图片')   
                })
            }
        })

        // 完成上传完了，成功或者失败，先删除进度条。
        uploader.on( 'uploadComplete', function( file ) {
            $( '#'+file.id ).find('.progress').remove();
        });

	   }])