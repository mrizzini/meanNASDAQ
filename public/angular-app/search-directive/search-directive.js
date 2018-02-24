angular.module('meanNASDAQ').directive('searchDirective', searchDirective);

function searchDirective() {
    return {
        restrict: 'E',
        templateUrl: 'angular-app/search-directive/search-directive.html'
    };
}