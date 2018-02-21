angular.module('meanNASDAQ').controller('StocksController', StocksController);

function StocksController(stockDataFactory, $http) {
    var vm = this;
    // $http.get('/api/stocks').then(function(response) {
    stockDataFactory.stocksDisplay().then(function(response) {
    console.log(response); 
    // vm.stocks = response.data;
    
        vm.stocks = [];
    vm.totalStocks = 0;
    vm.stocksPerPage = 10; // this should match however many results your API puts on one page
    getResultsPage(1);

    vm.pagination = {
        current: 1
    };

    vm.pageChanged = function(newPageNumber) {
        getResultsPage(newPageNumber);
        console.log(newPageNumber + ' is newPAGE');
    };

    function getResultsPage(pageNumber) {
        // this is just an example, in reality this stuff should be in a service
            stockDataFactory.stockPagination(pageNumber).then(function(response) {
          
                // $http.get('/api/stocks?page=' + pageNumber).then(function(response) {
                vm.stocks = response.data;
                vm.totalStocks = response.data.length;
            });
    }
    
    
});


}



   
