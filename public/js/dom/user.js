// requires appvm.js auth.js repo.js
// (function(g) {
//     $(function() {
//         var $auth, $projects, $error, promptAuthentication, launchProjects, logout;
//         var E_DEFAULT = 'Well this is awkward. Something went wrong!';
//         $auth = $('#login').easyModal();
//         $error = $auth.find('.error');
//         $projects = $('#projects').easyModal();
//         auth.bind('#login-form', function(err, message, response) {
//             if (err || !response) return $error.show().html(err);
//             auth.attachSession(response.user, response.token);
//             appvm.username(response.user.name); // todo move into appvm.user
//             appvm.user(response.user);
//             // populate projects
//             repo.fetchAll(response.user, token, function(err, projects) {
//                 if (err) return;
//                 appvm.userprojects(projects);
//             });
//             $auth.trigger('closeModal');
//         });
//         signup.bind('#signup-form', function(err, message, response) {
//             if (err || !response) return $error.show().html(err || E_DEFAULT);
//             auth.attachSession(response.user, response.token);
//             appvm.username(response.user.name);
//             $auth.trigger('closeModal');
//         });
//         $('#login-button').click(function() { promptAuthentication(); });
//         $('#logout-button').click(function() { logout(); });
//         $('#projects-button').click(function() { launchProjects(); });

//         promptAuthentication = function(msg) {
//             if (msg) $error.html(msg);
//             $auth.trigger('openModal');
//         };

//         launchProjects = function() {
//             $projects.trigger('openModal');
//             // repo.fetchAll(appvm.user(), token, function(err, projects) {
//             //     if (err) return;
//             //     appvm.userprojects(projects);
//             // });
//         };

//         logout = function() {
//             auth.logout();
//             // appvm.username(null);
//             // appvm.projectname(null);
//             // appvm.projectsource(null);
//             // appvm.projectdirty(false);
//         };

//         if (auth.isAuthenticated()) {
//             var sess = auth.getSession();
//             // appvm.username(sess.name);
//         }

//         g.userview = {
//             promptAuthentication: promptAuthentication
//         };
//     });
// })(window);
