// Models a user of the system (can be a mentor, pupil, etc.
// everyone is considered a user).

var mongoose = require('../services/db').get(),
    password = require('../services/util/password'),
    utils = require('../services/util/model.js');

var User, schema;

// language... here for now to make possible l10n easier in the future
var address_is_required = 'Email address is required',
    valid_email_is_required = 'Please use a valid email address',
    your_password_is_too_short = 'Your password must be at least 8 characters long';

var acl = {
    NONE: 0,
    ADMIN: 1,
    MENTOR: 2,
    ADVISOR: 4
};

// todo add indicies to this thing
schema = mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String, required: true}, // password requirements?
    acl: {type: Number, default: 0}, // what type of access does this user have? bitset.
    email: {
        type: String,
        required: address_is_required,
        match: [/^\w+([\.\-\+]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, valid_email_is_required]
    },
    locale: {type: String, default: 'en_US'},
    joined: Date,
    country: String,      // ISO 2 Char (e.g. US, CA, CH)
    locality: String,     // aka city
    region: String,       // aka state
    postalCode: String    // aka zip
});

// @param {password}
schema.methods.checkPassword = function(pass) {
    return password.check(pass, this.password || "");
};

// a select group of attributes to return
var editable = ['_id', 'email', 'locale', 'joined', 'name'];
schema.methods.getEditable = function() { return editable; };
schema.methods.toResponse = utils.toResponse(editable);

schema.pre('save', function(next) {
    if (!this.joined) {
        this.joined = new Date();
    }
    if (this.isModified('password')) {
        if (this.password.length < 8) {
            next(new Error(your_password_is_too_short));
            return;
        }
        this.password = password.hash(this.password);
    }
    next();
});

User = mongoose.model('User', schema);
User.acl = acl;
module.exports = User;
