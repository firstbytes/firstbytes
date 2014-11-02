var mongo = require('mongodb');
var server = require('../../services/server')();
var helper = require('./_helper')(server);

exports.setUp = helper.setup;
exports.tearDown = helper.teardown;

var Project = require('../../models/project');
var ProjectManager = require('../../services/project/manager');

var create = function() {
    return new Project({
        name: 'My new project',
        source: 'alert(\'hello\');',
        userId: 1,
        state: Project.STATE.WIP,
        privacy: Project.PRIVACY.PRIVATE
    });
};

exports.testProjectCreation = function(test) {
    test.expect(2);
    var p1 = create();
    p1.save(function(err, project) {
        test.ok(!err, err); //.message
        test.ok(project, 'Project was not created');
        test.done();
    });
};

exports.testAddRevision = function(test) {
    test.expect(2);

    var p1 = create();
    p1.save(function() {
        var pm = new ProjectManager();
        pm.saveRevision(p1, {}, function(err, revision) {
            test.ok(!err, err); //.message
            test.ok(revision.source === p1.source, 'Revision source does not match Product');
            test.done();
        });
    });
};
