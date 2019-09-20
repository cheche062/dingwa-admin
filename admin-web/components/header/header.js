angular.module("headerModule", [])
.directive("myHeader", function() {
    console.log("myHeader init")
    return {
        restrict: "E",
        templateUrl: "/components/header/header.html"
    }
})