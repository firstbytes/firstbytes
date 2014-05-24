var password = require("../../services/util/password.js");

exports.testHash = function(test) {
    var vals = ["abcdefg", "p@$sword", "spaces in my password!", ""];
    vals.forEach(function(val) {
        var hashed = password.hash(val);
        test.ok(password.check(val, hashed));
    });
    test.done();
};
