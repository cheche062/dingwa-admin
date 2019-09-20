angular.module("Filter", ['CommonService'])
    .filter('sec2dt', function () {
        return function (seconds) {
            return new Date(1970, 0, 1).setSeconds(seconds);
        };
    })

    .filter("toPercent", function () {
        return function (data, base) {
            return Math.floor((data / base) * 100) / 100 + "%";
        };
    })
    .filter("isActive", function () {
        var value;
        return function (data) {
            if (data === 0) {
                value = "不活跃"
            } else {
                value = "活跃"
            }
            return value;
        };
    })

    .filter("changeDefaultAuth", function () {
        return function (str) {
            if (str == "1") {
                str = "全有";
            } else {
                str = "全无";
            }

            return str;
        };
    })
    .filter("authority", function () {
        return function (str) {
            if (str == "1") {
                str = "只读";
            } else {
                str = "控制";
            }

            return str;
        };
    })
    .filter("formatStationGroup", function () {
        return function (str) {
            var changed = {};
            if (str.length === 0) {
                changed.name = "暂无站点组";
                str.push(changed);
            }
            return str;
        };
    })
    .filter("formatUserGroup", function () {
        return function (str) {
            var changed = {};
            if (str.length === 0) {
                changed.name = "暂无用户组";
                str.push(changed);
            }
            return str;
        };
    })
    .filter("toDate", function () {
        return function (str) {
            var d;
            d = new Date(str)
            return d;
        };
    })
    .filter("operatorType", function () {
        var value;
        return function (data) {
            if (data === 'update') {
                value = "修改"
            } else if (data == 'insert') {
                value = "新建"
            } else if (data == 'delete') {
                value = '删除'
            }
            return value;
        };
    })
    .filter("formatDate", function () {
        return function (str) {
            var date = new Date(str);
            console.log(date);
            var y = date.getFullYear();
            var m = (date.getMonth() < 10) ? "0" + date.getMonth() : date.getMonth();
            var d = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate();
            return y + "-" + m + "-" + d;
        };
    })
    .filter('duration2hour', function () {
        return function (value) {
            var h = Math.round(value / 3600).toString();
            if (h.length >= 5) {
                // h = Math.round(parseInt(h) / 10000) + "万"
                h = (parseInt(h) / 10000).toFixed(1) + "万";
            };
            return h;
        };
    })
    .filter('formatNumber', function () {
        return function (value) {
            value = value + '';
            if (value.length >= 5) {
                value = (parseInt(value) / 10000).toFixed(2) + "万";
            };
            return value;
        };
    })
    .filter('format2cash', function () {
        return function (value) {
            if (value == "cash") {
                value = "无需处理"
            }
            if (value == "undeal") {
                value = "未处理"
            }
            if (value == "deal") {
                value = "已处理"
            };
            return value;
        };
    })
    .filter('quantity2du', function () {
        return function (value) {
            var value = parseInt(value);
            var h = Math.round(value / 1000);
            return h;
        };
    })
    .filter('fen2yuan', function () {
        return function (value) {
            var value = parseInt(value);
            var h = Math.round(value / 100);
            return h;
        };
    })
    .filter('dun2', function () {
        return function (value) {
            var value = parseInt(value);
            var h = Math.round(value / 1000);
            return h;
        };
    })
    .filter('second2format', function () {
        return function (value) {
            var value = parseFloat(value);
            if (value == 0) {
                return '00:00:00'
            }
            if (value > 60) {
                server_min = parseInt(value / 60);
                server_second = parseInt(value % 60);
                if (server_min >= 60) {
                    server_hour = parseInt(server_min / 60);
                    server_min = parseInt(server_min % 60);
                } else if (server_min < 60) {
                    server_hour = 0;
                    server_min = server_min;
                }
                if (server_second < 10) {
                    server_second = '0' + server_second;
                }
                if (server_min < 10) {
                    server_min = '0' + server_min;
                }
                if (server_hour < 10) {
                    server_hour = '0' + server_hour;
                }
                server_time = server_hour + ':' + server_min + ':' + server_second;
            } else {
                server_hour = "00";
                server_min = "00";
                server_second = value;
                server_time = server_hour + ':' + server_min + ':' + server_second;
            }
            value = server_time;
            return value;
        };
    })
    .filter('discount_type', function () {
        return function (value) {
            if (value == 1) {
                value = "公司优惠";
            } else if (value == 2) {
                value = "站点组优惠";
            } else if (value == 3) {
                value = "用户组优惠";
            } else if (value == 4) {
                value = "站点组用户组优惠";
            }
            return value;
        }
    })
    .filter("showMenus", function () {
        return function (arr, id) {
            var flag = false;
            if (arr) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] === id) {
                        flag = true;
                        break;
                    }
                }
            } else {
                flag = false;
            }
            return flag;
        }
    })
    .filter("getMenuName", [function () {
        return function (arr) {
            // var menus = GetMenus;
            // var auths = "";
            var menuArr = '';
            initIds(arr);

            function initIds(arr) {

                var obj = eval("(" + arr + ")")
                if (obj.monitors && obj.monitors.checked) {
                    for (var i = 0; i < obj.monitors.child.length; i++) {
                        if (obj.monitors.child[i].checked) {
                            menuArr = '[' + obj.monitors.child[i].name + '],' + menuArr

                        };

                    }
                }
                if (obj.datas && obj.datas.checked) {
                    for (var i = 0; i < obj.datas.child.length; i++) {
                        if (obj.datas.child[i].checked) {
                            menuArr = '[' + obj.datas.child[i].name + '],' + menuArr

                        };

                    }
                }
                if (obj.finances && obj.finances.checked) {
                    for (var i = 0; i < obj.finances.child.length; i++) {
                        if (obj.finances.child[i].checked) {
                            menuArr = '[' + obj.finances.child[i].name + '],' + menuArr

                        };

                    }
                }
                if (obj.manages && obj.manages.checked) {
                    for (var i = 0; i < obj.manages.child.length; i++) {
                        if (obj.manages.child[i].checked) {
                            menuArr = '[' + obj.manages.child[i].name + '],' + menuArr
                        };

                    }
                }

            }
            return menuArr;

        }
    }])
    .filter('content_type', function () {
        return function (value) {
            if (value == 1) {
                value = "最新活动";
            } else if (value == 2) {
                value = "最新动态";
            } else if (value == 4) {
                value = "行业资讯";
            } else if (value == 3) {
                value = "行车贴士";
            } else if (value == 5) {
                value = "首页广告";
            } else if (value == 6) {
                value = "充电广告";
            } else if (value == 7) {
                value = "开机通知";
            } else if (value == 8) {
                value = "分享链接";
            }
            return value;
        }
    })
    .filter('cardfilter', function () {
        return function (arr) {
            var str = ''
            for (var i = 0; i < arr.length; i++) {
                str += arr[i].card_number
                str += ','
            }
            // console.log(str)
            return str
        }
    })
    .filter('stationMonitorName', function () {
        return function (value) {
            var front = value.substring(0, 4)
            var end = value.substr(value.length - 4)

            return front + '***' + end
        }
    })
    //充电送次数过滤器
    .filter('charge', function () {
        return function (value) {
            var arr = value.split(',')
            return '充' + arr[0] + '送' + arr[1]
        }
    })