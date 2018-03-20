/*global $ APIKEY stockAPIKEY */
angular.module('meanNASDAQ').controller('SearchController', SearchController);

function SearchController(stockDataFactory, $route, $window, AuthFactory, jwtHelper) {
    var vm = this;
    vm.isLoggedIn = function() {
        if (AuthFactory.isLoggedIn) {
            var token = $window.sessionStorage.token; // capturing token from session storage
            var decodedToken = jwtHelper.decodeToken(token); //decodes token 
            vm.loggedInUser = decodedToken.username; // add logged in user property so we can
            return true;
        } else {
            return false;
        }
    };
    
    vm.search = function() {
        console.log("vm search is, ", vm);
        var symbol =  vm.symbol.toUpperCase();
        var userSearch = {
        symbol: vm.symbol.toUpperCase()
    };
    var user = vm.username;
    console.log('search button clicked and symbol is ', symbol + ' user is ', user);

    stockDataFactory.searchStock(symbol).then(function(response) {
        if (!response) {
            vm.error = true;
            vm.correctSearch = false;
            vm.stock = symbol + " is not a correct NASDAQ symbol";
        } else {
            vm.correctSearch = true;
            vm.error = false;
            vm.stock = response.data[0];
            console.log('vm.stock is', vm.stock);
        }
    });
    
    if (vm.isLoggedIn()) {
        var token = $window.sessionStorage.token; // capturing token from session storage
        var decodedToken = jwtHelper.decodeToken(token); //decodes token 
        vm.loggedInUser = decodedToken.username; // add logged in user property so we can
        console.log('vm.loggedInUser is ', vm.loggedInUser);
        console.log(vm.loggedInUser + ' searched for ' + symbol);
        stockDataFactory.addUserSearch(vm.loggedInUser, userSearch).then(function(response) {
        }).catch(function(error) {
            console.log('addUserSearch error', error);
        });
    }
    
    console.log('VM.LOGGED IN', vm.loggedInUser);
                    
    if (vm.isLoggedIn()) {
        var token = $window.sessionStorage.token; // capturing token from session storage
        var decodedToken = jwtHelper.decodeToken(token); //decodes token 
        vm.loggedInUser = decodedToken.username; // add logged in user property so we can
        console.log('VM LOGGED IN 2 is ', vm.loggedInUser);
        stockDataFactory.userDisplay(vm.loggedInUser).then(function(response) {
            console.log("userDisplay response.data.userSearch is", response.data.userSearch);
            vm.users = response.data;
            var token = jwtHelper.decodeToken($window.sessionStorage.token);
            vm.username = token.username;
            console.log(vm.username);
            console.log(token);
            vm.userSearch = response.data;
            vm.userSearch = response.data.userSearch.slice((response.data.userSearch.length - 5), response.data.userSearch.length);
            console.log(vm.userSearch);
        }).catch(function(error) {
            console.log('userDisplay error', error);
        });
    }
    vm.isSubmitted = true;
    }; // Ends vm.search()

    $(document).ready(function() {
        $.ajax({
    		    method: "GET",
    		    url: "https://newsapi.org/v2/top-headlines",
    		    data: { category: "business", country: "us", language: "en", apiKey: APIKEY },
    		    success: function(data) {
    			     if (data.status == "ok") {
    					console.log(data);
    				    for (var i = 0; i < data.articles.length; i++) {
    				    var headline = data.articles[i].title;      
    					var articles = document.createElement("LI");
    	                var anchor = document.createElement("A");
    	                anchor.setAttribute('href', data.articles[i].url);
    	                anchor.setAttribute('target', "_blank");
    	                anchor.innerHTML = headline;
    	                articles.setAttribute("id", "articles" + i);
    	                var description = document.createElement("P");
    					var descriptionText = data.articles[i].description || "Click the article for more information";
    				    description.innerHTML = "-" + descriptionText;
    				    document.getElementById("articlePaginate").appendChild(articles);
    				    document.getElementById("articles" + i).appendChild(anchor);
    				    document.getElementById("articlePaginate").appendChild(description);
    				    }
    				    $('#articlePaginate').easyPaginate({
                        paginateElement: 'li',
                        elementsPerPage: 5,
                        effect: 'fade'
                        });
    			        }
    		        }
    	    });
    });

    $(document).ready(function() {
                $.ajax({
            		    url: "https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_INTRADAY&symbol=BTC&market=USD&apikey=" + stockAPIKEY,
            		    dataType: 'json',
            		    success: function(data) {
            		        console.log('CRYPTO data is, ', data);
            		        var currentDate = data["Meta Data"]["7. Last Refreshed"];
            		      //  var apiData = data["Time Series (Digital Currency Intraday)"][currentDate];
            		      //  var price = "1a. price (USD)";
            		      //  var btcCurrentPrice = [apiData][price];
            		      //  console.log('btcCurrentPrice is ', btcCurrentPrice);
            		        var BTC = data["Time Series (Digital Currency Intraday)"][currentDate]["1a. price (USD)"];
            		      //  console.log(BTC);
            		      //  console.log(data["Time Series (Digital Currency Intraday)"][currentDate]["1a. price (USD)"]);
                            var currentBTC = document.createElement("SPAN");
                			currentBTC.innerHTML = "$" + BTC;   //.slice(0, -2); 
                			document.getElementById("currentBTCPrice").appendChild(currentBTC);
            	           }
            	    });
    });
} // Ends SearchController 
