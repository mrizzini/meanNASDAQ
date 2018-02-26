var mongoose = require('mongoose');

var searchSchema = new mongoose.Schema({ // searches are sub-documents. create its own Schema
    search : {
    type : String,
  },
  createdOn : {
    type : Date,
    "default" : Date.now
  }
});

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    userSearch: [searchSchema],
    
    favorites : {
        type: String
    }
});

mongoose.model('User', userSchema);

// first step to creating authoriziation. next step is to require this in db.js
// then create users.controllers.js in controllers folder
// add authentization routes in index.js. and bring in controller at top of file index.js