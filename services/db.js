var mongoose = require("mongoose");
var db;

exports.connect = function(connectionString) {
    mongoose.connect(connectionString);
    db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function callback () {
      // todo don't log the connect string if crednetials get in there...
      console.log("Connected to mongo at " + connectionString);
    });
};

exports.get = function() {
    return mongoose;
};