// -*- coding: utf-8 -*-
var m = require('mithril');


function mlog (value){
    console.log(value);
    return value;
};

// error components
function UserErrorViewModel(){
    this.message = m.prop('no user...');
};
var UserErrorComponent = {
    controller: function (){
        return {
            vm: m.prop(new UserErrorViewModel()),
        };
    },
    view: function (controller){
        var vm = controller.vm();
        return m('div', vm.message());
    },
};

// user model
function User(data){
    this.id = m.prop(data.id);
    this.name = m.prop(data.name);
};
User.all = function (pattern){
    return m.request({
        url: './api/users.json',
        method: 'GET',
        data: {pattern: pattern},
        type: this,
    }).then(mlog);
};
User.filter = function (pattern){
    return this.all(pattern)
        .then(function (users){
            return users.filter(function (user){
                return user.name().indexOf(pattern) == -1 ? 0 : 1;
            });
        });
};
User.get = function (user_id){
    return this.all()
        .then(function (users){
            for (var ii=0; ii<users.length; ii++){
                if(users[ii].id() == user_id){
                    return users[ii];
                }
            }
            return null;
        }).then(mlog);
};
User.prototype.save = function (user_id){
    return m.request({
        url: './api/user',
        method: 'POST',
        data: [this],
    }).then(mlog);
};
var UserList = Array;


// show component
function UserShowViewModel(data){
    this.id = m.prop(null);
    this.name = m.prop(null);
    this.message = m.prop(null);
    this.editable = m.prop(false);
    this.lock();
    this.original = m.prop(null);
    if (data.user_id){
        this.update(data.user_id);
    }
};
UserShowViewModel.prototype.update = function (user_id, force){
    var original_user = this.original();
    var vm = this;
    var _refresh = function (user_){
        if(user_){
            vm.original(user_);
            vm.id(user_.id());
            vm.name(user_.name());
        }
    };
    if (!original_user || force){
        User.get(user_id).then(_refresh);
    } else {
        _refresh(original_user);
    }
};
UserShowViewModel.prototype.edit = function (){
    this.editable(true);
};
UserShowViewModel.prototype.lock = function (){
    this.editable(false);
};
UserShowViewModel.prototype.cancel = function (){
    this.lock();
    this.update();
};
UserShowViewModel.prototype.save = function (){
    this.lock();
    var user = new User({
        id: this.id(),
        name: this.name(),
    })
    user.save();
};

var UserShowComponent = {
    controller: function (){
        var user_id = m.route.param('user_id');
        var vm = m.prop(new UserShowViewModel({
                user_id: user_id,
        }));
        return {
            vm: vm,
            edit: function (){vm().edit()},
            lock: function (){vm().lock()},
            cancel: function (){vm().cancel()},
            save: function (){vm().save()},
            new_: function (){
                console.log('jump new create page.');
            },
        };
    },
    view: function (controller){
        var vm = controller.vm();
        if (vm.editable()){
            return m('div', [
                m('div', vm.id()),
                m('input', {value: vm.name(), oninput: m.withAttr('value', vm.name)}),
                m('div', vm.message()),
                m('button', {onclick: controller.save}, 'save'),
                m('button', {onclick: controller.cancel}, 'cancel'),
            ]);
        } else {
            return m('div', [
                m('div', vm.id()),
                m('div', vm.name()),
                m('div', vm.message()),
                m('button', {onclick: controller.edit}, 'edit'),
                m('button', {onclick: controller.new_}, 'new'),
            ]);
        }
    },
};



// user list component
function UserListViewModel(){
    var self = this;
    self.name = m.prop('DEFAULT');
    self.users = new UserList();
    self.load = function (pattern){
        User.filter(pattern)
            .then(function (users){
                self.users.length = 0;
                self.users.push.apply(self.users, users);
            });
    };
    self.refresh = function (value){
        self.name(value)
        self.load(value);
    };
}


var UserListComponent = {
    controller: function (){
        return {
            vm: m.prop(new UserListViewModel()),
        }
    },
    view: function (controller){
        var vm = controller.vm();
        return m('div', [
            m('input', {
                oninput: m.withAttr('value', vm.refresh),
                value: vm.name(),
            }),
            m('ul', [
                vm.users.map(function (user, index){
                    return m('li', [
                        m('a[href="/' + user.id() + '"]', {config: m.route}, user.name()),
                    ]);
                }),
            ]),
        ]);
    },
};


// routing
m.route.mode = 'hash';
m.route(document.body, '/', {
    '/error': UserErrorComponent,
    '/': UserListComponent,
    '/:user_id': UserShowComponent,
});
