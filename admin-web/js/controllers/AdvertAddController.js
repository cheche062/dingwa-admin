angular.module('AdvertAddController',['CommonService','AdvertService'])
	   .controller('AdvertAddCtrl',['$scope','ConfigService','DialogService','AdvertService','$state',function($scope,ConfigService,DialogService,AdvertService,$state){
	   	  $scope.info = {
	   	  	name:'',
	   	  	theme:'待机广告',
	   	  	time:0,
	   	  	keeponline:0,
	   	  	imgarr:[]
	   	  }
        /*添加广告*/
	   	$scope.submit = function(){
	   	  	  if($scope.info.name == ''){
	   	  	  	DialogService.alert('请输入广告名')
	   	  	  }else if(uploader.getFiles().length == 0){
	   	  	  	DialogService.alert('请选择图片')
	   	  	  }
	   	  	  else{	
                  var condition ={
                        name:$scope.info.name,
                        type:$scope.info.theme,
                        rotation:$scope.info.time,
                        standby:$scope.info.keeponline,
                        pic_ids:pic_ids
                  }
                  console.log(condition)
                  AdvertService.add(condition).then(function(rep){
                        console.log(rep)
                        $state.go('main.advert/show')
                  },function(err){

                  })
	   	  	  }
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
                extensions: 'gif,jpg,jpeg,bmp,png,bin,hex',
                mimeTypes: 'image/jpg,image/jpeg,image/bmp,image/png,.bin,.hex'
            }
        });
        uploader.on('fileQueued',function(file,num) {
            console.log(file)
            if(file.ext == 'jpg' || file.ext == 'bmp'||file.ext == 'jepg'|| file.ext == 'png'){
                var $li = $(
                    '<div id="' + file.id + '" class="file-item thumbnail" style="position:relative">' +
                    '<span id="'+file.id+'"><i class="fa fa-times"></i></span>'+
                        '<img>' +
                        '<div class="info">' + file.name + '</div>' +
                    '</div>'
                ),
                $img = $li.find('img');
                uploader.makeThumb( file, function( error, src ){
                if ( error ) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }

                $img.attr( 'src', src );
            }, 100, 100 );
            }else{
                var $li = $( '<div id="' + file.id + '" class="file-item" style="position:relative">'+
                    '<span id="'+file.id+'"></span>'+
                    '<h4 class="fileinfo">' + file.name + '</h4>' +
                '</div>' );
            }
            var $list = $('#fileList')
            $list.append( $li );
            $li.on('click', '#'+file.id, function(){
                $("#"+file.id).remove(); 
                uploader.removeFile(file,true);
            })
            // uploader.makeThumb( file, function( error, src ){
            //     if ( error ) {
            //         $img.replaceWith('<span>不能预览</span>');
            //         return;
            //     }

            //     $img.attr( 'src', src );
            // }, 100, 100 );
        });
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
            pic_ids.push(rep.pic_id)
            console.log(rep.pic_id)
            console.log(uploader.getFiles())
            $( '#'+file.id ).addClass('upload-state-done');
            $('#filePicker input').attr({disabled: false,});
            $scope.info.imgarr.push(file);
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