var mongoose = require('../services/db.js').get();
var utils = require('../services/util/model.js');

// An inquiry is a stream of messages between a single student and potentially several other users (mentors)

var STATE = {
    NEW: 1, // newly open, no mentor responses yet
    ACTIVE: 2, // open but actively being worked on
    RESOLVED: 3,
};

var messageSchema = {
    userId: String,
    sent: {type: Date, default: Date.now},
    message: {type: String}
};

var schema = mongoose.Schema({
    created: {type: Date, default: Date.now},
    messages: [messageSchema],
    studentId: {type: String, required: true},
    assignedTo: {type: String}, // mentor this is assigned to, may eventually make a collection
    projectId: {type: String},
    state: {type: Number, default: STATE.NEW},
});

var editable = ['created', 'messages', 'studentId', 'assignedTo', 'projectId', 'state']; // editable?
schema.methods.getEditable = function() { return editable; };
schema.methods.toResponse = utils.toResponse(editable);

var Inquiry = mongoose.model('Inquiry', schema);
Inquiry.STATE = STATE;

Inquiry.schema.path('state').validate(utils.validate.consts(Inquiry.STATE));

// todo consider adding a save hook to update state from NEW to ACTIVE
// want to materialize this state change to make seeks / queries easier

module.exports = Inquiry;
