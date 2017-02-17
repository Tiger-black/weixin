'use strict'
var xml2js = require('xml2js');
var Promise = require('bluebird');
var tpl = require('./tpl')

exports.parseXMLAsync = function(xml){//把xml数据转化
	return new Promise(function(resolve,resject){
		xml2js.parseString(xml,{trim:true},function(err,content){
			if(err) resject(err);
			else resolve(content);
		})
	})
}

function formatMessage(result){
	var message = {};

	if(typeof(result) === 'object'){
		// { xml: 
		//    { ToUserName: [ 'gh_072ea50e552f' ],
		//      FromUserName: [ 'oxUycxKTQqLink0cPMypIou2eVOA' ],
		//      CreateTime: [ '1481686435' ],
		//      MsgType: [ 'event' ],
		//      Event: [ 'subscribe' ],
		//      EventKey: [ '' ] } 
		//  }
		result = result.xml;//微信返回不一样了
		var keys = Object.keys(result);
		for(var i=0;i<keys.length;i++){
			var item = result[keys[i]];
			var key = keys[i];
			if(!(item instanceof Array) || item.length === 0){
				continue; //如果他不是一个数组 或者为空就跳出去
			}
			if(item.length === 1){
				var val = item[0];
				if(typeof(val) === 'object'){
					message[key] = formatMessage(val);
				}else{
					message[key] = (val || '').trim()
				}
			}else{
				message[key] = [];
				for(var j=0,k=item.length;j<k;j++){
					message[key].push(formatMessage(item[j]))
				}
			}
		}
	}
	return message;
}
exports.formatMessage = formatMessage;


exports.tpl=function(content,message){
	var info = {}    //零时存储回复的内容
	var type = 'text' //默认为text类型
	// console.log('---------------')
	// console.log(message);
	var FromUserName = message.FromUserName;
	var ToUserName = message.ToUserName;
	if(Array.isArray(content)){//如果是一个数组 那就是图文消息
		type = 'news'
	}
	type = content.type || type;
	info.content = content;
	info.createTime = new Date().getTime();
	info.ToUserName = FromUserName;
	info.FromUserName = ToUserName;
	console.log(info);
	return tpl.compiled(info);
}

