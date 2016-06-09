function MVC() {
	//初始化MVC对象
	var MVC = MVC || {};
	//初始化MVC数据模型层
	MVC.model = function() {
		//内部数据对象
		var M = {};
		M.data = {};
		M.conf = {};
		//返回数据模型层对象操作方法
		return {
			//获取服务器端数据
			getData: function(m) {
				//根据数据字段获取数据
				return M.data[m];
			},
			//获取配置数据
			getConf: function(c) {
				return M.conf[c];
			},
			//设置服务器端数据（通常将服务器端异步获取到的数据，更新该数据)
			setData: function(m, v) {
				M.data[m] = v;
				return this;
			},
			setConf: function(c, v) {
				M.conf[c] = v;
				return this;
			}
		}
	}();
	//初始化MVC视图层
	MVC.view = function() {
		//模型数据层对象操作方法引用
		var M = MVC.model;
		//内部视图创建方法对象
		var V = {};
		return {
			getView: function(v) {
				V[v] && V[v]();
			},
			setView: function(v, fn) {
				V[v] = fn;
			}
		}
	}();
	//初始化MVC控制器层
	MVC.ctrl = function() {
		//模型数据层对象操作方法引用
		var M = MVC.model;
		//视图数据层对象操作方法引用
		var V = MVC.view;
		//控制器创建方法对象
		var C = {
			//侧边导航栏模块
			initSlideBar: function() {
				V.getView("createSlidebar");
			}
		};
		C.initSlideBar();
	}();
	return MVC;
}
function formateString(str, data) {
	return str.replace(/{#(\w+)#}/g, function(match, key) {
		return typeof data[key] == "undefined" ? "" : data[key];
	})
}
var mvc = MVC();
var data = [
	{
		text: "萌妹子",
		icon: "left_meng.png",
		title: "喵耳萝莉的千本樱",
		content: "自古幼女有三好",
		img: "left_meng_img.png",
		href: "http://moe.hao123.com"
	},
	{
		text: "萌妹子",
		icon: "left_meng.png",
		title: "喵耳萝莉的千本樱",
		content: "自古幼女有三好",
		img: "left_meng_img.png",
		href: "http://moe.hao123.com"
	},
	{
		text: "萌妹子",
		icon: "left_meng.png",
		title: "喵耳萝莉的千本樱",
		content: "自古幼女有三好",
		img: "left_meng_img.png",
		href: "http://moe.hao123.com"
	}
];
mvc.model.setData("slidebar", data);
mvc.model.setConf("slideBarCloseAnimate", false);

//setView应该直接写在view里面的V对象里面，而非这样。才算是真正的view层。
mvc.view.setView("createSlidebar", function() {
	var html = "",
		data = mvc.model.getData("slidebar");
	if ( !data || !data.length ) return;
	var dom = document.createElement("div");
	dom.className = "slidebar";
	dom.id = "slidebar";
	var tpl = {
		container: [
			"<div class='slidebar-inner'><ul>{#content#}</ul></div>",
			"<a hidefocus href='#' class='slidebar-close' title='收起'/>"
		].join(""),
		item: [
			"<li>",
				"<a class='icon' href='{#href#}'>",
					"<img src='common/img/{#icon#}'>",
					"<span>{#text#}</span>",
				"</a>",
				"<div class='box'>",
					"<div>",
						"<a class='title' href='{#href#}'>{#title#}</a>",
						"<a href='{#href#}'>{#content#}</a>",
					"</div>",
					"<a class='image' href='{#href#}'><img src='common/img/{#img#}'/></a>",
				"</div>",
			"</li>"
		].join("")
	};
	for ( var i = 0, len = data.length; i < len; i++ ) {
		html += formateString(tpl.item, data[i]);
	}
	dom.innerHTML = formateString(tpl.container, {content: html});
	document.getElementsByTagName("body")[0].appendChild(dom);
});
//这里也是应该直接在ctrl层的C.initialSlideBar（）执行。
mvc.view.getView("createSlidebar");