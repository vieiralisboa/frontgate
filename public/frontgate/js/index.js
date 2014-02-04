//JavaScript

(function(){

    window.App = {
        Models: {},
        Views: {},
        Collections: {}
    };

    App.Models.Todo = Backbone.Model.extend({
        defaults: {
            id: null,
            title: "",
            done: 0
        }
    });

    App.Collections.Todos = Backbone.Collection.extend({
        model: App.Models.Todo,
        url: "/todos"
    });

    App.Views.Todo = Backbone.View.extend({
        tagName: "li",
        initialize: function(){
            this.model.on('destroy', this.remove, this);
        },
        render: function(){
            this.$el.html(this.model.get('title'));
            return this;
        }
    });

    App.Views.Todos = Backbone.View.extend({
        tagName: "ul",

        initialize: function(){
            this.collection.on('add', this.addOne, this);
        },

        render: function(){
            this.$el.empty();
            this.collection.each(this.addOne, this);
            return this;
        },

        addOne: function(todo){
            var todo = new App.Views.Todo({
                model: todo
            });

            this.$el.append(todo.render().el);

        }
    });
})();
