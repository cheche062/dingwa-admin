 angular.module('Directive2', ['CommonService'])
.directive('inputSelect', [function($scope) {
    return {
        restrict: 'AE',
        transclude: true,
        replace: true,
        templateUrl: 'templates/page-directive-input-select.html',
        scope: {
            type: '@',
            query: '=',
            id: '=',

        },
        link: function($scope, attrs, element) {

        },
        controller: function($scope, DictService, DirectiveDataTransfer, StationService, DeviceService){
            switch ($scope.type) {
                case "enterprise":
                    $scope.placeholder = "公司";
                    break;
                case "station":
                    $scope.placeholder = "站点名称";
                    break;
                case "user":
                    $scope.placeholder = "手机号";
                    break;
                case "usergroup":
                    $scope.placeholder = "用户组";
                    break;
                case "stationgroup":
                    $scope.placeholder = "站点组";
                    break;
                case "device":
                    $scope.placeholder = "设备号";
                    break;
                case "systemuser":
                    $scope.placeholder = "系统用户名";
                    break;
                case "systemgroup":
                    $scope.placeholder = "系统用户组名称";
                    break;
                case "score_cards":
                    $scope.placeholder = "批次备注";
            }
            $scope.dropdownDatas = [];


            $scope.search = function() {
                //用户可能点击下拉功能后直接输入，此时应让弹出框隐藏掉
                $scope.showDropdownFlag = false;
                if ($scope.query === '') {
                    $scope.showDropdownFlag = false;
                    $scope.id = '';
                    return false;
                };
                $scope.showDropdownFlag = true;
                var condition = {
                    type: $scope.type,
                    query: $scope.query,
                    limit: 50
                };
                DictService.search(condition).then(function(data) {
                    $scope.dropdownDatas = data;
                    $scope.showDropdownFlag = true;
                });

            };
            $scope.showDropdownFlag = false;
            $scope.getItem = function() {

                DirectiveDataTransfer.condition.show_type = $scope.type;
                var condition_item = {
                    type: $scope.type,
                    query: '',
                    limit: 100,
                    parent: ''
                };
                if ($scope.type == 'station') {
                    if (DirectiveDataTransfer.condition.enterprise_id !== '') {
                        var condition = {
                            enterprise_id: DirectiveDataTransfer.condition.enterprise_id
                        };
                        StationService.search(condition).then(function(data) {
                            $scope.dropdownDatas = data.list;
                            $scope.showDropdownFlag = !$scope.showDropdownFlag;
                        }, function() {

                        });
                    } else {
                        DictService.search(condition_item).then(function(data) {
                            $scope.dropdownDatas = data;
                            $scope.showDropdownFlag = !$scope.showDropdownFlag;
                        });
                    }
                } else if ($scope.type == 'device') {
                    if (DirectiveDataTransfer.condition.station_id !== '') {
                        var condition = {
                            station_id: DirectiveDataTransfer.condition.station_id
                        };
                        console.log(DirectiveDataTransfer.condition)
                        DeviceService.search(condition).then(function(data) {
                            $scope.dropdownDatas = data.list;
                            $scope.showDropdownFlag = !$scope.showDropdownFlag;
                        }, function() {

                        });
                    } else {
                        DictService.search(condition_item).then(function(data) {
                            $scope.dropdownDatas = data;
                            $scope.showDropdownFlag = !$scope.showDropdownFlag;
                        });
                    }
                }else {
                    DictService.search(condition_item).then(function(data) {
                        $scope.dropdownDatas = data;
                        $scope.showDropdownFlag = !$scope.showDropdownFlag;
                        // $scope.showDropdownFlag = true;
                    });
                }

                DirectiveDataTransfer.condition.count++;

            };
            $scope.clickDropdownItem = function(item) {
                if ($scope.type == 'user') {
                    $scope.query = item.phone;
                } else if ($scope.type == 'device') {
                    $scope.query = item.device_number;
                } else if($scope.type == '"score_cards"'){
                    $scope.query = item.remark;
                } else if($scope.type == 'soft_version'){
                    $scope.query = item.soft_version
                }else{
                    $scope.query = item.name;
                }

                $scope.id = item.id;
                if ($scope.type == 'enterprise') {
                    DirectiveDataTransfer.condition.enterprise_id = item.id;
                }
                if ($scope.type == 'station') {
                    DirectiveDataTransfer.condition.station_id = item.id;
                }

            };
            $(document).click(function() {
                $scope.$apply(function() {
                    $scope.showDropdownFlag = false;
                });
            });
            //此处要监听的是服务里的变量，不能直接写name，需要放在函数里处理
            $scope.$watch(function() {
                return DirectiveDataTransfer.condition.count;
            }, function(status) {
                if (DirectiveDataTransfer.condition.show_type !== $scope.type) {
                    $scope.showDropdownFlag = false;
                }
            })
        }
    }
}])