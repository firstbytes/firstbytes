// todo require.js
// processing, zepto js
$(function() {
    var canvas, $body;
    window.kill = function() {}; // global hack for now

    // todo attach p's own properties to window.
    // so that we intentionally add them to global space.
    canvas = $("#canvas").get(0);
    $body = $("body");

    $(window).on("message", function(msg) {
        var draw, canvas, code, $script;
        kill();
        code = "data:text/javascript," + encodeURI('var init = function(p){' + msg.data + '}; var processor = new Processing(canvas, init); kill = function(){console.log("Reseting");processor.exit();}');
        $("#canvas-script").remove();
        $script = $("<script></script>").attr("id", "canvas-script").attr("src", code);
        $body.append($script);
        // console.log("CHILD", msg.data, code);
    }, false);
});
