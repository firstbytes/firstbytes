// (function(g) {
//     var auth = {};

//     auth.bind = function(selector, callback) {
//         var $form, url, L;
//         L = {
//             ERROR: 'Uh... this is awkward. I don\'t seem to recognize you. Try to log in again.',
//             SUCCESS: 'Hey! Welcome back my friend!',
//         };
//         url = '/user/auth/';
//         $form = $(selector);
//         // form must have a username and password field
//         $form.submit(function() {
//             $.ajax(url, {
//                 type: 'post',
//                 dataType: 'json',
//                 data: $form.serialize(),
//                 success: function(response, status, xhr) {
//                     // todo pubsub this stuff?
//                     callback(null, L.SUCCESS, response);
//                 },
//                 error: function(xhr) {
//                     callback(L.ERROR);
//                 }
//             });
//             return false;
//         });
//         return $form;
//     };

//     auth.attachSession = function(user, token) {
//         // todo pubsub here?
//         localStorage['fb.user.email'] = user.email;
//         localStorage['fb.user.name'] = user.name;
//         localStorage['fb.user.id'] = user._id;
//         localStorage['fb.token'] = token;
//     };

//     auth.getSession = function() {
//         if (!localStorage['fb.user.email']) return false;
//         return {
//             email: localStorage['fb.user.email'],
//             name: localStorage['fb.user.name'],
//             id: localStorage['fb.user.id'],
//             token: localStorage['fb.token']
//         };
//     };

//     auth.logout = function() {
//         localStorage.clear();
//     };

//     auth.isAuthenticated = function() {
//         return !!localStorage['fb.user.id'] && !!localStorage['fb.token'];
//     };

//     g.auth = auth;
// })(window);
