angular.module('meanNASDAQ').controller('SearchController', SearchController);

function SearchController(stockDataFactory, $route, $window, AuthFactory, jwtHelper) {
    var vm = this;
    // vm.isSubmitted = false;
    // vm.searchHistory = [];
    
    vm.isLoggedIn = function() {
        if (AuthFactory.isLoggedIn) {
            return true;
        } else {
            return false;
        }
    };
    
    // $http.get('/api/stocks').then(function(response) {
    // stockDataFactory.searchStock(symbol).then(function(response) {
    // console.log(response); 
    // vm.stocks = response.data;
    
    
    // vm.searchDisplay = function() {
        
    // console.log('search button clicked FOR DISPLAY');
    // var symbol = vm.symbol;

    // stockDataFactory.searchDisplay(symbol).then(function(response) {
    //     console.log('search Display', symbol);
    //     console.log('response.data is', response.data);
    //     console.log('response is ', response.data.search);
    //     vm.stockSearchHistory = response.data.search;
    //     // $route.reload(); 
    //     // vm.isSubmitted = true;
    //      // vm.searchHistory.push(response.data[0].Symbol);
    //     // if (vm.searchHistory.length > 3) {
    //     //  vm.searchHistory.shift();   
    //     // }
    // }
    // );
    
    //     };
    
    
    vm.search = function() {

    var symbol =  vm.symbol.toUpperCase();
    var userSearch = {
        symbol: vm.symbol.toUpperCase()
    };
    var user = vm.username;
    console.log('search button clicked and symbol is ', symbol + ' user is ', user);
    // vm.isSubmitted = true;

    stockDataFactory.searchStock(symbol).then(function(response) {
        // console.log('response is ', response.data.length);
        // vm.isSubmitted = true;
        if (!response) {
            vm.error = true;
            vm.correctSearch = false;
            vm.stock = symbol + " is not a correct NASDAQ symbol";
        } else {
            vm.correctSearch = true;
            vm.error = false;
            vm.stock = response.data[0];
            // vm.isSubmitted = true;
            console.log('vm.stock is', vm.stock);
        }
        // vm.stock = response.data[0];
        // vm.isSubmitted = true;
        // console.log('vm.stock is', vm.stock);
        // vm.searchHistory.push(response.data[0].Symbol);
        // if (vm.searchHistory.length > 3) {
        //  vm.searchHistory.shift();   
        // }
    });
    
    if (vm.isLoggedIn()) {
        var token = $window.sessionStorage.token; // capturing token from session storage
        var decodedToken = jwtHelper.decodeToken(token); //decodes token 
        vm.loggedInUser = decodedToken.username; // add logged in user property so we can
        console.log('vm.loggedInUser is ', vm.loggedInUser);
        console.log(vm.loggedInUser + ' searched for ' + symbol);
        stockDataFactory.addUserSearch(vm.loggedInUser, userSearch).then(function(response) {
        }).catch(function(error) {
            console.log(error);
        }
        )}
        vm.isSubmitted = true;
    };
    
  
    //     stockDataFactory.showSearches().then(function(response) {
    //     console.log(response.data.length);
    //     // $route.reload(); 
    //     // if (response.data.length >= 10) {
    //     //     response.data.shift();
    //     //     console.log('when shift, response.data.length is', response.data.length);
    //     // }
    //     vm.allSearches = response.data.slice((response.data.length - 5), response.data.length);
    //     // if (vm.allSearches.length > 10) {
    //     //     vm.allSearches.pop();
    //     // }
    // });
    
    
}
