var bcrypt = require("bcryptjs");

var password = {
    hash: function(pass) {
        return bcrypt.hashSync(pass, 8);
    },

    check: function(pass, hash) {
        return bcrypt.compareSync(pass, hash);
    }
};

module.exports = password;
