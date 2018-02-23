var mongoose = require('mongoose'); // brings in mongoose to the controller file
var Stock = mongoose.model('Stock'); // brings in reference to our model. use this inside controllers to interact w/ database
var User = mongoose.model('User');


module.exports.stocksGetAll = function (req, res) {

  console.log('Requested by: ' + req.user); //access user property
  console.log('GET the stocks');
  console.log(req.query);

  var offset = 0;
  var count = 3288;
  var maxCount= 3288;
  
  if (req.query && req.query.offset) { // checks if query property exists and if offset exists
    offset = parseInt(req.query.offset, 10); // we set offset parameter to a new var. need to turn to a number using parseInt
    }
      
  if (req.query && req.query.count) { // checks if query property exists and if count exists
    count = parseInt(req.query.count, 10); // we set count parameter to a new var. need to turn to a number using parseInt
    }
    
  if (isNaN(offset) || isNaN(count)) { // checks if these vars are not numbers. if they are not, 
    res
      .status(400) // sets status to 400
      .json({ // sends message to browser
        "message": "If supplied in querystring count and offset should be numbers"
      });
    return; // ends function
  }  
    
    if (count > maxCount) { // if count is entered and higher than maxCount
      res // send status code and message
        .status(400)
        .json({
          "message": "Count limit of " + maxCount + " exceeded"
      });
      return;
    }
    
    Stock
    .find()
    .skip(offset) // method to get how many documents to skip
    .limit(count) // method to get how many doucuments we want to return
    .exec(function(err, stocks){ // exec is a method to execute query. takes a call back. err and returned data
      if (err) { // if error happens run this
        console.log('Error finding stocks');
        res
          .status(500) // sends 500 status code
          .json(err); // sends err to browser
      } else {
        console.log('Found stocks', stocks.length);
        res
          .json(stocks); // send stocks info to browser
      }
    });
};

module.exports.stocksGetOne = function(req, res) {
    var stockId = req.params.stockId;
    console.log('GET stockId', stockId);
    
    Stock
    .findById(stockId)
    .exec(function(err, doc) {
        var response = {
            status : 200,
            message: doc
        };
        if (err) {
            console.log('Error finding stock');
            response.status = 500;
            response.message = err;
        } else if(!doc) {
            response.status = 404;
            response.message = {
                "message" : "Stock ID not found"
            };
        }
        res
        .status(response.status)
        .json( response.message );
        
    });
};


module.exports.stocksSearchOne = function (req, res) {
    console.log('GET STOCK BY SYMBOL');
    // var symbol = req.params.Symbol;
        var symbol = req.params.symbol;
        console.log('symbol is ' + symbol);
    
    Stock
    .find({Symbol: symbol})
    // .skip(offset) // method to get how many documents to skip
    // .limit(count) // method to get how many doucuments we want to return
    .exec(function(err, stock){ // exec is a method to execute query. takes a call back. err and returned data
      if (err) { // if error happens run this
        console.log('Error finding stocks');
        res
          .status(500) // sends 500 status code
          .json(err); // sends err to browser
      } else {
        console.log('Found stock', stock);
        res
          .json(stock); // send stocks info to browser
      }
    }
    );

};



var _addFavorite = function(req, res, stock) {
    User.favorites.push({
        favorite : req.params.symbol,
        
    });
    
    User.save(function(err, favoriteStock) {
        if (err) {
            res
            .status(500)
            .json(err);
        } else {
            res
            .status(201)
            .json(favoriteStock.favorites[favoriteStock.favories.length - 1]);
        }
    });
};




module.exports.stocksAddFavorite = function (req, res) {
  var userId = req.params.userId;
  console.log('GET stockId', userId);
    
    User
    .findById(userId)
    .select('favorites')
    .exec(function(err, doc) {
        var response = {
            status: 200,
            message: []
        };
        if (err) {
            console.log('Error finding favorite');
            response.status = 500;
            response.message = err;
        } else if (!doc) {
            console.log('User id not found in database ' + userId);
            response.status = 404;
            response.message = {
                "message": "User ID not found " + userId
            };
        } if (doc) {
            _addFavorite(req, res, doc);
        } else {
            res
            .status(response.status)
            .json( response.message );
        }
    });
};