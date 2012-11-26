(function($){
	'use strict';
	
	console.log("Sillypog:*");
	
	var viewManager;
	
	/**
	* Document ready function
	*/
	$(function(){
		console.log('Document ready');
		
		// Set the source for any .dynamicImg classes
		$('.dynamicImg').loadSVG();	// Uses custom plugin
		
		viewManager = new sillypog.ViewManager();
		// Transitions are added after the initial page set up so they won't run first time.
		viewManager.specifyTransition('','portfolio', transitionAboutPortfolio);
	});
	
	function transitionAboutPortfolio(){
		console.log('transitionAboutPortfolio');
	}
	
	
}(jQuery));