angular.module('StationController', ['CommonService', 'StationService', 'BookingService', 'ChargeService'])
    .controller('StationShowCtrl', ['$scope', '$interval', '$state', '$stateParams', 'StationService', 'BookingService', 'DictService',
        function($scope, $interval, $state, $stateParams, StationService, BookingService, DictService) {
            var storage = window.localStorage;
            if (storage.getItem('UserAuth') !== null) {
                $scope.UserAuth = JSON.parse(storage.getItem('UserAuth'));
            }
            $scope.now = new Date();
            $scope.last_two_month = $scope.now.getTime() - 60 * 24 * 3600 * 1000;
            $scope.info = {
                start_date: formatDate($scope.last_two_month),
                end_date: formatDate($scope.now),
                loading: true,
                order_by: 'created_at',
                order: 'desc',
                total: 0,
                pageCnt: 0,
                page: 1,
                offset: 0,
                limit: 20,
                show_another_screen: false,
                export_all: false,
                show_other: 'base',

            };
            $scope.station = {};
            var timeer = $interval(function(){
                StationService.get($stateParams.id).then(function(data){
                    $scope.station = data;
                    for (var x in $scope.stationgroups) {
                        if ($scope.stationgroups[x].id == data.group_id) {
                            $scope.station.group_name = $scope.stationgroups[x].name;
                        }
                    }
                }, function(){

                })
            }, 5 * 1000);
            $scope.$on('$destroy', function(){
                $interval.cancel(timeer)
            })
            init();
            $("#station-list-start-date, #station-list-end-date").datepicker({
                language: 'zh-CN',
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayBtn: false,
                endDate: formatDate($scope.now), //禁止选择当天之后的日期
                todayHighlight: true
            });
            $("#station-list-start-date").datepicker("setDate", formatDate($scope.last_two_month));
            $("#station-list-end-date").datepicker("setDate", formatDate($scope.now));
            $scope.pic_data = [];
            function init() {
                var condition = {
                    type: "stationgroup",
                };
                DictService.search(condition).then(function(data) {
                    $scope.stationgroups = data;

                    StationService.get($stateParams.id).then(function(data) {
                        $scope.station = data;
                        if (data.pics.length > 0) {
                            $scope.pic_data = data.pics;
                            $scope.firstPic = $scope.pic_data[0];
                            $scope.secondPic = $scope.pic_data.slice(1);
                        };
                        for (var x in $scope.stationgroups) {
                            if ($scope.stationgroups[x].id == data.group_id) {
                                $scope.station.group_name = $scope.stationgroups[x].name;
                            }
                        }
                        // var s = $('.carousel-inner div:first')
                        // s.addClass('active');
                    }, function(code) {});
                }, function(code) {

                });
                loadBookingRecords();
            }

            function loadBookingRecords() {
                if (!checkDateInput()) {
                    DialogService.alert("日期不合法，请重新输入！");
                    return;
                };
                var condition = {
                    station_id: $stateParams.id,
                    user_id: '',
                    st: $scope.info.start_date,
                    et: $scope.info.end_date,
                    order_by: $scope.info.order_by,
                    order: $scope.info.order,
                    offset: $scope.info.offset,
                    limit: $scope.info.limit,
                };
                BookingService.search(condition).then(function(data) {
                    $scope.records = data.list;
                    $scope.info.total = data.total;
                    $scope.info.pageCnt = Math.ceil(data.total / $scope.info.limit);
                    if ($scope.info.export_all) {
                        setTimeout(function() {
                            $('#to-export-reservation').tableExport({
                                type: 'excel',
                                tableName: '',
                                escape: 'false'
                            });
                        }, 500)
                        $scope.info.limit = 20;
                        $scope.info.export_all = false;
                    }
                }, function(code) {

                });
            }
            $scope.book = function() {
                loadBookingRecords();
            };
            $scope.toExport = function() {
                $scope.info.export_all = true;
                $scope.info.limit = $scope.info.total;
                $scope.info.offset = 0;
                loadBookingRecords();
            };
            $scope.order = function(which) {
                if ($scope.info.order_by != which) {
                    $scope.info.order = 'desc';
                } else {
                    if ($scope.info.order == 'desc') {
                        $scope.info.order = 'asc';
                    } else {
                        $scope.info.order = 'desc';
                    }
                }
                $scope.info.order_by = which;
                $scope.info.page = 1;
                $scope.info.offset = 0;
                loadBookingRecords();
            };
            $scope.startPaging = function() {
                loadBookingRecords();
            };
            $scope.goToAnalysis = function() {
                $state.go('main.station/show-analysis', { id: $stateParams.id })
            }
            $scope.goToEdit = function() {
                $state.go("main.station/edit", {
                    id: $stateParams.id
                });
            };


        }
    ])
    .controller('StationChargeRecordsCtrl', ['$scope', '$state', '$stateParams', 'StationService', 'DialogService', 'ChargeService',
        function($scope, $state, $stateParams, StationService, DialogService, ChargeService) {
            var now = new Date();
            var last_two_month = now.getTime() - 7 * 24 * 3600 * 1000;
            $scope.info = {
                start_date: formatDate(last_two_month),
                end_date: formatDate(now),
                loading: true,
                order_by: 'created_at',
                order: 'desc',
                total: 0,
                pageCnt: 0,
                page: 1,
                offset: 0,
                limit: 20,
                export_all: false,
                status: '全部',
                start_type: '全部'
            };
            $scope.station = {};
            $("#charge-start-date, #charge-end-date").datepicker({
                language: 'zh-CN',
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayBtn: false,
                endDate: formatDate(now), //禁止选择当天之后的日期
                todayHighlight: true
            });
            $("#charge-start-date").datepicker("setDate", formatDate(last_two_month));
            $("#charge-end-date").datepicker("setDate", formatDate(now));
            loadChargeRecords();

            function loadChargeRecords() {
                var condition = {
                    station_id: $stateParams.id,
                    user_id: '',
                    device_id: '',
                    st: $scope.info.start_date,
                    et: $scope.info.end_date,
                    order_by: $scope.info.order_by,
                    order: $scope.info.order,
                    offset: $scope.info.offset,
                    limit: $scope.info.limit,
                    status: $scope.info.status,
                    start_type: $scope.info.start_type
                };
                ChargeService.search(condition).then(function(data) {
                    $scope.chargeRecords = data.list;
                    $scope.info.total = data.total;
                    $scope.info.durations = data.durations;
                    $scope.info.elec_costs = data.elec_costs;
                    $scope.info.elec_quantitys = data.elec_quantitys;
                    $scope.info.payments = data.payments;
                    $scope.info.serve_costs = data.serve_costs;
                    $scope.info.pageCnt = Math.ceil(data.total / $scope.info.limit);
                    if ($scope.info.export_all) {
                        setTimeout(function() {
                            $('#to-export-charge').tableExport({ type: 'excel', tableName: '', escape: 'false' });
                        }, 500)
                        $scope.info.limit = 20;
                        $scope.info.export_all = false;
                    }
                    $scope.info.show_loading = false;
                }, function(code) {
                    $scope.info.show_loading = false;
                });
                $scope.search = function() {
                    $scope.info.show_loading = true;
                    $scope.info.offset = 0;
                    $scope.info.page = 1;
                    loadChargeRecords();
                };
                $scope.startPaging = function() {
                    loadChargeRecords();
                };
                $scope.order = function(which) {
                    if ($scope.info.order_by != which) {
                        $scope.info.order = 'desc';
                    } else {
                        if ($scope.info.order == 'desc') {
                            $scope.info.order = 'asc';
                        } else {
                            $scope.info.order = 'desc';
                        }
                    }
                    $scope.info.order_by = which;
                    $scope.info.page = 1;
                    $scope.info.offset = 0;
                    loadChargeRecords();
                };
                $scope.toExport = function() {
                    $scope.info.export_all = true;
                    $scope.info.limit = $scope.info.total;
                    $scope.info.offset = 0;
                    loadChargeRecords();
                };
            }
        }
    ])
    .controller('LoadDevicesAcCtrl', ['$scope', '$interval', '$state', '$stateParams', 'StationService', 'DeviceService', 'DialogService',
        function($scope, $interval, $state, $stateParams, StationService, DeviceService, DialogService) {
            var storage = window.localStorage;
            if (storage.getItem('UserAuth') !== null) {
                $scope.UserAuth = JSON.parse(storage.getItem('UserAuth'));
            }
            $scope.info = {
                loading: true,
                total: 0,
                pageCnt: 0,
                page: 1,
                offset: 0,
                limit: 50,
                search_device: "",
                export_all: false
            };
            $scope.devices_ac = [];
            $scope.devices_dc = [];

            function loadDevicesAc() {
                var condition = {
                    station_id: $stateParams.id,
                    query: $scope.info.search_device,
                    order: $scope.info.order,
                    order_by: $scope.info.order_by,
                    offset: $scope.info.offset,
                    limit: $scope.info.limit,
                    charge_type: '交流'
                };
                DeviceService.search(condition).then(function(data) {
                    $scope.devices_ac = data.list;
                    $scope.info.total = data.total;
                    $scope.info.pageCnt = Math.ceil(data.total / $scope.info.limit);
                    if ($scope.info.export_all) {
                        setTimeout(function() {
                            $('#to-export-device-ac').tableExport({ type: 'excel', tableName: '', escape: 'false' });
                        }, 500)
                        $scope.info.limit = 50;
                        $scope.info.export_all = false;
                    }
                }, function(code) {

                });
            }

            loadDevicesAc();
            var timeer = $interval(loadDevicesAc, 5 * 1000);
            $scope.$on('$destroy', function(){
                $interval.cancel(timeer)
            })


            $scope.search = function() {
                $scope.info.offset = 0;
                $scope.info.page = 1;
                loadDevicesAc();
            };
            $scope.startPaging = function() {
                loadDevicesAc();
            };
            $scope.order = function(which) {
                if ($scope.info.order_by != which) {
                    $scope.info.order = 'desc';
                } else {
                    if ($scope.info.order == 'desc') {
                        $scope.info.order = 'asc';
                    } else {
                        $scope.info.order = 'desc';
                    }
                }
                $scope.info.order_by = which;
                $scope.info.page = 1;
                $scope.info.offset = 0;
                loadDevicesAc();
            };
            $scope.delete = function(id) {
                DialogService.confirm("确认要删除吗？", function() {
                    DeviceService.delete(id).then(function(data) {
                        loadDevicesAc();
                    }, function(code) {

                    })
                })
            };
            $scope.toExport = function() {
                $scope.info.export_all = true;
                $scope.info.limit = $scope.info.total;
                $scope.info.offset = 0;
                loadDevicesAc();
            };
        }
    ])
    .controller('LoadDevicesDcCtrl', ['$scope', '$interval', '$state', '$stateParams', 'StationService', 'DeviceService', 'DialogService',
        function($scope, $interval, $state, $stateParams, StationService, DeviceService, DialogService) {
            var storage = window.localStorage;
            if (storage.getItem('UserAuth') !== null) {
                $scope.UserAuth = JSON.parse(storage.getItem('UserAuth'));
            }
            $scope.info = {
                loading: true,
                total: 0,
                pageCnt: 0,
                page: 1,
                offset: 0,
                limit: 50,
                search_device: "",
                export_all: false
            };
            $scope.devices_ac = [];
            $scope.devices_dc = [];
            var timeer = $interval(loadDevicesDc, 5 * 1000);
            $scope.$on('$destroy', function(){
                $interval.cancel(timeer)
            })

            function loadDevicesDc() {
                var condition = {
                    station_id: $stateParams.id,
                    query: $scope.info.search_device,
                    order: $scope.info.order,
                    order_by: $scope.info.order_by,
                    offset: $scope.info.offset,
                    limit: $scope.info.limit,
                    charge_type: '直流'
                };
                DeviceService.search(condition).then(function(data) {
                    $scope.devices_dc = data.list;
                    $scope.info.total = data.total;
                    $scope.info.pageCnt = Math.ceil(data.total / $scope.info.limit);
                    if ($scope.info.export_all) {
                        setTimeout(function() {
                            $('#to-export-device-dc').tableExport({ type: 'excel', tableName: '', escape: 'false' });
                        }, 500)
                        $scope.info.limit = 50;
                        $scope.info.export_all = false;
                    }
                }, function(code) {

                });
            }

            loadDevicesDc();


            $scope.search = function() {
                $scope.info.offset = 0;
                $scope.info.page = 1;
                loadDevicesDc();
            };
            $scope.startPaging = function() {
                loadDevicesDc();
            };
            $scope.order = function(which) {
                if ($scope.info.order_by != which) {
                    $scope.info.order = 'desc';
                } else {
                    if ($scope.info.order == 'desc') {
                        $scope.info.order = 'asc';
                    } else {
                        $scope.info.order = 'desc';
                    }
                }
                $scope.info.order_by = which;
                $scope.info.page = 1;
                $scope.info.offset = 0;
                loadDevicesDc();
            };
            $scope.delete = function(id) {
                DialogService.confirm("确认要删除吗？", function() {
                    DeviceService.delete(id).then(function(data) {
                        loadDevicesDc();
                    }, function(code) {

                    })
                })
            };
            $scope.toExport = function() {
                $scope.info.export_all = true;
                $scope.info.limit = $scope.info.total;
                $scope.info.offset = 0;
                loadDevicesDc();
            };
        }
    ])
    .controller('StationWarningCtrl', ['$scope', '$state', '$stateParams', '$interval', 'BookingService', 'DialogService',
        function($scope, $state, $stateParams, $interval, BookingService, DialogService) {
            var now = new Date();
            var last_two_month = now.getTime() - 7 * 52 * 24 * 3600 * 1000;
            $scope.info = {
                total: 0,
                pageCnt: 0,
                page: 1,
                offset: 0,
                limit: 20,
                export_all: false,
                start_date: formatDate(last_two_month),
                end_date: formatDate(now),
            };
            init();
            var timmer = $interval(function(){
                loadWarning();
            }, 60 *1000)
            $scope.$on('$destroy', function(){
                $interval.cancel(timmer)
            })
            function init(argument) {
                loadWarning();
            };
            $("#warning-start-date, #warning-end-date").datepicker({
                language: 'zh-CN',
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayBtn: false,
                endDate: formatDate(now), //禁止选择当天之后的日期
                todayHighlight: true
            });
            $("#warning-start-date").datepicker("setDate", formatDate(last_two_month));
            $("#warning-end-date").datepicker("setDate", formatDate(now));

            function loadWarning() {
                var condition = {
                    station_id: $stateParams.id,
                    st: $scope.info.start_date,
                    et: $scope.info.end_date,
                    offset: $scope.info.offset,
                    limit: $scope.info.limit
                };
                BookingService.warningSearch(condition).then(function(data) {
                    $scope.open_alarm = data.open_alarm
                    $scope.warnings = data.list;
                    $scope.info.total = data.total;
                    $scope.info.pageCnt = Math.ceil(data.total / $scope.info.limit);
                  
                    for(var i =0; i< data.list.length; i++) {
                        if (data.list[i].status == '未处理' && (data.list[i].fault_type == '0' || (data.list[i].fault_type == '1' && data.open_alarm == '1'))) {
                            var audio = document.getElementById("bgMusic");
                            audio.play();
                            return
                        };
                    }
                    if ($scope.info.export_all) {
                        setTimeout(function() {
                            $('#to-export-warning').tableExport({ type: 'excel', tableName: '', escape: 'false' });
                        }, 500)
                        $scope.info.limit = 20;
                        $scope.info.export_all = false;
                    }

                }, function(code) {

                })
            }
            $scope.startPaging = function() {
                loadWarning();
            };
            $scope.deal = function(id) {
                BookingService.warningDeal(id).then(function(data) {
                    loadWarning();
                    DialogService.alert("处理成功！")
                }, function(code) {
                    DialogService.alert("处理失败！")
                })
            }
            $scope.search = function() {
                $scope.info.offset = 0;
                $scope.info.page = 1;
                loadWarning();
            };
            $scope.toExport = function() {
                $scope.info.export_all = true;
                $scope.info.limit = $scope.info.total;
                $scope.info.offset = 0;
                loadWarning();
            };
            $scope.closeWarning = function() {
                console.log($('.alert-cdot').children('div').length)
                if ($('.alert-cdot').children('div').length <= 1) {
                     var audio = document.getElementById("bgMusic");
                     audio.pause();
                };

            };
            



        }
    ])
    .controller('StationMaintainCtrl', ['$scope', '$state', '$stateParams', 'BookingService',
        function($scope, $state, $stateParams, BookingService) {
            var now = new Date();
            var last_two_month = now.getTime() - 7 * 24 * 3600 * 1000;
            $scope.info = {
                total: 0,
                pageCnt: 0,
                page: 1,
                offset: 0,
                limit: 20,
                export_all: false,
                start_date: formatDate(last_two_month),
                end_date: formatDate(now),
                status: '全部'
            };
            init();

            function init(argument) {
                loadMaintain();
            };
            $("#maintain-start-date, #maintain-end-date").datepicker({
                language: 'zh-CN',
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayBtn: false,
                endDate: formatDate(now), //禁止选择当天之后的日期
                todayHighlight: true
            });
            $("#maintain-start-date").datepicker("setDate", formatDate(last_two_month));
            $("#maintain-end-date").datepicker("setDate", formatDate(now));

            function loadMaintain() {
                var condition = {
                    station_id: $stateParams.id,
                    st: $scope.info.start_date,
                    et: $scope.info.end_date,
                    fault_type: $scope.info.status,
                    limit: 20,
                    offset: $scope.info.offset,
                    total: $scope.info.total
                };
                BookingService.maintainSearch(condition).then(function(data) {
                    $scope.maintains = data.list;
                    $scope.info.total = data.total;
                    $scope.info.pageCnt = Math.ceil(data.total / $scope.info.limit);
                    if ($scope.info.export_all) {
                        setTimeout(function() {
                            $('#to-export-maintain').tableExport({ type: 'excel', tableName: '', escape: 'false' });
                        }, 500)
                        $scope.info.limit = 20;
                        $scope.info.export_all = false;
                    }

                }, function(code) {

                })
            }

            $scope.startPaging = function() {
                loadMaintain();
            };
            $scope.search = function() {
                $scope.info.offset = 0;
                $scope.info.page = 1;
                loadMaintain();
            };
            $scope.toExport = function() {
                $scope.info.export_all = true;
                $scope.info.limit = $scope.info.total;
                $scope.info.offset = 0;
                loadMaintain();
            };



        }
    ])