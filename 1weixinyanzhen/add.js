'use strict'
var Koa = require('koa'); //相当于exports
var sha1 = require('sha1'); 
var config = {
	wechat:{
		appID:'wx93e3acc42f096317',
		appSecret:'45ee9f71857f948ec89fb2304c2567a1',
		token:'lixiaohuzhangjinya666'
	}
}
var app = new Koa();
app.use(function *(next){
	console.log(this.query); 
	var token = config.wechat.token;
	var signature = this.query.signature;
	var nonce = this.query.nonce;
	var timestamp = this.query.timestamp;
	var echostr = this.query.echostr;

	var str= [token, timestamp, nonce].sort().join('');
	var sha=sha1(str);
	if(sha == signature){
		this.body=echostr+'';
	}else{
		this.body='wrong';
	};
});
app.listen(1234);
console.log('listening:1234');



