// editor.js
// todo require js, angular, and all the other goodies
// needs zepto/jquery, code
$(function() {
    var editor = ace.edit('editor');
    // editor.setTheme('ace/theme/monokai');
    editor.getSession().setMode('ace/mode/javascript');
    editor.setShowPrintMargin(false);

    editor.getSession().on('changeAnnotation', function(){
        var annotations = editor.getSession().getAnnotations();
        var code = editor.getValue();
        var errors = annotations.filter(function(annotation) {
            // 'error' || 'warning' || 'info'
            return (annotation.type === 'error');
        });

        // knockout bindings
        appvm.dirty(true);
        appvm.project().source(code);

        if (errors.length > 0) {
            appvm.err(errors.join(', '));
            return; // short circuit when there are errors
        }

        // Publish the code to the iframe
        var win = $('#sandbox').get(0).contentWindow;
        var l = window.location;
        var origin = l.protocol + '//' + l.host;
        win.postMessage(code, origin); // todo listen for errors coming back from iframe
    });

    appvm.projectObserver = ko.computed(function() {
        var ecode = editor.getValue();
        var pcode = appvm.project().source();
        if (ecode === pcode) return;
        editor.setValue(pcode);
    }, appvm);
});