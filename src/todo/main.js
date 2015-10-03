// -*- coding: utf-8 -*-
var m = require('mithril');
var views = require('./views/views.js');

var TodoComponent = {
    controller: function (){
    },
    view: function (){
        return m('p', 'todo名');
    },
};

m.route.mode = 'hash';
m.mount(document.getElementById('todo-wrap'), TodoComponent);
