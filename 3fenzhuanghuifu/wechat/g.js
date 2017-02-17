//g.js g是generator的简写  生成器函数 
// 验证微信的模块
'use strict'
var sha1 = require('sha1'); //微信使用的加密模块
var getRawBody = require('raw-body');
var Wechats = require('./wechats');
var util = require('./util');

module.exports = function(opts,handler){
	var Wechat = new Wechats(opts)
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
				var data = yield getRawBody(this.req,{ //解析微信post数据
					length:this.length,
					limit:'1mb',
					encoding:this.charset
				});
				var content = yield util.parseXMLAsync(data);//他的键值还是数组 需要进一步格式化
				//console.log(content)
				var message = yield util.formatMessage(content);
				console.log(message)
				this.weixin = message;
				yield handler.call(this,next)//改变上下文指向，把next当作参数传递给handler 把挂载的this weixin交还给业务层去处理
				// 之后执行下面执行真正的回复 外层的逻辑已经处理完毕了 解析怎么回复
				Wechat.reply.call(this);
			}
		};
}



