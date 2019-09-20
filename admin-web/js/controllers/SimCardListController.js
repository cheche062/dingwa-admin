angular.module('SimCardModule',[])
       .controller('SimCardListController',['$scope','SimsService',function($scope,SimsService){
            $scope.info = {
                station_obj : {
                    id:'',
                    name:''
                },
                enterprise:{
                    id:'',
                    name:''
                },
                device_number:'',
                offset:0,
                limit:20,
                order_by:'created_at',
                order:'desc',
                activate_st:'',
                activate_et:'',
                shutdown_st:'',
                shutdown_et:'',
                is_open:'全部',
                page:1,
                total:0,
            };
            $scope.enterprise = {
                name:'',
                id:''
            };
            $scope.cardList = [];
            searchCondition = {};
            now = new Date();
            one_year_ago_date = new Date();
            one_year_later_date = new Date();

            function Date_zh_CN_transform(date_CN) {
                if(!date_CN) {
                    return '';
                }

                let reg =/[\u4e00-\u9fa5]/g;
                let date = date_CN.replace(reg, '-');
                date = date.substring(0, date.length-1);
                return date;
            }
            $scope.search = function(){
                let st1 = Date_zh_CN_transform($scope.info.activate_st);
                let et1 = Date_zh_CN_transform($scope.info.activate_et);
                let st2 = Date_zh_CN_transform($scope.info.shutdown_st);
                let et2 = Date_zh_CN_transform($scope.info.shutdown_et);
                var condition = {
                    enterprise_id:$scope.enterprise.id,
                    station_id:$scope.info.station_obj.id,
                    query:$scope.info.device_number,
                    activate_st: st1,
                    activate_et: et1,
                    shutdown_st: st2,
                    shutdown_et: et2,
                    is_open: $scope.info.is_open,
                    offset:$scope.info.offset,
                    limit:$scope.info.limit,
                    order_by:$scope.info.order_by,
                    order:$scope.info.order,
                    downexcel:0
                }
                searchCondition = {...condition};
                SimsService.search(condition).then(function(res){
                    console.log(res)
                    $scope.cardList = res.list
                    $scope.info.total = res.total
                    $scope.info.pageCnt = Math.ceil($scope.info.total/$scope.info.limit)
                },function(){})
            }
            $scope.downExcel = function() {
                searchCondition.downexcel = 1;
                SimsService.search(searchCondition).then(function(res){
                    console.log(res)
                    window.open(res.path)                    
                },function(){})
            }
            //点击button查询
            $scope.btnSearch = function(){
                $scope.info.page = 1;
                $scope.search();
            }
            init();
            function init(){
                let year = 0;
                $scope.search();
                year = now.getFullYear();
                one_year_ago_date.setFullYear(year-1);
                one_year_later_date.setFullYear(year+1);
            }
            $scope.startPaging = function(){
                $scope.search()
            }
            $("#active-start-date").datepicker({
                endDate: formatDate(now),
                language: 'zh-CN'
            }); 
            $('#active-start-date').datepicker("setDate", formatDate(one_year_ago_date));
            $("#active-end-date").datepicker({
                endDate: formatDate(now),
                language: 'zh-CN'
            });
            $('#active-end-date').datepicker("setDate", formatDate(now));
            $("#halt-start-date").datepicker({
                endDate: formatDate(now),
                language: 'zh-CN'
            }); 
            $('#halt-start-date').datepicker("setDate", formatDate(now));
            $("#halt-end-date").datepicker({
                setDate: formatDate(now),
                language: 'zh-CN'
            });  
            $('#halt-end-date').datepicker("setDate", formatDate(one_year_later_date));

            //根据不同字段正序或倒序
            $scope.sort = function(type){
                console.log(type)
                if($scope.info.order_by !== type){
                    $scope.info.order_by = type;
                    $scope.info.order = 'desc'
                }else{
                    $scope.info.order = $scope.info.order == 'desc' ? 'asc' : 'desc'; 
                }
                $scope.search();
            }
       }])