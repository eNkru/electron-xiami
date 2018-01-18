(function(root, factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		// AMD support.
		define([], factory);
	} else if (typeof exports === 'object') {
		// NodeJS support.
		module.exports = factory();
	} else {
		// Browser global support.
		root.Lyrics = factory();
	}
}(this, function() {
	'use strict';
	var Lyrics = function(text_lrc){
		/* Private */
		var _proto = Lyrics.prototype;
		var timestamp_offset = 0;
		var lyrics_all = undefined;
		var meta_info = undefined;
		var setTimestampOffset = function(offset){
			timestamp_offset = isNaN(offset) ? 0 : Number(offset) / 1000;
			return Number(offset);
		}
		var isEmpty = function(obj) {
			for(var prop in obj) {
				if(obj.hasOwnProperty(prop)) {
					return false;
				}
			}
			return true;
		}
		var ID_TAGS = [
			{name:'artist',id:'ar'},
			{name:'album',id:'al'},
			{name:'title',id:'ti'},
			{name:'author',id:'au'},
			{name:'length',id:'length'},
			{name:'by',id:'by'},
			{name:'offset',id:'offset', handler:setTimestampOffset},
			{name:'createdBy',id:'re'},
			{name:'createdByVersion',id:'ve'},
		];

		_proto.load = function(text_lrc){
			lyrics_all = new Array();
			meta_info = new Object();
			timestamp_offset = 0;

			var lines_all = String(text_lrc).split('\n');
			for (var i = 0; i < lines_all.length; i++) {
				var line = lines_all[i].replace(/(^\s*)|(\s*$)/g,'');
				if (!line) {
					continue;
				}

				//Parse ID Tags
				var is_id_tag = false;
				for (var j = 0; j < ID_TAGS.length; j++) {
					var match = ID_TAGS[j].re.exec(line);
					if (!match || match.length < 2) {
						continue;
					}

					is_id_tag = true;
					var value = match[1].replace(/(^\s*)|(\s*$)/g,'');
					if (typeof ID_TAGS[j].handler == 'function') {
						meta_info[String(ID_TAGS[j].name)] = ID_TAGS[j].handler.call(this, value);
					} else {
						meta_info[String(ID_TAGS[j].name)] = String(value);
					}
				}
				if (is_id_tag) {
					continue;
				}

				//Parse lyric
				var timestamp_all = Array();
				while (true) {
					var match = /^(\[\d+:\d+(.\d+)?\])(.*)/g.exec(line);
					if (match) {
						timestamp_all.push(match[1]);
						line = match[match.length-1].replace(/(^\s*)|(\s*$)/g,'');
					} else {
						break;
					}
				}
				for (var j = 0; j < timestamp_all.length; j++) {
					var ts_match = /^\[(\d{1,2}):(\d|[0-5]\d)(\.(\d+))?\]$/g.exec(timestamp_all[j]);
					if (ts_match) {
						lyrics_all.push({
							timestamp:Number(ts_match[1])*60 + Number(ts_match[2]) + (ts_match[4] ? Number('0.'+ts_match[4]) : 0),
							text:line
						});
					}
				}
			}

			lyrics_all.sort(function(a,b){
				return (a.timestamp > b.timestamp ? 1 : -1);
			});
			if (!lyrics_all.length) {
				lyrics_all = undefined;
			}
			if (isEmpty(meta_info)) {
				meta_info = undefined;
			}
			return (lyrics_all !== undefined || meta_info !== undefined) ? true : false;
		}

		/* Public */
		_proto.getLyrics = function(){
			return lyrics_all;
		}
		_proto.getLyric = function(idx){
			try{
				return lyrics_all[idx];
			}catch(e){
				return undefined;
			}
		}
		_proto.getIDTags = function(){
			return meta_info;
		}
		_proto.select = function(ts){
			if (isNaN(ts)) {
				return -1;
			}
			var timestamp = Number(ts) + timestamp_offset + 0.95;
			var i = 0;
			if (timestamp < lyrics_all[0].timestamp) {
				return -1;
			}
			for (i = 0; i < (lyrics_all.length - 1); i++) {
				if (lyrics_all[i].timestamp <= timestamp
					&& lyrics_all[i+1].timestamp > timestamp) {
					break;
				}
			}
			return i;
		}

		/* Initialization */
		for (var i = 0; i < ID_TAGS.length; i++) {
			ID_TAGS[i].re = new RegExp('\\['+ID_TAGS[i].id+':(.*)\\]$', 'g');
		}
		if (text_lrc) {
			this.load(text_lrc);
		}
	}
	return Lyrics;
}));
