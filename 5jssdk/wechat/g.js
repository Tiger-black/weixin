//g.js g是generator的简写  生成器函数 
// 验证微信的模块
'use strict'
var sha1 = require('sha1'); //微信使用的加密模块
var getRawBody = require('raw-body');
var Wechats = require('./wechats');
var util = require('./util');

module.exports = function(opts){
	//var Wechat = new Wechats(opts)
	return function *(next){
			var that = this;
			//console.log(this.query); 
			var token = opts.token;
			var signature = this.query.signature;
			var nonce = this.query.nonce;
			var timestamp = this.query.timestamp;
			var echostr = this.query.echostr;

			var str= [token, timestamp, nonce].sort().join('');
			var sha=sha1(str);
			if(this.method === 'GET'){
				if(sha == signature){//验证微信服务器 微信服务器发过来一个get请求
					this.body=echostr+'';
				}else{
					this.body='wrong';
				};
			}else if(this.method === 'POST'){//从post数据包里面拿用户的数据、事件。。需要验证 不一定post请求都是微信过来的也有可能有人测试你的代码
				if(sha != signature){//验证微信服务器 微信服务器发过来一个get请求
					this.body='wrong';
					return false;
				}
				var data = yield getRawBody(this.req,{//转换数据格式
					length:this.length,
					limit:'1mb',
					encoding:this.charset
				});
				var content = yield util.parseXMLAsync(data);//他的键值还是数组 需要进一步格式化
				//console.log(content)
				var message = yield util.formatMessage(content);
				console.log(message)
				if(message.MsgType === 'event'){//判断MsgType 如果是event说明是个事件
					if(message.Event === 'subscribe'){//判断一下是什么事件  关注事件或者。。。subscribe 关注 unsubscribe 取消关注
						var now = new Date().getTime();//时间戳
						that.status = 200;
						that.type = 'application/xml'
						that.body = '<xml>'+
									'<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'+
									'<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'+
									'<CreateTime>'+now+'</CreateTime>'+
									'<MsgType><![CDATA[text]]></MsgType>'+
									'<Content><![CDATA[欢迎来到我的酒馆]]></Content>'+
									'</xml>'

						console.log(that.body)
						return
					}
				}
			}
		};
}



