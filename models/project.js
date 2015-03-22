var mongoose = require('../services/db.js').get();
var utils = require('../services/util/model.js');
var Revision = require('./revision');

// Project models a new project that the Coder is working on
// For now it includes the source code, but this will soon change
// to use version control or perhaps GridFS to store revisions

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
    privacy: {type: Number, default: PRIVACY.PRIVATE},
    lesson: {type: String} // reference id of the lesson this is built from
});

var editable = ['name', 'source', 'state', 'userId', 'privacy', 'lesson', '_id'];
schema.methods.getEditable = function() { return editable; };
schema.methods.toResponse = utils.toResponse(editable);

var Project = mongoose.model('Project', schema);
Project.STATE = STATE;
Project.PRIVACY = PRIVACY;

Project.schema.path('state').validate(utils.validate.consts(Project.STATE));
Project.schema.path('privacy').validate(utils.validate.consts(Project.PRIVACY));

// We always create a "Revision"...
// Would like to move this out of here and keep the models skinny.
Project.schema.post('save', function(project) {
  // Very naive solution for now. Will ultimately replace it with a real version control system.
  var rev = new Revision({
    projectId: project._id,
    source: project.source,
    type: Revision.EXPLICIT
  });
  rev.save(function() {
     // do we need to wait?
  });
});

module.exports = Project;
