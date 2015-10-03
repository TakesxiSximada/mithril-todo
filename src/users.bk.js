// -*- coding: utf-8 -*-
var m = require('mithril');


function mlog (value){
    console.log(value);
    return value;
};


function User(data){
    this.id = m.prop(data.id);
    this.name = m.prop(data.name);
};
User.prototype.save = function (){
    return m.request({
        url: '/api/user',
        method: 'POST',
    });
};
User.list = function (){
    return m.request({
        url: '/api/users.json',
        method: 'GET',
        type: User,
    });
};
User.search = function (pattern){
    return User.list()
        .then(mlog)
        .then(function (users){
            return users.filter(function (user){
                return user.name().indexOf(pattern) == -1 ? 0 : 1;
            });
        });
};
User.get = function (id){
    return User.list()
        .then(mlog)
        .then(function (users){
            return users.filter(function (user){
                return user.id() == id;
            });
        })
        .then(function (users){
            return users.shift();
        });
};
var UserList = Array;

var user_list_view_model = (function (){
    var vm = {};
    vm.init = function (){
        vm.list = new UserList();
        vm.name = m.prop('');
        vm.update_name = function (name){
            vm.name(name);
            vm.search();
        };
        vm.search = function (){
            User.search(vm.name())
                .then(mlog)
                .then(function (users){
                    vm.list.length = 0;
                    vm.list.push.apply(vm.list, users);
                });
        };
    };
    return vm;
})();


function UserViewModel(){
    this.id = m.prop('');
    this.name = m.prop('');
    this.editable = m.prop(false);
    this.message = m.prop('');
};
UserViewModel.prototype.update = function (user){
    // thisの差し替えが発生してうまく動かなそう
    // 仕方がないのでcontroller側にロジックを持っていく
    if(user){
        this.id(user.id());
        this.name(user.name());
    }else{
        console.log('no user...');
    }
};
UserViewModel.prototype.clear = function (user){
    this.id('');
    this.name('');
};
UserViewModel.prototype.edit_save_text = function (){
    return this.editable() ? 'save' : 'edit';
};
UserViewModel.prototype.cancel_new_text = function (){
    return this.editable() ? 'cancel' : 'new';
};


function UserController(){
    this.vm = new UserViewModel();
    this.load();
};
UserController.prototype.load = function (){
    var id = m.route.param('id');
    var vm = this.vm;
    return User.get(id).then(vm.update);
};
UserController.prototype.edit = function (){
    this.vm.editable(true);
};
UserController.prototype.save = function (){
    this.vm.editable(false);
    var user = new User(this.vm.id(), this.vm.name());
    user.save()
        .thien(this.refresh, this.vm.message);
};
UserController.prototype.cancel = function (){
    this.vm.editable(false);
    this.refresh();
};
UserController.prototype.new_ = function (){
    this.vm.editable(true);
    m.route('/add');
};
UserController.prototype.refresh = function (){
    m.route('/'+this.vm.id());
};

function user_view(controller){
    var vm = controller.vm;
    return m('div', [
        m('div', vm.id()),
        m('div', vm.user),
        vm.editable() ? m('input', {value: vm.name(), oninput: m.withAttr('value', user_view_model.name)}, user_view_model.name()) : m('div', vm.name()),
        m('button', {onclick: vm.editable() ? vm.save : controller.edit}, vm.edit_save_text()),
        m('button', {onclick: vm.editable() ? controller.cancel : controller.new_}, vm.cancel_new_text()),
        m('div', vm.message()),
    ]);
};

var show = {
    controller: UserController,
    view: user_view,
    view_: function (controller){
        var vm = controller.vm;
        return m('div', [
            m('div', 'A'),
            vm.editable() ? m('input', {value: vm.name(), oninput: m.withAttr('value', user_view_model.name)}, user_view_model.name()) : m('div', vm.name()),
            m('button', {onclick: vm.editable() ? vm.save : controller.edit}, vm.edit_save_text()),
            m('button', {onclick: vm.editable() ? controller.cancel : controller.new_}, vm.cancel_new_text()),
            m('div', vm.message()),
        ]);
    },
};

var list = {
    controller: function (){
        user_list_view_model.init();
        return {};
    },
    view: function (controller){
        return m('div', [
            m('input', {
                oninput: m.withAttr('value', user_list_view_model.update_name),
                value: user_list_view_model.name(),
            }),
            m('ul', [
                user_list_view_model.list.map(function (user, indx){
                    return m('li', [
                        m('a[href="/' + user.id() + '"]', {config: m.route}, user.name()),
                    ]);
                }),
            ])
        ]);
    },
};

var add = {
    controller: function (){
        return {};
    },
    view: function (controller){
        return m('div', 'add');
    },
};


var delete_ = {
    controller: function (){
        return {id: m.route.param('userID')};
    },
    view: function (controller){
        return m('div', 'delete');
    },
};
var error = {
    controller: function (){
        return {id: m.route.param('userID')};
    },
    view: function (controller){
        return m('div', 'error!!');
    },
};

// (list)
// create
// show
// update
// delete
m.route.mode = 'hash';
m.route(document.body, '/error', {
    '/': list,
    '/error': error,
    '/add': add,
    '/:id': {
        controller: UserController,
        view: user_view,
    },
    '/:id/delete': delete_,
});
