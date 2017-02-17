'use strict'
var Promise = require('bluebird');
var request = Promise.promisify(require('request')); //对request 模块 Promise化

var prefix = 'https://api.weixin.qq.com/cgi-bin/'
var api = {
	accessToken:prefix + 'token?grant_type=client_credential'
}

function Wechats(opts){//管理和微信的一些接口和票据的更新
	//首先去拿老的票据 access——token  如果过期就拿一个新的  g.js 已经是中间件了它只处理和微信纯粹的交互而不应该干涉外部业务逻辑
	var that = this;
	this.appID = opts.appID;
	this.appSecret = opts.appSecret;
	this.getAccessToken = opts.getAccessToken;
	this.saveAccessToken = opts.saveAccessToken;
	this.getAccessToken() //我们实现的时候会把它实现成一个promise  就是 util.s 的读取文件方法 判断token值是否合法
		.then(function(data){//拿到了票据里面的信息
			try{ 
				data = JSON.parse(data);
			}
			catch(e){ //如果失败或者不合法 我们应该再去更新一下票据
				console.log(e)
				return that.updateAccessToken();//依然是一个promise 向下传递
			}
			if(that.isValidAccessToken(data)){//合法性的一个检查
				return Promise.resolve(data) //如果是合法的 通过Promise.resolve把data传递下去
			}else{// 如果是不合法 过期的 去更新
				return that.updateAccessToken();//依然是一个promise 向下传递
			}
		})
		.then(function(data){
			//console.log('111111111111')
			// console.log(data)
			that.access_token = data.access_token;
			that.expires_in = data.expires_in;
			that.saveAccessToken(data)//把这个票据存起来
		})
}
Wechats.prototype.isValidAccessToken = function(data){
	if(!data || !data.access_token || !data.expires_in){
		return false;
	}
	var access_token = data.access_token;
	var expires_in = data.expires_in;
	var now = (new Date().getTime());
	if(now < expires_in){ //过期时间比较当前时间
		return true;
	}else{
		return false;
	}
}
Wechats.prototype.updateAccessToken = function(data){ //更新的时候就去请求微信的服务器地址
	var appID = this.appID;
	var appSecret = this.appSecret;
	//var url = api.accessToken + '&appid=' + appID + '&Secret=' + appSecret ;
	var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appID + '&secret=' + appSecret ;
	return new Promise(function(resolve,reject){
		request({url:url,json:true}).then(function(response){// 向某一个服务器发起一个请求 从这个地址拿回服务器返回数据
			//console.log('__________________')
			var data = response.body;// 微信服务器返回数据
			var now = (new Date().getTime());
			var expires_in = now + (data.expires_in - 20) * 1000;
			data.expires_in = expires_in ;
			resolve(data)
		}) 
	})
}
module.exports = Wechats;