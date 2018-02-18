// most of this is a schema, and then a data model is exported out of here
// schema is a javascript object

var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({ // reviews are sub-documents. create its own Schema
   name : {
    type : String,
    required : true
  },
    review : {
    type : String,
    required : true
  },
  createdOn : {
    type : Date,
    "default" : Date.now
  }
});

var stockSchema = new mongoose.Schema({ 
   Symbol : String,
   Name : String,
   LastSale: Number,
   MarketCap : Number,
   ADRTSO : String,
   IPOyear : Number,
   Sector : String,
   Industry : String,
   SummaryQuote : String,
   reviews : [reviewSchema]
});

// a model is a compiled version of the Schema. a single instance of the model has
// a direct 1-1 relationship with a single document in the database
// all data interactions with mongoose must go thru the model

mongoose.model('Stock', stockSchema); // compiles model. (name of model we are using, name of Schema, name of mongoDB collection) 
// this must come after Schemas. mongoDB collection is optional. if none, it will use lowercase pluralized version of model name