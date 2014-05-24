(function(g) {
    // var signup = {};
    // signup.bind = function(selector, callback) {
    //     var $form, url, L;
    //     L = {
    //         ERROR: 'Looks like we have some problems creating your account. Make sure you fill out all required fields.',
    //         SUCCESS: 'Saved!',
    //     };
    //     url = '/user/';
    //     $form = $(selector);
    //     // form must have a name, email, password.
    //     // can have locale, joined, country, locality, region, postalCode.
    //     $form.submit(function() {
    //         $.ajax(url, {
    //             type: 'post',
    //             dataType: 'json',
    //             data: $form.serialize(),
    //             success: function(user, status, xhr) {
    //                 callback(null, L.SUCCESS, user);
    //             },
    //             error: function(xhr) {
    //                 callback(L.ERROR);
    //             }
    //         });
    //         return false;
    //     });
    //     return $form;
    // };

    var L = {
        SIGNUP_ERROR: 'Looks like we have some problems creating your account. Make sure you fill out all required fields.',
        SIGNUP_SUCCESS: 'Saved!',
        ERROR: 'Uh... this is awkward. I don\'t seem to recognize you. Try to log in again.',
        SUCCESS: 'Hey! Welcome back my friend!',
    };

    // can have locale, joined, country, locality, region, postalCode.
    g.signup = function(data, callback) {
        var url = '/user/';
        $.ajax(url, {
            type: 'post',
            dataType: 'json',
            data: data,
            success: function(response, status, xhr) {
                // response.user, response.token
                callback(null, response, L.SIGNUP_SUCCESS);
            },
            error: function(xhr) {
                callback(L.SIGNUP_ERROR);
            }
        });
    };

    // form must have a username and password field
    g.auth = function(data, callback) {
        var url = '/user/auth/';
        $.ajax(url, {
            type: 'post',
            dataType: 'json',
            data: data,
            success: function(response, status, xhr) {
                // response.user, response.token
                callback(null, response, L.SUCCESS);
            },
            error: function(xhr) {
                callback(L.ERROR);
            }
        });
    };
})(window);
