var mongoose = require("../services/db").get();
var utils = require('../services/util/model');
var Project = require('./project');

var schema = mongoose.Schema({
    projectId: String,
    source: String,
    type: Number, // implicit save vs. explicit save
    err: Array, // array of errors (if any)
    saved: {type: Date, default: Date.now}
});

var Revision = mongoose.model("Revision", schema);

Revision.TYPE = {
    IMPLICIT: 1,
    EXPLICIT: 2
};

Revision.schema.path("type").validate(utils.validate.consts(Revision.TYPE));

module.exports = Revision;
