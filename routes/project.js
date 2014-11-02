/**
 * Routes for "projects"
 *
 * Need to use the revision and "Project Manager"
 * Need to add in auth middleware :-)
 * Need to add in validation
 * Need to DRY up some of these methods across other model routes
 */
var Project = require("../models/project.js");
// var modelRoute = require("../routes/_model.js");

// GET /project/ID/
// exports.get = modelRoute.get(Project);

// PUT /project/ID/
// exports.put = modelRoute.put(Project);

// POST /project/
// exports.post = modelRoute.post(Project, function(req, res, instance) {
//     instance.created = Date.now();
// });

// DELETE /project/ID/
// exports.delete = modelRoute.delete(Project);

// POST /project/
exports.create = function(req, res) {
    // todo use project manager
    var p = new Project(req.body);
    console.log(req.body);
    // todo fix up this session stuff
    // console.log(req.session);
    // if (req.session.user != p.userId) return res.status(401).json({error: 'That is not you!'});
    // p.userId = req.session.user;
    p.save(function(err) {
        if (err) return res.status(400).json({error: 'Could not save project'});
        res.json(p.toResponse());
    });
    // var pm = new ProjectManager();
    // pm.addRevision(req.body, function(err, revision) {
    //     if (err) return res.json(500, {"error": err});
    //     if (!revision) return res.status(404).json({"error": "Who?"});
    //     res.json(revision);
    // });
};

// PUT /project/ID/
exports.update = function(req, res) {
    var pm = new ProjectManager(req.params.id);
    pm.addRevision(req.body, function(err, revision) {
        if (err) return res.json(500, {"error": err});
        if (!revision) return res.status(404).json({"error": "Who?"});
        res.json(revision);
    });
};

// POST /project/ID/revisions/
exports.saveRevision = function(req, res) {
    var pm = new ProjectManager(req.params.id);
    req.body.saved = Date.now(); // force it for now at least
    pm.addRevision(req.body, function(err, revision) {
        if (err) return res.json(500, {"error": err});
        if (!revision) return res.status(404).json({"error": "Who?"});
        res.json(revision);
    });
};

// GET /project/ID/revisions/
exports.getRevisions = function(req, res) {
    var pm = new ProjectManager(req.params.id);
    pm.getRevisions(req.body, function(err, revisions) {
        if (err) return res.status(500).json({"error": err});
        if (!revisions) return res.status(404).json({"error": "Who?"}); // project didn't exist
        res.json(revisions); // may also be an empty array
    });
};