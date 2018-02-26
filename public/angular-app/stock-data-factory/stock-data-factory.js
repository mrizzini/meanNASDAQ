angular.module('meanNASDAQ').factory('stockDataFactory', stockDataFactory);

function stockDataFactory($http) {
    return {
        // stockList: stockList,
        stocksDisplay: stocksDisplay,
        stockDisplay: stockDisplay,
        userDisplay: userDisplay,
        // getResultsPage: getResultsPage
        postReview: postReview,
        // stockPagination: stockPagination,
        searchStock: searchStock,
        // postFavorite: postFavorite,
        // searchDisplay: searchDisplay,
        // showSearches: showSearches,
        addUserSearch: addUserSearch,
        login: login,
        register: register
    };
    
    // function stockList() {
    //     return $http.get('/api/stocks').then(complete).catch(failed);
    // }
    
    // function getResultsPage(pageNumber) {
    //      return $http.get('/api/stocks?page=' + pageNumber)
    //         .then(complete).catch(failed);
            
    // }
    
    function stocksDisplay() {
        return $http.get('/api/stocks').then(complete).catch(failed);
    }
    
    function stockDisplay(id) {
        return $http.get('/api/stocks/' + id).then(complete).catch(failed);
    }
    
    // function stockPagination(pageNumber) {
    //     return $http.get('/api/stocks?page=' + pageNumber).then(complete).catch(failed);
    // }
    
    function postReview(id, review) {
        return $http.post('/api/stocks/' + id + '/reviews', review).then(complete).catch(failed);
    }
    

    function searchStock(Symbol) {
        return $http.get('/api/stocks/search/' + Symbol).then(complete).catch(failed);
        // return $http.post('/api/users/user/' + user + '/searches/' + Symbol).then(complete).catch(failed);
    }
    
    // function searchDisplay(Symbol) {
    //     return $http.get('/api/stocks/searches/' + Symbol).then(complete).catch(failed);
    // }
    
    // function showSearches() {
    //     return $http.get('/api/stocks/searches/allSearches').then(complete).catch(failed);
    // }
    
    function userDisplay() {
        return $http.get('/api/users').then(complete).catch(failed);
    }
    
    function login(user) {
        return $http.post('/api/users/login', user).then(complete).catch(failed);
    }
    
    function register(user) {
        return $http.post('/api/users/register', user).then(complete).catch(failed);
    }
    
    function addUserSearch(user, Symbol) {
        // return $http.post('/api/users/' + user, Symbol).then(complete).catch(failed);
        // return $http.post('/api/users/user/' + user + '/searches', Symbol).then(complete).catch(failed);
        // return $http.post('/api/users/' + user, Symbol).then(complete).catch(failed);
        return $http.post('/api/users/' + user + '/searches', Symbol).then(complete).catch(failed);
        // return $http.post('/api/users/' + user + '/searches', Symbol).then(complete).catch(failed);
    }
    
    // function postFavorite(id, stock) {
    //     return $http.post('/api/users/').then(complete).catch(failed);
    // }
    
    function complete(response) {
        return response;
    }
    
    function failed(error) {
        console.log(error.statusText);
    }
    
}