var sillypog = sillypog || {}; 
sillypog.Portfolio = (function($){
	'use strict';
	
	//----------
	// Private properties
	//----------
	var contents;
	
	//----------
	// Constructor
	//----------
	var Portfolio = function(){
		console.log('Portfolio: Constructor');
		
		loadContents();
	};
	
	//----------
	// Public methods
	//----------
	ViewManager.prototype.showArticle = function(showArticle){
	}
	
	//----------
	// Private methods
	//----------
	var loadContents = function loadContents(){
		$.getJSON('json/contents.json', function(data){
			console.log('Contents loaded', data);
			contents = data;
			onContentsLoaded();
		});
	}
	
	var onContentsLoaded = function onContentsLoaded(){
		// Dispatch event? // Resolve deferred?
	}
	
	// Export
	return Portfolio;
	
})(jQuery);