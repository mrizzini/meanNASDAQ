var mongoose = require('mongoose'); // brings in mongoose to the controller file
var Search = mongoose.model('Searche'); // brings in reference to our model. use this inside controllers to interact w/ database
var Stock = mongoose.model('Stock'); // brings in reference to our model. use this inside controllers to interact w/ database



// NEED TO ADD SEARCH MODEL


module.exports.searchesGetAll = function(req, res) {
    console.log('Finding searches');
  Search
    .find()
    // .skip(offset) // method to get how many documents to skip
    // .limit(count) // method to get how many doucuments we want to return
    .exec(function(err, searches){ // exec is a method to execute query. takes a call back. err and returned data
      if (err) { // if error happens run this
        console.log('Error finding searches');
        res
          .status(500) // sends 500 status code
          .json(err); // sends err to browser
      } else {
        console.log('Found searches', searches.length);
        res
          .json(searches); // send stocks info to browser
      }
    });
};   





module.exports.searchesAddOne = function(req, res) {
        // console.log(req);
       console.log('new search');
    // var symbol = req.params.Symbol;
        // var search = req.body.symbol;
        var search = req.params.symbol;
        console.log('searched for ', search);
        // console.log('symbol is ' + symbol);
    
    Search.create({ // creates searc in database
        search: search,
    }, function (err, search) { // handles error
        if (err) {
            console.log(err);
            res.status(400).json(err);
        } else { // if 201 created, we log it and return 201 status with user info
            console.log('search for', search);
            res.status(201).json(search);
        }
    });
};
    
    
// module.exports.searchesGetAll = function(req, res) {
//     console.log('Finding searches');
//   Search
//     .find()
//     // .skip(offset) // method to get how many documents to skip
//     // .limit(count) // method to get how many doucuments we want to return
//     .exec(function(err, searches){ // exec is a method to execute query. takes a call back. err and returned data
//       if (err) { // if error happens run this
//         console.log('Error finding searches');
//         res
//           .status(500) // sends 500 status code
//           .json(err); // sends err to browser
//       } else {
//         console.log('Found searches', searches.length);
//         res
//           .json(searches); // send stocks info to browser
//       }
//     });
// };   
    
    
    
    
    
    
    
    
    
//     var stockId = req.params.stockId;
//     console.log('GET stockId', stockId);
    
//     Stock
//     .findById(stockId)
//     .select('reviews')
//     .exec(function(err, doc) {
//         var response = {
//             status: 200,
//             message: []
//         };
//         if (err) {
//             console.log('Error finding review');
//             response.status = 500;
//             response.message = err;
//         } else if (!doc) {
//             console.log('Stock id not found in database ' + stockId);
//             response.status = 404;
//             response.message = {
//                 "message": "Stock ID not found " + stockId
//             };
//         } if (doc) {
//             _addReview(req, res, doc);
//         } else {
//             res
//             .status(response.status)
//             .json( response.message );
//         }
//     });
    
// };