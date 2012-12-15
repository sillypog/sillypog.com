var sillypog = sillypog || {}; 
sillypog.Links = (function($){
	'use strict';
	
	//----------
	// Private properties
	//----------
	var instance;	// Allow private properties to call public methods
	
	var stage;	// jQuery object of the DOM element
	var contact;
	
	var baseText; 
	
	//----------
	// Constructor
	//----------
	var Links = function($stage, $contact){
		console.log('Links: Constructor');
		
		instance = this;
		
		stage = $stage;
		contact = $contact;
		
		baseText = $contact.text();
	};
	
	//----------
	// Public methods
	//----------
	Links.prototype.show = function(){
		stage.removeClass('hidden');
		
		// Wrap templates around the links in the list
		applyTemplates();
		
		// Change the text of the contact element when we mouse over
		$('a', stage).on('mouseenter', showHighlightText);
		$('a', stage).on('mouseleave', showBaseText);
	}
	
	Links.prototype.intro = function(params){
		this.show();	// No animation yet
	}
	
	Links.prototype.outro = function(){
	}
	
	//----------
	// Private methods
	//----------
	function applyTemplates(){
		$('#linksList a', stage).each(function(){
			var a = $(this);
			var properties = {	icon:a.attr('id'),
								url:a.attr('href')};
			$.tmpl(sillypog.templates.LINK_TEMPLATE, properties).appendTo(a);
		});
	}
	
	function showHighlightText(e){
		//console.log('showHighlightText',e,this);
		var linkText = $(this).attr('href');
		var linkParts = linkText.split(':'); 
		linkText = linkParts.length > 1 ? linkParts[1] : linkText;
		linkParts = linkText.split('//');
		linkText = linkParts.length > 1 ? linkParts[1] : linkText;
		contact.text(linkText);
	}
	
	function showBaseText(e){
		contact.text(baseText);
	}
	
	// Export
	return Links;
	
})(jQuery);