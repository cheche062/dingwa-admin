(function(){
    var $WebUpload = function(pictureId,url,uploadUrl) {
        this.pictureId = pictureId;
        this.uploadBtnId = pictureId + "Btn";
        this.uploadPreId = pictureId + "List";
        this.uploadUrl = uploadUrl;
        this.fileSizeLimit = 10 * 1024 * 1024;
        this.picWidth = 100;
        this.picHeight = 100;
        this.fileNumLimit = 2;
        this.url = url
    };

        $WebUpload.prototype = {
            /*** 初始化webUploader*/
            init : function() {
                        var uploader = this.create();
                        this.bindEvent(uploader);
                        return uploader;
            },
            /*** 创建webuploader对象*/
            create : function() {
                   var webUploader = WebUploader.create({
                       auto : true,
                       pick : {
                           id : '#' + this.uploadBtnId,
                           multiple : false,// 只上传一个
                       },
                       accept : {
                           title : 'Images',
                           extensions : 'gif,jpg,jpeg,bmp,png',
                           mimeTypes: 'image/jpg,image/jpeg,image/bmp,image/png'
                       },
                       swf : this.url + '/static/css/plugins/webuploader/Uploader.swf',
                       disableGlobalDnd : true,
                       duplicate : true,
                       server : this.uploadUrl,
                       fileSingleSizeLimit : this.fileSizeLimit,
                       fileNumLimit:this.fileNumLimit
                   })
                   return webUploader;
            },
            /*** 绑定事件*/
            bindEvent : function(bindedObj) {
                            var me =  this;
                            bindedObj.on('fileQueued', function(file) {
                                // var $li = $('<div><span id="'+file.id+'"><i class="fa fa-times"></i></span>'+
                                //     '<img width="100px" height="100px"></div>');
                                // var $img = $li.find('img');

                                // $("#" + me.uploadPreId).html($li);
                                var $li = $(
                                        '<div id="' + file.id + '" class="file-item thumbnail" style="position:relative">' +
                                        '<span id="'+file.id+'"><i class="fa fa-times"></i></span>'+
                                            '<img width="100px" height="100px">' +
                                            '<div class="info">' + file.name + '</div>' +
                                        '</div>'
                                        ),
                                    $img = $li.find('img'),
                                    // $list = $('#fileList')
                                    $list = $('#'+me.pictureId+'List')
                                    $list.append( $li );
                                    $li.on('click', '#'+file.id, function(){
                                    $("#"+file.id).remove();
                                        bindedObj.removeFile(file,true);
                                    })
                                // 生成缩略图
                                bindedObj.makeThumb(file, function(error, src) {
                                    if (error) {
                                        $img.replaceWith('<span>不能预览</span>');
                                        return;
                                    }
                                    $img.attr('src', src);
                                }, me.picWidth, me.picHeight);
                            });

                            // // 文件上传过程中创建进度条实时显示。
                            // bindedObj.on('uploadProgress', function(file, percentage) {

                            // });

                            // // 文件上传成功，给item添加成功class, 用样式标记上传成功。
                            // bindedObj.on('uploadSuccess', function(file,response) {
                            //     $scope.$apply(function(){
                            //         DialogService.alert("上传成功");
                            //     })
                            //     // $("#" + me.pictureId).val(response._raw);
                            //     $( '#'+me.picturedId).addClass('upload-state-done');
                            // });

                            // // 文件上传失败，显示上传出错。
                            // bindedObj.on('uploadError', function(file) {
                            //     var $li = $( '#'+file.id ),
                            //     $error = $li.find('div.error');
                            //     // 避免重复创建
                            //     if ( !$error.length ) {
                            //         $error = $('<div class="error"></div>').appendTo( $li );
                            //     }

                            //     $error.text('上传失败');
                            //     // DialogService.alert("上传失败");
                            // });

                            // 其他错误
                            bindedObj.on('error', function(type) {
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
                                        DialogService.alert("图片选择重复");
                                    })
                                } else {
                                    $scope.$apply(function(){
                                        DialogService.alert("上传过程中出错");
                                    })
                                }
                            });

                            // 完成上传完了，成功或者失败
                            bindedObj.on('uploadComplete', function(file) {

                            });
            },
        }
    window.$WebUpload = $WebUpload;
}());