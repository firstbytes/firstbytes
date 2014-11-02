// state.js
// local storage stuffs
// requires appvm
(function(g) {
    g.state = {};
    g.state.save = function() {
        // probably want to be a little more selective. for example, may want to remove
        // the projects list.
        var s = ko.toJSON(appvm);
        localStorage['fb.state'] = s;
    };

    if (localStorage['fb.state']) {
        var parsed = JSON.parse(localStorage['fb.state']);
        if (!parsed) return;
        populateKnockout(parsed);
    }

    // hack for now. ideally find a nice way to subscribe to all ko state changes.
    setInterval(function() {
        g.state.save();
    }, 2000);

})(window);
