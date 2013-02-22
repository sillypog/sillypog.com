// Create a namespace for templates
var sillypog = sillypog || {};
sillypog.templates = {};

sillypog.events = {
	OUTRO_COMPLETE : 'OutroComplete',
	CONTENTS_LOADED: 'ContentsLoaded'
};

(function($, templates){
	'use strict';
	
	// Avoid potential issues with console calls on IE
	if (!window.console) console = {log: function() {}}; 
	console.log("Sillypog:*");
	
	var contentModel;
	var viewManager;
	
	/**
	* Document ready function
	*/
	$(function(){
		// Compile templates
		$('[type="text/x-jQuery-tmpl"]').compileTemplates(templates);
		
		var pages = {
			none		: new sillypog.NoView(),
			'' 			: new sillypog.About($('#about')),
			portfolio 	: new sillypog.Portfolio($('#portfolio'), sillypog.ContentModel),
			links		: new sillypog.Links($('#links'), $('#contact')),
			articles	: new sillypog.Articles($('#articles'))
		};
		
		viewManager = new sillypog.ViewManager(pages);
		
		// Load contents
		$(window).bind(sillypog.events.CONTENTS_LOADED, pages.portfolio.contentsLoaded);
		sillypog.ContentModel.load();
	});
	
	function contentsLoaded(e){
		console.log('contentsLoaded');
	}
	
}(jQuery, sillypog.templates));