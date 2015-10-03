// -*- coding: utf-8 -*-
var m = require('mithril');
var todo = {};

//コードをシンプルにするために、このコンポーネントをモデルクラスの名前空間としても流用する

//Todoクラスは2つのプロパティを持つ
todo.Todo = function(data) {
    this.description = m.prop(data.description);
    this.done = m.prop(false);

};

//TodoListクラスはtodoの配列
todo.TodoList = Array;

//ビュー・モデルは表示されているTodoのリストを管理し、
//作成が完了する前のTodoの説明を格納したり、
//作成が可能かどうかを判定するロジックや、
//Todoが追加された後にテキスト入力をクリアする責務を持つ
todo.vm = (function() {
    var vm = {}
    vm.init = function() {
        //アクティブなToDoのリスト
        vm.list = new todo.TodoList();

        //新しいToDoを作成する前の、入力中のToDoの名前を保持するスロット
        vm.description = m.prop("");

        //ToDoをリストに登録し、ユーザが使いやすいようにdescriptionフィールドをクリアする
        vm.add = function() {
            if (vm.description()) {
                vm.list.push(new todo.Todo({description: vm.description()}));
                vm.description("");

            }

        };

    }
    return vm

}())

//コントローラは、モデルの中のどの部分が、現在のページと関連するのかを定義している
//この場合は１つのビュー・モデルですべてを取り仕切っている
todo.controller = function() {
    todo.vm.init()

}

//これがビュー
todo.view = function() {
    return m("html", [
        m("body", [
            m("input", {onchange: m.withAttr("value", todo.vm.description), value: todo.vm.description()}),
            m("button", {onclick: todo.vm.add}, "追加"),
            m("table", [
                todo.vm.list.map(function(task, index) {
                    return m("tr", [
                        m("td", [
                            m("input[type=checkbox]", {onclick: m.withAttr("checked", task.done), checked: task.done()})

                        ]),
                        m("td", {style: {textDecoration: task.done() ?"line-through" : "none"}}, task.description()),

                    ])

                })

            ])

        ])

    ]);

};

//アプリケーションの初期化
m.mount(document, {controller: todo.controller, view: todo.view});
