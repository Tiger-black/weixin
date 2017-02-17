'use strict'
var fs = require('fs');
var Promise = require('bluebird');

exports.readFileAsync = function(fpath,encoding){ //读文件
	return new Promise(function(resolve,resject){
		fs.readFile(fpath,encoding,function(err,content){
			if(err)resject(err);
			else resolve(content);
		})
	})
}
exports.writeFileAsync = function(fpath,content){ //写文件
	return new Promise(function(resolve,resject){
		fs.writeFile(fpath,content,function(err,content){
			if(err)resject(err);
			else resolve();
		})
	})
}