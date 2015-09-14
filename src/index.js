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

var dashboard = {
    controller: function (){
        return {id: m.route.param('userID')};
    },
    view: function (controller){
        return m('a[href="/dashboard/alice"]', {config: m.route}, controller.id);
    },
};

var jumper = {
    controller: function (){
        m.route('/dashboard/alice');
    }
};


// m.route.mode は3種類
// - search (defaut): Query文字?を使用。IE8の場合はhistory.pushStateのサポートがないため、ページリフレッシュが発生する
// - hash: ページリフレッシュが発生しない。名前付きアンカー(/aaa#top)がつかえない。
// - pathname: 特別な文字を含まないURLのみ使用可。このモードでブックマークとページリフレッシュをサポートするためには、サーバ側にも手を加える必要があり。IE8の場合はhistory.pushStateのサポートがないため、ページリフレッシュが発生する
m.route.mode = 'hash';

m.route(document.body, '/dashboard/alice', {
    '/jump': jumper,
    '/dashboard/:userID': dashboard,
});

// routing
// - サポートしている内容
//   - routeのリスト定義
//   - source codeによるroute間のリダイレクト
//   - テンプレート内でリンクを作ると、透過的であまり主張しないリンクが作成できる
// - 必要な項目
//   - HOSTとなるDOM要素
//   - デフォルトのroute
//   - 遷移する可能性のあるroute
//   - 遷移する可能性のあるrouteをレンダリングするモジュールのkey/value map
//
// m.mount(document, {
//     controller: todo.controller,
//     view: todo.view
// });
