// needs some TLC
/**
 * Manages a Coder's Projects
 * Creating them, editing them, making revisions, seeing diffs, etc.
 */

 var Project = require("../../models/project");
 var Revision = require("../../models/revision");

/**
 * @param {Project|String} project Project or id of a project
 */
var ProjectManager = function(id) {
    this.id = id;
};

/**
 * @param {int|Project} project
 * @param {Function} callback (err, Project)
 */
ProjectManager.prototype.fetch = function(project, callback) {
    if (typeof project === 'object') return callback(null, project);
    Project.findOne({ _id: this.id }, function(err, project) {
        callback(err, project);
    });
};

/**
 * @param {Project} project
 * @param {int}[optional] type explicit save vs. implicit save
 * @param {Function} callback (err, Project)
 */
ProjectManager.prototype.save = function(project, type, callback) {
    project.save(function(err) {
        if (err) return callback(err);
        // todo check if source is dirty http://stackoverflow.com/questions/18192804/mongoose-get-db-value-in-pre-save-hook
        // todo actually have code revisions backed in git and "Revision" be a reference to the hash
        if (typeof type === 'function') callback = type;
        type = (typeof type === 'number') ? type : Revision.TYPE.EXPLICIT;
        this.saveRevision(project, type, function(err, rev) {
            callback(err, project);
        });
    }.bind(this));
};

/**
 * @param {Project} project
 * @param {int|Object}[optional] type save type or object of optional details (source, type, saved)
 * @param {Function} callback (err, Revision)
 */
ProjectManager.prototype.saveRevision = function(project, details, callback) {
    if (typeof details === 'function') { callback = details; /*details = {};*/ }
    if (typeof details === 'number') details = {type: details};
    if (typeof details !== 'object') details = {};

    // revisions should eventually be stored as a reference to a git hash as opposed to the source itself
    var rev = new Revision({
        projectId: project._id,
        type: details.type === Revision.TYPE.EXPLICIT ? Revision.TYPE.EXPLICIT : Revision.TYPE.IMPLICIT,
        source: details.source || project.source,
        saved: details.saved || Date.now(),
        err: details.err || [] // TODO parse source server side check for errors via jshint
    });

    rev.save(callback);
};

/**
 * Gets the last N explicit revisions
 * @todo add options for changing limit and type (implicit vs. explicit)
 *
 * @param Project
 * @param {Function} callback (err, Revision[])
 */
ProjectManager.prototype.getRevisions = function(project, callback) {
    Revision.find({projectId: this.id}, callback); // todo add some sort of paging, sorting and limiting
};

/**
 * /project/id/revisions
 * @param {Project}
 * @param {Function} callback (err, Project)
 * @return {Object} object ready to be sent to the client as a restful response
 */
ProjectManager.prototype.resourceProject = function(project, callback) {
    // todo build a helper for these and perhaps move these formatters
    // into another service
    return {
        name: project.name,
        source: project.source,
        created: project.created, // to timestamp?
        state: project.state,
        privacy: project.privacy,
        rels: { // todo complete URIs
            revisions: '/project/' + project._id + '/revisions',
            user: '/user/' + project.userId,
        }
    };
};

/**
 * /project/id/revisions
 * @param {roject}
 * @param {Function} callback (err, Project)
 * @return {Object} object ready to be sent to the client as a restful response
 */
ProjectManager.prototype.resourceRevisions = function(project, callback) {
    this.getRevisions(project, function(err, revisions) {
        if (err) return callback(err);
        if (revisions === null) return callback(new Error('Unknown project'));
        var res = revisions.map(function(revision) {
            return {
                source: revision.source,
                type: revision.type,
                rels: { // todo complete URIs
                    revisions: '/project/' + project._id,
                    user: '/user/' + project.userId
                }
            };
        });
    });
};

module.exports = ProjectManager;