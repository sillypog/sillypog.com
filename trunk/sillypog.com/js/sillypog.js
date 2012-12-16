// Create a namespace for templates
var sillypog = sillypog || {};
sillypog.templates = {};

sillypog.events = {
	OUTRO_COMPLETE : 'OutroComplete'
};

(function($, templates){
	'use strict';
	
	console.log("Sillypog:*");
	
	var viewManager;
	var portfolio;
	var links;
	
	/**
	* Document ready function
	*/
	$(function(){
		// Compile templates
		$('[type="text/x-jQuery-tmpl"]').compileTemplates(templates);
		
		var pages = {
			'none'		: new sillypog.NoView(),
			'' 			: new sillypog.About($('#about')),
			'portfolio' : new sillypog.Portfolio($('#portfolio')),
			'links'		: new sillypog.Links($('#links'), $('#contact'))
		};
		
		viewManager = new sillypog.ViewManager(pages);
	});
	
}(jQuery, sillypog.templates));