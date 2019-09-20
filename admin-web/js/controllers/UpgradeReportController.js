angular.module("UpgradeReportController", ['CommonService', 'UpgradeService'])
.controller("UpgradeReportCtrl", ['$scope', 'UpgradeService', 'ConfigService', 'DialogService', 'DictService',
	function($scope, UpgradeService, ConfigService, DialogService, DictService){
		 var storage = window.localStorage;
		if (storage.getItem('UserAuth') !== null) {
		    $scope.UserAuth = JSON.parse(storage.getItem('UserAuth'));
		    console.log($scope.UserAuth)
		}
	var now = new Date();
	var last_two_month = now.getTime() - 60 * 24 * 3600 * 1000;
	$scope.info = {
		manufacturer_id: 0,
		pack_id: 0,
		st: formatDate(last_two_month),
		et: formatDate(now),
		total: 0,
		pageCnt: 0,
		page: 1,
		offset: 0,
		limit: 20,
		order_by: 'created_at',
		order: 'desc',
		current_pack_id: ''
	};
	$scope.reports = [];
	$scope.manufacturerOption = {id:'0', name: '全部'};
	$scope.packOption = {id: 0, name: '全部'}
	$scope.packs = []
	init();
	function init() {
		loadReports();
		// loadPacks();
		// loadManufacturer();
	};
	// function loadManufacturer() {
	// 	var condition = {
	// 		type: 'manufacturer'
	// 	}
	// 	DictService.search(condition).then(function(data){
	// 		$scope.manufacturers = data.concat({id: '0', name: '全部'}).reverse();
	// 	}, function(code){

	// 	})
	// }
	// function loadPacks(){
	// 	var condition = {
	// 		type: 'packs',
	// 		query: '',
	// 	};
	// 	DictService.search(condition).then(function(data){
	// 		console.log(data)
	// 		$scope.packs = data.concat({id: 0, name: '全部'}).reverse();
	// 	}, function(code){

	// 	})
	// }
	$scope.search = function(){
		$scope.info.offset = 0;
		$scope.info.page = 1;
		loadReports();
	};
	$scope.startPaging = function() {
		loadReports();
	};
	function loadReports() {
		var condition = {
			pack_id: $scope.info.pack_id,
			station_id:$scope.info.station_id,
			order_by: $scope.info.order_by,
			order: $scope.info.order,
			total: $scope.info.total,
			offset: $scope.info.offset,
			limit: $scope.info.limit,
		};
		UpgradeService.searchPackage(condition).then(function(res){
			console.log(res.data.list)
			$scope.reports = res.data.list;
			$scope.info.total = res.data.total;
			$scope.info.pageCnt = Math.ceil(res.data.total / $scope.info.limit);
		}, function(code) {

		})
	}
	$scope.getReport = function(){
		var condition = {
			pack_id: $scope.info.current_pack_id
		}
		UpgradeService.searchReport(condition).then(function(res){
			console.log(res)
			$scope.report = res.data
		}, function(code){

		})
	};
	$("input[id^='start-date'], input[id^='end-date']").datepicker({
	    language: 'zh-CN',
	    format: 'yyyy-mm-dd',
	    autoclose: true,
	    todayBtn: false,
	    endDate: formatDate(now), //禁止选择当天之后的日期
	    todayHighlight: true
	});
	$("input[id^='start-date']").datepicker("setDate", formatDate(last_two_month));
	$("input[id^='end-date']").datepicker("setDate", formatDate(now));
	 
	 
	 
}])
