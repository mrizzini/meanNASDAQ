var mongoose = require('mongoose');

var searchSchema = new mongoose.Schema({
    search: {
        type: String
    }
});

mongoose.model('Searche', searchSchema);

// require this in db.js
// then create search.controllers.js in controllers folder
// add authentization routes in index.js. and bring in controller at top of file index.js