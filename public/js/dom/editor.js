// editor.js
// todo require js, angular, and all the other goodies
// needs zepto/jquery, code
$(function() {
    var editor = ace.edit('editor');
    // editor.setTheme('ace/theme/monokai');
    editor.getSession().setMode('ace/mode/javascript');
    editor.setShowPrintMargin(false);

    // editor.getSession().on('change', function(e) {
    // });

    editor.getSession().on('changeAnnotation', function(){
        var annotations = editor.getSession().getAnnotations();
        var errors = annotations.filter(function(annotation) {
            // 'error' || 'warning' || 'info'
            return (annotation.type === 'error');
        });
        if (errors.length > 0) return; // short circuit when there are errors
        var win = $('#sandbox').get(0).contentWindow;
        var code = editor.getValue();
        var l = window.location;
        var origin = l.protocol + '//' + l.host;
        // todo make more generic publish
        // repo.save(code, true); // auto save to local storage
        win.postMessage(code, origin); // todo listen for errors coming back from iframe

        // // ko
        appvm.dirty(true);
        appvm.project().source(code);
        // console.log(appvm.project(), appvm.project().source());
        // appvm.project(new Project({source: code}));
    });

    // clean up everything below and move out of here...
    // temp storage hack for now...
    // $('#save').click(function() {
    //     // todo move this out of here
    //     repo.save(editor.getValue());
    //     if (!auth.isAuthenticated()) {
    //         // todo cleanup this view* stuff
    //         userview.promptAuthentication('Save your progress! Log in or create an account.');
    //     } else {
    //         var sess = auth.getSession();
    //         var project = {
    //             userId: sess.id,
    //             source: editor.getValue(),
    //             // name: appvm.projectname()
    //         };
    //         repo.saveToRemote(project, sess.token, function(err) {
    //             if (err) {
    //                 // appvm.err('Unable to save project.');
    //                 return;
    //             }
    //             // appvm.projectdirty(false);
    //         });
    //     }
    // });
    // $('#revert').click(function() {
    //     // recover to the last explicitly saved state
    //     if (!localStorage['fb.source']) return;
    //     editor.setValue(repo.getLastSaved['fb.source']);
    // });
    // var $flash = $('<div />', {'css': {'position':'absolute', 'top': '0px', 'left': '0px', 'height': '100%', 'width': '100%', 'background':'#fff'}}).hide();
    // $('body').append($flash);
    // $('#screenshot').click(function() {
    //     $flash.show();
    //     $flash.fadeOut();
    // });

    // if (!!repo.getLastAutoSaved()) {
    //     // should move this or better yet get some two way binding going on
    //     editor.setValue(repo.getLastAutoSaved());
    // }
});