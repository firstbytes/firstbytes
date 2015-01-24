// // requires auth.js, jquery/zepto
// // todo requirejs, wire up knockout for source code changes
(function(g) {
    var L, repo;
    repo = {};
    L = {
        SAVE_ERROR: 'Whoops! Looks like we were not able to save your code. Bummer. Make sure you are online.',
        DATA_ERROR: 'Whoops! Looks like we were not able to save your code. Looks like we had trouble reading your program.',
        GET_PROJECTS_ERROR: 'Uh oh. We were not able to fetch your projects. Make sure you are online.'
    };

    // @param {string} user_id
    // @param {string} token
    // @param {object} project pojo representation of project
    // @param {function} callback (string err, object response)
    repo.save = function(user_id, token, project, callback) {
        if (typeof project === 'string') {
            project = JSON.parse(project);
        }
        if (typeof project !== 'object') {
            return callback(L.DATA_ERROR);
        }

        var conf = {
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            headers: {'token': token},
            data: JSON.stringify(project),
            success: function(response, status, xhr) {
                callback(null, response);
            },
            error: function(xhr) {
                callback(L.SAVE_ERROR);
            }
        };

        if (project._id) {
            conf.type = 'put';
            $.ajax('/project/' + project._id + '/', conf);
        } else {
            $.ajax('/project/', conf);
        }
    };

    // @param {string} user_id
    // @param {string} token
    // @param {function} callback (string err, object projects)
    repo.fetchAll = function(user_id, token, callback) {
        var url;
        url = '/user/' + user_id + '/projects';
        $.ajax(url, {
            type: 'get',
            dataType: 'json',
            headers: {'token': token},
            success: function(response, status, xhr) {
                callback(null, response);
            },
            error: function(xhr) {
                callback(L.GET_PROJECTS_ERROR);
            }
        });
    };

    // @param {string} id project id to fetch
    // @param {string} token [optional] token to optionally authenticate with
    // @param {function} callback (string err, object project)
    repo.fetchProject = function(id, token, callback) {
        if (typeof token === 'function' && typeof callback === 'undefined') {
            callback = token;
            token = undefined;
        }
        var url, conf;
        url = '/project/' + id + '/';
        conf = {
            type: 'get',
            dataType: 'json',
            success: function(response, status, xhr) {
                callback(null, response);
            },
            error: function(xhr) {
                callback(L.GET_PROJECTS_ERROR);
            }
        };
        if (token) conf.headers = {'token': token};
        $.ajax(url, conf);
    };

    // @param {function} callback (string err, object lessons)
    repo.fetchLessons = function(callback) {
        var url;
        url = '/lessons/Intro'; // sticking to default category for now "Intro", can switch this out in the future
        $.ajax(url, {
            type: 'get',
            dataType: 'json',
            // headers: {'token': token},
            success: function(response, status, xhr) {
                callback(null, response);
            },
            error: function(xhr) {
                callback(L.GET_PROJECTS_ERROR);
            }
        });
    };

    g.repo = repo;
})(window);
