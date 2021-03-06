/*global $ stockAPIKEY */
angular.module('meanNASDAQ').controller('StockController', StockController);

function StockController($route, $routeParams, $window, stockDataFactory, AuthFactory, jwtHelper) {
    var vm = this;
    var id = $routeParams.id; // stores id
    vm.isSubmitted = false;
    var currentPrice;
    // $http.get('/api/stocks').then(function(response) {
    stockDataFactory.stockDisplay(id).then(function(response) {
    console.log(response); 
    vm.stock = response.data;
    vm.symbol = {
        symbol : vm.stock.Symbol
    };
    
        $(document).ready(function() {
            var apiSymbol = vm.stock.Symbol;
            console.log('apiSymbol is ', apiSymbol);
            $.ajax({
        		    url: "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + apiSymbol + "&outputsize=compact&apikey=" + stockAPIKEY,
        		    dataType: 'json',
        		  //  data: { function: 'TIME_SERIES_INTRADAY', symbol: vm.symbol, interval: "1min", datatype: 'json', apikey: stockAPIKEY },
        		    success: function(data) {
        				 	
        				 	var currentDate = data["Meta Data"]["3. Last Refreshed"].slice(0, 10); 
        					console.log('Intraday 1 min currentDate is, ', currentDate.slice(0, 10));
        					var apiData = data["Time Series (Daily)"];
        					var todayData = apiData[currentDate];
        					var todayOpen = todayData["1. open"];
        					var todayClose = todayData["4. close"];
        				 	var todayHigh = todayData["2. high"];
        				 	var todayLow=  todayData["3. low"];
        				 
        					var todayDate = document.createElement("SPAN");
        					todayDate.innerHTML = currentDate;
        	        		document.getElementById("currentDate").appendChild(todayDate);
        					
        					var open = document.createElement("SPAN");
        					open.innerHTML = "$" + todayOpen.slice(0, -2); 
        					document.getElementById("todayOpen").appendChild(open);

         					var close = document.createElement("SPAN");
        					close.innerHTML = "$"+ todayClose.slice(0, -2); 
        	        		document.getElementById("todayClose").appendChild(close);       
        	        		
         					var high = document.createElement("SPAN");
        					high.innerHTML = "$" + todayHigh.slice(0, -2); 
        	        		document.getElementById("todayHigh").appendChild(high);
        	        		
         					var low = document.createElement("SPAN");
        					low.innerHTML = "$" + todayLow.slice(0, -2); 
        	        		document.getElementById("todayLow").appendChild(low); 
        		       }
        	    });
        });
    
            $(document).ready(function() {
            var apiSymbol = vm.stock.Symbol;
            console.log('apiSymbol is ', apiSymbol);
            $.ajax({
        		    url: "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + apiSymbol + "&interval=1min&outputsize=compact&apikey=" + stockAPIKEY,
        		    dataType: 'json',
        		  //  data: { function: 'TIME_SERIES_INTRADAY', symbol: vm.symbol, interval: "1min", datatype: 'json', apikey: stockAPIKEY },
        		    success: function(data) {
        		        console.log('second data is, ', data);
        		        var currentDate = data["Meta Data"]["3. Last Refreshed"];
        		        var apiData = data["Time Series (1min)"];
        		        console.log('current date is, ', currentDate);
        		        currentPrice = apiData[currentDate]["4. close"];
                        console.log('current price should be 1078.92 ', currentPrice);
                        var current = document.createElement("SPAN");
        				current.innerHTML = "$" + currentPrice.slice(0, -2); 
        				document.getElementById("currentPrice").appendChild(current);
        	           }
        	    });
        });
    
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
    
    
    vm.buyStock = function() {
        var token = $window.sessionStorage.token; // capturing token from session storage
        var decodedToken = jwtHelper.decodeToken(token); //decodes token 
        vm.loggedInUser = decodedToken.username; // add logged in user property so we can
        console.log("buy stock logged in user is", vm.loggedInUser);
        var stockInfo = {
            symbol: vm.symbol.symbol,
            price: currentPrice.slice(0, -2),
            amount: parseFloat(vm.amount),
            totalCost: ((currentPrice.slice(0, -2)) * vm.amount)
        };
        console.log('stockInfo for buyStock is, ', stockInfo);
        
        if (Number.isInteger(stockInfo.amount) && stockInfo.amount > 0) {
            stockDataFactory.userDisplay(vm.loggedInUser).then(function(response) {
                console.log("userDisplay in buyStock response is", response);
                vm.funds = response.data.funds;
                vm.favorites = response.data.userFavorites;
                vm.funds = response.data.funds;
                vm.stocksOwned = response.data.stocksOwned;
           
            if (stockInfo.totalCost <= vm.funds) {
            
                stockDataFactory.userBuyStock(vm.loggedInUser, stockInfo).then(function(response) {
                    console.log(response);
                    vm.message = 'Share(s) purchased';
                }).catch(function(error) {
                    console.log(error);
                }); // ends stockDataFactory.userBuyStock
                
                stockDataFactory.userUpdateFunds(vm.loggedInUser, stockInfo).then(function(response) {
                    console.log(response);
                }).catch(function(error) {
                    console.log(error);
                }); // ends stockDataFactory.userUpdateFunds
            
                
            } else { // ends if (stockInfo.totalCost <= vm.funds)
                alert('You do not have sufficent funds in your account to purchase');
            } 
            
            }); // ends stockDataFactory.userDisplay
        }  else { // ends if (Number.isInteger(stockInfo.amount))
                alert('You have not entered a positive whole number. Please try again');
            
        }
    };

} // ends Stock Controller
