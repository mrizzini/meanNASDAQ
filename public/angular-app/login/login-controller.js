angular.module('meanNASDAQ').controller('LoginController', LoginController);

function LoginController($http, $location, $window, AuthFactory, jwtHelper, stockDataFactory) {
    var vm = this;
    
    vm.isLoggedIn = function() {
        if (AuthFactory.isLoggedIn) {
            return true;
        } else {
            return false;
        }
    };
    
    vm.login = function() {
        if (vm.username && vm.password) {
            var user = {
                username: vm.username,
                password: vm.password
            };
            
            stockDataFactory.login(user).then(function(response){ 
        // $http.post('/api/users/login', user).then(function(response) {
            if (response.data.success) {
                $window.sessionStorage.token = response.data.token;
                AuthFactory.isLoggedIn = true;
                var token = $window.sessionStorage.token; // capturing token from session storage
                var decodedToken = jwtHelper.decodeToken(token); //decodes token 
                vm.loggedInUser = decodedToken.username; // add logged in user property so we can access it in html
                // need to add jwtHelper as dependency to app.js
            }
        }).catch(function(error) {
           console.log(error); 
        });
            
        }
    };
    
    vm.logout = function() {
        AuthFactory.isLoggedIn = false;
        delete $window.sessionStorage.token;
        $location.path('/');
    };
    
    
    vm.isActiveTab = function(url) {
        var currentPath = $location.path().split('/')[1];
        return (url === currentPath ? 'active' : '');
    };
    
    
}