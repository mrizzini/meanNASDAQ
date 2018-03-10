/*global $ stockAPIKEY */
angular.module('meanNASDAQ').controller('ProfileController', ProfileController);

function ProfileController($route, $routeParams, $window, $location, stockDataFactory, AuthFactory, jwtHelper) {
    var vm = this;
    var token = $window.sessionStorage.token; // capturing token from session storage
    var decodedToken = jwtHelper.decodeToken(token); //decodes token 
    var currentPrice;
    vm.loggedInUser = decodedToken.username; // add logged in user property so we can
    stockDataFactory.userDisplay(vm.loggedInUser).then(function(response) {
    console.log("userDisplay response is", response); 
    vm.favorites = response.data.userFavorites;
    vm.funds = response.data.funds;
    vm.stocksOwned = response.data.stocksOwned;
    });
    
    var getCurrentPrice = function (symbol) {
        $(document).ready(function() {
          var apiSymbol = symbol;
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
                //     var current = document.createElement("SPAN");
        				    // current.innerHTML = "$" + currentPrice.slice(0, -2); 
        				    // document.getElementById("currentPrice").appendChild(current);
        	           }
        	    });
        });
        return currentPrice;
    };
    
    
    vm.sellStock = function(stockId, symbol, amount) {
      getCurrentPrice(symbol);
      console.log('vm.sellStock hit');
      console.log('selling ', amount + ' shares of ', +  symbol + ' stockId of ', stockId);
      console.log('CURRENT PRICE IS ', currentPrice);

      var token = $window.sessionStorage.token; // capturing token from session storage
      var decodedToken = jwtHelper.decodeToken(token); //decodes token 
      vm.loggedInUser = decodedToken.username; // add logged in user property so we can
        
      // $(document).ready(function() {
      //     var apiSymbol = symbol;
      //     console.log('apiSymbol is ', apiSymbol);
      //     $.ajax({
      //   		    url: "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + apiSymbol + "&interval=1min&outputsize=compact&apikey=" + stockAPIKEY,
      //   		    dataType: 'json',
      //   		  //  data: { function: 'TIME_SERIES_INTRADAY', symbol: vm.symbol, interval: "1min", datatype: 'json', apikey: stockAPIKEY },
      //   		    success: function(data) {
      //   		        console.log('second data is, ', data);
      //   		        var currentDate = data["Meta Data"]["3. Last Refreshed"];
      //   		        var apiData = data["Time Series (1min)"];
      //   		        console.log('current date is, ', currentDate);
      //   		        currentPrice = apiData[currentDate]["4. close"];
      //               console.log('current price should be 1078.92 ', currentPrice);
      //           //     var current = document.createElement("SPAN");
      //   				    // current.innerHTML = "$" + currentPrice.slice(0, -2); 
      //   				    // document.getElementById("currentPrice").appendChild(current);
      //   	           }
      //   	    });
      //   });
        
        
        
        // console.log("sell stock logged in user is", vm.loggedInUser);
        var stockInfo = {
            symbol: symbol,
            price: currentPrice.slice(0, -2),
            amount: parseFloat(amount),
            totalCost: ((currentPrice.slice(0, -2)) * vm.amount)
        };
        console.log('stockInfo for sellStock is, ', stockInfo);
        
        // if (Number.isInteger(stockInfo.amount)) {
        //     stockDataFactory.userDisplay(vm.loggedInUser).then(function(response) {
        //         console.log("userDisplay in buyStock response is", response);
        //         vm.funds = response.data.funds;
        //         vm.favorites = response.data.userFavorites;
        //         vm.funds = response.data.funds;
        //         vm.stocksOwned = response.data.stocksOwned;
           
        //     if (stockInfo.totalCost <= vm.funds) {
            
        //         stockDataFactory.userBuyStock(vm.loggedInUser, stockInfo).then(function(response) {
        //             console.log(response);
        //             vm.message = 'Share(s) purchased';
        //         }).catch(function(error) {
        //             console.log(error);
        //         }); // ends stockDataFactory.userBuyStock
                
        //         stockDataFactory.userUpdateFunds(vm.loggedInUser, stockInfo).then(function(response) {
        //             console.log(response);
        //         }).catch(function(error) {
        //             console.log(error);
        //         }); // ends stockDataFactory.userUpdateFunds
            
                
        //     } else { // ends if (stockInfo.totalCost <= vm.funds)
        //         alert('You do not have sufficent funds in your account to purchase');
        //     } 
            
        //     }); // ends stockDataFactory.userDisplay
        // }  else { // ends if (Number.isInteger(stockInfo.amount))
        //         alert('You have not entered a whole number. Please try again');
            
        // }
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
    
}



