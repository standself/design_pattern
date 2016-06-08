//模板引擎模块
F.module("lib/widget", function() {
	/***
	 *模板引擎 处理数据与编译模板入口
	 * @param str 模板容器id或者模板字符串
	 * @param data 渲染数据
	 ***/
	var _TplEngine = function(str, data) {
		//如果数据是数组
		if ( data instanceof Array ) {
			//缓存渲染模板结果
			var html = "",
				//数据索引
				i = 0,
				//数据长度
				len = data.length;
			//遍历数据
			for( ; i < len; i++ ) {
				html += _getTpl(str)(data[i]);
			}
			//返回模板渲染最终结果
			return html;
		} else {
			//返回模板渲染结果
			return _getTpl(str)(data);
		}
	},
	/***
	 *获取模板
	 * @param str 模板容器id，或者模板字符串
	 ***/
		_getTpl = function(str) {
			//获取元素
			var ele = document.getElementById(str);
			//如果元素存在
			if ( ele ) {
				//如果是input或者textarea表单元素，则获取该元素的value值，否则获取元素内容
				var html = /^(textarea|input)$/i.test(ele.nodeName) ? ele.value : ele.innerHTML;
				return _compileTpl(html);
			} else {
				//编译模板
				return _compileTpl(str);
			}
		},
	//处理模板 
		_dealTpl = function(str) {
			var _left = "{%", 			//左分隔符
				_right = "%}";			//右分隔符
			return String(str)
				//转义标签内的< 如：<div>{%if(a&lt;b)%}</div> -> <div>{%if(a<b)%}</div>
				.replace(/&lt;/g, "<")
				//转义标签内的>
				.replace(/&gt;/g, ">")
				//过滤回车符，制表符， 回车符
				.replace(/[\r\t\n]/g, "")
				//替换内容
				.replace(new RegExp(_left+"=(.*?)"+_right, "g"), "',typeof($1)=== 'undefined'?'': $1,'")
				//替换左分隔符
				.replace(new RegExp(_left, "g"), "');")
				//替换右分隔符
				.replace(new RegExp(_right, "g"), "template_array.push('");
		},
	//编译执行
		// @param str 模板数据
		_compileTpl = function(str) {
			/***fnBody:
				var template_array = [];
				var fn = (function(data){
					var template_key="";
					for(key in data) {
						template_key +=("var " + key + "=data[\"" + key + "\"];");
					}
					eval(template_key);//这里声明的变量在_dealTpl中有用到。
					template_array.push(_dealTpl(str));
					template_key = null;
				})(templateData);
				fn = null;
				return template_array.join("");
			***/
			//编译函数体,其中的eval(template_key)是为了实现template_key里面的关键字key被声明为变量时等于值。
				//比如 template_key = { key: "1111"} 是为了实现变量声明：var key = "1111";
			var fnBody = "var template_array=[];\nvar fn=(function(data){\nvar template_key='';\nfor(key in data) {\ntemplate_key+=('var '+key+'=data[\"'+key+'\"];');\n}\neval(template_key);\ntemplate_array.push('"+_dealTpl(str)+"');\nconsole.log(templateData);\ntemplate_key=null;\n}) (templateData);\nfn = null;\nreturn template_array.join('');";
			//编译函数
				//相当于function(templateData) { fnBody}
			return new Function("templateData", fnBody);
		};
	return _TplEngine;
})