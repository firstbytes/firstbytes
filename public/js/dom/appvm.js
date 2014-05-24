// The beginning of KO integration. Need to pull in the stuff from
// dom/editor.js and dom/user.js
(function(g) {
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
    function Editor(data) {
        this.dirty = ko.observable(data.dirty);
        this.source = ko.observable(data.source);
    }

    // to subscribe to observable updates... http://knockoutjs.com/documentation/observables.html
    // myViewModel.personName.subscribe(function(newValue) {
    //     alert("The person's new name is " + newValue);
    // });

    // ViewModel
    function AppViewModel() {
        var initSession, modals, self;

        self = this;

        self.session = ko.observable(null); // new Session({})
        self.user = ko.observable(null); //new User({email: "asdlfkjals"})
        self.projects = ko.observableArray([]);
        self.editor = ko.observable(new Editor({}));

        // state
        self.project = ko.observable(new Project({})); // the current project
        self.dirty = ko.observable(false); //
        self.err = ko.observable(null);
        self.message = ko.observable(null);

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

        // forms. should make their own model views.
        self.cformlogin = self.cformsignup = function(form) {
            var data = $(form).serialize();
            signup(data, initSession);
        };

        initSession = function(err, response, status) {
            if (err) {
                self.err(err);
                return;
            }
            self.session(new Session({token: response.token}));
            self.user(new User(response.user));
            self.message(status);
            self.showlogin(false);
        };

        self.authenticated = ko.computed(function() {
            return !!self.session(); //.token();
        }, this);
        self.unauthenticated = ko.computed(function() {
            return !self.session(); //.token();
        }, this);

        self.cshowsignin = function() {
            self.showlogin(true);
        };
        self.csignout = function() {
            self.session(null);
            self.user(null);
        };
        self.cshowprojects = function() {
            self.showprojects(true);
        };
        self.csave = function() {
            if (self.authenticated()) {
                repo.save(self.user(), self.session().token(), ko.toJSON(self.project()), function(err, response) {
                    console.log(err, response);
                });
                // save the program
            } else {
                self.showlogin(true);
            }
        };

        // sign up form

    }
    // Main View Model
    g.appvm = new AppViewModel();
    ko.applyBindings(g.appvm);

    // Form View Model?
    // g.loginvm
    // ko.applyBindings(g.loginvm, document.getElementById("login"))
})(window);
