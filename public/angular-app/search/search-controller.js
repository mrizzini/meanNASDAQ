angular.module('meanNASDAQ').controller('SearchController', SearchController);

function SearchController(stockDataFactory, $route) {
    var vm = this;
    // vm.isSubmitted = false;
    vm.searchHistory = [];
    
    // $http.get('/api/stocks').then(function(response) {
    // stockDataFactory.searchStock(symbol).then(function(response) {
    // console.log(response); 
    // vm.stocks = response.data;
    
    
     vm.searchDisplay = function() {
        
    console.log('search button clicked FOR DISPLAY');
    var symbol = vm.symbol;

    stockDataFactory.searchDisplay(symbol).then(function(response) {
        console.log('search Display', symbol);
        console.log('response.data is', response.data);
        console.log('response is ', response.data.search);
        vm.stockSearchHistory = response.data.search;
        // $route.reload(); 
        // vm.isSubmitted = true;
         // vm.searchHistory.push(response.data[0].Symbol);
        // if (vm.searchHistory.length > 3) {
        //  vm.searchHistory.shift();   
        // }
    }
    );
    
        };
    
    
    vm.search = function() {

    console.log('search button clicked');
    var symbol = vm.symbol;
        vm.isSubmitted = true;

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
    
    };
    
  
        stockDataFactory.showSearches().then(function(response) {
        console.log(response.data.length);
        // $route.reload(); 
        // if (response.data.length >= 10) {
        //     response.data.shift();
        //     console.log('when shift, response.data.length is', response.data.length);
        // }
        vm.allSearches = response.data.slice((response.data.length - 5), response.data.length);
        // if (vm.allSearches.length > 10) {
        //     vm.allSearches.pop();
        // }
    });
    
    
}
