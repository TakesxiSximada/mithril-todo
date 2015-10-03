// -*- coding: utf-8 -*-
var m = require('mithril');
var views = require('msx-loader!./views/main.msx');

var TodoComponent = {
    controller: function (){
        return {};
    },
    view: views.todo,
};

m.route.mode = 'hash';
m.mount(document.getElementById('todo-wrap'), TodoComponent);
