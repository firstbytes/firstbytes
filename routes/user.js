/**
 * API end points
 * /user/*
 */

var uuid = require('node-uuid');
var User = require('../models/user');
var Project = require('../models/project');
var auth = require('../services/auth/user-auth');
var modelRoute = require("../routes/_model");
var stats = require('../services/stats');

var createSession, L;

L = {
  NOPE: 'Not allowed',
};

// GET /users/
exports.allStudents = function(req, res) {
    // todo require auth
    stats.allStudents(function(err, students) {
        if (err) return res.status(400).json({'error': err});
        var data = students.map(function(s) { return s.toResponse(); });
        res.json(data);
    });
};

// GET /user/ID/projects/?page=N&start=M
exports.projects = function(req, res) {
  // don't check against user id in auth call because we'll allow admins access
  auth.getAndAssertUserFromRequest(req, false, function(err, user) {
    // console.log(req.params.id, err);
    if (err) return res.status(401).json({'error': err});
    if (req.params.id != user._id && user.acl !== 1)  {
      return res.status(401).json({'error': L.NOPE}); // allow admins
    }
    // console.log(req.params.id);
    Project.find({userId: req.params.id}, function(err, projects) {
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
  auth.getAndAssertUserFromRequest(req, req.params.id, function(err, user) {
    if (err) return res.status(400).json({'error': err});
    res.json({"token": req.get('token'), "user": user.toResponse()});
  });
};

createSession = function(req, user) {
  var token = uuid.v4();
  req.session.user = req.session[token] = user._id;
  return token;
};

// POST /user/login/ (unlike auth, returns a session cookie)
// exports.login = function(req, res) {
//     // todo pull in passport integration
//     // passport.authenticate("local", { successRedirect: "/", failureRedirect: "/login", failureFlash: true });
// };
