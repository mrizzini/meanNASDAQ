angular.module('meanNASDAQ').controller('SearchController', SearchController);

function SearchController(stockDataFactory, $route, $window, AuthFactory, jwtHelper) {
    var vm = this;
    
    vm.isLoggedIn = function() {
        if (AuthFactory.isLoggedIn) {
            return true;
        } else {
            return false;
        }
    };
    
    vm.search = function() {
    var symbol =  vm.symbol.toUpperCase();
    var userSearch = {
        symbol: vm.symbol.toUpperCase()
    };
    var user = vm.username;
    console.log('search button clicked and symbol is ', symbol + ' user is ', user);

    stockDataFactory.searchStock(symbol).then(function(response) {
        if (!response) {
            vm.error = true;
            vm.correctSearch = false;
            vm.stock = symbol + " is not a correct NASDAQ symbol";
        } else {
            vm.correctSearch = true;
            vm.error = false;
            vm.stock = response.data[0];
            console.log('vm.stock is', vm.stock);
        }
    });
    
    if (vm.isLoggedIn()) {
        var token = $window.sessionStorage.token; // capturing token from session storage
        var decodedToken = jwtHelper.decodeToken(token); //decodes token 
        vm.loggedInUser = decodedToken.username; // add logged in user property so we can
        console.log('vm.loggedInUser is ', vm.loggedInUser);
        console.log(vm.loggedInUser + ' searched for ' + symbol);
        stockDataFactory.addUserSearch(vm.loggedInUser, userSearch).then(function(response) {
        }).catch(function(error) {
            console.log('addUserSearch error', error);
        });
    }
    
    console.log('VM.LOGGED IN', vm.loggedInUser);
                    
    if (vm.isLoggedIn()) {
        var token = $window.sessionStorage.token; // capturing token from session storage
        var decodedToken = jwtHelper.decodeToken(token); //decodes token 
        vm.loggedInUser = decodedToken.username; // add logged in user property so we can
        console.log('VM LOGGED IN 2 is ', vm.loggedInUser);
        stockDataFactory.userDisplay(vm.loggedInUser).then(function(response) {
            console.log("userDisplay response.data.userSearch is", response.data.userSearch);
            vm.users = response.data;
            var token = jwtHelper.decodeToken($window.sessionStorage.token);
            vm.username = token.username;
            console.log(vm.username);
            console.log(token);
            vm.userSearch = response.data;
            vm.userSearch = response.data.userSearch.slice((response.data.userSearch.length - 5), response.data.userSearch.length);
            console.log(vm.userSearch);
        }).catch(function(error) {
            console.log('userDisplay error', error);
        });
    }
    vm.isSubmitted = true;
    }; // Ends vm.search()

} // Ends SearchController 
