angular.module('meanNASDAQ').controller('SearchDisplayController', SearchDisplayController);

function SearchDisplayController(stockDataFactory) {
    var vmTwo = this;

    vmTwo.searchDisplay = function() {
        
    console.log('search button clicked FOR DISPLAY');
    var symbol = vmTwo.symbol;

    stockDataFactory.searchDisplay().then(function(response) {
        console.log('response is ' + response);
        vmTwo.stock = response.data[0];
        vmTwo.isSubmitted = true;
        vmTwo.searchHistory.push(response.data[0].Symbol);
        if (vmTwo.searchHistory.length > 3) {
         vmTwo.searchHistory.shift();   
        }
    }
    );
    
        }
}