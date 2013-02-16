// Create a namespace for templates
var sillypog = sillypog || {};
sillypog.templates = {};

sillypog.events = {
	OUTRO_COMPLETE : 'OutroComplete',
	CONTENTS_LOADED: 'ContentsLoaded'
};

(function($, templates){
	'use strict';
	
	console.log("Sillypog:*");
	
	var contentModel;
	var viewManager;
	
	/**
	* Document ready function
	*/
	$(function(){
		// Compile templates
		$('[type="text/x-jQuery-tmpl"]').compileTemplates(templates);
		
		contentModel = new sillypog.ContentModel();
		
		var pages = {
			'none'		: new sillypog.NoView(),
			'' 			: new sillypog.About($('#about')),
			'portfolio' : new sillypog.Portfolio($('#portfolio'), contentModel),
			'links'		: new sillypog.Links($('#links'), $('#contact')),
			'articles'	: new sillypog.Articles($('#articles'))
		};
		
		viewManager = new sillypog.ViewManager(pages);
		
		// Load contents
		$(contentModel).bind(sillypog.events.CONTENTS_LOADED, pages.portfolio.contentsLoaded);
		//$(contentModel).bind(sillypog.events.CONTENTS_LOADED, pages.articles.contentsLoaded);
		contentModel.load();
	});
	
	function contentsLoaded(e){
		console.log('contentsLoaded');
	}
	
}(jQuery, sillypog.templates));