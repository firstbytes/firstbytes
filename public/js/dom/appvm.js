// The beginning of KO integration. Need to pull in the stuff from
// dom/editor.js, dom/komodels.js and dom/user.js
// requires moment.js, auth.js, repo.js
(function(g) {
    var L = {
        LAST_SAVED_AT: 'Saved ', // todo interpolation
        UNSAVED: 'Unsaved',
        DEFAULT_USERNAME_TEXT: 'Sign in to save your progress!',
        MUST_LOGIN: 'You must log in',
        MUST_LOGIN_SAVE: 'To save your progress, you\'ll need to create an account or log in in with an existing account.',
        MUST_LOGIN_PROJECTS: 'You must log in to view your projects',
        CANNOT_DELETE: 'Cannot delete this project',
        PROJECT_DELETED: 'Project deleted',
        UNABLE_TO_SAVE: 'Unable to be saved'
    };

    // ViewModel
    function AppViewModel() {
        var initSession, clearState, clearProjectState, modals, self, populateKnockout;

        self = this;

        self.session = ko.observable(null); // new Session({})
        self.user = ko.observable(null); //new User({email: "asdlfkjals"})
        self.projects = ko.observableArray([]); // don't bother making these actual "Project" instances
        self.lessons = ko.observableArray([]);
        // self.editor = ko.observable(new Editor({}));
        self.username = ko.computed(function() {
            return self.user() ? self.user().name() : L.DEFAULT_USERNAME_TEXT;
        });

        // state
        self.project = ko.observable(new Project({})); // the current project
        self.dirty = ko.observable(false);
        self.err = ko.observable(null);
        self.message = ko.observable(null);
        self.saveStatus = ko.observable('');
        self.lastSaved = ko.observable(null);

        self.showloading = ko.observable(true);

        self.authenticated = ko.computed(function() { return !!self.session(); }, this);
        self.unauthenticated = ko.computed(function() { return !self.session(); }, this);

        self.project.subscribe(function(value) {
            // clear save status when project changes
            self.saveStatus('');
            self.lastSaved(null);
        });

        // modals. these feel awkward here.
        modals = ['showlogin', 'showprojects', 'showlessons', 'showreference'];
        for (var i in modals) {
            self[modals[i]] = ko.observable(false);
        }
        // calculated based on whether or not we have one of our modals ready for displaying
        self.showmodal = ko.computed(function() {
            for (var i in modals) {
                if (self[modals[i]]()) return true;
            }
            return false;
        }, self);
        // hide all of our modals registered above ^
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
            clearProjectState();
        };
        clearProjectState = function() {
            self.project(new Project({}));
            self.message(null);
            self.err(null);
            self.dirty(false);
            self.saveStatus('');
            self.lastSaved(null);
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
            // todo warn if there are unsaved changes on the current project
            clearProjectState();
        };
        self.cscreenshot = function() {
            var stageCanvas = stage('#sandbox'); // blah coupling :-(
            stageCanvas.publishScreenshotIntent();
        };
        self.cshowprojects = function() {
            if (!self.authenticated()) {
                self.err(L.MUST_LOGIN_PROJECTS);
                return;
            }
            // fire off a request async - ideally have a loading state
            repo.fetchAll(self.user()._id(), self.session().token(), function(err, projects) {
                // force attributes
                self.projects(projects);
            });
            self.showprojects(true);
        };
        self.cprojectselect = function(project) {
            self.project(new Project(project));
            self.chidemodal();
        };
        self.cshowlessons = function() {
            // Only fetch the Intro lessons for now
            repo.fetchLessons('Intro', function(err, lessons) {
                self.lessons(lessons);
            });
            self.showlessons(true);
        };
        self.clessonselect = function(lesson) {
            self.project(new Project({
                name: lesson.name,
                source: lesson.source,
                lesson: lesson._id,
                instructions: marked(lesson.instructions), // convert to html
                userId: self.user()._id() // server side will validate
            }));
            self.chidemodal();
        };
        self.cshowreference = function() {
            self.showreference(true);
        };
        self.cdelete = function() {
            // todo launch a confirm box prior to delete
            if (!self.authenticated || !self.project() ||
                !self.project()._id() || !self.session() || !self.session().token()) {
                self.err(L.CANNOT_DELETE);
                return;
            }
            repo.delete(self.project()._id(), self.session().token(), function(err, response) {
                if (err) {
                    self.err(L.CANNOT_DELETE);
                    return;
                }
                self.message(L.PROJECT_DELETED);
                clearProjectState();
            });
        };
        self.cshare = function() {
            if (!self.project()) return;
            var id = self.project()._id();
            window.location.href = "/stage/" + id;
        };
        self.csave = function() {
            if (self.authenticated()) {
                // todo show some sort of saving network indicator
                self.project().userId(self.user()._id()); // make sure we're setting the user id on the project
                repo.save(self.user()._id(), self.session().token(), ko.toJS(self.project()), function(err, response) {
                    if (err) {
                        self.err(L.UNABLE_TO_SAVE);
                        return;
                    }
                    self.project(new Project(response));
                    self.lastSaved(new Date());
                    self.saveStatus(L.LAST_SAVED_AT + moment(self.lastSaved()).fromNow());
                    self.dirty(false);
                });
            } else {
                // todo update the message to mention they need to sign in or create an account
                // to save their progress
                self.err(L.MUST_LOGIN_SAVE);
                self.showlogin(true);
            }
        };
    }

    // Main View Model
    g.appvm = new AppViewModel();
    ko.applyBindings(g.appvm);
    $(function() {
        g.appvm.showloading(false);
    });

    // update save status (and potentially other things) on a regular basis
    setInterval(function() {
        var last = appvm.lastSaved();
        if (last) appvm.saveStatus(L.LAST_SAVED_AT + moment(last).fromNow());
    }, 30000);

    // Form View Model?
    // g.loginvm
    // ko.applyBindings(g.loginvm, document.getElementById("login"))
})(window);
