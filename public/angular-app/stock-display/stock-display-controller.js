angular.module('meanNASDAQ').controller('StockController', StockController);

function StockController($route, $routeParams, stockDataFactory) {
    var vm = this;
    var id = $routeParams.id; // stores id
    // $http.get('/api/stocks').then(function(response) {
    stockDataFactory.stockDisplay(id).then(function(response) {
    console.log(response); 
    vm.stock = response.data;
    });

    vm.addReview = function() {
        var postData = {
            name: vm.name,
            review: vm.review
        };
        if (vm.reviewForm.$valid) {
            stockDataFactory.postReview(id, postData).then(function(response) {
                if (response.status === 201) { // not 200 like in udemy video
                    $route.reload();    //reloads route so review automatically is posted
                }
            }).catch(function(error) {
                console.log(error);
            });
        } else {
            vm.isSubmitted = true;
        }
    };


}