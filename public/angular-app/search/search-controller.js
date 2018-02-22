angular.module('meanNASDAQ').controller('SearchController', SearchController);

function SearchController(stockDataFactory) {
    var vm = this;
    vm.isSubmitted = false;
    vm.searchHistory = [];

    // $http.get('/api/stocks').then(function(response) {
    // stockDataFactory.searchStock(symbol).then(function(response) {
    // console.log(response); 
    // vm.stocks = response.data;
    
    vm.search = function() {
        
    console.log('search button clicked');
    var symbol = vm.symbol;

    stockDataFactory.searchStock(symbol).then(function(response) {
        console.log('response is ' + response);
        vm.stock = response.data[0];
        vm.isSubmitted = true;
        vm.searchHistory.push(response.data[0].Symbol);
        if (vm.searchHistory.length > 3) {
         vm.searchHistory.shift();   
        }
    });
 
    };
}
