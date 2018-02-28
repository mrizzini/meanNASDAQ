angular.module('meanNASDAQ').controller('StockController', StockController);

function StockController($route, $routeParams, $window, stockDataFactory, AuthFactory, jwtHelper) {
    var vm = this;
    var id = $routeParams.id; // stores id
    vm.isSubmitted = false;
    // $http.get('/api/stocks').then(function(response) {
    stockDataFactory.stockDisplay(id).then(function(response) {
    console.log(response); 
    vm.stock = response.data;
    
    vm.symbol = {
        symbol : vm.stock.Symbol
    };
    
    });

    vm.isLoggedIn = function() {
        if (AuthFactory.isLoggedIn) {
            return true;
        } else {
            return false;
        }
    };


    vm.addReview = function() {
        
        var token = jwtHelper.decodeToken($window.sessionStorage.token);
        var username = token.username;
        
        var postData = {
            name: username,
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


    vm.addFavorite = function() {
        var token = $window.sessionStorage.token; // capturing token from session storage
        var decodedToken = jwtHelper.decodeToken(token); //decodes token 
        vm.loggedInUser = decodedToken.username; // add logged in user property so we can
        console.log("add favorite logged in user is", vm.loggedInUser);
        vm.stockFavorited = true;

        stockDataFactory.addUserFavorite(vm.loggedInUser, vm.symbol).then(function(response) {
            console.log(response);
        }).catch(function(error) {
            console.log(error);
        });
    };
  
    
} // ends Stock Controller


    //     var id = $routeParams.id; // stores id
    //     var stock = vm.stock.Symbol;
    //     console.log("stock is ", stock);
    //     console.log("ID is ", id);
    //     console.log('stock added to favoritres');
        
    //     stockDataFactory.postFavorite(id, stock).then(function(response) {
    //     console.log(response); 
    //     vm.users = response.data;
    //     console.log(vm.users);
    // });