// // requires auth.js, jquery/zepto
// // todo requirejs, wire up knockout for source code changes
(function(g) {
    var L, repo;
    repo = {};
    L = {
        SAVE_ERROR: 'Whoops! Looks like we were not able to save your code. Bummer. Make sure you are online.',
        GET_PROJECTS_ERROR: 'Uh oh. We were not able to fetch your projects. Make sure you are online.'
    };

    repo.save = function(user_id, token, project, callback) {
        // todo saving revisions and pushing updates
        // instead of just creating new projects
        console.log(JSON.stringify(project));
        $.ajax('/project/', {
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            headers: {'token': token},
            data: project,
            success: function(response, status, xhr) {
                callback(null, response);
            },
            error: function(xhr) {
                callback(L.SAVE_ERROR);
            }
        });
    };

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

    g.repo = repo;
})(window);
