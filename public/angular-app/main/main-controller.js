angular.module('meanNASDAQ').controller('NASDAQController', NASDAQController);

function NASDAQController(stockDataFactory) {
    var vm = this;
    // $http.get('/api/stocks').then(function(response) {
    stockDataFactory.stockList().then(function(response) {
    console.log(response); 
    vm.stocks = response.data;
    });
}


