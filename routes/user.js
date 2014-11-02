/**
 * API end points
 * /user/*
 */

var uuid = require('node-uuid');
var User = require('../models/user');
var Project = require('../models/project');
var auth = require('../services/auth/user-auth');
var modelRoute = require("../routes/_model");

var createSession;

// todo put some auth middleware around get, put, delete
// exports.get = modelRoute.get(User);
// exports.put = modelRoute.put(User);
// exports.post = modelRoute.post(User, function(req, res, instance) {
//     instance.joined = new Date();
// });
// exports.delete = modelRoute.delete(User);

// GET /user/ID/projects/?page=N&start=M
exports.projects = function(req, res) {
  // res.send("json", {});
  auth.getUserFromRequest(req, req.params.id, function(err, user) {
    if (err) return res.status(401).json({'error': err});
    Project.find({}, function(err, projects) {
      if (err) return res.status(401).json({'error': err});
      res.json(projects.map(function(p) { return p.toResponse(); } ));
    });
  });
};

// // GET /user/ID/projects/public/?page=N&start=M
// exports.publicprojects = function(req, res){
//   // todo
// };

// POST /user/auth/
exports.auth = function(req, res) {
  auth.lookup(req.body['email'], req.body['password'], function(err, user) {
      var token;
      if (err) return res.status(400).json({'error': err});
      if (!user) return res.status(400).send('json', {'error': E_UNKNOWN_USER});
      token = createSession(req, user);
      res.json({"token": token, "user": user.toResponse()});
  });
};

// POST /user/
exports.create = function(req, res) {
  var user;
  user = new User(req.body);
  user.save(function(err) {
    if (err) return res.status(400).json({'error': err});
    var token = createSession(req, user);
    res.json({"token": token, "user": user.toResponse()});
  });
};

// GET /user/ID
exports.authFromToken = function(req, res) {
  auth.getUserFromRequest(req, req.params.id, function(err, user) {
    if (err) return res.status(400).json({'error': err});
    res.json({"token": req.get('token'), "user": user.toResponse()});
  });
};

createSession = function(req, user) {
  var token = uuid.v4();
  req.session.user = req.session[token] = user._id; // meh
  return token;
};

// POST /user/login/ (unlike auth, returns a session cookie)
// exports.login = function(req, res) {
//     // todo pull in passport integration
//     // passport.authenticate("local", { successRedirect: "/", failureRedirect: "/login", failureFlash: true });
// };
