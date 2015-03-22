// todo add in passport
// var passport = require("passport");
// var LocalStrategy = require("passport-local").Strategy;
var User = require('../../models/user');

var L;

L = {
    ERR_UNKNOWN_USER: 'Unknown User',
    ERR_PASSWORD: 'Invalid password',
    INVALID_TOKEN: 'Invalid token',
    NO_PERMISSION: 'User does not have permission'
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
    User.findOne({'email': username + ''}).exec(function(err, user) { // force strings on queries
        if (err) return callback(err);
        if (!user) return callback(L.ERR_UNKNOWN_USER);
        if (!user.checkPassword(password)) return callback(L.ERR_PASSWORD);
        callback(null, user);
    });
};

// @param {req} Object Express/Connect req object
// @param {function} callback (err, User)
exports.getUserFromRequest = function(req, callback) {
    exports.getAndAssertUserFromRequest(req, false, function(err, user) {
        callback(err, user);
    });
};

// @param {req} Object Express/Connect req object
// @param {userId} String user id to check against, if false will default
// @param {function} callback (err, User)
exports.getAndAssertUserFromRequest = function(req, userId, callback) {
    var token = req.get("token");
    if (!token) return callback(L.INVALID_TOKEN);
    if (!req.session || !req.session[token]) return callback(L.INVALID_TOKEN);
    if (userId === false) userId = req.session[token];
    exports.getUser(userId, function(err, user) {
        if (err) return callback(err);
        // Must be logged in as this user or logged in as an admin
        if (req.session[token] === userId) return callback(null, user);
        exports.fetchUserAndCheckPermission(req.session[token], "TBD", function(err) {
            callback(err, err ? null : user);
        });
    });
};

// @param {req} Object Express/Connect req object
// @param {userId} String user id to check against, if false will default
// @param {function} callback (err, User)
exports.getUser = function(userId, callback) {
    if (!userId) return callback(L.ERR_UNKNOWN_USER);
    User.findOne({"_id": userId + ""}).exec(function(err, user) { // force strings on queries
        if (err) return callback(err);
        if (!user) return callback(L.ERR_UNKNOWN_USER);
        callback(null, user);
    });
};

// @param {userId} String user id to check against, if false will default
// @param {permission} string the permission in question (moot for now as we don't have specific permissions quite yet)
// @param {function} callback (err)
exports.fetchUserAndCheckPermission = function(userId, permission, callback) {
    exports.getUser(userId, function(err, user) {
        if (err) return callback(err);
        callback(exports.hasPermission(user, permission) ? null : L.NO_PERMISSION, user);
    });
};

// @param {user} Object User
// @param {permission} string the permission in question (moot for now as we don't have specific permissions quite yet)
exports.hasPermission = function(user, permission) {
    // todo add more permissions and make this more specific
    return user && user.acl === User.acl.ADMIN;
};
