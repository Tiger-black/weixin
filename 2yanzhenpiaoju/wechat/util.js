'use strict'
var xml2js = require('xml2js');
var Promise = require('bluebird');

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

