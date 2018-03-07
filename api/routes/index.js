var express = require('express');
var router = express.Router();

var ctrlStocks = require('../controllers/stocks.controllers.js'); // requires controllers file so it has access to functions in that file. 
var ctrlReviews = require('../controllers/reviews.controllers.js'); // requires controllers file so it has access to functions in that file
var ctrlUsers = require('../controllers/users.controllers.js'); // requires controllers file so it has access to functions in that file

// // Stock routes 
router
    .route('/stocks') // api/stocks
    .get(ctrlStocks.stocksGetAll); // this maps the controller to the route

router
    .route('/stocks/:stockId') // stockId is a parameter which will match any thing from /api/stocks/....  the controller can also access this
    .get(ctrlStocks.stocksGetOne);

router
    .route('/stocks/search/:symbol') // api/stocks
    .get(ctrlStocks.stocksSearchOne); // this maps the controller to the route

//Review routes
router
    .route('/stocks/:stockId/reviews') // api/stocks
    .get(ctrlReviews.reviewsGetAll) // this maps the controller to the route
    .post(ctrlUsers.authenticate, ctrlReviews.reviewsAddOne);

router
    .route('/stocks/:stockId/reviews/:reviewId') // stockId is a parameter which will match any thing from /api/stocks/....  the controller can also access this
    .get(ctrlReviews.reviewsGetOne);

// Authenication routes
router
    .route('/users/register')
    .post(ctrlUsers.register);

router
    .route('/users/login')
    .post(ctrlUsers.login);
    
router
    .route('/users/:user') // api/users
    .get(ctrlUsers.usersGetOne) // this maps the controller to the route
    .delete(ctrlUsers.deleteUser);
    // .post(ctrlUsers.authenticate, ctrlStocks.stocksAddFavorite);

router
    .route('/users/:user/searches')
    .post(ctrlUsers.usersAddSearch);
    
router
    .route('/users/:user/favorites')
    .post(ctrlUsers.usersAddFavorite);
    
router
    .route('/users/:user/transaction')
    .get(ctrlUsers.usersGetOne)
    .put(ctrlUsers.updateFunds)
    .post(ctrlUsers.usersBuyStock);
    

 module.exports = router; //exports router to other files

// // http methods:
// // GET - getting certain information
// // POST - create something new
// // PUT - update something that already exists
// // DELETE - deleting something

// // APIs should always return a response, return the correct HTTP status code, and return contents/msg