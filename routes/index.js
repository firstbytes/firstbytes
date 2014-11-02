
// GET /
exports.index = function(req, res){
  res.render("editor", { title: "First Bytes Society: Playground" });
};

// GET /canvas
// Part of the sandbox
exports.canvas = function(req, res){
  res.render("canvas");
};

// GET /login/ See user.js for other auth details
exports.login = function(req, res) {
    res.render("login");
};

// GET /setup/
exports.setup = function(req, res) {
    res.render("setup");
};