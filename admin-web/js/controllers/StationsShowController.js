angular.module("StationsShowController", ["CommonService", "StationService"])
.controller("StationsShowCtrl", ["$scope", "$state", "StationService","DialogService",'DictService',
    function ( $scope, $state, StationService,DialogService,DictService) {
        $scope.info = {
            type:'0',
            status:'0',
            provider:'0',
            offset:0,
            limit:20,
            order_by:'created_at',
            order:'desc',
            total:0,
            page:1,
            pageCnt:0,
            station_obj: { "id":'',"name":''},
            enter_obj:{'id':'',name:''}
        }
        $scope.stations = []

        $scope.provinces = [];
        $scope.cities = [];
        $scope.districts = [];
        $scope.provinceOption = {
            id: 0,
            name: '选择省'
        };
        $scope.cityOption = {
            id:0,
            name: '选择市'
        };
        $scope.districtOption = {
            id: 0,
            name: '选择区县'
        };

        var fields = '/station/list';
        $scope.search = function(){
            var condition = {
                type:$scope.info.type,
                status:$scope.info.status,
                provider:$scope.info.provider,
                province_id:$scope.provinceOption.id,
                city_id:$scope.cityOption.id,
                district_id:$scope.districtOption.id,
                station_obj:$scope.info.station_obj,
                enter_obj:$scope.info.enter_obj,
                offset:$scope.info.offset,
                limit:$scope.info.limit,
                order_by:$scope.info.order_by,
                order:$scope.info.order,
                total:$scope.info.total
            }
            StationService.search(condition).then(function(res){
                // console.log(res)
                window.sessionStorage.setItem(fields, JSON.stringify(condition));
                $scope.stations = res.data.list
                console.log($scope.stations)
                $scope.info.total = res.data.total
                $scope.info.pageCnt = Math.ceil(res.data.total/$scope.info.limit)
            },function(res){
                DialogService.alert(res.msg)
            })
        }
        init()
        function init(){
            var url = window.location.href;
            ut= url.split("#");
            url=ut[1];

            if((sessionStorage.getItem(url)) && (fields == url)){
                var session = JSON.parse(sessionStorage.getItem(url));
                console.log(session);
                $scope.info.type = session.type;
                $scope.info.status = session.status;
                $scope.info.provider = session.provider;
                $scope.provinceOption.id = session.province_id;
                $scope.cityOption.id = session.city_id;
                $scope.districtOption.id = session.district_id;
                $scope.info.station_obj = session.station_obj;
                $scope.info.enter_obj = session.enter_obj;
                $scope.info.offset = session.offset;
                $scope.info.limit = session.limit;
                $scope.info.order_by = session.order_by;
                $scope.info.order = session.order;
                $scope.info.total = session.total;

                var condition = {
                    type: "city",
                    query: session.province_id
                };

                if (session.province_id != 0) {
                    DictService.search(condition).then(function(data) {
                        console.log(data)
                        $scope.cities = data;
                    }, function(code) {});
                }
                condition.query = session.city_id;
                if (session.city_id !=0) {
                    DictService.search(condition).then(function(data) {
                        console.log(data)
                        $scope.districts = data;
                    }, function(code) {});
                }
            }
            $scope.search()
        }
        console.log($scope.userAuthId)
        $scope.goEdit = function(id){
            $state.go('main.station/edit',{id:id})
        }
        $scope.goDetail = function(id){
            $state.go('main.station/show',{id:id})
        }
        $scope.delete = function(id){
            DialogService.confirm('确认要删除吗',function(){
                var condition = {
                    id:id
                }
                StationService.delete(condition).then(function(res){
                    DialogService.alert('删除成功')
                    $scope.search()
                },function(err){})
            })
        }
        $scope.startPaging = function(){
            $scope.search()
        }
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
    }
])
