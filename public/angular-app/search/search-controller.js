angular.module('meanNASDAQ').controller('SearchController', SearchController);

function SearchController(stockDataFactory, $route) {
    var vm = this;
    vm.isSubmitted = false;
    vm.searchHistory = [];
    
    // $http.get('/api/stocks').then(function(response) {
    // stockDataFactory.searchStock(symbol).then(function(response) {
    // console.log(response); 
    // vm.stocks = response.data;
    
    stockDataFactory.showSearches().then(function(response) {
        console.log(response.data.length);
        // if (response.data.length >= 10) {
        //     response.data.shift();
        //     console.log('when shift, response.data.length is', response.data.length);
        // }
        vm.allSearches = response.data;
        // if (vm.allSearches.length > 10) {
        //     vm.allSearches.pop();
        // }
    });
    
    
    vm.search = function() {
        
    console.log('search button clicked');
    var symbol = vm.symbol;

    stockDataFactory.searchStock(symbol).then(function(response) {
        console.log('response is ', response.data);
        vm.stock = response.data[0];
        vm.isSubmitted = true;
        vm.searchHistory.push(response.data[0].Symbol);
        if (vm.searchHistory.length > 3) {
         vm.searchHistory.shift();   
        }
    });
    
    };
    
    vm.searchDisplay = function() {
        
    console.log('search button clicked FOR DISPLAY');
    var symbol = vm.symbol;

    stockDataFactory.searchDisplay(symbol).then(function(response) {
        console.log('search Display', symbol);
        console.log('response.data is', response.data);
        console.log('response is ', response.data.search);
        vm.stockSearchHistory = response.data.search;
        $route.reload(); 
        // vm.isSubmitted = true;
         // vm.searchHistory.push(response.data[0].Symbol);
        // if (vm.searchHistory.length > 3) {
        //  vm.searchHistory.shift();   
        // }
    }
    );
    
        };
    
}
