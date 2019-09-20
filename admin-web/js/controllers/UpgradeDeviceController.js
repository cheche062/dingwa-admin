angular.module("UpgradeDeviceController", ['CommonService', 'UpgradeService'])
.controller("UpgradeDeviceCtrl", ['$scope', 'UpgradeService', 'ConfigService', 'DialogService', 'DictService',
 function($scope, UpgradeService, ConfigService, DialogService, DictService){
 	 var storage = window.localStorage;
 	if (storage.getItem('UserAuth') !== null) {
 	    $scope.UserAuth = JSON.parse(storage.getItem('UserAuth'));
 	    console.log($scope.UserAuth)
 	}
    $scope.EnterpriseID = storage.getItem('EnterpriseID')
 	var local_pack_id;
	$scope.info = {
		station_id: '',
		device_id:'',
		soft_version: "",
		model: "",
		order_by: "created_at",
		order: "desc",
		total: 0,
		pageCnt: 0,
		page: 1,
		offset: 0,
		limit: 20,
		device_name:'',
		device_id:'',
		station_name:'',
		station_id:''
	};
	$scope.devices = [];
	$scope.device_ids = [];
	$scope.report = {};
	$scope.stationOption = {
		name: '',
		id: ''
	};
	$scope.packOption = {
		name: '',
		id: ''
	};
	init();
	function init() {
		loadPacks();
		loadDevices();
	};
	function loadDevices() {
		var condition = {
			station_id: $scope.info.station_id,
			device_id:$scope.info.device_id,
			soft_version:$scope.info.soft_version,
			model:$scope.info.model,
			offset:$scope.info.offset,
			limit:$scope.info.limit,
			total:$scope.info.total,
			order_by:$scope.info.order_by,
			order:$scope.info.order,
			total:$scope.info.total
		};
		UpgradeService.search(condition).then(function(res){
			console.log(res)
			$scope.devices = res.data.list;
			$scope.info.total = res.data.total;
			$scope.info.pageCnt = Math.ceil(res.data.total / $scope.info.limit);
		}, function(code) {

		})
	}
	$scope.search = function(){
		$scope.info.offset = 0;
		$scope.info.page = 1;
		loadDevices();
	};
	$scope.startPaging = function(){
		loadDevices();
	}
	$scope.searchStationList = function() {
		if($scope.info.station_name == ''){
			$scope.info.station_id = 0
		}
		if ($scope.info.station_name != '') {
			$scope.info.show_station_list = true;
			var condition = {
				type: 'station',
				query: $scope.info.station_name
			}
			DictService.search(condition).then(function(data){
				$scope.station_lists = data;
			}, function(code){

			})
		}else {
			$scope.info.show_station_list = false;
		}
	};
	$scope.clickStationList = function(x) {
		$scope.info.show_station_list = false;
		$scope.info.station_name = x.name;
		$scope.info.station_id = x.id;
	};
	$(document).click(function(){
		$scope.$apply(function(){
			$scope.info.show_station_list = false;
		})
	})

	function loadPacks(){
		var condition = {
			type: 'packs',
			query: '',
		};
		DictService.search(condition).then(function(data){
			$scope.packs = data;
		}, function(code){

		})
	}
	$scope.checkedAll = function(){
		var len = $scope.devices.length;
		if ($scope.info.checked_all) {
			for(var i = 0; i < len; i++) {
				$scope.devices[i].checked = true;
			}
		} else {
			for(var i = 0; i < len; i++) {
				$scope.devices[i].checked = false;
			}
		}
	};
	//单个升级
	$scope.getDeviceId = function(x){
		$scope.device_ids = [];
		$scope.device_ids.push(x.id);
		var condition = {
			deviceIds: $scope.device_ids
		}
		UpgradeService.checkUpgrade(condition).then(function(data){
			console.log(data)
			if (data.data.unableDevices == 0) {
				$('#SelectPackageOne').modal();
			}else{
				var str = '设备';
				for(var i = 0; i< data.length; i++) {
					str += data[i] + ' / ';
				}
				str += '正在升级过程中，无法再次升级';
				DialogService.alert(str)
			}
		}, function(code){

		})
	};
	//批量勾选升级桩
	$scope.checkUpgrade = function(){
		var len = $scope.devices.length;
		for(var i = 0; i < len; i++) {
			if ($scope.devices[i].checked) {
				$scope.device_ids.push(parseInt($scope.devices[i].id))
			};
		}
		var condition = {
			deviceIds: $scope.device_ids,
		}
		UpgradeService.checkUpgrade(condition).then(function(data){
			if (data.data.unableDevices == 0) {
				$('#SelectPackage').modal();
			}else{
				var str = '设备: ';
				for(var i = 0; i< data.length; i++) {
					str += data[i] + ' / ';
				}
				str += '正在升级过程中，无法再次升级'
				DialogService.alert(str)
			}
		}, function(code){

		})
	}
	//单个桩确认升级
	$scope.upgradeOne = function() {
		$("#SelectPackageOne").modal('hide')
		var condition = {
			deviceIds: $scope.device_ids,
			pack_id: parseInt($scope.packOption.id)
		}
		UpgradeService.beginUpgrade(condition).then(function(data){
			console.log(data)
			var str = "桩："
			if (data.data.unableDevices.length>0) {
				for(var i = 0; i < data.length; i++){
					str += data[i] + ' / ';
				}
				str += "无法用该升级包升级"
				DialogService.alert(str)
			}else{
				$scope.getReport();
			}

		}, function(code){

		})
	};
	//多个桩确认升级
	$scope.upgrade = function(){
		$("#SelectPackage").modal('hide')
		$scope.device_ids = [];
		var len = $scope.devices.length;
		for(var i = 0; i < len; i++) {
			if ($scope.devices[i].checked) {
				$scope.device_ids.push(parseInt($scope.devices[i].id))
			};
		}
		var condition = {
			deviceIds: $scope.device_ids,
			pack_id: parseInt($scope.packOption.id)
		}
		UpgradeService.beginUpgrade(condition).then(function(data){
			var str = "桩："
			if (data.data.unableDevices.length>0) {
				for(var i = 0; i < data.length; i++){
					str += data[i] + ' / ';
				}
				str += "无法用该升级包升级"
				DialogService.alert(str)
			}else{
				$scope.getReport();
			}
		}, function(code){

		})
	};

	$scope.getReport = function() {
		var condition = {
			pack_id: $scope.packOption.id
		}
		UpgradeService.searchReport(condition).then(function(res){
			console.log(res)
			$scope.report = res.data;
			$("#GetReport").modal();
		}, function(code){

		})
	}


}])
