F.module("lib/dom", function() {
		return {
			//获取元素方法
			g: function(id) {
				return document.getElementById(id);
			},
			//获取或者设置元素的内容方法
			html: function(id, html) {
				console.log(id);
				if (html) {
					this.g(id).innerHTML = html;
				} else {
					return this.g(id).innerHTML;
				}
			}
		}
	});