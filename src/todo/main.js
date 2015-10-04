// -*- coding: utf-8 -*-
var m = require('mithril');
var models = require('./models.js');
var views = require('msx-loader!./views.msx');


var TodoComponent = {
    controller: function (){
        return {};
    },
    view: views.todo_list,
};


var todos = new models.TodoList()
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));
todos.push(new models.Todo({name: 'gera'}));

var TodoListComponent = {
    controller: function (){
        return {todos: todos};
    },
    view: views.todo_list,
};

m.route.mode = 'hash';
m.mount(document.getElementById('todo-wrap'), TodoListComponent);
