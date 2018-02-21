angular.module('meanNASDAQ', ['ngRoute', 'angular-jwt', 'angularUtils.directives.dirPagination']).config(config).run(run);
// .controller('NASDAQController', NASDAQController);

function config($httpProvider, $routeProvider) { // need Provider b/c we created interceptor
    $httpProvider.interceptors.push('AuthInterceptor');   // need to add custom interceptor
    
    $routeProvider
    .when('/', {
        templateUrl: 'angular-app/main/main.html',
        controller: NASDAQController,
        controllerAs: 'vm',
        access: {
            restricted: false
        }
    })
    .when('/stocks', {
        templateUrl: 'angular-app/stock-list/stocks.html',
        controller: StocksController,
        controllerAs: 'vm',
        access: {
            restricted: false
        }
    })
    .when('/stock/:id', {
       templateUrl: 'angular-app/stock-display/stock.html',
       controller: StockController,
       controllerAs: 'vm',
        access: {
            restricted: false
        }
    })
    .when('/register', {
        templateUrl: 'angular-app/register/register.html',
        controller: RegisterController,
        controllerAs: 'vm',
        access: {
            restricted: false
        }
    })
    .when('/profile', {
        templateUrl: 'angular-app/profile/profile.html',
        controller: ProfileController,
        controllerAs: 'vm',
        access: {
            restricted: true
        }
    })
    .otherwise({
        redirectTo: '/'
    });
}

function run($rootScope, $location, $window, AuthFactory) {
    $rootScope.$on('routeChangeStart', function(event, nextRoute, currentRoute) {
        if (nextRoute.access !== undefined && nextRoute.access.restricted && !$window.sessionStorage.token && !AuthFactory.isLoggedIn) {
        // if user is not logged in and there is no token in the session 
            event.preventDefault(); // we dont navigate to the path
            $location.path('/'); // and send to route
        }
    });
}



// angular.module('meanNASDAQ', ['ngRoute', 'angular-jwt']).config(config).run(run); // need run when you have the interceptor. gets executed after injector is created
// // .controller('HotelsController', HotelsController);

// function config($httpProvider, $routeProvider) { // need Provider b/c we created interceptor
//     $httpProvider.interceptors.push('AuthInterceptor');   // need to add custom interceptor
    
//     $routeProvider
//     // .when('/', {
//     //     templateUrl: 'angular/hotel-list/hotels.html',
//     //     controller: HotelsController,
//     //     controllerAs: 'vm'
//     // })
//     .when('/', {
//         templateUrl: 'angular/main/main.html',
//         access: { // when someone is at this page, it is not a restricted path
//             restricted: false
//         }
//     })
//     .when('/hotels', {
//         templateUrl: 'angular/hotel-list/hotels.html',
//         controller: HotelsController,
//         controllerAs: 'vm'
//     })
//     .when('/hotel/:id', {
//         templateUrl: 'angular/hotel-display/hotel.html',
//         controller: HotelController,
//         controllerAs: 'vm',
//         access: { // when someone is at this page, it is not a restricted path
//             restricted: false
//         }
//     })
//     .when('/register', { // sets up routes for register page
//         templateUrl: 'angular/register/register.html',
//         controller: RegisterController,
//         controllerAs: 'vm',
//         access: { // when someone is at this page, it is not a restricted path
//             restricted: false
//         }
//     })
//     .when('/profile', {
//         templateUrl: 'angular/profile/profile.html',
//         controllerAs: 'vm',
//         access: { // when someone is at this page, it is a restricted path
//             restricted: true
//         }
//     })
//     .otherwise({ // if none of these match, we redirect to route of the app
//         redirectTo: '/'
//     });
// }

// function run($rootScope, $location, $window, AuthFactory) {
//     $rootScope.$on('routeChangeStart', function(event, nextRoute, currentRoute) {
//         if (nextRoute.access !== undefined && nextRoute.access.restricted && !$window.sessionStorage.token && !AuthFactory.isLoggedIn) {
//         // if user is not logged in and there is no token in the session 
//             event.preventDefault(); // we dont navigate to the path
//             $location.path('/'); // and send to route
//         }
//     });
// }