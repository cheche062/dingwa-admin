angular.module('main', ['ui.router', 'oc.lazyLoad', 'CommonService', 'Directive', 'Filter'])
    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 
        function ($stateProvider, $urlRouterProvider, $httpProvider) {
            $httpProvider.interceptors.push('HttpRequestInterceptor');

            $stateProvider
                .state('main', {
                    url: '/main/',
                    abstract: true,
                    views: {
                        'lazyLoadView': {
                            controller: 'MainCtrl',
                            templateUrl: '/templates/layout.html',
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            // console.log("layout.html 载入")
                            return $ocLazyLoad.load({
                                serie: true,
                                name: 'main',
                                files: [
                                    '/js/services/SystemUserService.js', 
                                    '/js/controllers/CommonController.js', 
                                    '/js/services/LoginService.js',
                                    '/components/header/header.js'
                                ]
                            });
                        }]
                    }
                })
                .state('login', {
                    url: '/login',
                    cache: false,
                    views: {
                        'lazyLoadView': {
                            controller: 'LoginCtrl',
                            templateUrl: '/templates/dw-login.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'main',
                                files: [
                                    '/js/services/LoginService.js',
                                    '/js/services/SystemUserService.js',
                                    '/js/controllers/LoginController.js',
                                    '/lib/base64.js'
                                ]
                            })
                        }]
                    }
                })
                //首页
                // .state('main.index', {
                //     url:'index',
                //     cache:false,
                //     views:{
                //         'layout':{
                //             controller:'IndexCtrl',
                //             templateUrl:'/templates/dw-index.html'
                //         }
                //     },
                //     resolve: {
                //         loadMyCtrl:['$ocLazyLoad', function ($ocLazyLoad) {
                //             return $ocLazyLoad.load({
                //                 serie:true,
                //                 name:'main',
                //                 files: [
                //                     // '/js/services/SystemUserService.js',
                //                     '/js/controllers/IndexController.js',
                //                 ]
                //             })
                //         }]
                //     }
                // })
                //新首页
                .state('index', {
                    url: '/index',
                    cache: false,
                    views: {
                        'lazyLoadView': {
                            controller: 'IndexCtrl',
                            templateUrl: '/templates/dw-index.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                // serie:true,
                                name: '',
                                files: [
                                    '/js/controllers/IndexController.js',
                                    '/js/services/SystemUserService.js',
                                    '/js/services/LoginService.js',
                                    '/components/header/header.js'
                                ]
                            })
                        }]
                    }
                })
                //修改系统用户密码
                .state('main.system/pwd', {
                    url: 'system/pwd',
                    views: {
                        'layout': {
                            controller: 'SystemPwdCtrl',
                            templateUrl: '/templates/dw-system-pwd.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/controllers/SystemPwdController.js',
                                    '/js/services/SystemUserService.js'
                                ]
                            })
                        }]
                    }
                })
                // 公司列表
                .state('main.enterprise/list', {
                    url: 'enterprise/list',
                    views: {
                        'layout': {
                            controller: 'EnterprisesShowCtrl',
                            templateUrl: '/templates/dw-enterprise-list.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/EnterpriseService.js',
                                    '/js/controllers/EnterprisesShowController.js'
                                ]
                            })
                        }]
                    }
                })
                // 公司添加
                .state('main.enterprise/add', {
                    url: 'enterprise/add',
                    views: {
                        'layout': {
                            controller: 'EnterpriseAddCtrl',
                            templateUrl: '/templates/dw-enterprise-add.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/EnterpriseService.js',
                                    '/js/controllers/EnterpriseAddController.js',
                                    '/lib/uploadPic.js',
                                    '/webupload/webuploader.css',
                                    '/webupload/webuploader.js'
                                    // '/webupload/webuploader.min.js'
                                ]
                            })
                        }]
                    }
                })
                // 公司编辑
                .state('main.enterprise/edit', {
                    url: 'enterprise/edit/:id',
                    views: {
                        'layout': {
                            controller: 'EnterpriseEditCtrl',
                            templateUrl: '/templates/dw-enterprise-edit.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/EnterpriseService.js',
                                    '/js/controllers/EnterpriseEditController.js',
                                    '/lib/uploadPic.js',
                                    '/webupload/webuploader.css',
                                    // '/webupload/webuploader.min.js'
                                    '/webupload/webuploader.js'
                                ]
                            })
                        }]
                    }
                })
                //公司详情
                .state('main.enterprise/show', {
                    url: 'enterprise/show/:id',
                    views: {
                        'layout': {
                            controller: 'EnterpriseShowCtrl',
                            templateUrl: '/templates/dw-enterprise-show.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/EnterpriseService.js',
                                    '/js/controllers/EnterpriseShowController.js'
                                ]
                            })
                        }]
                    }
                })
                // 站点列表
                .state('main.station/list', {
                    url: 'station/list',
                    views: {
                        'layout': {
                            controller: 'StationsShowCtrl',
                            templateUrl: '/templates/dw-station-list.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/StationService.js',
                                    '/js/controllers/StationsShowController.js'
                                ]
                            })
                        }]
                    }
                })
                // 站点添加
                .state('main.station/add', {
                    url: 'station/add',
                    views: {
                        'layout': {
                            controller: 'StationAddCtrl',
                            templateUrl: '/templates/dw-station-add.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/StationService.js',
                                    '/js/controllers/StationAddController.js',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    '/css/bootstrap-datepicker.css',
                                    '/lib/bootstrap-datetimepicker.js',
                                    '/css/bootstrap-datetimepicker.min.css',
                                    '/lib/uploadPic.js',
                                    '/webupload/webuploader.css',
                                    // '/webupload/webuploader.min.js'
                                    '/webupload/webuploader.js'
                                ]
                            })
                        }]
                    }
                })
                //站点编辑
                .state('main.station/edit', {
                    url: 'station/edit/:id',
                    views: {
                        'layout': {
                            controller: 'StationEditCtrl',
                            templateUrl: '/templates/dw-station-edit.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/StationService.js',
                                    '/js/controllers/StationEditController.js',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    '/lib/bootstrap-datetimepicker.js',
                                    '/css/bootstrap-datepicker.css',
                                    '/css/bootstrap-datetimepicker.min.css',
                                    '/lib/uploadPic.js',
                                    '/webupload/webuploader.css',
                                    // '/webupload/webuploader.min.js'
                                    '/webupload/webuploader.js'
                                ]
                            })
                        }]
                    }
                })
                //站点详情
                .state('main.station/show', {
                    url: 'station/show/:id',
                    views: {
                        'layout': {
                            controller: 'StationShowCtrl',
                            templateUrl: '/templates/dw-station-show.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/StationService.js',
                                    '/js/services/DeviceService.js',
                                    '/js/controllers/StationShowController.js',
                                ]
                            })
                        }]
                    }
                })

                // 设备列表
                .state('main.device/list', {
                    url: 'device/list',
                    views: {
                        'layout': {
                            controller: 'DevicesShowCtrl',
                            templateUrl: '/templates/dw-device-list.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/DeviceService.js',
                                    '/js/controllers/DevicesShowController.js'
                                ]
                            })
                        }]
                    }
                })
                // 设备添加
                .state('main.device/add', {
                    url: 'device/add',
                    views: {
                        'layout': {
                            controller: 'DeviceAddCtrl',
                            templateUrl: '/templates/dw-device-add.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/DeviceService.js',
                                    '/js/controllers/DeviceAddController.js',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    // '/lib/bootstrap-datetimepicker.js',
                                    '/css/bootstrap-datepicker.css',
                                    // '/css/bootstrap-datetimepicker.min.css', 
                                ]
                            })
                        }]
                    }
                })
                // 设备编辑
                .state('main.device/edit', {
                    url: 'device/edit/:id',
                    views: {
                        'layout': {
                            controller: 'DeviceEditCtrl',
                            templateUrl: '/templates/dw-device-edit.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/DeviceService.js',
                                    '/js/controllers/DeviceEditController.js',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    // '/lib/bootstrap-datetimepicker.js',
                                    '/css/bootstrap-datepicker.css',
                                    // '/css/bootstrap-datetimepicker.min.css', 
                                ]
                            })
                        }]
                    }
                })
                // 设备详情
                .state('main.device/detail', {
                    url: 'device/detail/:id',
                    views: {
                        'layout': {
                            controller: 'DeviceDetailCtrl',
                            templateUrl: '/templates/dw-device-detail.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/DeviceService.js',
                                    '/js/services/DevicePortService.js',
                                    '/js/controllers/DeviceDetailController.js',
                                    '/css/device.css',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    '/css/bootstrap-datepicker.css',
                                ]
                            })
                        }]
                    }
                })
                // 设备配置页面
                .state('main.device/setting', {
                    url: 'device/setting/:id',
                    views: {
                        'layout': {
                            controller: 'DeviceSettingCtrl',
                            templateUrl: '/templates/dw-device-setting.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/DeviceService.js',
                                    '/js/controllers/DeviceSettingController.js']
                            });
                        }]
                    }
                })
                // 用户列表
                .state('main.user/list', {
                    url: 'user/list',
                    views: {
                        'layout': {
                            controller: 'UsersShowCtrl',
                            templateUrl: '/templates/dw-user-list.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/UserService.js',
                                    '/js/controllers/UsersShowController.js',
                                    '/lib/bootstrap-datepicker.js',
                                    // '/lib/bootstrap-datetimepicker.min.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    '/css/bootstrap-datepicker.css',
                                ]
                            })
                        }]
                    }
                })
                // 用户添加
                .state('main.user/add', {
                    url: 'user/add',
                    views: {
                        'layout': {
                            controller: 'UserAddCtrl',
                            templateUrl: '/templates/dw-user-add.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/UserService.js',
                                    '/js/controllers/UserAddController.js',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    // '/lib/bootstrap-datetimepicker.js',
                                    '/css/bootstrap-datepicker.css',
                                    // '/css/bootstrap-datetimepicker.min.css', 
                                ]
                            })
                        }]
                    }
                })
                //用户编辑
                .state('main.user/edit', {
                    url: 'user/edit/:id',
                    views: {
                        'layout': {
                            controller: 'UserEditCtrl',
                            templateUrl: '/templates/dw-user-edit.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/UserService.js',
                                    '/js/controllers/UserEditController.js',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    '/css/bootstrap-datepicker.css',
                                    '/lib/base64.js'
                                    // '/css/bootstrap-datetimepicker.min.css', 
                                    // '/lib/bootstrap-datetimepicker.js',
                                ]
                            })
                        }]
                    }
                })
                //用户详情
                .state('main.user/show', {
                    url: 'user/show/:id',
                    views: {
                        'layout': {
                            controller: 'UserShowCtrl',
                            templateUrl: '/templates/dw-user-show.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/UserService.js',
                                    '/js/controllers/UserShowController.js',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    '/css/bootstrap-datepicker.css',
                                    '/lib/base64.js'
                                ]
                            })
                        }]
                    }
                })
                //系统用户管理
                .state('main.systemuser/list', {
                    url: 'systemuser/list',
                    params: {
                        name: null
                    },
                    views: {
                        'layout': {
                            controller: 'SystemUsersShowCtrl',
                            templateUrl: '/templates/dw-system-user-list.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/SystemUserService.js',
                                    '/js/controllers/SystemUsersShowController.js',
                                    // 'js/directives.js'
                                ]
                            })
                        }]
                    }
                })
                //系统用户添加
                .state('main.systemuser/add', {
                    url: 'systemuser/add',
                    views: {
                        'layout': {
                            controller: 'SystemUserAddCtrl',
                            templateUrl: '/templates/dw-system-user-add.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/SystemUserService.js',
                                    '/js/controllers/SystemUserAddController.js',
                                    '/js/directives.js',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    '/css/bootstrap-datepicker.css'
                                ]
                            })
                        }]
                    }
                })
                //系统用户详情
                .state('main.systemuser/detail', {
                    url: 'systemuser/detail/:id',
                    views: {
                        'layout': {
                            controller: 'SystemUserDetailCtrl',
                            templateUrl: '/templates/dw-system-user-detail.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/SystemUserService.js',
                                    '/js/controllers/SystemUserDetailController.js',
                                    '/lib/base64.js'
                                ]
                            })
                        }]
                    }
                })
                //系统用户编辑
                .state('main.systemuser/edit', {
                    url: 'systemuser/edit/:id',
                    views: {
                        'layout': {
                            controller: 'SystemUserEditCtrl',
                            templateUrl: '/templates/dw-system-user-edit.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/SystemUserService.js',
                                    '/js/controllers/SystemUserEditController.js',
                                    '/lib/base64.js',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    '/css/bootstrap-datepicker.css'
                                ]
                            })
                        }]
                    }
                })
                //系统用户组列表
                .state('main.systemusergroup/list', {
                    url: 'systemusergroup/list',
                    views: {
                        'layout': {
                            controller: 'SystemUserGroupsShowCtrl',
                            templateUrl: '/templates/dw-system-user-group-list.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/SystemUserGroupService.js',
                                    '/js/controllers/SystemUserGroupsShowController.js',
                                    '/lib/base64.js'
                                ]
                            })
                        }]
                    }
                })
                //系统用户组添加
                .state('main.systemusergroup/add', {
                    url: 'systemusergroup/add',
                    views: {
                        'layout': {
                            controller: 'SystemUserGroupAddCtrl',
                            templateUrl: '/templates/dw-system-user-group-add.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/SystemUserGroupService.js',
                                    '/js/controllers/SystemUserGroupAddController.js',
                                    '/lib/base64.js'
                                ]
                            })
                        }]
                    }
                })
                //系统用户组编辑
                .state('main.systemusergroup/edit', {
                    url: 'systemusergroup/edit/:id',
                    views: {
                        'layout': {
                            controller: 'SystemUserGroupEditCtrl',
                            templateUrl: '/templates/dw-system-user-group-edit.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/SystemUserGroupService.js',
                                    '/js/controllers/SystemUserGroupEditController.js',
                                    '/lib/base64.js'
                                ]
                            })
                        }]
                    }
                })
                //订单管理
                .state('main.charge/orders', {
                    url: 'charge/orders',
                    views: {
                        'layout': {
                            controller: 'FinanceOrderCtrl',
                            templateUrl: '/templates/dw-finance-charge-orders.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/ChargeOrderService.js',
                                    '/js/controllers/FinanceChargeOrderController.js',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    '/css/bootstrap-datepicker.css',
                                    // '/lib/bootstrap-datetimepicker.js',
                                ]
                            })
                        }]
                    }
                })
                //充电桩管理
                .state('main.deviceport/list', {
                    url: 'deviceport/list',
                    views: {
                        'layout': {
                            controller: 'DevicePortsShowCtrl',
                            templateUrl: '/templates/dw-deviceport-list.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/DevicePortService.js',
                                    '/js/controllers/DevicePortsShowController.js',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    '/css/bootstrap-datepicker.css',
                                    // '/lib/bootstrap-datetimepicker.js',
                                ]
                            })
                        }]
                    }
                })
                // 充电桩端口添加
                .state('main.deviceport/add', {
                    url: 'deviceport/add',
                    views: {
                        'layout': {
                            controller: 'DevicePortAddCtrl',
                            templateUrl: '/templates/dw-deviceport-add.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/DevicePortService.js',
                                    '/js/controllers/DevicePortAddController.js'
                                ]
                            })
                        }]
                    }
                })
                // 充电桩端口编辑
                .state('main.deviceport/edit', {
                    url: 'deviceport/edit/:id',
                    views: {
                        'layout': {
                            controller: 'DevicePortEditCtrl',
                            templateUrl: '/templates/dw-deviceport-edit.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/DevicePortService.js',
                                    '/js/controllers/DevicePortEditController.js'
                                ]
                            })
                        }]
                    }
                })
                // 充电桩端口详情
                .state('main.deviceport/detail', {
                    url: 'deviceport/detail/:id',
                    views: {
                        'layout': {
                            controller: 'DevicePortDetailCtrl',
                            templateUrl: '/templates/dw-deviceport-detail.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/DevicePortService.js',
                                    '/js/controllers/DevicePortDetailController.js',
                                    '/css/device.css'
                                ]
                            })
                        }]
                    }
                })
                //远程升级(包)
                .state('main.upgrade/package', {
                    url: 'upgrade/package',
                    views: {
                        'layout': {
                            controller: 'UpgradePackageCtrl',
                            templateUrl: '/templates/dw-upgrade-package.html',
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/UpgradeService.js',
                                    '/js/controllers/UpgradePackageController.js',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    '/css/bootstrap-datepicker.css',
                                    '/lib/uploadPic.js',
                                    '/webupload/webuploader.css',
                                    '/webupload/webuploader.js'
                                ]
                            });
                        }]
                    }
                })
                //远程升级(桩)
                .state('main.upgrade/device', {
                    url: 'upgrade/device',
                    views: {
                        'layout': {
                            controller: 'UpgradeDeviceCtrl',
                            templateUrl: '/templates/dw-upgrade-device.html',
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/UpgradeService.js',
                                    '/js/controllers/UpgradeDeviceController.js'
                                ]
                            });
                        }]
                    }
                })
                //远程升级(报告)
                .state('main.upgrade/report', {
                    url: 'upgrade/report',
                    views: {
                        'layout': {
                            controller: 'UpgradeReportCtrl',
                            templateUrl: '/templates/dw-upgrade-report.html',
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    '/css/bootstrap-datepicker.css',
                                    '/js/services/UpgradeService.js',
                                    '/js/controllers/UpgradeReportController.js'
                                ]
                            });
                        }]
                    }
                })
                //分润用户汇总列表
                .state('main.profit/list', {
                    url: 'profit/list',
                    views: {
                        'layout': {
                            controller: 'ProfitCtrl',
                            templateUrl: '/templates/dw-profit-user.html',
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/controllers/ProfitController.js',
                                    '/js/services/ProfitService.js',
                                    '/js/services/SystemUserService.js',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    '/css/bootstrap-datepicker.css'
                                ]
                            });
                        }]
                    }
                })
                //分润站点汇总列表
                .state('main.profitStation/list', {
                    url: 'profitStation/list/:id',
                    views: {
                        'layout': {
                            controller: 'ProfitStationCtrl',
                            templateUrl: '/templates/dw-profit-station.html',
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/controllers/ProfitStationController.js',
                                    '/js/services/ProfitService.js',
                                    '/js/services/SystemUserService.js',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    '/css/bootstrap-datepicker.css'
                                ]
                            });
                        }]
                    }
                })
                //分润站点设备列表
                .state('main.profitDevice/list', {
                    url: 'profitDevice/list/:id',
                    views: {
                        'layout': {
                            controller: 'ProfitDeviceCtrl',
                            templateUrl: '/templates/dw-profit-device.html',
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/controllers/ProfitDeviceController.js',
                                    '/js/services/ProfitService.js',
                                    '/js/services/SystemUserService.js',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    '/css/bootstrap-datepicker.css'
                                ]
                            });
                        }]
                    }
                })
                //分润站点订单列表
                .state('main.profitOrder/list', {
                    url: 'profitOrder/list/:id',
                    views: {
                        'layout': {
                            controller: 'ProfitOrderCtrl',
                            templateUrl: '/templates/dw-profit-order.html',
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/controllers/ProfitOrderController.js',
                                    '/js/services/ProfitService.js',
                                    '/js/services/SystemUserService.js',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    '/css/bootstrap-datepicker.css'
                                ]
                            });
                        }]
                    }
                })
                //账户提现列表
                .state('main.withDraw/list', {
                    url: 'withdraw/list',
                    views: {
                        'layout': {
                            controller: 'WithDrawListCtrl',
                            templateUrl: '/templates/dw-withdraw-list.html',
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/controllers/WithDrawListController.js',
                                    '/js/services/WithDrawService.js',
                                    '/js/services/SystemUserService.js',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    '/css/bootstrap-datepicker.css'
                                ]
                            });
                        }]
                    }
                })
                // 修改：账户提现详情
                .state('main.withDraw/detail', {
                    url: 'withDraw/detail/:id',
                    views: {
                        'layout': {
                            controller: 'WithDrawDetailCtrl',
                            templateUrl: '/templates/dw-withdraw-detail.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/WithDrawService.js',
                                    '/js/controllers/WithDrawDetailController.js',
                                    '/js/services/DeviceService.js',
                                    '/css/device.css'
                                ]
                            })
                        }]
                    }
                })
                // 修改：账户提现审批
                .state('main.withDraw/apply', {
                    url: 'withDraw/apply',
                    views: {
                        'layout': {
                            //controller: 'WithDrawDetailCtrl',
                            templateUrl: '/templates/dw-withdraw-apply.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/services/WithDrawService.js',
                                    '/js/controllers/WithDrawDetailController.js',
                                    '/js/services/DeviceService.js',
                                    '/css/device.css',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    '/css/bootstrap-datepicker.css'
                                ]
                            })
                        }]
                    }
                })
                //后台查看权限
                .state('rights/list', {
                    url: '/rights/list',
                    cache: false,
                    views: {
                        'lazyLoadView': {
                            controller: 'RightsShowCtrl',
                            templateUrl: '/templates/dw-rights-list.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'main',
                                files: [
                                    '/js/services/RightsService.js',
                                    '/js/controllers/RightsShowController.js',
                                    '/js/services/SystemUserService.js'
                                ]
                            })
                        }]
                    }
                })
                //后台编辑权限
                .state('rights/add', {
                    url: '/rights/add',
                    cache: false,
                    views: {
                        'lazyLoadView': {
                            controller: 'RightsAddCtrl',
                            templateUrl: '/templates/dw-rights-add.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'main',
                                files: [
                                    '/js/services/RightsService.js',
                                    '/js/controllers/RightsAddController.js'
                                ]
                            })
                        }]
                    }
                })
                //广告中心
                .state('main.advert/show', {
                    url: 'advert/show',
                    views: {
                        'layout': {
                            controller: 'AdvertShowCtrl',
                            templateUrl: '/templates/page-advert.html',
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    'js/controllers/AdvertShowController.js',
                                    '/css/bootstrap-datepicker.css',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    '/js/services/AdvertService.js',
                                    '/js/directives.js']
                            });
                        }]
                    }
                })
                // 广告下发
                .state('main.advert/lssued', {
                    url: 'advert/lssued',
                    views: {
                        'layout': {
                            controller: 'AdvertLssuedCtrl',
                            templateUrl: '/templates/page-advert-lssued.html',
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: ['/js/controllers/AdvertLssuedController.js',
                                    '/css/bootstrap-datetimepicker.min.css',
                                    '/lib/bootstrap-datetimepicker.js',
                                    '/js/services/DeviceService.js',
                                    '/js/directives.js',
                                    '/js/directive-input-select.js',
                                    '/js/services/StationService.js',
                                    '/js/services/AdvertService.js']
                                // '/css/bootstrap-datepicker.css',
                                // '/lib/bootstrap-datepicker.js',
                                // '/lib/bootstrap-datepicker.zh-CN.min.js',
                            });
                        }]
                    }
                })
                // 广告添加
                .state('main.advert/add', {
                    url: 'advert/add',
                    views: {
                        'layout': {
                            controller: 'AdvertAddCtrl',
                            templateUrl: '/templates/page-advert-add.html',
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: ['/js/controllers/AdvertAddController.js',
                                    '/js/services/AdvertService.js',
                                    '/webuploader/webuploader.css',
                                    '/webuploader/webuploader.js']
                            });
                        }]
                    }
                })
                // 广告下发,设备广告编辑
                .state('main.advert/edit', {
                    url: 'advert/edit/:id',
                    views: {
                        'layout': {
                            controller: 'AdvertEditCtrl',
                            templateUrl: '/templates/page-advert-edit.html',
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    'css/bootstrap-datepicker.css',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    '/js/directives.js',
                                    '/js/controllers/AdvertEditController.js',
                                    '/js/services/DeviceService.js',
                                    '/js/services/AdvertService.js']
                            });
                        }]
                    }
                })
                /*广告中心广告编辑*/
                .state('main.advertshow/edit', {
                    url: 'advertshow/edit/:id',
                    views: {
                        'layout': {
                            controller: 'AdvertShowEditCtrl',
                            templateUrl: '/templates/page-advertshow-edit.html',
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/controllers/AdvertShowEditController.js',
                                    '/js/services/AdvertService.js',
                                    '/webuploader/webuploader.css',
                                    '/webuploader/webuploader.js']
                            });
                        }]
                    }
                })
                //活动站点卡
                .state('main.active/station', {
                    url: 'active/station',
                    views: {
                        'layout': {
                            controller: 'ActiveStationCtrl',
                            templateUrl: '/templates/dw-active-station.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/controllers/ActiveStationController.js',
                                    '/js/services/ActiveService.js',
                                    '/lib/bootstrap-datetimepicker.js',
                                    '/css/bootstrap-datetimepicker.min.css',
                                    'css/bootstrap-datepicker.css',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                ]
                            })
                        }]
                    }
                })
                //活动注册即送
                .state('main.active/register', {
                    url: 'active/register',
                    views: {
                        'layout': {
                            controller: 'ActiveRegisterCtrl',
                            templateUrl: '/templates/dw-active-register.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/controllers/ActiveRegisterController.js',
                                    '/js/services/ActiveService.js',
                                    '/lib/bootstrap-datetimepicker.js',
                                    '/css/bootstrap-datetimepicker.min.css',
                                    'css/bootstrap-datepicker.css',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                ]
                            })
                        }]
                    }
                })
                //活动充电送次数
                .state('main.active/charge', {
                    url: 'active/charge',
                    views: {
                        'layout': {
                            controller: 'ActiveChargeCtrl',
                            templateUrl: '/templates/dw-active-charge.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: "",
                                files: [
                                    '/js/controllers/ActiveChargeController.js',
                                    '/js/services/ActiveService.js',
                                    '/lib/bootstrap-datetimepicker.js',
                                    '/css/bootstrap-datetimepicker.min.css',
                                    'css/bootstrap-datepicker.css',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                ]
                            })
                        }]
                    }
                })
                //活动充值返余额
                .state('main.active/recharge', {
                    url: 'active/recharge',
                    views: {
                        'layout': {
                            controller: 'ActiveRechargeCtrl',
                            templateUrl: '/templates/dw-active-recharge.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/controllers/ActiveRechargeController.js',
                                    '/js/services/ActiveService.js',
                                    '/lib/bootstrap-datetimepicker.js',
                                    '/css/bootstrap-datetimepicker.min.css',
                                    'css/bootstrap-datepicker.css',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                ]
                            })
                        }]
                    }
                })

                //邮件提醒设置
                .state('main.mails/notify', {
                    url: 'mails/notify',
                    views: {
                        'layout': {
                            controller: 'MailNotifyController',
                            templateUrl: '/templates/dw-mail-notify-config.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/controllers/MailNotifyController.js',
                                    '/js/services/MailNotifyService.js',
                                    // '/lib/bootstrap-select.min.js',
                                    // '/css/bootstrap-select.min.css',
                                ]
                            })
                        }]
                    }
                })
                // 卡管理
                .state('main.card/list', {
                    url: 'card/list',
                    views: {
                        'layout': {
                            controller: 'CardListController',
                            templateUrl: '/templates/dw-card-list.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/controllers/CardListController.js',
                                    '/js/services/CardService.js',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    '/css/bootstrap-datepicker.css'
                                ]
                            })
                        }]
                    }
                })
                //数据中心
                .state('main.data/center', {
                    url: 'data/center',
                    views: {
                        'layout': {
                            controller: 'DataCenterController',
                            templateUrl: '/templates/dw-data-center.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/controllers/DataCenterController.js',
                                    '/js/services/SystemUserService.js',
                                    '/js/services/LoginService.js'
                                ]
                            })
                        }]
                    }
                })
                //数据中心(test)
                .state('main.data/centerTest', {
                    url: 'data/centerTest',
                    cache: false,
                    views: {
                        'layout': {
                            controller: 'testCtrol',
                            templateUrl: '/templates/dw-data-centerTest.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/controllers/DataCenterControllerTest.js'
                                ]
                            })
                        }]
                    }
                })
                //sim卡管理
                .state('main.simCard/list', {
                    url: 'simCard/list',
                    views: {
                        'layout': {
                            controller: 'SimCardListController',
                            templateUrl: '/templates/dw-sim-card-list.html'
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                serie: true,
                                name: '',
                                files: [
                                    '/js/controllers/SimCardListController.js',
                                    '/js/services/SimService.js',
                                    '/lib/bootstrap-datepicker.js',
                                    '/lib/bootstrap-datepicker.zh-CN.min.js',
                                    '/css/bootstrap-datepicker.css',
                                ]
                            })
                        }]
                    }
                })

            $urlRouterProvider.otherwise('index');
        }
    ])
    .factory("mainFac1", function() {
        return {
            name: "mainFac1"
        }
    })
