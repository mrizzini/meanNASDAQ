var mongoose = require('mongoose');
var User = mongoose.model('User');
var bcrypt = require('bcrypt-nodejs'); // encrypting password
var jwt = require('jsonwebtoken');

// create register and login function to use as API route

module.exports.register = function(req, res) {
    console.log(req);
    console.log('registering user');
    
    var username = req.body.username; // contains all properties we can collect from front end. 
    var name = req.body.name || null; // if req.body.name doesnt exist it is null
    var password = req.body.password;
    
    User.create({ // creates user
        username: username,
        name: name,
        password:  bcrypt.hashSync(password, bcrypt.genSaltSync(10)), // this encrypts password
        funds: 10000
    }, function(err, user) {
       if (err) {
           console.log(err);
           res.status(400).json(err);
       }  else {
           console.log('user created', user);
           res.status(201).json(user);
       }
    });
};


module.exports.login = function(req, res) {
    console.log('logging in user');
    var username = req.body.username;
    var password = req.body.password;
    
    User.findOne({
        username: username
    }).exec(function(err, user) {
        if (!user || !password) {
        console.log(err);
        console.log('wrong user name or password');
        res.status(400).json(err);
        } else {
            if (bcrypt.compareSync(password, user.password)) {
                console.log('User found,' + user);
                var token = jwt.sign({ username: user.username }, 's3cr3t', { expiresIn: 3600 });
                res.status(200).json({success: true, token: token});
            } else {
                res.status(401).json('Unauthorized!');
            }
        }
    });
};
    
    
var _addUserSearch = function(req, res, user) {
    console.log('req body is', req.body);
    console.log('user test', req.body.symbol);
    user.userSearch.push({
        search : req.body.symbol
    });
    
    user.save(function(err, userSearchUpdated) {
        if (err) {
            res
            .status(500)
            .json(err);
        } else {
            res
            .status(201)
            .json(userSearchUpdated.userSearch[userSearchUpdated.userSearch.length - 1]);
        }
    });
};
    
    
module.exports.usersAddSearch = function(req, res) {
    console.log("UsersAddSearch req params is", req.params.user);
    var username = req.params.user;
    
    User.findOne({
        username: username
    })
    .exec(function(err, doc) {
        var response = {
            status: 200,
            message: []
        };
        if (err) {
            console.log('Error finding user');
            response.status = 500;
            response.message = err;
        } else if (!doc) {
            console.log('UsersAddSearch Username not found in database ' + username);
            response.status = 404;
            response.message = {
                "message": "User not found " + username
            };
        } if (doc) {
            _addUserSearch(req, res, doc);
        } else {
            res
            .status(response.status)
            .json( response.message );
        }
    });
    
};


module.exports.authenticate = function(req, res, next) { // create authentication function. next is a middleware. function that has access to req & res and can make changes and end cycle
    var headerExists = req.headers.authorization; // checks if req object has an authorization header
    if (headerExists) { // if it exists,
        var token = req.headers.authorization.split(' ')[1]; // Authorization Bearer xxx
        jwt.verify(token, 's3cr3t', function(error, decoded) {
            if (error) {
                console.log(error);
                res.status(401).json('Unauthorized');
            } else {
                req.user = decoded.username; // decoded is decoded token. username property was added above to payload
                next();
            }
        });
    } else {
        res.status(403).json('No token provided'); // if there is no headerExist
    }
}; // jwt.io to validate tokesn


module.exports.usersGetOne = function (req, res) {
    var username = req.params.user;
    console.log('USERS GET ONE username is', req.params);
    User.findOne({
        username: username
    })
    .exec(function(err, doc) {
        var response = {
            status: 200,
            message: []
        };
        if (err) {
            console.log('Error finding user');
            response.status = 500;
            response.message = err;
        } else if (!doc) {
            console.log('UsersGetOne Username not found in database ' + username);
            response.status = 404;
            response.message = {
                "message": "User not found " + username
            };
        } else {
            response.message = doc;
            if(!response.message) {
                response.status = 404;
                response.message = {
                    "message" : "not found" 
                };
            }
        }
            res
            .status(response.status)
            .json( response.message );
    });
};


var _addUserFavorite = function(req, res, user) {
    console.log('req body is', req.body);
    user.userFavorites.push({
        favorites : req.body.symbol
    });
    
    user.save(function(err, userFavoritesUpdated) {
        if (err) {
            res
            .status(500)
            .json(err);
        } else {
            res
            .status(201)
            .json(userFavoritesUpdated.userFavorites[userFavoritesUpdated.userFavorites.length - 1]);
        }
    });
};


module.exports.usersAddFavorite = function(req, res) {
    var username = req.params.user;
    var symbol = req.body.symbol;
    console.log('usersAddFavorite user is', username);
    console.log('usersAddFavorite symbol is', req.body.symbol);
    
    User.findOne({
        username: username
    })
    .exec(function(err, doc) {
        var response = {
            status: 200,
            message: []
        };
        if (err) {
            console.log('Error finding user');
            response.status = 500;
            response.message = err;
        } else if (!doc) {
            console.log('usersAddFavorite Username not found in database ' + username);
            response.status = 404;
            response.message = {
                "message": "User not found " + username
            };
        } if (doc) {
            _addUserFavorite(req, res, doc);
        } else {
            res
            .status(response.status)
            .json( response.message );
        }
    });
    
};


module.exports.deleteUser = function(req, res) {
    var user = req.params.user;
    console.log("deleted user is ", user);
    
    User
    .remove({ username: user })
    .exec(function(err, user) {
        if (err) {
            res
            .status(404)
            .json(err);
        } else {
            console.log('User deleted from database', user);
            res
            .status(204)
            .json();
        }
    });
};

var _addUserStock = function(req, res, user) {
    console.log('req body is', req.body);
    user.stocksOwned.push({
        stock : req.body.symbol,
        amount: req.body.amount
    });
    
    user.save(function(err, userStocksUpdated) {
        if (err) {
            res
            .status(500)
            .json(err);
        } else {
            res
            .status(201)
            .json(userStocksUpdated.stocksOwned[userStocksUpdated.stocksOwned.length - 1]);
        }
    });
};


module.exports.usersBuyStock = function(req, res) {
    console.log('module.exports.usersBuyStock function hit');  
    var username = req.params.user;
    var symbol = req.body.symbol;
    var amount = req.body.amount;
    var totalCost = req.body.totalCost;
    console.log('usersBuyStock user is', username);
    console.log('usersBuyStock symbol is', symbol);
    console.log('usersBuyStock amount is', amount);
    console.log('usersBuyStock totalCost is', totalCost);
    
    User.findOne({
        username: username
    })
    .exec(function(err, doc) {
        var response = {
            status: 200,
            message: []
        };
        if (err) {
            console.log('Error finding user');
            response.status = 500;
            response.message = err;
        } else if (!doc) {
            console.log('usersBuyStock Username not found in database ' + username);
            response.status = 404;
            response.message = {
                "message": "User not found " + username
            };
        } if (doc) {
            _addUserStock(req, res, doc);
        } else {
            res
            .status(response.status)
            .json( response.message );
        }
    });
    
};

module.exports.updateFunds = function(req, res) {
    console.log('updateFunds hit');
    var username = req.params.user;
    var totalCost = req.body.totalCost;
    console.log("updateFunds username is, ", username);
    console.log('updateFunds totalCost is', totalCost);
    console.log('totalCost is a ', typeof(totalCost));
    
    User
    .findOne({
        username: username
    })
    .select('funds')
    .exec(function(err, user) {
        var funds = user.funds;
        var response = {
            status: 200,
            message: {}
        };
        if (err) {
                console.log("Error finding user");
                response.status = 500;
                response.message = err;
        } else if (!user) {
                console.log("User not found in database ", user);
                response.status = 404;
                response.message = {
                    "message" : 'User not found ' + user
                };
            }   else {
                response.message = user.funds;
                // If the review doesn't exist Mongoose returns null
                if (!response.message) {
                    response.status = 404;
                    response.message = {
                        "message" : "Funds not found", funds
                    };
                }
            }
            
            if (response.status !== 200) {
            res
                .status(response.status)
                .json(response.message); // returns just the specific review
        } else {
            user.funds = (user.funds - totalCost);
            user.save(function(err, fundsUpdated) {
                if (err) {
                    res
                    .status(500)
                    .json(err);
                } else {
                    res
                    .status(204)
                    .json();
                }
            });
        }
    });
};