var stage = function(selector) {
    // Publish the code to the iframe
    var win = $(selector).get(0).contentWindow;
    // if (!win) throw Error("Bad selector");
    return {
        publish: function(code) {
            var l = window.location;
            var origin = l.protocol + '//' + l.host;
            // todo clear up this try catch wrapper to be more useful
            // and especially for passing it back to the parent (out of iframe)
            // doesn't help with syntax errors...
            code = 'try{;' + code + '\n;}catch(e){console.log("Error!" + e);}';
            win.postMessage(code, origin);
            console.debug('Sending code: ' + code);
            // todo listen for errors coming back from iframe
        }
    };
};
