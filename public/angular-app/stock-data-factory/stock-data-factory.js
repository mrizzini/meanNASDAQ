angular.module('meanNASDAQ').factory('stockDataFactory', stockDataFactory);

function stockDataFactory($http) {
    return {
        stocksDisplay: stocksDisplay,
        stockDisplay: stockDisplay,
        postReview: postReview,
        searchStock: searchStock,
        userDisplay: userDisplay,
        addUserSearch: addUserSearch,
        addUserFavorite: addUserFavorite,
        deleteProfile: deleteProfile,
        login: login,
        register: register,
        userBuyStock: userBuyStock
    };
    
    function stocksDisplay() {
        return $http.get('/api/stocks').then(complete).catch(failed);
    }
    
    function stockDisplay(id) {
        return $http.get('/api/stocks/' + id).then(complete).catch(failed);
    }
    
    function postReview(id, review) {
        return $http.post('/api/stocks/' + id + '/reviews', review).then(complete).catch(failed);
    }
    
    function searchStock(Symbol) {
        return $http.get('/api/stocks/search/' + Symbol).then(complete).catch(failed);
        // return $http.post('/api/users/user/' + user + '/searches/' + Symbol).then(complete).catch(failed);
    }
    
    function userDisplay(user) {
        return $http.get('/api/users/' + user).then(complete).catch(failed);
    }
    
    function addUserSearch(user, Symbol) {
        return $http.post('/api/users/' + user + '/searches', Symbol).then(complete).catch(failed);
    }

    function addUserFavorite(user, stock) {
        return $http.post('/api/users/' + user + '/favorites', stock).then(complete).catch(failed);
    }
        
    function userBuyStock(user, stockInfo) {
        return $http.post('/api/users/' + user + '/transaction', stockInfo).then(complete).catch(failed);
    }
    
    function deleteProfile(user) {
        return $http.delete('/api/users/' + user).then(complete).catch(failed);
    }
    
    function login(user) {
        return $http.post('/api/users/login', user).then(complete).catch(failed);
    }
    
    function register(user) {
        return $http.post('/api/users/register', user).then(complete).catch(failed);
    }
    
    function complete(response) {
        return response;
    }
    
    function failed(error) {
        console.log(error.statusText);
    }
    
}