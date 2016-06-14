/***
 * A library v1.0.0
 * Author zhangrongming
 * Date: 2014-11-30
 ***/
 ~(function(window) {
 	/***
 	 * @name	框架单体对象A
 	 * @param	selector 	选择器或页面加载回调函数
 	 * @param 	context 	查找元素上下文
 	 ***/
 	var A = function(selector, context) {
 		//如果selector为方法则为窗口添加页面加载完成时间监听
 		if ( typeof selector == "function" ) {
 			A(window).on("load", selector);
 		} else {
 			//创建A对象
 			return new A.fn.init(selector, context);
 		}
  	}
 	//原型方法
 	A.fn = A.prototype = {
 		//强化构造函数
 		constructor: A,
 		//构造函数
 		init: function(selector, context) {
 			//modify选择器为元素
 			if ( typeof selector == "object" ) {
 				this[0] = selector;
 				this.length = 1;
 				return this;
 			};
 			//设置获取到的元素长度属性
 			this.length = 0;
 			context = document.getElementById(context) || document;
 			//如果是id选择器
 			if ( ~selector.indexOf("#") ) {
 				this[0] = document.getElementById(selector.slice(1));
 				this.length = 1;
 			//如果是类选择器
 			} else if ( ~selector.indexOf(".") ) {
 				var doms = [],
 					className = selector.slice(1);
 				//支持通过类获取元素的方法
 				if ( context.getElementsByClassName ) {
 					doms = context.getElementsByClassName(className);
 				} else {
 					doms = context.getElementsByTagName("*");
 				}
 				//设置获取到的元素
 				for ( var i = 0, len = doms.length; i < len; i++ ) {
 					if ( doms[i].className && !!~doms[i].className.indexOf(className) ) {
 						this[this.length] = doms[i];
 						//校正长度
 						this.length++;
 					}
 				}
 			//否则元素为名选择器
 			} else {
 				var doms = context.getElementsByTagName(selector),
 					i = 0,
 					len = doms.length;
 				for ( ; i < len; i++ ) {
 					this[i] = doms[i];
 				}
 				this.length = len;
 			}
 			//设置当前对象的选择上下文
 			this.context = context;
 			//设置当前对象的选择器
 			this.selector = selector;
 			return this;
 		},
 		//元素长度
 		length: 0,
 		//增强数组
 		push: [].push,
 		splice: [].splice
 	}
 	//设置构造函数原型
 	A.fn.init.prototype = A.fn;
 	/***
 	 * @name 	对象扩展	
 	 * @param[0] 	目标对象
 	 * @param[1, ...] 拓展对象
 	 ***/
 	A.extend = A.fn.extend = function() {
 		var i = 1,
 			len = arguments.length,
 			target = arguments[0],
 			j;
 		//如果一个参数，则为当前对象拓展方法
 		if ( i == len ) {
 			target = this;
 			i--;
 		}
 		//遍历拓展对象
 		for( ; i < len; i++ ) {
 			//遍历拓展对象中方法与属性
 			for ( j in arguments[i] ) {
 				//浅复制
 				target[j] = arguments[i][j];
 			}
 		}
 		//返回目标对象
 		return target;
 	};
 	//单体对象A方法拓展
 	A.extend({
 		/***
 		 * @name 	将横线式命名字符串转化为驼峰
 		 * eg: "test-demo" -> "testDemo"
 		 ***/
 		camelCase: function(str) {
 			return str.replace(/\-(\w)/g, function(match, letter) {
 				return letter.toUpperCase();
 			});
 		},
 		/***
 		 * @name 	去除字符串两端空白符
 		 * eg: " test  " -> "test"
 		 ***/
 		trim: function(str) {
 			return str.replace(/^\s+|\s+$/g, "");
 		},
 		/***
 		 * @name 	创建一个元素并包装成A对象
 		 * @param type 		元素类型
 		 * @param value 	元素属性对象
 		 ***/
 		create: function(type, value) {
 			var dom = document.createElement(type);
 			return A(dom).attr(value);
 		},
 		/***
 		 * 	@name 	格式化模板
 		 * @param str 	模板字符串
 		 * @param data 	渲染数据
 		 * eg: "<div>{#value#}</div>" + {value:"test"} -> "<div>test</div>"
 		 ***/
 		 formateString: function(str, data) {
 		 	var html = "";
 		 	if ( data instanceof Array ) {
 		 		for ( var i = 0, len = data.length; i < len; i++ ) {
 		 			html += arguments.callee(str, data[i]);
 		 		}
 		 		return html;
 		 	} else {
 		 		//搜索{#key#}格式字符串，并在data中查找对应的key属性替换
 		 		return str.relace(/\{#(\w+)#\}/g, function(match, key) {
 		 			return typeof data === "string" ? data : (typeof data[key] === "undefined" ? "" : data[key]);
 		 		})
 		 	}
 		 }
 	});
 	//事件绑定方法
 	var _on = (function() {
 		//如果标准浏览器
 		if ( document.addEventListener ) {
 			return function(dom, type, fn, data) {
 				dom.addEventListener(type, funciton(e) {
 					fn.call(dom, e, data);
 				}, false);
 			}
 		//如果是ie浏览器
 		} else if ( document.attachEvent ) {
 			return function(dom, type, fn, data) {
 				dom.attachEvent(type, function(e) {
 					fn.call(dom, e, data);
 				});
 			}
 		//如果是老版本浏览器
 		} else {
 			return function(dom, type, fn, data) {
 				dom["on" + type] = function(e) {
 					fn.call(dom, e, data);
 				};
 			}
 		}
 	})();
 	A.fn.extend({
 		//添加事件
 		on: function(type, fn, data) {
 			var i = this.length;
 			for(; --i >= 0;) {
 				//通过闭包实现对i变量保存
 				_on(this[i], type, fn, data);
 			}
 			return this;
 		},
 		//设置或者获取元素样式
 		css: function() {
 			var arg = arguments,
 				len = arg.length;
 			//如果无获取到的元素则返回
 			if ( this.length < 1 ) {
 				return this;
 			}
 			//如果是一个参数 
 			if ( len === 1 ) {
 				//如果参数是字符串则返回获取到的第一个元素的样式
 				if ( typeof arg[0] === "string" ) {
 					//ie浏览器
 					if ( this[0].currentStyle ) {
 						return this[0].currentStyle[name];
 					} else {
 						return getComputedStyle(this[0], false)[name];
 					}
 				//如果参数为对象则为获取到的所有元素设置 样式
 				} else if ( typeof arg[0] === "object" ) {
 					for ( var i in arg[0] ) {
 						for ( var j = this.length - 1; j >= 0; j-- ) {
 							this[j].style[A.camelCase(i)] = arg[0][i];
 						}
 					}
 				//如果两个参数
 				} else if ( len === 2 ) {
 					//为获取到的所有元素设置样式
 					for ( var j = this.length - 1; j >= 0; j-- ) {
 						this[j].style[A.camelCase(arg[0])] = arg[1];
 					}
 				}
 				return this;
 			}
 		},
 		//设置或者获取元素属性
 		attr: function() {
 			var arg = arguments,
 				len = arg.length;
 			if ( this.length < 1 ) return this;
 			//如果是一个参数 
 			if ( len === 1 ) {
 				//如果参数是字符串则返回获取到的第一个元素的属性值
 				if ( typeof arg[0] === "string" ) {
 					return this[0].getAttribute(arg[0]);
 				//如果参数为对象则为获取到的所有元素设置属性
 				} else if ( typeof arg[0] === "object" ) {
 					for ( var i in arg[0] ) {
 						for ( var j = this.length - 1; j >= 0; j-- ) {
 							this[j].setAttribute(arg[0], arg[1]);
 						}
 					}
 				}
 			//如果是两个参数
 			} else if ( len === 2 ) {
 				//为获取到的所有元素设置属性
 				for ( var j = this.length - 1; j >= 0; j-- ) {
 					this[j].setAttribute(arg[0], arg[1]);
 				}
 			}
 			return this;
 		},
 		//获取或者设置元素内容
 		html: function() {
 			var arg = arguments,
 				len = arg.length;
 			//如果无法获取到元素则返回
 			if ( this.length < 1 ) {
 				return this;
 			}
 			//如果无参数则返回获取到的第一个元素内容
 			if ( len === 0 ) {
 				return this[0].innerHTML;
 			// 如果是要给参数，则设置获取到的所有元素内容
 			} else if ( len === 1 ) {
 				for ( var i = this.length - 1; i >= 0; i-- ) {
 					this[i].innerHTML = arg[0];
 				}
 			//如果是两个参数，且第二个参数值为true，则为获取到的所有元素追加内容
 			} else if ( len === 2 && arg[1] ) {
 				for ( var i = this.length -1; i >= 0; i-- ) {
 					this[i].innerHTML += arg[0];
 				}
 			}
 			return this;
 		},
 		/***
 		 * @name 	判断类存在
 		 * @param 	val 	类名
 		 ***/
 		hasClass: function(val) {
 			//如果无获取到的元素则返回 
 			if ( !this[0] ) return;
 			//类名去除首尾空白符
 			var value = A.trim(val);
 			//如果获取到的第一个元素类名包含val则返回true，否则就返回false
 			return this[0].className && this[0].className.indexOf(value)>=0 ? true :false;
 		},
 		/***
 		 * @name 	 添加类
 		 * @param 	 val 	类名
 		 ***/
 		addClass: function(val) {
 		 	var value = A.trim(val),
 		 		str = "";
 		 	//遍历所有获取到的元素
 		 	for ( var i = 0, len = this.length; i < len; i++ ) {
 		 		str = this[i].className;
 		 		//如果元素类名包含添加类，则为元素添加类
 		 		if ( !~str.indexOf(value) ) {
 		 			this[i].className += " " + value;
 		 		}
 		 	}
 		 	return this;
 		 },
 		 /***
 		  * @name 移除类
 		  * @param 	val 类名
 		  ***/
 		removeClass: function(val) {
 		 	var value = A.trim(val),
 		 		classNameArr,			//将元素类名转化为数组
 		 		result;					//元素类名最终结果
 		 	//遍历所有获取到的值
 		 	for ( var i = 0, len = this.length; i < len; i++ ) {
 		 		if ( this[i].className && ~this[i].className.indexOf(value) ) {
 		 			//通过空格符将元素类名切割成数组
 		 			 classNameArr = this[i].className.split(" ");
 		 			result = "";
 		 			//遍历类名
 		 			for ( var j = classNameArr.length - 1; j >= 0; j-- ) {
 		 				classNameArr[j] = A.trim(classNameArr[j]);
 		 				//如果类名存在并且类名不等于移除类，就保留该类
 		 				result += classNameArr[j] && classNameArr[j] != value ? " " + classNameArr[j] : ""; 
 		 			}
 		 			//重置元素类名
 		 			this[i].className = result;
 		 		}
 		 	}
 		 	return this;
 		 },
 		 /***
 		  * @name 		插入元素
 		  * @param 	parent 	父元素
 		  ***/
 		 appendTo: function(parent) {
 		 	var doms = A(parent);
 		 	//如果获取到父元素
 		 	if ( doms.length ) {
 		 		//遍历父元素
 		 		for ( var j = this.length - 1; j >= 0; j-- ) {
 		 			//简化元素克隆（cloneNode操作，只想第一个父元素中插入子元素
 		 			doms[0].appendChild(this[j]);
 		 		}
 		 	}
 		 }
 	});
	//运动框架单体对象
 })