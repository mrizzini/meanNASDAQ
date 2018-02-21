var mongoose = require('mongoose');
var User = mongoose.model('User');
var bcrypt = require('bcrypt-nodejs'); // encrypting password
var jwt = require('jsonwebtoken');

// create register and login function to use as API route

module.exports.register = function(req, res) {
    console.log('registering user');
    
    var username = req.body.username; // contains all properties we can collect from front end. 
    var name = req.body.name || null; // if req.body.name doesnt exist it is null
    var password = req.body.password;
    
    User.create({ // creates user
        username: username,
        name: name,
        password:  bcrypt.hashSync(password, bcrypt.genSaltSync(10)) // this encrypts password
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
    
// module.exports.authenticate = function(req, res, next) {
//         var headerExists = req.headers.authorization;
//         if (headerExists) {
//             var token = req.headers.authorization.split(' ')[1];
//             jwt.verify(token, 's3cr3t', function(error, decoded) {
//                 if (error) {
//                     console.log(error);
//                     res.status(401).json('Unauthorized!!');
//                 } else {
//                     req.user = decoded.username;
//                     next();
//                 }
//             });
//         } else {
//             res.status(403).json('No token provided');
//         }
//     };

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


module.exports.usersGetAll = function (req, res) {
  

    
    User
    .find()
    // .skip(offset) // method to get how many documents to skip
    // .limit(count) // method to get how many doucuments we want to return
    .exec(function(err, users){ // exec is a method to execute query. takes a call back. err and returned data
      if (err) { // if error happens run this
        console.log('Error finding stocks');
        res
          .status(500) // sends 500 status code
          .json(err); // sends err to browser
      } else {
        console.log('Found users', users.length);
        res
          .json(users); // send stocks info to browser
      }
    });
};