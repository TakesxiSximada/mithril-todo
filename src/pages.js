//
var m = require('mithril');
//model
var Page = {
	list: function() {
		return m.request({method: "GET", url: "/api/pages.json"});
	}
};

var Demo = {
	//controller
	controller: function() {
		var pages = Page.list();
		return {
			pages: pages,
			rotate: function() {
				pages().push(pages().shift());
			}
		};
	},
	view: function(ctrl) {
		return m("div", [
			ctrl.pages().map(function(page) {
				return m("a", {href: page.url}, page.title);
			}),
			m("button", {onclick: ctrl.rotate}, "Rotate links")
		])
	}
};

m.mount(document.getElementById("pages"), Demo);
