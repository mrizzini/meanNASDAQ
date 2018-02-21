angular.module('meanNASDAQ').controller('ProfileController', ProfileController);

function ProfileController($route, $routeParams, $window, stockDataFactory, AuthFactory, jwtHelper) {
    var vm = this;
    stockDataFactory.userDisplay().then(function(response) {
    console.log(response); 
    vm.users = response.data;
    var token = jwtHelper.decodeToken($window.sessionStorage.token);
    vm.username = token.username;
    });
    
    // var token = jwtHelper.decodeToken($window.sessionStorage.token);
    // vm.username = token.username;
}



