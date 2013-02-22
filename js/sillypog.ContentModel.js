var sillypog = sillypog || {};
sillypog.ContentModel = (function($){
	'use strict';
	
	var instance = this;
	var contents;
	var index = 0;
	var _ready = false;
	
	function ready(){
		return _ready;
	}
	
	function load(){
		console.log('ContentModel.load');
		$.getJSON('json/contents.json', function(data){
			contents = data.articles;
			onContentsLoaded();
		});
	}
	
	function next(n){
		return contents.slice(index,n);
		index+=n;
	}
	
	//----------
	// Private
	//----------
	
	function onContentsLoaded(){
		// Dispatch event? // Resolve deferred?
		console.log('Contents loaded', contents);
		
		_ready = true;
		$(window).trigger(sillypog.events.CONTENTS_LOADED);
	}
	
	// Export
	return {
		ready:ready,
		load:load,
		next:next
	};
	
})(jQuery);