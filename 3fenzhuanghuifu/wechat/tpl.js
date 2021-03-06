//消息回复模版
'use strict'
var ejs = require('ejs');
var heredoc = require('heredoc');
var util = require('./util');
var tpl = heredoc(function(){/*
	<xml>
	<ToUserName><![CDATA[<%= FromUserName %>]]></ToUserName>
	<FromUserName><![CDATA[<%= ToUserName %>]]></FromUserName>
	<CreateTime><% createTime %></CreateTime>
	<MsgType><![CDATA[<%= msgType %>]]></MsgType>
	<% if(msgType == 'text') {%>
		<Content><![CDATA[< content >]]></Content>
	<% }else if(msgType == 'image'){ %>
		<Image>
			<MediaId><![CDATA[<%= content.media_id %>]]></MediaId>
		</Image>
	<% }else if(msgType == 'voice'){ %>
		<Voice>
			<MediaId><![CDATA[<%= content.media_id %>]]></MediaId>
		</Voice>
	<% }else if(msgType == 'video'){ %>
		<Video>
			<MediaId><![CDATA[<%= content.media_id %>]]></MediaId>
			<Title><![CDATA[<%= content.title %>]]></Title>
			<Description><![CDATA[<%= content.description %>]]></Description>
		</Video>
	<% }else if(msgType == 'video'){ %>
		<Music>
			<Title><![CDATA[<%= content.title %>]]></Title>
			<Description><![CDATA[<%= content.description %>]]></Description>
			<MusicUrl><![CDATA[<%= content.musicUrl %>]]></MusicUrl>
			<HQMusicUrl><![CDATA[<%= content.hqMusicUrl %>]]></HQMusicUrl>
			<ThumbMediaId><![CDATA[<%= content.thumbMediaId %>]]></ThumbMediaId>
		</Music>
	<% }else if(msgType == 'news'){ %>
		<ArticleCount><% content.length %></ArticleCount>
		<Articles>
			<% content.forEach(function(item){ %>
				<item>
					<Title><![CDATA[<%= item.title %>]]></Title> 
					<Description><![CDATA[<%= item.description %>]]></Description>
					<PicUrl><![CDATA[<%= item.picurl %>]]></PicUrl>
					<Url><![CDATA[<%= item.url %>]]></Url>
				</item>
			<% }) %>
		</Articles>
	<% } %>
	</xml>
*/})

var compiled = ejs.compile(tpl);
exports = module.exports = {
	compiled : compiled
}


