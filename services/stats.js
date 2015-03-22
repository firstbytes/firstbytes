// Really poor generic name (stats) for now.

var User = require('../models/user'),
    Project = require('../models/project'),
    Lesson = require('../models/lesson');

// @param {function} callback (string err, int count)
exports.totalStudents = function(callback) {
    User.count({acl: 0}, callback); // exclude everyone that isn't a "student"
};

// @param {function} callback (string err, int count)
exports.totalProjects = function(callback) {
    Project.count({}, callback); // need to back out projects by admins, not as easy with Mongo/NoSQL without joins
};

// @param {string} id
// @param {function} callback
exports.userDetails = function(id, callback) {
    User.findOne({_id: id}, function(err, user) {
        if (err) return callback(err);
        Project.find({userId: user._id}, function(err, projects) {
            if (err) return callback(err);
            // projects.map(function(p) { return p.toResponse(); } )
            callback(null, {
                user: user,
                projects: projects
            });
        });
    });
};

// @param {function} callback
exports.allStudents = function(callback) {
    User.find({acl: 0}, callback);
};

// @param {string} id
// @param {object} options optional
// @param {function} callback
// exports.searchUser = function(phrase, options, callback) {
//     if (typeof options === 'function') {
//         callback = options;
//         options = null;
//     }
//     if (typeof options !== 'object') options = {};
//     User.find({name: });
// };
