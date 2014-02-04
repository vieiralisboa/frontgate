//JavaScript

window.Apps = window.Apps || {};

Apps.App = {
    Models: {}
};

Apps.App.Models.Person = Backbone.Model.extend({});

var person = new Apps.App.Models.Person({
    name: "Joe Doe",
    gender: "male",
    birthDate: "1966-03-11",
    birthPlace: "USA"
});

console.log(person.toJSON());
