/**
 * Factory for CRUD model routes
 */

exports.get = function(model) {
    return function(req, res) {
        model.findOne({ _id: req.params.id }, function(err, instance) {
            if (err) return res.json(500, {"error": err});
            if (!instance) return res.json(404, {"error": "Who?"});
            res.json(instance);
        });
    };
};

exports.put = function(model, pre) {
    return function(req, res){
        model.findOne({ _id: req.params.id }, function(err, instance) {
            if (err) return res.json(500, {"error": err});
            if (!instance) return res.json(404, {"error": "Who?"});
            // todo validation, etc.
            model.schema.eachPath(function(path, details) {
                if (req.body[path] === undefined) return;
                instance[path] = req.body[path];
            });
            if (pre) pre(req, res, instance);
            instance.save(function (err) {
                if (err) return res.json(500, {"error": err});
                res.json(instance);
            });
        });
    };
};

exports.post = function(model, pre) {
    return function(req, res){
        // todo validation, etc.
        var instance = new model();
        model.schema.eachPath(function(path, details) {
            if (req.body[path] === undefined) return;
            instance[path] = req.body[path];
        });
        if (pre) pre(req, res, instance);
        instance.save(function (err) {
            if (err) return res.json(500, {"error": err});
            res.json(201, instance);
        });
    };
};

exports.delete = function(model) {
    return function(req, res){
        model.remove({ _id: req.params.id }, function(err) {
            if (err) return res.json(500, {"error": err});
            res.json({"success": 1});
        });
    };
};
