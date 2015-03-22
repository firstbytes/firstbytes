var mongoose = require("../services/db").get();
var utils = require('../services/util/model');
var Project = require('./project');

// Temporary solution for now. Ultimately would like to get revisions in some sort of
// real version control system like git.

var TYPES = {
    IMPLICIT: 1,
    EXPLICIT: 2
};

var schema = mongoose.Schema({
    projectId: String,
    source: String,
    type: {type: Number, default: TYPES.IMPLICIT}, // implicit save vs. explicit save
    err: Array, // array of errors (if any)
    saved: {type: Date, default: Date.now}
});

var Revision = mongoose.model("Revision", schema);
Revision.TYPE = TYPES;
Revision.schema.path("type").validate(utils.validate.consts(Revision.TYPE));
module.exports = Revision;
