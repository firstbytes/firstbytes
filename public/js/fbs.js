// todo require.js
// requires processing, zepto js

// this is super basic and very naive about user input
// have a fair amount of clean up to do here, but "working"
$(function() {
    var canvas, $body, size = 500;
    window.kill = function() {}; // global hack for now
    canvas = $("#canvas").get(0);
    $body = $("body");

    $(window).on("message", function(msg) {
        var draw, canvas, code, $script, build;
        kill();
        code = msg.data;
        // super hacky check to decide how to build the source uri
        // should consider something like structeredjs for inspecting source code
        build = (code.indexOf('FB.draw') === -1) ? buildSrcSimple : buildSrc;
        code = build(msg.data);
        $("#canvas-script").remove();
        $script = $("<script></script>").attr("id", "canvas-script")
            .attr("src", code);
        $body.append($script);
    }, false);

    var buildSrcSimple = function(src) {
        // don't require defining draw/setup functions
        // think we always want to require the namespacing for now
        // this may change if we seek interoperability with KA sketches
        src = 'FB.draw = function() {' + src + '\n;};';
        return buildSrc(src);
    };
    var buildSrc = function(src) {
        src = 'var FB = new Processing(canvas, function(FB){' +
            '_fb_init(FB, ' + size + ');' +
            src + '\n;' +
        '}); kill = function(){FB.exit();}';
        return duri(src);
    };
    var duri = function(src) {
        return "data:text/javascript," + encodeURI(src);
    };
});
