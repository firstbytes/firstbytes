// var stats = require('../services/stats');
// var User = require('../models/user');
// var Project = require('../models/project');
// var auth = require('../services/auth/user-auth');


// base
exports.index = function(req, res) {
    res.render('dashboard');
};

// // GET /user/ID/projects/?page=N&start=M
// exports.student = function(req, res) {
//   // res.send("json", {});
//   auth.getAndAssertUserFromRequest(req, req.params.id, function(err, user) {
//     if (err) return res.status(401).json({'error': err});
//     Project.find({userId: user._id}, function(err, projects) {
//       if (err) return res.status(401).json({'error': err});
//       res.json(projects.map(function(p) { return p.toResponse(); } ));
//     });
//   });
// };

// // POST /user/auth/
// exports.auth = function(req, res) {
//   auth.lookup(req.body['email'], req.body['password'], function(err, user) {
//       var token;
//       if (err) return res.status(400).json({'error': err});
//       if (!user) return res.status(400).send('json', {'error': E_UNKNOWN_USER});
//       token = createSession(req, user);
//       res.json({"token": token, "user": user.toResponse()});
//   });
// };

// // POST /user/
// exports.create = function(req, res) {
//   var user;
//   user = new User(req.body);
//   user.save(function(err) {
//     if (err) return res.status(400).json({'error': err});
//     var token = createSession(req, user);
//     res.json({"token": token, "user": user.toResponse()});
//   });
// };

// // GET /user/ID
// exports.authFromToken = function(req, res) {
//   auth.getAndAssertUserFromRequest(req, req.params.id, function(err, user) {
//     if (err) return res.status(400).json({'error': err});
//     res.json({"token": req.get('token'), "user": user.toResponse()});
//   });
// };

// createSession = function(req, user) {
//   var token = uuid.v4();
//   req.session.user = req.session[token] = user._id;
//   return token;
// };
