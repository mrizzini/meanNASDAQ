var mongoose = require('mongoose'); // brings in mongoose to the controller file
var Stock = mongoose.model('Stock'); // brings in reference to our model. use this inside controllers to interact w/ database


// GET all reviews for a stock
module.exports.reviewsGetAll = function(req, res) {
  
    var stockId = req.params.stockId;
    console.log('GET stockId', stockId);
    
    Stock
    .findById(stockId)
    .select('reviews')
    .exec(function(err, doc) {
        var response = {
            status: 200,
            message: []
        };
        if (err) {
            console.log('Error finding review');
            response.status = 500;
            response.message = err;
        } else if (!doc) {
            console.log('Stock id not found in database ' + stockId);
            response.status = 404;
            response.message = {
                "message": "Stock ID not found " + stockId
            };
        } else {
            response.message = doc.reviews ? doc.reviews : []; // this sends a message of the reviews or an empty array
        }
        res
        .status(response.status)
        .json( response.message );
    });
    
    
};


// GET single review for a stock
module.exports.reviewsGetOne = function(req, res) {
    var stockId = req.params.stockId;
    var reviewId = req.params.reviewId;
    console.log('GET reviewId ' + reviewId + " for stockId " + stockId);
    
    Stock
    .findById(stockId)
    .select('reviews')
    .exec(function(err, stock) {
        var review = stock.reviews.id(reviewId);
        var response = {
            status: 200,
            message: {}
        };
        if (err) {
            console.log("Error finding stock");
            response.status = 500;
            response.message = err;
        } else if (!stock) {
            console.log('Stock id not found in database ' + stockId);
            response.status = 404,
            response.message = {
                "message" : 'Stock ID not found ' + stockId
            };
        } else {
            // Get the review
            response.message = stock.reviews.id(stockId);
            // if the review doesn't exist Mongoose returns null
            if (!response.message) {
                response.status = 404;
                response.message = {
                    "message" : "Review ID not found " + reviewId
                };
            }
        }
        res
        .status(response.status)
        .json( response.message ); // returns just the specific review
    });
};

var _addReview = function(req, res, stock) {
    stock.reviews.push({
        name : req.body.name,
        review : req.body.review 
    });
    
    stock.save(function(err, stockUpdated) {
        if (err) {
            res
            .status(500)
            .json(err);
        } else {
            res
            .status(201)
            .json(stockUpdated.reviews[stockUpdated.reviews.length - 1]);
        }
    });
};

module.exports.reviewsAddOne = function(req, res) {
    
    var stockId = req.params.stockId;
    console.log('GET stockId', stockId);
    
    Stock
    .findById(stockId)
    .select('reviews')
    .exec(function(err, doc) {
        var response = {
            status: 200,
            message: []
        };
        if (err) {
            console.log('Error finding review');
            response.status = 500;
            response.message = err;
        } else if (!doc) {
            console.log('Stock id not found in database ' + stockId);
            response.status = 404;
            response.message = {
                "message": "Stock ID not found " + stockId
            };
        } if (doc) {
            _addReview(req, res, doc);
        } else {
            res
            .status(response.status)
            .json( response.message );
        }
    });
    
};