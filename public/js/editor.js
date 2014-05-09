// editor.js
// todo require js
// needs zepto
$(function() {
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");
    editor.setShowPrintMargin(false);

    // editor.getSession().on('change', function(e) {
    // });

    editor.getSession().on("changeAnnotation", function(){
        var ann = editor.getSession().getAnnotations();
        for (var key in ann) {
            // if (ann[key].type === "error" ) { // || "warning" || "info" (nothing is okay)
            console.log(ann[key].text); // bad things!
            return; // short circuit on error
        }
        console.log("Sending!");
        var win = $("#sandbox").get(0).contentWindow;
        var code = editor.getValue();
        var l = window.location;
        var origin = l.protocol + "//" + l.host;
        win.postMessage(code, origin);
    });
});