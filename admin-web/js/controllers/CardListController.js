angular.module('CardListModule',['CommonService','CardService'])
       .controller('CardListController',['$scope','DialogService','CardService',function($scope,DialogService,CardService){
            var now = new Date(),
                nextYear = new Date().getTime() + (24*3600*365*1000),
                lastMonth = new Date().getTime() - (24*3600*1000*30)
            $scope.info = {
                order_by:'created_at',
                order:'desc',
                offset:0,
                limit:20,
                total:0,
                //修改：注释
                // created_st:formatDate(lastMonth),
                // created_et:formatDate(now),
                created_st:'',
                created_et:'',
                pageCnt: 0,
                page: 1,
                closeDate:formatDate(nextYear),
                card_number:'',
                type:'0'
            }
            $scope.list = [];
            $scope.card = {
                card_number:'',
                type:2,
                finished_at:formatDate(nextYear),
                max_value:0
            }
            $("input[id^='start-date']").datepicker({
                language: 'zh-CN',
                startView: 0,
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayBtn: false,
                startDate:'1970-01-01',
                endDate: formatDate(now), //禁止选择当天之后的日期
                todayHighlight: true
            })
            $("input[id='close-date']").datepicker({
                language: 'zh-CN',
                startView: 0,
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayBtn: false,
                startDate:formatDate(new Date().getTime()),
                // endDate: formatDate(nextYear),
                todayHighlight: true
            })
            $('#close-date').datepicker("setDate", formatDate(nextYear));
            $('#start-date-start').datepicker("setDate", formatDate(lastMonth));
            $('#start-date-end').datepicker("setDate", formatDate(now));
            $scope.addCard = function(){
                $('#AddCardModal').modal('show');
            }
            $scope.enterprise = {
                parent_id: ""
            };
            $scope.search = function(){
                var condition = {
                    created_st:$scope.info.created_st,
                    created_et:$scope.info.created_et,
                    type:$scope.info.type,
                    card_number:$scope.info.card_number,
                    offset:($scope.info.page-1)*20,
                    limit:$scope.info.limit,
                    order_by:$scope.info.order_by,
                    order:$scope.info.order,
                    total:$scope.info.total
                }
                CardService.search(condition).then(function(res){
                    console.log(res);
                    $scope.list = res.data.list;
                    $scope.info.total = res.data.total;
                    $scope.info.pageCnt = Math.ceil($scope.info.total/$scope.info.limit);
                })
            }
            init()
            function init(){
                $scope.search();
            }
            // 右边查询
            $scope.filterSearch = function(){
                $scope.info.page = 1;
                $scope.search();
            }
            //重置卡
            $scope.resetCard = function(){
                $scope.card = {
                    card_number:'',
                    type:2,
                    finished_at:formatDate(nextYear),
                    max_value:0
                }
                $scope.enterprise.parent_id = '';
            }
            //确认添加卡
            $scope.confirmAdd = function(){
                if($scope.card.card_number == ''){
                    DialogService.alert('请输入卡号')
                    return false
                }
                if($scope.card.card_number.length > 16){
                    DialogService.alert('卡号最多16位')
                    return false
                }
                if($scope.enterprise.parent_id == ''){
                    DialogService.alert('请选择归属公司')
                    return false
                }
                if($scope.card.finished_at == ''){
                    DialogService.alert('请选择截止日期')
                    return false
                }
                var condition = {
                    enterprise_id:$scope.enterprise.parent_id,
                    card_number:$scope.card.card_number,
                    type:$scope.card.type,
                    finished_at:$scope.card.finished_at,
                    max_value:$scope.card.type == 1 ? 20 : $scope.card.type == 2 ? 9 : 0
                }
                console.log(condition)
                CardService.add(condition).then(function(res){
                    DialogService.alert('添加成功')
                    $('#AddCardModal').modal('hide');
                    $scope.search();
                })
            }
            // 取消添加卡
            $scope.cancelAdd = function(){
                $scope.resetCard()
            }
            // 监听modal关闭初始化卡
            $('#AddCardModal').on('hide.bs.modal',function(){
                $scope.resetCard()
            })
            $('#close-date').on('hide', function(event) {
                event.stopPropagation();
            });
            //删除卡
            $scope.delete = function(id){
                DialogService.confirm('确认要删除卡?',function(){
                    var condition = {
                        id: id
                    }
                    CardService.delete(condition).then(function(res){
                        DialogService.alert('删除成功')
                        $scope.info.page = 1;
                        $scope.search();
                    })
                })
            }
            //封禁,解封
            $scope.forbid = function(card){
                var condition = {
                    id:card.id
                }
                var str = card.forbid_status == 1 ? '确认要封禁?' : card.forbid_status == 2 ? '确认要激活?' : '确认要进行操作?'
                DialogService.confirm(str,function(){
                    CardService.forbid(condition).then(function(res){
                        DialogService.alert('处理成功')
                        $scope.search();
                    })
                })
            }
            $scope.startPaging = function(){
                $scope.search();
            }
            //编辑卡
            $scope.editCard = {
                card_number:'',
                type:2,
                id:'',
                // finished_at:formatDate(nextYear)
            }
            $scope.edit = function(card){
                // $scope.enterprise.parent_id = card.enterprise_id;
                $scope.editCard.card_number = card.card_number;
                $scope.editCard.type = card.type;
                $scope.editCard.id = card.id;
                $scope.editCard.finished_at = card.finished_at;
                $('#EditCardModal').modal('show');
            }
            $scope.cardType = [
                {value:2,name:'包月时卡'},
                {value:3,name:'充值卡'}
            ]
            //编辑卡
            $scope.confirmEdit = function(){
                if($scope.editCard.card_number == ''){
                    DialogService.alert('请输入卡号')
                    return false
                }
                if($scope.editCard.card_number.length > 16){
                    DialogService.alert('卡号最多16位')
                    return false
                }
                var condition = {
                    id:$scope.editCard.id,
                    card_number:$scope.editCard.card_number,
                    type:$scope.editCard.type
                    // enterprise_id:$scope.enterprise.parent_id,
                }
                CardService.update(condition).then(function(res){
                    DialogService.alert('更新成功!')
                    $('#EditCardModal').modal('hide');
                    $scope.search();
                })
                console.log(condition)
            }
            $scope.importData=function(){
                //非空验证
                if($("#i-file").val()!=""){
                    //获取上传的文件名称
                    var filename = document.querySelector('input[type=file]').files[0];//获取上传的文件
                    console.log(filename);
                    
                    //定义一个Json数组
                    var resultJson=[];
                    //创建FileReader对象
                    var reader = new FileReader();
                    //读取文件
                    reader.readAsBinaryString(filename);
                    //加载读取的文件
                    reader.onload=function(e){
                        var workbook = XLSX.read(e.target.result,{type:'binary'});
                        //获取表名
                        var sheetName=workbook.SheetNames;
                        //将表文件的数据解析成json数组格式
                        resultJson=XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                        console.log(resultJson);
                        console.log("编号："+resultJson[0].id);
                        console.log("姓名："+resultJson[0].name);
                        console.log("年龄："+resultJson[0].age);

                        //调用uploadFile方法
                        CardService.uploadFile(resultJson).then(function(res){
                            //清空
                            $("#location").val("");
                            $("#i-file").val("");
                            DialogService.alert('导入成功！')
                            $scope.search();
                        })
                        
                    }
                }else{
                    alert("请点击文本框来选择需要导入的文件！");
                }
            }
            // 监听modal关闭初始化卡
            $('#EditCardModal').on('hide.bs.modal',function(){
                $scope.enterprise.parent_id = '';
            })
       }])