var mongoose = require('../services/db.js').get();
var utils = require('../services/util/model.js');

// Project models a new project that the Coder is working on
// For now it includes the source code, but this will soon change
// to use version control or perhaps GridFS to store revisions

// todo add instance methods (but don't make fat models)

var STATE = {
    WIP: 1,
    PUBLISHED: 2,
    ARCHIVED: 3
};

var PRIVACY = {
    PUBLIC: 1,
    PRIVATE: 2
};

var schema = mongoose.Schema({
    name: String,
    created: {type: Date, default: Date.now},
    source: String, // latest source kept inline, prefer not to make this an array of embeded revisions (for size reasons)
    userId: {type: String},
    state: {type: Number, default: STATE.WIP},
    privacy: {type: Number, default: PRIVACY.PRIVATE}
});

schema.methods.toResponse = utils.toResponse(['name', 'source', 'state', 'userId', 'privacy', '_id']);

var Project = mongoose.model('Project', schema);
Project.STATE = STATE;
Project.PRIVACY = PRIVACY;

Project.schema.path('state').validate(utils.validate.consts(Project.STATE));
Project.schema.path('privacy').validate(utils.validate.consts(Project.PRIVACY));

// // We always create a "Revision"
// Project.post('save', function(project) {
//   deciding against it for now... keep models skinny and "low level"
// });

module.exports = Project;
