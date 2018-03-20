/*global $ stockAPIKEY */
angular.module('meanNASDAQ').controller('ProfileController', ProfileController);

function ProfileController($route, $routeParams, $window, $location, stockDataFactory, AuthFactory, jwtHelper) {
    var vm = this;
    var token = $window.sessionStorage.token; // capturing token from session storage
    var decodedToken = jwtHelper.decodeToken(token); //decodes token 
    var currentPrice;
    var buttonIndex;
    var current;
    vm.clicked = false;
    vm.loggedInUser = decodedToken.username; // add logged in user property so we can
    stockDataFactory.userDisplay(vm.loggedInUser).then(function(response) {
    console.log("userDisplay response is", response); 
    vm.favorites = response.data.userFavorites;
    vm.funds = response.data.funds;
    vm.stocksOwned = response.data.stocksOwned;
    });
    
    vm.getCurrentPrice = function(symbol, index) {
      vm.clicked = true;
      console.log('other button clicked');
          $(document).ready(function() {
          var apiSymbol = symbol;
          buttonIndex = parseFloat(index.currentTarget.id);
          console.log('apiSymbol is ', apiSymbol);
          console.log('index is ', buttonIndex);
          $.ajax({
        		    url: "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + apiSymbol + "&interval=1min&outputsize=compact&apikey=" + stockAPIKEY,
        		    dataType: 'json',
        		  //  data: { function: 'TIME_SERIES_INTRADAY', symbol: vm.symbol, interval: "1min", datatype: 'json', apikey: stockAPIKEY },
        		    success: function(data) {
        		        if (data["Error Message"]) {
        		          console.log("API ERROR");
        		          console.log(data["Error Message"]);
        		          current = document.createElement("SPAN");
                      current.setAttribute("id", "symbolIs" + apiSymbol);
        				      current.innerHTML = "Error. Please refresh and try again"; 
        				      document.getElementById("currentPrice" + buttonIndex).appendChild(current);
        		        } else {
        		        console.log('selling stock getting current price data is, ', data);
        		        var currentDate = data["Meta Data"]["3. Last Refreshed"];
        		        var apiData = data["Time Series (1min)"];
        		        console.log('current date is, ', currentDate);
        		        currentPrice = apiData[currentDate]["4. close"];
        		        currentPrice = currentPrice.slice(0, -2);
        		        currentPrice = parseFloat(currentPrice);
                    console.log('current price should is ', currentPrice);
                    current = document.createElement("SPAN");
                    current.setAttribute("id", "symbolIs" + apiSymbol);
        				    current.innerHTML = currentPrice; 
        				    document.getElementById("currentPrice" + buttonIndex).appendChild(current);
        	           }
        		    }
        	    });
        });
        return buttonIndex;
    };
    
    vm.sellStock = function(stockId, symbol, amount) {
      console.log('vm.clicked is ', vm.clicked);
      // console.log(vm.stocksOwned[buttonIndex].amount);
      if (!vm.clicked) { 
        alert('Please get current price first before selling back stock');
      } else {
      if (amount < 1 || amount > vm.stocksOwned[buttonIndex].amount) {
        alert('Please enter a positive number that is less than the amount you own');
      } else {
      console.log('buttonIndex is ', buttonIndex);
      var sellStockCurrentPrice = parseFloat(document.getElementById('symbolIs' + symbol).innerHTML);
      console.log('vm.sellStock hit');
      console.log('selling ', amount + ' shares of ' +  symbol + ' stockId of ', stockId);
      console.log('CURRENT PRICE IS ', sellStockCurrentPrice);

      var token = $window.sessionStorage.token; // capturing token from session storage
      var decodedToken = jwtHelper.decodeToken(token); //decodes token 
      vm.loggedInUser = decodedToken.username; // add logged in user property so we can
        
          if (currentPrice) {
            var stockInfo = {
            symbol: symbol,
            price: sellStockCurrentPrice,
            amount: parseFloat(amount),
            totalCost: (sellStockCurrentPrice * amount),
            index: buttonIndex
          };
            console.log('stockInfo for sellStock is, ', stockInfo);
          }
          
        if (Number.isInteger(stockInfo.amount) && stockInfo.totalCost) {
            console.log('amount is a number');
            console.log('totalCost is ', stockInfo.totalCost);
              
                stockDataFactory.userSellStock(vm.loggedInUser, stockInfo).then(function(response) {
                    console.log(response);
                    vm.message = 'Share(s) sold';
                }).catch(function(error) {
                    console.log(error);
                }); // ends stockDataFactory.userSellStock
                
                stockDataFactory.userSellUpdateFunds(vm.loggedInUser, stockInfo).then(function(response) {
                    console.log(response);
                    vm.clicked = false;
                    $route.reload(); 
                }).catch(function(error) {
                    console.log(error);
                }); // ends stockDataFactory.userSellUpdateFunds
        } else {
          alert("Please enter a whole number");
        }
        }
      }
    };
    
    
    vm.deleteProfile = function() {
      console.log('delete button clicked');
      var deleteConfirmation = confirm(vm.loggedInUser + ", are you sure you want to delete your profile?");
        if(deleteConfirmation == true) {
            stockDataFactory.deleteProfile(vm.loggedInUser).then(function(response) {
            console.log(vm.loggedInUser + " is deleting profile"); 
            AuthFactory.isLoggedIn = false;
            delete $window.sessionStorage.token;
            $location.path('/');
        });
        } else {
          console.log('user decided to keep profile');
      }
    };
    
} //ends Profile Controller



