// -*- coding: utf-8 -*-

function mlog (value){
    console.log(value);
    return value;
};

var m = require('mithril');
var dashboard = {
    controller: function (){
        return {id: m.route.param('userID')};
    },
    view: function (controller){
        return m('div', 'aaac');
    },
};


m.route.mode = 'hash';
m.route(document.body, '/dashboard/alice', {
    '/dashboard/:userID': dashboard,
});
