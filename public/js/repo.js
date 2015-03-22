// // requires auth.js, jquery/zepto
// // todo requirejs, wire up knockout for source code changes
(function(g) {
    var L, repo;
    repo = {};
    L = {
        SAVE_ERROR: 'Whoops! Looks like we were not able to save your code. Bummer. Make sure you are online.',
        DATA_ERROR: 'Whoops! Looks like we were not able to save your code. Looks like we had trouble reading your program.',
        DELETE_ERROR: 'Whoops! Looks like we were not able to delete this project.',
        GET_PROJECTS_ERROR: 'Uh oh. We were not able to fetch your projects. Make sure you are online.',
        GET_USER_ERROR: 'Uh oh. We were not able to locate that student. Make sure you are online.'
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
    // @param {object} revision pojo representation of project
    // @param {function} callback (string err, object response)
    repo.saveRevision = function(user_id, token, revision, callback) {
        // if (typeof project === 'string') {
        //     project = JSON.parse(project);
        // }
        // if (typeof project !== 'object') {
        //     return callback(L.DATA_ERROR);
        // }
        if (!revision.projectId) {
            return callback(L.DATA_ERROR);
        }

        var conf = {
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            headers: {'token': token},
            data: JSON.stringify(revision),
            success: function(response, status, xhr) {
                callback(null, response);
            },
            error: function(xhr) {
                callback(L.SAVE_ERROR);
            }
        };

        $.ajax('/project/' + revision.projectId + '/revisions/', conf);
    };


    // @param {string} project_id
    // @param {string} token
    // @param {function} callback (string err, object response)
    repo.delete = function(project_id, token, callback) {
        var conf = {
            type: 'delete',
            dataType: 'json',
            contentType: 'application/json',
            headers: {'token': token},
            success: function(response, status, xhr) {
                callback(null, response);
            },
            error: function(xhr) {
                callback(L.DELETE_ERROR);
            }
        };

        $.ajax('/project/' + project_id + '/', conf);
    };

    // @param {string} userId
    // @param {string} token
    // @param {function} callback (string err, object projects)
    repo.fetchAll = function(userId, token, callback) {
        var url;
        url = '/user/' + userId + '/projects';
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


    // @param {string} id project id to fetch
    // @param {string} token [optional] token to optionally authenticate with
    // @param {function} callback (string err, object project)
    repo.fetchLesson = function(id, token, callback) {
        // todo dry with project
        if (typeof token === 'function' && typeof callback === 'undefined') {
            callback = token;
            token = undefined;
        }
        var url, conf;
        url = '/lesson/' + id + '/';
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
    repo.fetchLessons = function(category, callback) {
        var url;
        url = '/lessons/' + category;
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


    // @param {function} callback (string err, object lessons)
    repo.fetchStudent = function(id, token, callback) {
        var url;
        url = '/user/' + id;
        $.ajax(url, {
            type: 'get',
            dataType: 'json',
            headers: {'token': token},
            success: function(response, status, xhr) {
                callback(null, response);
            },
            error: function(xhr) {
                callback(L.GET_USER_ERROR);
            }
        });
    };

    g.repo = repo;
})(window);
