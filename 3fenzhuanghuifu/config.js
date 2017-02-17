'use strict'
var path = require('path');
var util = require('./libs/util');
var wechat_file = path.join(__dirname,'./config/wechat.txt')
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
module.exports = config;