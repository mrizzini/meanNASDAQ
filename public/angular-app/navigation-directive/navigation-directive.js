angular.module('meanNASDAQ').directive('mnNavigation', mnNavigation);

function mnNavigation() {
    return {
        restrict: 'E',
        templateUrl: 'angular-app/navigation-directive/navigation-directive.html'
    };
}