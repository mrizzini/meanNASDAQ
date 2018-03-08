angular.module('meanNASDAQ').controller('ProfileController', ProfileController);

function ProfileController($route, $routeParams, $window, $location, stockDataFactory, AuthFactory, jwtHelper) {
    var vm = this;
    var token = $window.sessionStorage.token; // capturing token from session storage
    var decodedToken = jwtHelper.decodeToken(token); //decodes token 
    vm.loggedInUser = decodedToken.username; // add logged in user property so we can
    stockDataFactory.userDisplay(vm.loggedInUser).then(function(response) {
    console.log("userDisplay response is", response); 
    vm.favorites = response.data.userFavorites;
    vm.funds = response.data.funds;
    vm.stocksOwned = response.data.stocksOwned;
    });
    
    
    vm.deleteProfile = function() {
      console.log('delete button clicked');
      var deleteConfirmation = confirm(vm.loggedInUser + ", are you sure you want to delete your profile?");
        if(deleteConfirmation == true) {
            stockDataFactory.deleteProfile(vm.loggedInUser).then(function(response) {
            console.log(vm.loggedInUser + " is deleting profile"); 
            AuthFactory.isLoggedIn = false;
            delete $window.sessionStorage.token;
            $location.path('/');
        });
        } else {
          console.log('user decided to keep profile');
      }
    };
    
}



