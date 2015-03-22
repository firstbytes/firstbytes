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
    this.lesson = ko.observable(data.lesson);
    this.instructions = ko.observable(data.instructions);
}
// function Editor(data) {
//     this.dirty = ko.observable(data.dirty);
//     this.source = ko.observable(data.source);
// }
