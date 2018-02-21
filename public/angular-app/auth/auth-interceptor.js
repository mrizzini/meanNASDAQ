angular.module('meanNASDAQ').factory('AuthInterceptor', AuthInterceptor);
// creating an inteceptor. this will help us intercept the http request we make
// if there is an endpoint that requires us to send a token, we will automatically attach
// the token using the interceptor, to that request


// they need to handle req and res and res error
// need to return an object in factories
function AuthInterceptor($location, $q, $window, AuthFactory) {
    return {
        request: request,
        response: response,
        responseError: responseError
    };
    
    function request(config) {
        config.headers = config.headers || {}; // sets config.headers or uses empty object if none there
        if ($window.sessionStorage.token) { // if token is stored on client side in browser's session storage
            config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token; 
            // attaches new authorization header and sends the format we expect.
        }
        return config;
    }
    
    function response(response) {
        // want property to determine if user is logged in or not. need to create auth-factory.js. authentication factory
        if (response.status === 200 && $window.sessionStorage.token && !AuthFactory.isLoggedIn) {
            AuthFactory.isLoggedIn = true;
        }
        if (response.status === 401) {
            AuthFactory.isLoggedIn = false;
        }
        return response || $q.when(response);
    }
    
    function responseError(rejection) {
        if (rejection.status === 401 || rejection.stauts === 403) {
            // delete session storage token. set login to false. and set to route
            delete $window.sessionStorage.token;
            AuthFactory.isLoggedIn = false;
            $location.path('/');
        }
        return $q.reject(rejection); // reject our promise
    }
    
}