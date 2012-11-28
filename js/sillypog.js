(function($){
	'use strict';
	
	console.log("Sillypog:*");
	
	var viewManager;
	var portfolio;
	
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
		// Fade the text out and just leave the bubbles
		$('#aboutText>p').each(function(index){
			TweenLite.to($(this), 0.5, {css:{alpha:0}, ease:Quint.easeIn, delay:0.25 * index});
		});
		TweenLite.to($('#about header > *'), 1, {css:{alpha:0}, ease:Quint.easeIn, onComplete:showPortfolio});
		
		
		function showPortfolio(){
		  // Get the position of the remaining elements in the about page
		  var bigCirclePosition = $('#about .bigCircle').offset();
		  // Hide the about layer
		  $('#about').addClass('hidden');
		  // Create a new layer for portfolio that has the circles in the same positions.
		  $('#portfolio').removeClass('hidden');
		  // Make all the bubbles group together and go solid
		  $('#portfolio .bigCircle').offset(bigCirclePosition);
		  
		  // Spread them out as the contents come in
		}
	}
	
	
}(jQuery));