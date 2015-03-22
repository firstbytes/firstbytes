
// GET /
exports.index = function(req, res){
  res.render("editor", { title: "First Bytes Society: Playground" });
};

// GET /canvas
// Part of the sandbox
exports.canvas = function(req, res){
  res.render("canvas");
};

// GET /stage/ID/
exports.stage = function(req, res) {
    res.render("stage", { id: req.params.id });
};