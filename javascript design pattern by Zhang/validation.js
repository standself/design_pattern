function Validation(content) {
	this.content = content;
}
Validation.prototype = {
	email: function() {},
	password: function() {},
	length: function() {},
	username: function() {},
	phone: function() {}
};

var validateEmail = function(content) {
	Validation.call(this, content);
}
validateEmail.prototype = new Validation();
validateEmail.prototype.email = function() {
	var reg = new RegExp( /^\w+((-\w+)|(\.\w))*\@[a-zA-Z0-9]+((\.|-)[a-zA-Z0-9]+)*\.[a-zA-Z0-9]+$/);
	return reg.test(this.content.replace( /(^\s*)|(\s*$)|\r|\n/g , ""));
};

var email = new validateEmail("799@444.at");
console.log(email);