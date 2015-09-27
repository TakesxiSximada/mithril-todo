// -*- coding: utf-8 -*-
var m = require('mithril');

function mlog (value){
    console.log(value);
    return value;
};

var Status = {
    PENDING: 'PENDING',
    STARTED: 'STARTED',
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE',
    REVOKED: 'REVOKED',
};

var TODO_STORAGE_KEY = 'TODO-STORAGE-KEY-';
function Todo(data){
    this.id = m.prop(data.id);
    this.title = m.prop(data.title);
    this.description = m.prop(data.description);
    this.status = m.prop(data.status);
};
Todo.prototype.change_status = function (status){
    this.status(status);
}
Todo.prototype.pending = function (){ this.change_status(Status.PENDING) };
Todo.prototype.start = function (){ this.change_status(Status.STATERD) };
Todo.prototype.success = function (){ this.change_status(Status.SUCCESS) };
Todo.prototype.fail = function (){ this.change_status(Status.FAILURE) };
Todo.prototype.revoke = function (){ this.change_status(Status.REVOKED) };

Todo.get = function(id){
    var key = TODO_STORAGE_KEY + id;
    var serialized = window.localStorage.getItem(key);
    if (serialized){
        var data = JSON.parse(serialized);
        return new Todo(data);
    }else{
        mlog('todo not found: ' + id);
        return null;
    }
};

Todo.filter = function (condition){
    return Todo.all();
};
Todo.all = function (){
    var deferred = m.deferred();
    setTimeout(function (){
        var key = '';
        var todos = new TodoList();
        for(var ii=0; ii<window.localStorage.length; ii++){
            key = window.localStorage.key(ii);
            if (key.indexOf(TODO_STORAGE_KEY) == 0){
                todos.push(new Todo(JSON.parse(window.localStorage.getItem(key))));
            }
        };
        deferred.resolve(todos);
    }, 0);
    return deferred.promise;
};
Todo.prototype.count = function (){
    return Todo.all()
        .then(function (todos){
            return todos.length;
        });
};
Todo.prototype.numbering = function (){
    var self = this;
    if(this.id()){
        var deferred = m.deferred();
        return deferred.promise;
    }else{
        return this.count()
            .then(function (count){
                self.id(count + 1);  // numbering
            });
    }
};
Todo.prototype.save = function (){
    var self = this;
    return this.numbering()
        .then(function (){
            var data = {
                id: self.id(),
                title: self.title(),
                description: self.description(),
                status: self.status(),
            };
            window.localStorage.setItem(
                TODO_STORAGE_KEY + data.id,
                JSON.stringify(data)
            );
            return {
                'status': 'success',
                'todo': self,
            };
        });
};

var TodoList = Array;


var TodoListObservable = function (){
    var controllers = [];
    return {
        register: function (controller){
            return function (){
                var ctrl = new controller;
                ctrl.onunload = function (){
                    controllers.splice(controllers.indexOf(ctrl), 1);
                };
                controllers.push({instance: ctrl, controller: controller});
                return ctrl;
            };
        },
        trigger: function (){
            controllers.map(function (c, index){
                var ctrl = new c.controller();
                for(var ii in ctrl){
                    c.instance[ii] = ctrl[ii];
                }
            });
        },
    }
}.call();


function TodoListForm(){
    var self = this;
    self.todos = new TodoList();

    self.load = function (condition){
        m.startComputation();
        return Todo.filter(condition)
            .then(function(todos){
                self.todos.length = 0;
                self.todos.push.apply(self.todos, todos);
                m.endComputation();
            });
    };
};

function TodoForm(id) {
    var self = this;
    self.id = m.prop(id);

    self.title = m.prop('');
    self.description = m.prop('');
    self.status = m.prop('');

    self.message = m.prop('');

    // for cancel
    self.original_id = m.prop(self.id());
    self.original_title = m.prop(self.title());
    self.original_description = m.prop(self.description());
    self.original_status = m.prop(self.status());

    self.editable = m.prop(false);  // show or edit

    self.refresh = function (){
        var todo = Todo.get(self.id());
        if (todo){
            self.update(todo);
        }else{
            self.message('todo not found: ');
        }
    };

    self.update = function (todo){
        self.id(todo.id());
        self.title(todo.title());
        self.description(todo.description());
        self.status(todo.status());

        self.original_id(todo.id());
        self.original_title(todo.title());
        self.original_description(todo.description());
        self.original_status(todo.status());
    };

    self.load = self.update; // deprecated

    self.edit = function (){
        self.editable(true);
    };
    self.cancel = function (){
        self.id(self.original_id());
        self.title(self.original_title());
        self.description(self.original_description());
        self.status(self.original_status());
        self.editable(false);
    };
    self.save = function (){
        var todo = self.create_todo();
        self.editable(false);
        return todo.save().then(function (res){
            self.update(res.todo);
            console.log('save');
        });
    };
    self.create_todo = function (){
        return new Todo({
            id: self.id(),
            title: self.title(),
            description: self.description(),
            status: self.status(),
        });
    };
}


var TodoCreateComponent = {
    controller: function (){
        var form = new TodoForm();
        form.editable(true);
        return {
            form: m.prop(form),
            save: function (){
                form.save().then(function (){
                    m.route('/' + form.id());
                });
            },
            cancel: function (){
                m.route('/');
            },
        };
    },
    view: function (controller){
        var form = controller.form();
        return m('div', [
            m('div', form.id()),
            m('input', {value: form.title(), oninput: m.withAttr('value', form.title)}),
            m('input', {value: form.description(), oninput: m.withAttr('value', form.description)}),
            m('button', {onclick: controller.save}, 'save'),
            m('button', {onclick: controller.cancel}, 'cancel'),
        ]);
    },
};


var TodoComponent = {
    controller: function (){
        var id = m.route.param('id');
        var form = new TodoForm(id);
        form.refresh();
        return {
            form: m.prop(form),
            create: function (){ m.route('/new'); },
            list: function (){ m.route('/'); },
        };
    },
    view: function (controller){
        var form = controller.form();
        if (form.editable()){
            return m('div', [
                m('div', form.id()),
                m('input', {value: form.title(), oninput: m.withAttr('value', form.title)}),
                m('input', {value: form.description(), oninput: m.withAttr('value', form.description)}),
                m('button', {onclick: form.save}, 'save'),
                m('button', {onclick: form.cancel}, 'cancel'),
            ]);
        }else{
            return m('div', [
                m('button', {onclick: form.edit}, 'edit'),
                m('button', {onclick: controller.create}, 'new'),
                m('button', {onclick: controller.list}, 'list'),
                m('div', form.id()),
                m('div', form.title()),
                m('div', form.description()),
            ]);
        }
    },
}


var TodoListComponent = {
    controller: function (){
        var form = new TodoListForm();
        form.load();
        return {
            todos: Todo.all(),
            form: m.prop(form),
            create: function (){
                m.route('/new');
            },
        };
    },
    view: function (controller){
        var form = controller.form();
        return m('div', [
            m('button', {onclick: controller.create}, 'new'),
            m('ul', [
                form.todos.map(function (todo, index){
                    return m('li', [
                        m('label', [
                            m('input[type="checkbox"]'),
                        ]),
                        m('div', [
                            m('span', todo.status()),
                        ]),
                        m('div', [
                            m('a[href="/' + todo.id() + '"]', {config: m.route}, todo.title()),
                        ]),
                    ]);
                }),
            ]),
        ]);
    },
}

function cfactory (){
    TodoListComponent.controller();
    TodoListComponent.form().load();
    return TodoListComponent;
}

m.route.mode = 'hash';
m.route(document.body, '/', {
    '/': TodoListComponent,  // list
    '/new': TodoCreateComponent,  // create entry
    '/:id': TodoComponent,  // show and edit entry

});
