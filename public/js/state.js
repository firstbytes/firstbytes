// state.js
// local storage stuffs
// this will
(function(g) {
    // @param {object} vm instance of a knock out view model
    // @param {string} storageKey name of the key to use, defaults to fb.state
    // @param {function} restoreState (object) callback to call to populate knockout if there was previous data
    g.initStateListener = function(vm, storageKey, restoreState) {
        storageKey = storageKey || 'fb.state';
        g.state = {};
        g.state.save = function() {
            // probably want to be a little more selective. for example, may want to remove
            // the projects list.
            var s = ko.toJSON(vm);
            localStorage[storageKey] = s;
        };

        if (localStorage[storageKey]) {
            var parsed = JSON.parse(localStorage[storageKey]);
            if (!parsed) return;
            restoreState(parsed);
            console.log('Loaded previous state', parsed);
        }

        g.state.clear = function() {
            localStorage.clear();
        };

        // hack for now. ideally find a nice way to subscribe to all ko state changes.
        setInterval(function() {
            g.state.save();
            // console.log('Background save current state:', localStorage);
        }, 2000);

        // todo does this overwire any other hooks?
        window.onbeforeunload = function() {
            g.state.save();
        };
    };
})(window);
