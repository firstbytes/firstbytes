var server = require('../../services/server')();
var helper = require('./_helper')(server);
var auth = require('../../services/auth/user-auth.js');

exports.setUp = helper.setup;
exports.tearDown = helper.teardown;

var User = require('../../models/user.js');

exports.testCreation = function(test) {
    test.expect(3);

    var password = 'turing test!';
    var u1 = new User({
        name: 'Alan Turing',
        password: password,
        email: 'alan@example.com'
    });

    u1.save(function(err, user) {
        test.ok(!err, err);
        test.ok(user, 'User was not created');
        test.ok(user.password !== password, 'Password was not hashed');
        test.done();
    });
};

exports.testToResponse = function(test) {
    test.expect(3);

    var password = 'turing test!';
    var u1 = new User({
        name: 'Alan Turing',
        password: password,
        email: 'alan@example.com'
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
        name: 'Alan Turing',
        password: 'examplepassword',
        email: 'alan3@example.com'
    });
    u1.save(function(err, user) {
        var token = 'token-abc';
        var fauxReq = { session: {}, get: function() { return token; }};
        fauxReq.session[token] = user._id;
        auth.getUserFromRequest(fauxReq, function(err, fetched) {
            test.ok(user._id.toString() === fetched._id.toString());
            test.done();
        });
    });
};

exports.testAdminCheck = function(test) {
    test.expect(3);
    var u1 = new User({
        name: 'Boss Lady',
        password: 'examplepassword',
        email: 'boss@example.com',
        acl: User.acl.ADMIN
    });
    u1.save(function(err, user) {
        // we only have one specific check
        var perm = 'ANYTHING_FOR_NOW_CHANGE_ME_LATER';
        test.ok(auth.hasPermission(user, perm));
        auth.fetchUserAndCheckPermission(user._id, perm, function(err, fetched) {
            test.ok(!err, 'There was an error' + err);
            test.ok(user._id.toString() === fetched._id.toString(), 'User and admin user returned were diff');
            test.done();
        });
    });
};

exports.testAdminUserFromRequest = function(test) {
    test.expect(1);
    var uStudent = new User({
        name: 'Alan Turing',
        password: 'examplepassword',
        email: 'alan3@example.com'
    });
    var uAdmin = new User({
        name: 'Boss Lady',
        password: 'examplepassword',
        email: 'boss@example.com',
        acl: User.acl.ADMIN
    });
    uStudent.save(function(err, user1) {
        uAdmin.save(function(err, user2) {
            var token = 'token-abc';
            var fauxReq = { session: {}, get: function() { return token; }};
            fauxReq.session[token] = uAdmin._id;
            auth.getAndAssertUserFromRequest(fauxReq, uStudent._id, function(err, fetched) {
                test.ok(uStudent._id.toString() === fetched._id.toString());
                test.done();
            });
        });
    });
};

