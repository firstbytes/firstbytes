// todo add in passport
// var passport = require("passport");
// var LocalStrategy = require("passport-local").Strategy;
var User = require('../../models/user');

var L;

L = {
    ERR_UNKNOWN_USER: 'Unknown User',
    ERR_PASSWORD: 'Invalid password',
    INVALID_TOKEN: 'Invalid token'
};

// Passport - Was a thought originally but keeping in simple for now

// var MSG_INVALID_PASSWORD = 'Incorrect username/password combination.';

// passport.use(new LocalStrategy(function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//         console.log("uer", user);
//         if (err) return done(err);
//         if (!user || !user.checkPassword(password)) {
//             return done(null, false, { message: MSG_INVALID_PASSWORD});
//         }
//         return done(null, user);
//     });
//   }
// ));

// passport.serializeUser(function(user, done) {
//   done(null, user._id);
// });

// passport.deserializeUser(function(id, done) {
//     User.findOne({_id: id}, done);
// });

// module.exports = passport;

// @param {username} string typically email
// @param {password} string
// @param {callback} function (err, User)
exports.lookup = function(username, password, callback) {
    User.findOne({"email": username + ""}).exec(function(err, user) { // force strings on queries
        if (err) return callback(err);
        if (!user) return callback(L.ERR_UNKNOWN_USER);
        if (!user.checkPassword(password)) return callback(L.ERR_PASSWORD);
        callback(null, user);
    });
};

// @param {req} Object Express/Connect req object
// @param {userId} String id of user to check for
// @param {function} callback (err, User)
exports.userFromRequest = function(req, userId, callback) {
    var token = req.get('token');
    if (!token || req.session[token] !== userId) {
        return callback(L.INVALID_TOKEN);
    }
    User.findOne({'_id': userId + ''}).exec(function(err, user) { // force strings on queries
        if (err) return callback(err);
        if (!user) return callback(L.ERR_UNKNOWN_USER);
        callback(null, user);
    });
};
