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
	
	var shown;
	
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
		
		if (!shown){
			firstShow();
		}
		shown = true;
	}
	
	Links.prototype.intro = function(params){
		this.show();	// No animation yet
	}
	
	Links.prototype.outro = function(){
		outroComplete();
	}
	
	//----------
	// Private methods
	//----------
	function firstShow(){
		// Wrap templates around the links in the list
		applyTemplates();
		
		// Change the text of the contact element when we mouse over
		$('a', stage).on('mouseenter', showHighlightText);
		$('a', stage).on('mouseleave', showBaseText);
	}
	
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
	
	function outroComplete(){
		stage.addClass('hidden');
		// Let the manager know that this page is now hidden. Include the position of the big circle in the event information.
		$(instance).trigger(sillypog.events.OUTRO_COMPLETE);
	}
	
	// Export
	return Links;
	
})(jQuery);