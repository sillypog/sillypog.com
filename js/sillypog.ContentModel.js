var sillypog = sillypog || {};
sillypog.ContentModel = (function($){
	'use strict';
	
	var instance;
	var contents;
	var index = 0;
	
	var ContentModel = function(){
		console.log('ContentModel: Constructor');
		instance = this;
		
		this.ready = false;
	}
	
	ContentModel.prototype.load = function(){
		console.log('ContentModel.loadContents');
		$.getJSON('json/contents.json', function(data){
			contents = data.articles;
			onContentsLoaded();
		});
	}
	
	ContentModel.prototype.next = function(n){
		return contents.slice(index,n);
		index+=n;
	}
	
	var onContentsLoaded = function onContentsLoaded(){
		// Dispatch event? // Resolve deferred?
		console.log('Contents loaded', contents);
		
		instance.ready = true;
		$(instance).trigger(sillypog.events.CONTENTS_LOADED);
	}
	
	// Export
	return ContentModel;
	
})(jQuery);