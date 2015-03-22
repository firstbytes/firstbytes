// todo require.js
// requires processing, zepto js

// this is super basic and very naive about user input
// have a fair amount of clean up to do here, but 'working'
$(function() {
    var canvas, $body, channels;
    var onCode, onScreenshot;
    window.kill = function() {}; // global hack for now
    canvas = $('#canvas').get(0);
    $body = $('body');

    onCode = function(msg, payload) {
        console.debug('Received: ' + msg.data);
        var draw, canvas, code, $script, build, request;
        kill();
        code = payload.code;
        code = duri(code);
        $('#canvas-script').remove();
        $script = $('<script></script>').attr('id', 'canvas-script')
            .attr('src', code);
        $body.append($script);
    };

    onScreenshot = function(msg, payload) {
        var data;
        console.debug('Screenshot Request Received: ' + msg.data);
        console.log(msg.source.saveScreenshot);
        data = getScreenshot();
        // msg.source.postMessage(data, msg.origin);
        msg.source.saveScreenshot(data); // hack because ^ wasn't cooperating
    };

    var duri = function(src) {
        return 'data:text/javascript,' + encodeURI(src);
    };
    var getScreenshot = function() {
        return canvas.toDataURL();
    };

    channels = {
        'code': onCode,
        'screenshot': onScreenshot
    };

    $(window).on('message', function(msg) {
        var payload;
        try {
            payload = JSON.parse(msg.data);
        } catch(e) {
            console.warn('Malformed request data');
            return;
        }
        if (!channels[payload.type]) return;
        channels[payload.type](msg, payload);
    }, false);
});
