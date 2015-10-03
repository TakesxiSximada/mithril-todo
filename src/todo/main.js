// -*- coding: utf-8 -*-
var m = require('mithril');
var views = require('./compile_views/main.js');

var TodoComponent = {
    controller: function (){
        return {};
    },
    view: views.todo,
};

m.route.mode = 'hash';
m.mount(document.getElementById('todo-wrap'), TodoComponent);
