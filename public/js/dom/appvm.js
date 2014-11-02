// The beginning of KO integration. Need to pull in the stuff from
// dom/editor.js and dom/user.js
(function(g) {
    var L = {
        LAST_SAVED_AT: "Saved at ", // todo interpolation
        UNSAVED: "Unsaved",
        DEFAULT_USERNAME_TEXT: "Annonymous",
        MUST_LOGIN: "You must log in",
        MUST_LOGIN_SAVE: "To save your progress, you'll need to create an account or log in in with an existing account.",
        MUST_LOGIN_PROJECTS: "You must log in to view your projects",
        UNABLE_TO_SAVE: "Unable to be saved"
    };

    // Observable Objects
    function Session(data) {
        this.token = ko.observable(data.token);
    }
    function User(data) {
        this._id = ko.observable(data._id);
        this.name = ko.observable(data.name);
        this.email = ko.observable(data.email);
        this.locale = ko.observable(data.locale);
    }
    function Project(data) {
        this._id = ko.observable(data._id);
        this.name = ko.observable(data.name);
        this.source = ko.observable(data.source);
        this.state = ko.observable(data.state);
        this.userId = ko.observable(data.userId);
        this.privacy = ko.observable(data.privacy);
    }
    // function Editor(data) {
    //     this.dirty = ko.observable(data.dirty);
    //     this.source = ko.observable(data.source);
    // }

    // ViewModel
    function AppViewModel() {
        var initSession, modals, self, populateKnockout;

        self = this;

        self.session = ko.observable(null); // new Session({})
        self.user = ko.observable(null); //new User({email: "asdlfkjals"})
        self.projects = ko.observableArray([]); // don't bother making these actual "Project" instances
        // self.editor = ko.observable(new Editor({}));
        self.username = ko.computed(function() {
            return self.user() ? self.user().name() : L.DEFAULT_USERNAME_TEXT;
        });

        // state
        self.project = ko.observable(new Project({})); // the current project
        self.dirty = ko.observable(false);
        self.err = ko.observable(null);
        self.message = ko.observable(null);
        self.saveStatus = ko.observable(L.UNSAVED);

        self.authenticated = ko.computed(function() { return !!self.session(); }, this);
        self.unauthenticated = ko.computed(function() { return !self.session(); }, this);

        // modals. these feel awkward here.
        modals = ['showlogin', 'showprojects'];
        for (var i in modals) {
            self[modals[i]] = ko.observable(false);
        }
        self.showmodal = ko.computed(function() {
            for (var i in modals) {
                if (self[modals[i]]()) return true;
            }
            return false;
        }, self);
        self.chidemodal = function() {
            for (var i in modals) {
                self[modals[i]](false);
            }
        };

        initSession = function(err, response, status) {
            if (err) return self.err(err);
            self.session(new Session({token: response.token}));
            self.user(new User(response.user));
            self.message(status);
            self.showlogin(false);
        };
        clearState = function() {
            self.session(null);
            self.user(null);
            self.projects([]);
            self.project(new Project({}));
            self.message(null);
            self.err(null);
            self.dirty(false);
            state.save();
        };
        populateKnockout = function(parsed) {
            if (parsed.session) self.session(new Session(parsed.session));
            if (parsed.user) self.user(new User(parsed.user));
            if (parsed.project) self.project(new Project(parsed.project));
            if (parsed.saveStatus) self.saveStatus(parsed.saveStatus);
        };
        g.populateKnockout = populateKnockout;


        // forms. should make their own model views?
        self.cformsignup = function(form) {
            var data = $(form).serialize();
            signup(data, initSession);
        };
        self.cformlogin = function(form) {
            var data = $(form).serialize();
            auth(data, initSession);
        };
        // apparently these methods don't need to be a member of the appvm
        // and can be put elsewhere. may want to consider doing that to keep appvm cleaner
        // and the code better organized/modularized
        self.cshowsignin = function() {
            self.showlogin(true);
        };
        self.csignout = function() {
            clearState();
        };
        self.cnewproject = function() {
            // todo create a new project but warn if there are unsaved changes
            self.project(new Project({}));
        };
        self.cshowprojects = function() {
            if (!self.authenticated()) {
                self.err(L.MUST_LOGIN_PROJECTS);
                return;
            }
            // fire off a request async - ideally have a loading state
            repo.fetchAll(self.user()._id(), self.session().token(), function(err, projects) {
                self.projects(projects);
            });
            self.showprojects(true);
        };
        self.cprojectselect = function(project) {
            self.project(new Project(project));
            self.chidemodal();
        };
        self.csave = function() {
            if (self.authenticated()) {
                repo.save(self.user()._id(), self.session().token(), ko.toJSON(self.project()), function(err, response) {
                    if (err) {
                        self.saveStatus = L.UNABLE_TO_SAVE;
                        return;
                    }
                    self.saveStatus = L.LAST_SAVED_AT + new Date();
                    self.dirty(false);
                });
            } else {
                // todo update the message to mention they need to sign in or create an account
                // to save their progress
                self.err(L.MUST_LOGIN_SAVE);
                self.showlogin(true);
            }
        };

        // // example of how to subscribe to observable updates... http://knockoutjs.com/documentation/observables.html
        // self.project().source.subscribe(function(value) {
        //     console.log("wut", value);
        // });
    }
    // Main View Model
    g.appvm = new AppViewModel();
    ko.applyBindings(g.appvm);

    // Form View Model?
    // g.loginvm
    // ko.applyBindings(g.loginvm, document.getElementById("login"))
})(window);
