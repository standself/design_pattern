//定义一个event模块，保存在lib/event.js中
	F.module("lib/event", ["lib/dom"], function(dom) {
		var events = {
			on: function(id, type, fn) {
				dom.g(id)["on" + type] = fn;
			}
		}
		return events;
	});