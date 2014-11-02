var mongo = require("mongodb");
var server = require("../../services/server")();
var helper = require("./_helper")(server);
var auth = require("../../services/auth/user-auth.js");

exports.setUp = helper.setup;
exports.tearDown = helper.teardown;

var User = require("../../models/user.js");

exports.testCreation = function(test) {
    test.expect(3);

    var password = "turing test!";
    var u1 = new User({
        name: "Alan Turing",
        password: password,
        email: "alan@example.com"
    });

    u1.save(function(err, user) {
        test.ok(!err, err);
        test.ok(user, "User was not created");
        test.ok(user.password !== password, "Password was not hashed");
        test.done();
    });
};

exports.testToResponse = function(test) {
    test.expect(3);

    var password = "turing test!";
    var u1 = new User({
        name: "Alan Turing",
        password: password,
        email: "alan@example.com"
    });

    u1.save(function(err, user) {
        var r = u1.toResponse();
        test.ok(u1.name === r.name);
        test.ok(!!u1.password); // password here
        test.ok(!r.password); // but no password here
        test.done();
    });
};

exports.testUserFromRequest = function(test) {
    test.expect(1);
    var u1 = new User({
        name: "Alan Turing",
        password: "examplepassword",
        email: "alan@example.com"
    });
    u1.save(function(err, user) {
        var token = 'token-abc';
        var fauxReq = { session: {}, get: function() { return token; }};
        fauxReq.session[token] = user._id;
        auth.userFromRequest(fauxReq, user._id, function(err, fetched) {
            test.ok(user._id.toString() === fetched._id.toString());
            test.done();
        });
    });
};
