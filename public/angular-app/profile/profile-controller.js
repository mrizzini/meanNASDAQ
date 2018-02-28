angular.module('meanNASDAQ').controller('ProfileController', ProfileController);

function ProfileController($route, $routeParams, $window, stockDataFactory, AuthFactory, jwtHelper) {
    var vm = this;
    var token = $window.sessionStorage.token; // capturing token from session storage
    var decodedToken = jwtHelper.decodeToken(token); //decodes token 
    vm.loggedInUser = decodedToken.username; // add logged in user property so we can
    stockDataFactory.userDisplay(vm.loggedInUser).then(function(response) {
    console.log("userDisplay response is", response); 
    vm.favorites = response.data.userFavorites;
    // vm.users = response.data;
    // var token = jwtHelper.decodeToken($window.sessionStorage.token);
    // vm.username = token.username;
    });
    
    // var token = jwtHelper.decodeToken($window.sessionStorage.token);
    // vm.username = token.username;
}



