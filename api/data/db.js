var mongoose = require('mongoose');
var dburl =  'mongodb://' + process.env.IP + ':27017/nasdaq'; //defines connection string as database url

mongoose.connect(dburl); // will connect to the database using mongoose. listens to events

// these are the 3 mongoose connection listeners
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dburl);
});
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
});

process.on('SIGINT', function() {
   mongoose.connection.close(function() {
       console.log('Mongoose disconnected through app termination (SIGINT)');
       process.exit(0);
   }); 
});

process.on('SIGTERM', function(){ // this listens for the SIGTERM, for Heroku app termination. takes callback
    mongoose.connection.close(function(){ // this line closes mongoose connection. takes callback
        console.log('Mongoose disconnected through app termination (SIGTERM)'); // logs when it is called 
        process.exit(0); // tells process it can finish, it can exit
    });
});

process.once('SIGUSR2', function(){ // this listens for the SIGUSR event, happens for nodemon. takes callback
    mongoose.connection.close(function(){ // this line closes mongoose connection. takes callback
        console.log('Mongoose disconnected through app termination (SIGUSR2)'); // logs when it is called 
        process.kill(process.pid, 'SIGUSR2'); // sends event so nodemon picks it up
    });
});

//bring in schemas and models later

require('./stocks.models.js');