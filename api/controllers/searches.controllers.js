var mongoose = require('mongoose'); // brings in mongoose to the controller file
// var Search = mongoose.model('Search'); // brings in reference to our model. use this inside controllers to interact w/ database


// NEED TO ADD SEARCH MODEL

module.exports.searchesAddOne = function(req, res) {
    
       console.log('new search');
    // var symbol = req.params.Symbol;
        var search = req.body.search;
        // console.log('symbol is ' + symbol);
    
    Search.create({ // creates user in database
        searches: search,
        // password: password   // use this to test, then encrypt
        // pasword: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) // this encrypts password
// Store hash in your password DB.
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