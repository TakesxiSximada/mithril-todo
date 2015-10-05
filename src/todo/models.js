// -*- coding: utf-8 -*-
var m = require('mithril');


var TodoList = Array;


STORAGE_KEY = 'TODO-STORAGE-KEY-';

function Todo(data){
    this.id = m.prop();
    this.name = m.prop(data.name);
}

Todo.query = {

    _create: function (key){
        var serial = window.localStorage.getItem(key)
        var data = JSON.parse(serial);
        return new Todo(data);
    },
    all: function (){
        var self = this;
        var deferred = m.deferred();
        setTimeout(function (){
            var key = '';
            var todos = new TodoList();
            for (var ii=0; ii<window.localStorage.length; ii++){
                key = window.localStorage.key(ii);

                if (key.indexOf(STORAGE_KEY) == 0){
                    todos.push(self._create(key));
                }
            }
            deferred.resolve(todos);
        }, 0);
        return deferred.promise;
    },
    filter: function (){
    },
    order_by: function (){
    },
};
Todo.prototype._count = function (){
    return Todo.query.all()
        .then(function (todos){
            return todos.length;
        });
};
Todo.prototype._numbering = function (){
    var self = this;
    if (this.id()){
        var deferred = m.deferred();
        deferred.resolve(this.id());
        return deferred.promise;
    }else{
        return this._count()
            .then(function (count){
                self.id(count + 1);  // nummbering
            });
    }
};
Todo.prototype.save = function (){
    var self = this;
    return this._numbering()
        .then(function (){
            var data = {
                id: self.id(),
                name: self.name(),
            };
            window.localStorage.setItem(
                STORAGE_KEY + data.id,
                JSON.stringify(data)
            );
        });
};


module.exports.Todo = Todo;
module.exports.TodoList = TodoList;
