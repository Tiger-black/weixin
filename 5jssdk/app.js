'use strict'        // 入口文件
var Koa = require('koa');
var path = require('path');
var wechat = require('./wechat/g');
var util = require('./libs/util');

var ejs = require('ejs');
var heredoc = require('heredoc');

var wechat_file = path.join(__dirname,'./config/wechat.txt');
var config = {//对象字面量 config
	wechat:{
		appID:'wxeeea5baf5a71d6fb',
		appSecret:'9fb34bf24f72eb2563b9d102e9488ab6',
		token:'lixiaohuzhangjinya666',
		getAccessToken:function(){
			return util.readFileAsync(wechat_file,{encoding:'utf8',flag:'r'}) //return 一个 promise  获取票据
		},
		saveAccessToken:function(data){
			data = JSON.stringify(data);
			return util.writeFileAsync(wechat_file,data)// 更新票据
		}
	}
}
var app = new Koa();

var tpl = heredoc(function(){/*
	<!DOCTYPE html>
	<html lang="en">
	<head>
	    <meta charset="UTF-8">
	    <meta name="viewport"
	          content="width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1, user-scalable=no"/>
	          <meta name="baidu-site-verification" content="BjFMN40gIF" />
	    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
	    <meta name="format-detection" content="telephone=no"/>
	    <title>小黄人</title>
	</head>
	<body>
	<div style='color:red;font-size:40px'>哎嗨哎嗨哎嗨呦</div>
	<script type="text/javascript" src="http://www.css88.com/doc/zeptojs_api/zepto-docs.min.js"></script>
	<script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
	<script type="text/javascript">
		wx.config({
		    debug: true, // 开启调试模式
		    appId: '', // 必填，公众号的唯一标识
		    timestamp:'', // 必填，生成签名的时间戳
		    nonceStr: '', // 必填，生成签名的随机串
		    signature: '',// 必填，签名，见附录1
		    jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});
	</script>
	</body>
	</html>
*/})

app.use(function * (next){//路由
	if(this.url.indexOf('/tigger') > -1){
		this.body = ejs.render(tpl,{})
		return next;
	};
	yield next;
})
app.use(wechat(config.wechat));
app.listen(1234);
console.log('listening:1234');


