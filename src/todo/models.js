// -*- coding: utf-8 -*-
var m = require('mithril');


function Todo(data){
    this.name = m.prop(data.name);
}


var TodoList = Array;


module.exports.Todo = Todo;
module.exports.TodoList = TodoList;
