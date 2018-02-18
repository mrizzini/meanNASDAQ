var express = require('express');
var router = express.Router();

 var ctrlStocks = require('../controllers/stocks.controllers.js'); // requires controllers file so it has access to functions in that file. 
// var ctrlReviews = require('../controllers/reviews.controllers.js'); // requires controllers file so it has access to functions in that file
// var ctrlUsers = require('../controllers/users.controllers.js'); // requires controllers file so it has access to functions in that file

// // Hotel routes 
router
    .route('/stocks')
    .get(ctrlStocks.stocksGetAll); // this maps the controller to the route


// router
//     .route('/hotels/:hotelId') // hotelId is a parameter which will match any thing from /api/hotels/....  the controller can also access this
//     .get(ctrlHotels.hotelsGetOne)
//     .put(ctrlHotels.hotelsUpdateOne) // updates specific hotel. put updates entire document
//     .delete(ctrlHotels.hotelsDeleteOne); // deletes hotel


// // router
// //     .route('/hotels/new') 
// //     .post(ctrlHotels.hotelsAddOne);
    
// // Review routes
// router
//     .route('/hotels/:hotelId/reviews')
//     .get(ctrlReviews.reviewsGetAll) // this maps the controller to the route
//     // .post(ctrlReviews.reviewsAddOne); // post route to add review, a sub-document
//     .post(ctrlUsers.authenticate, ctrlReviews.reviewsAddOne); // post route to add review, a sub-document
//     // ctrlUsers checks for valid token. middleware. if so, it will post review.


// router
//     .route('/hotels/:hotelId/reviews/:reviewId') // hotelId is a parameter which will match any thing from /api/hotels/....  the controller can also access this
//     .get(ctrlReviews.reviewsGetOne)
//     .put(ctrlReviews.reviewsUpdateOne) // route to update a specific hotel review
//     .delete(ctrlReviews.reviewsDeleteOne); // deletes specific hotel review
    
// // Authentication route. also need to bring in controller above
// router
//     .route('/users/register')
//     .post(ctrlUsers.register);
    
//     router
//     .route('/users/login')
//      .post(ctrlUsers.login);
//     //    .post(ctrlUsers.login);



 module.exports = router; //exports router to other files

// // http methods:
// // GET - getting certain information
// // POST - create something new
// // PUT - update something that already exists
// // DELETE - deleting something

// // APIs should always return a response, return the correct HTTP status code, and return contents/msg