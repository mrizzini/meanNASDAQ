angular.module('meanNASDAQ').controller('StocksController', StocksController);

function StocksController(stockDataFactory, $http) {
    var vm = this;
    // $http.get('/api/stocks').then(function(response) {
    stockDataFactory.stocksDisplay().then(function(response) {
    console.log(response); 
    vm.stocks = response.data;
    });

}



  
    
