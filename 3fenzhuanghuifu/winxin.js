// '用来做回复的'
'use strict'
exports.reply = function * (next){
	var message = this.weixin;
	if(message.MsgType === 'event'){//事件推送
		if(message.Event === 'subscribe'){//订阅事件
			if(message.EventKey){//判断途径
				console.log('二维码来滴'+message.EventKey+''+message.ticket)
			}
			this.body='欢迎来到我的酒馆\r\n'+'消息ID：'+message.msgId
		}else if(message.Event === 'unsubscribe'){//取消订阅事件
			console.log('无情取消关注');
			this.body='';
		}
	}else{

	}
	yield next;
}