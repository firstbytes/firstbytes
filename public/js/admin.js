// admin.js, requires state.js, adminvm.js, jquery, knock out
(function(g) {

    var L = {
        UNABLE_TO_GET_STUDENTS: 'Failed to pull the students :-(',
        ERROR: 'Uh... this is awkward. Something went wrong.',
    };

    // @param {function} callback (err string, students array)
    g.fetchStudents = function(token, callback) {
        var url = '/users/';
        $.ajax(url, {
            type: 'get',
            dataType: 'json',
            success: function(response, status, xhr) {
                if (xhr.status != 200) return callback(L.ERROR);
                callback(null, response);
            },
            error: function(xhr) {
                callback(L.ERROR);
            }
        });
    };

    g.fetchStudentDetails = function(userId, token, callback) {
        // todo add in check for open inquiries
        var url;
        url = '/user/' + userId + '/projects';
        $.ajax(url, {
            type: 'get',
            dataType: 'json',
            headers: {'token': token},
            success: function(response, status, xhr) {
                // if (status != '200') return callback(L.GET_PROJECTS_ERROR);
                callback(null, {
                    projects: response
                }); // nested to future proof for inquiries
            },
            error: function(xhr) {
                callback(L.GET_PROJECTS_ERROR);
            }
        });
    };

    g.initSession = function(err, response, status) {
        if (err) return self.err(err);
        self.session(new Session({token: response.token}));
        self.user(new User(response.user));
        self.message(status);
        self.showlogin(false);
    };

    g.clearSession = function() {
        self.session(null);
        self.user(null);
    };

})(window);

$(function() {
    // state saving
    initStateListener(adminvm, 'fb.state.admin', restoreSession);

    // todo only do this after logging in! todo add in token!
    fetchStudents('', function(err, students) {
        if (err) return adminvm.err(err);
        adminvm.students(students);
    });
});