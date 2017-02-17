'use strict'        // 入口文件
var Koa = require('koa');
var path = require('path');
var wechat = require('./wechat/g');
var util = require('./libs/util');
var config = require('./config');
var winxin = require('./winxin');
var wechat_file = path.join(__dirname,'./config/wechat.txt')

var app = new Koa();
app.use(wechat(config.wechat,winxin.reply));
app.listen(1234);
console.log('listening:1234');


