// -*- coding: utf-8 -*-
var m = require('mithril');
var todo = {};


// model
todo.Todo = function (data){
    this.description = m.prop(data.description);
    this.done = m.prop(false);
};


// model
todo.TodoList = Array;


// view-model
todo.vm = (function (){
    var vm = {};
    vm.init = function (){
        vm.list = new todo.TodoList();
        vm.description = m.prop('');
        vm.add = function (){
            var desc = vm.description();
            if (desc){
                var task = new todo.Todo({'description': desc});
                vm.list.push(task);
                console.log('added todo: ' + task.description());

                // clear
                vm.description('')
            }
        };
    };
    return vm;
}());

// controller
todo.controller = function (){
    todo.vm.init();
};

// view
todo.view = function (){
    return m('html', [
        m('body', [
            m('input', {
                onchange: m.withAttr('value', todo.vm.description),
                value: todo.vm.description()}),
            m('button', {onclick: todo.vm.add}, 'add'),
            m('table', [
                todo.vm.list.map(function (task, index){
                    return m('tr', [
                        m('td', [
                            m('input[type=checkbox]', {
                                onclick: m.withAttr('checked', task.done),
                                checked: task.done()
                            })
                        ]),
                        m('td', {
                            'style': {
                                textDecoration: task.done() ? 'line-through' : 'none',
                            }},
                          task.description()
                        )
                    ])
                })
            ])
        ])
    ]);
};

m.mount(document, {
    controller: todo.controller,
    view: todo.view
});
