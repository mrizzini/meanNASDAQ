angular.module('meanNASDAQ').filter('searchFilter', searchFilter);

function searchFilter($filter, input) {
    return function(string) {
        if (input.val().length > 0) {
            
        }
    };
}