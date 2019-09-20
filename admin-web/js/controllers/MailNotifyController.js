angular.module("MailNotifyController", ["CommonService", "MailNotifyService"])
.controller("MailNotifyController", ["$scope", "$state","MailNotifyService","DialogService",
    function($scope, $state,MailNotifyService,DialogService) {
        $scope.mail_list = [];
        $scope.info = {
            emails: '',
            offset: 0,
            limit: 20,
            order_by: 'created_at',
            order: 'desc',
            pageCnt: 0,
            total: 0
        }
        $scope.mailAdd = {
            emails: '',
            type: '1'
        };
        $scope.mailEdit = {
            id: 0,
            emails: '',
            type: '1'
        };
        $scope.mailDetail = {};
        
        init()
        function init(){
            getMailsList();
            // $('.selectpicker').selectpicker({});
        }

        function getMailsList() {
            var condition = {
                emails: $scope.info.emails,
                offset: '' + $scope.info.offset,
                limit: '' + $scope.info.limit,
                order_by:$scope.info.order_by,
                order: $scope.info.order,
                total: '' + $scope.info.total
            };

            MailNotifyService.get(condition).then(function(res){
    			console.log(res)
                $scope.mail_list = res.data.list
                $scope.info.total = res.data.total
                $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
    		},function(res){
    			if(res.msg != ''){
    				DialogService.alert(res.msg)
    			}
    		})
        }

        $scope.search = function() {
            $scope.info.total = 0;
            getMailsList();
        }

        $scope.addMail = function() {
            // const mailReg = new RegExp("/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g");
            const mailReg = new RegExp(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/);

            if($scope.mailAdd.emails == '') {
                DialogService.alert('请输入邮箱地址！');
                return false;
            }

            if(!mailReg.test($scope.mailAdd.emails)){
                DialogService.alert('请输入正确的邮箱地址！');
                return false;                
            }

            if($scope.mailAdd.type == '') {
                DialogService.alert('请选择通知类型！');
                return false;
            }

            const condition = $scope.mailAdd;
            MailNotifyService.add(condition).then(function(res){
                DialogService.alert('添加成功');
                getMailsList();
            },function(res){
                if(res.msg != ''){
                    DialogService.alert(res.msg)
                }
            })
            $('#addModal').modal('hide');
            $scope.mailAdd.emails = '';
            $scope.mailAdd.type = '1';
            // $('#addSelecter').selectpicker('refresh');
        };

        $scope.delete = function(id) {
            DialogService.confirm('确认要删除邮箱?',function(){
                var condition = {
                    id:id
                };
                MailNotifyService.delete(condition).then(function(res){
                    DialogService.alert('删除成功')
                    getMailsList()
                },function(err){
                    if(res.msg != ''){
                        DialogService.alert(res.msg)
                    }
                })
            })
        }

        $scope.editClick = function(mail) {
            console.log(mail);
            
            $scope.mailEdit.id = mail.id;
            $scope.mailEdit.emails = mail.emails;
            $scope.mailEdit.type = '' + mail.type;

            // $('#editSelecter').selectpicker('refresh');
            $('#editModal').modal('show');
        }

        $scope.editConfirm = function() {
            // const mailReg = new RegExp(/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g);
            const mailReg = new RegExp(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/);

            if($scope.mailEdit.emails == '') {
                DialogService.alert('请输入邮箱地址！');
                return false;
            }
            console.log($scope.mailEdit.emails);
            
            if(!mailReg.test($scope.mailEdit.emails)) {
                DialogService.alert('请输入正确的邮箱地址！');
                return false;                
            }

            if($scope.mailEdit.type == '') {
                DialogService.alert('请选择通知类型！');
                return false;
            }

            const condition = $scope.mailEdit;
            MailNotifyService.edit(condition).then(function(res){
                getMailsList()
                DialogService.alert('修改成功')
            },function(res){
                if(res.msg != ''){
                    DialogService.alert(res.msg)
                }
            });

            $('#editModal').modal('hide');
        }
        $scope.startPaging = function(){
            getMailsList()
        }
    }
]);