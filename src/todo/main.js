// -*- coding: utf-8 -*-
var m = require('mithril');
var models = require('./models.js');
var viewmodels = require('msx-loader!./viewmodels.msx');
var views = require('msx-loader!./views.msx');
var observers = require('./observers.js');
var utils = require('./utils.js');



var TodoComponent = {
    controller: function (){
        return {};
    },
    view: views.todo_list,
};


var TodoListComponent = {
    controller: observers.Observable.register([utils.UPDATE_TODO], function (){
        var self = this;
        self.todos = m.prop(new models.TodoList());
        models.Todo.query.all().then(function (todos){
            self.todos().push.apply(self.todos(), todos);
        }).then(function (){
            console.log('redraw');
            m.redraw();
        });
    }),
    view: views.todo_list,
};


var TodoInputComponent = {
    controller: function (){
        console.log('A');
        return {
            vm: m.prop(new viewmodels.TodoInput()),
        };
    },
    view: views.todo_input,
};


m.route.mode = 'hash';
m.mount(document.getElementById('todo-wrap'), TodoListComponent);
m.mount(document.getElementById('todo-input'), TodoInputComponent);
