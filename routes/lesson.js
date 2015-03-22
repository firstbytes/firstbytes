/**
 * Routes for "projects"
 *
 * Need to use the revision and "Project Manager"
 * Need to add in auth middleware :-)
 * Need to add in validation
 * Need to DRY up some of these methods across other model routes
 */
var Lesson = require("../models/lesson.js");
// var auth = require("../services/auth/user-auth.js");

var L = {
    DNE: 'Lesson does not exist!',
    CATEGORY_DNE: 'Category does not exist!'
};

// GET /lesson/ID/
exports.get = function(req, res) {
    Lesson.findById(req.params.id, function(err, lesson) {
        if (err || !lesson) return res.status(401).json({error: L.DNE}); // todo 500 on err
        res.json(lesson);
    });
};

// GET /lessons/CATEGORY/
exports.getByCategory = function(req, res) {
    Lesson.find({'category': req.params.category + ''}, function(err, lessons) {
        if (err || lessons.length === 0) return res.status(401).json({error: L.CATEGORY_DNE}); // todo 500 on err
        res.json(lessons);
    });
};

// // POST /project/
// exports.create = function(req, res) {
//     // todo use project manager
//     var p = new Project(req.body);
//     auth.getUserFromRequest(req, function(err, user) {
//         p.userId = user._id;
//         p.save(function(err) {
//             if (err) return res.status(400).json({error: L.COULD_NOT_SAVE_PROJECT});
//             res.json(p.toResponse());
//         });
//     });
// };

// // PUT /project/ID/
// exports.update = function(req, res) {
//     // todo use project manager
//     var uid = req.body.userId || false,
//         payload = req.body;
//     auth.getAndAssertUserFromRequest(req, uid, function(err, user) {
//         if (err) return res.status(400).json({error: L.COULD_NOT_AUTH});
//         Project.findById(payload._id, function(err, project) {
//             if (err) return res.status(400).json({error: L.COULD_NOT_SAVE_PROJECT});
//             if (project.userId.toString() !== user._id.toString()) return res.status(400).json({error: L.NOT_YOUR_PROJECT});
//             var attributes = project.getEditable();
//             for (var attr in attributes) {
//                 project[attributes[attr]] = payload[attributes[attr]];
//             }
//             project.save(function(err) {
//                 if (err) return res.status(400).json({error: L.COULD_NOT_SAVE_PROJECT});
//                 res.json(project.toResponse());
//             });
//         });
//     });
// };

// // POST /project/ID/revisions/
// exports.saveRevision = function(req, res) {
//     var pm = new ProjectManager(req.params.id);
//     req.body.saved = Date.now(); // force it for now at least
//     pm.addRevision(req.body, function(err, revision) {
//         if (err) return res.json(500, {"error": err});
//         if (!revision) return res.status(404).json({"error": L.COULD_NOT_AUTH});
//         res.json(revision);
//     });
// };

// // GET /project/ID/revisions/
// exports.getRevisions = function(req, res) {
//     var pm = new ProjectManager(req.params.id);
//     pm.getRevisions(req.body, function(err, revisions) {
//         if (err) return res.status(500).json({"error": err});
//         if (!revisions) return res.status(404).json({"error": L.COULD_NOT_AUTH}); // project didn't exist
//         res.json(revisions); // may also be an empty array
//     });
// };
