var mongoose = require('../services/db.js').get();
var utils = require('../services/util/model.js');

var L = {
    NAME_REQUIRED: 'A name is required',
    DESC_REQUIRED: 'A description is required',
    CATEGORY_REQUIRED: 'A parent category must be defined',
    SEQ_REQUIRED: 'A sequence number must be defined and unique for the given category'
};

var schema = mongoose.Schema({
    name: {type: String, required: L.NAME_REQUIRED},
    created: {type: Date, default: Date.now},
    description: {type: String, required: L.DESC_REQUIRED},
    instructions: {type: String},
    source: String, // starting source if there is any
    category: {type: String, required: L.CATEGORY_REQUIRED}, // name of the category
    sequence: {type: Number, required: L.SEQ_REQUIRED}, // sequence of the lesson within the category
    difficulty: {type: Number, default: 0}, // 0-9, 0 being the easiest
});

// should these actually be editable?
var editable = ['name', 'source', 'description', 'category', 'sequence', 'difficulty', '_id'];
schema.methods.getEditable = function() { return editable; };
schema.methods.toResponse = utils.toResponse(editable);

var Lesson = mongoose.model('Lesson', schema);

// todo: ensure that there are no sequence dupes within any given category
// Lesson.schema.path('sequence').validate(utils.validate.consts(Lesson.STATE));

module.exports = Lesson;
