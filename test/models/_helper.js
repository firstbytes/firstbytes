module.exports = function(server) {
    var wipedb = function(done) {
        if (server.app.get("env") !== "test") {
            console.warn("Environment must be test ", server.app.get("env"));
            done();
            return;
        }

        // have to go native here instead of use mongoose
        // http://stackoverflow.com/questions/10519432/how-to-do-raw-mongodb-operations-in-mongoose
        var mongo = require("mongodb").MongoClient;

        mongo.connect(server.app.get("data.mongo"), function(err, db) {
            var doneAndClose = function(err) {
                db.close();
                done(err);
            };
            if (err) {
                console.warn("Unable to drop database - Could not connect");
                doneAndClose(new Error("Unable to drop database - Could not connect"));
                return;
            }
            db.dropDatabase(function(err) {
                if (err) {
                    console.warn("Unable to drop database - ", err);
                    doneAndClose(err);
                    return;
                }
                doneAndClose();
            });
        });
    };

    var setup = function(done) {
        server.connect(); // need to explicitly connect if we aren't going to server.listen()
        done();
    };

    var teardown = function(done) {
        wipedb(function(err) {
            server.disconnect();
            done(err);
        });
    };

    return {
        wipedb: wipedb,
        setup: setup,
        teardown: teardown
    };
};
