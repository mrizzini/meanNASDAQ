/*global $ stockAPIKEY */
angular.module('meanNASDAQ').controller('ProfileController', ProfileController);

function ProfileController($route, $routeParams, $window, $location, stockDataFactory, AuthFactory, jwtHelper) {
    var vm = this;
    var token = $window.sessionStorage.token; // capturing token from session storage
    var decodedToken = jwtHelper.decodeToken(token); //decodes token 
    var currentPrice;
    var buttonIndex;
    vm.loggedInUser = decodedToken.username; // add logged in user property so we can
    stockDataFactory.userDisplay(vm.loggedInUser).then(function(response) {
    console.log("userDisplay response is", response); 
    vm.favorites = response.data.userFavorites;
    vm.funds = response.data.funds;
    vm.stocksOwned = response.data.stocksOwned;
    });
    
    // var getCurrentPrice = function (symbol) {
    //     $(document).ready(function() {
    //       var apiSymbol = symbol;
    //       console.log('apiSymbol is ', apiSymbol);
    //       $.ajax({
    //     		    url: "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + apiSymbol + "&interval=1min&outputsize=compact&apikey=" + stockAPIKEY,
    //     		    dataType: 'json',
    //     		  //  data: { function: 'TIME_SERIES_INTRADAY', symbol: vm.symbol, interval: "1min", datatype: 'json', apikey: stockAPIKEY },
    //     		    success: function(data) {
    //     		        console.log('second data is, ', data);
    //     		        var currentDate = data["Meta Data"]["3. Last Refreshed"];
    //     		        var apiData = data["Time Series (1min)"];
    //     		        console.log('current date is, ', currentDate);
    //     		        currentPrice = apiData[currentDate]["4. close"];
    //     		        currentPrice = currentPrice.slice(0, -2);
    //     		        currentPrice = parseFloat(currentPrice);
    //                 console.log('current price should be 1078.92 ', currentPrice);
    //             //     var current = document.createElement("SPAN");
    //     				    // current.innerHTML = "$" + currentPrice.slice(0, -2); 
    //     				    // document.getElementById("currentPrice").appendChild(current);
    //     	           }
    //     	    });
    //     });
    //     return currentPrice;
    // };
    
    vm.getCurrentPrice = function(symbol, index) {
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
        		        console.log('selling stock getting current price data is, ', data);
        		        var currentDate = data["Meta Data"]["3. Last Refreshed"];
        		        var apiData = data["Time Series (1min)"];
        		        console.log('current date is, ', currentDate);
        		        currentPrice = apiData[currentDate]["4. close"];
        		        currentPrice = currentPrice.slice(0, -2);
        		        currentPrice = parseFloat(currentPrice);
                    console.log('current price should is ', currentPrice);
                    var current = document.createElement("SPAN");
                    current.setAttribute("id", "symbolIs" + apiSymbol);
        				    current.innerHTML = currentPrice; 
        				    document.getElementById("currentPrice").appendChild(current);
        	           }
        	    });
        });
        return buttonIndex;
    };
    
    vm.sellStock = function(stockId, symbol, amount) {
      console.log('buttonIndex is ', buttonIndex);
      // getCurrentPrice(symbol);
      var sellStockCurrentPrice = parseFloat(document.getElementById('symbolIs' + symbol).innerHTML);
      // // var tagName = document.getElementsByTagName('td');
      // var stockIdNumber = $(this).attr('id');
      // console.log('td is is', index);
      // sellStockCurrentPrice = parseFloat(sellStockCurrentPrice, 10);
      console.log('vm.sellStock hit');
      console.log('selling ', amount + ' shares of ' +  symbol + ' stockId of ', stockId);
      console.log('CURRENT PRICE IS ', sellStockCurrentPrice);

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
        //     stockDataFactory.userDisplay(vm.loggedInUser).then(function(response) {
        //         console.log("userDisplay in buyStock response is", response);
        //         vm.funds = response.data.funds;
        //         vm.favorites = response.data.userFavorites;
        //         vm.funds = response.data.funds;
        //         vm.stocksOwned = response.data.stocksOwned;
           
        //     if (stockInfo.totalCost <= vm.funds) {
            
                stockDataFactory.userSellStock(vm.loggedInUser, stockInfo).then(function(response) {
                    console.log(response);
                    vm.message = 'Share(s) sold';
                }).catch(function(error) {
                    console.log(error);
                }); // ends stockDataFactory.userBuyStock
                
                stockDataFactory.userSellUpdateFunds(vm.loggedInUser, stockInfo).then(function(response) {
                    console.log(response);
                    $route.reload(); 
                }).catch(function(error) {
                    console.log(error);
                }); // ends stockDataFactory.userUpdateFunds
            
                
        //     } else { // ends if (stockInfo.totalCost <= vm.funds)
        //         alert('You do not have sufficent funds in your account to purchase');
        //     } 
            
        //     }); // ends stockDataFactory.userDisplay
        // }  else { // ends if (Number.isInteger(stockInfo.amount))
        //         alert('You have not entered a whole number. Please try again');
            
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
    
}



