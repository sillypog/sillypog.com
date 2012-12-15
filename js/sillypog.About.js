var sillypog = sillypog || {};
sillypog.About = (function($){
	'use strict;'
	
	var instance;
	var stage;
	
	/**
	* Constructor
	*/
	var About = function($stage){
		instance = this;
		stage = $stage;
	};
	
	About.prototype.show = function(){
		// Set the source for any .dynamicImg classes
		$('[svg-src]').loadSVG();	// Uses custom plugin
		
		// Circulate
		var circulator = new sillypog.Circulator();
		$('#aboutText > p', stage).each(function(){
			circulator.circulate($(this), $('.bigCircle'), true);
		});
		
		stage.removeClass('hidden');
		
		// This is the test call, it should actually be in outroComplete
		//$(this).trigger(sillypog.events.OUTRO_COMPLETE, {bigCircle:'bigCircle'});
	}
	
	About.prototype.intro = function(){
		this.show();
	}
	
	About.prototype.outro = function(){
		// Fade the text out and just leave the bubbles
		$('#aboutText>p', stage).each(function(index){
			TweenLite.to($(this), 0.5, {css:{alpha:0}, ease:Quint.easeIn, delay:0.25 * index});
		});
		TweenLite.to($('#about header > *'), 1, {css:{alpha:0}, ease:Quint.easeIn, onComplete:outroComplete});
	}
	
	/**
	* Private methods
	*/
	function outroComplete(){
		console.log('outroComplete');
		// Store the circle positions before hiding everything.
		var params = {	bigCirclePosition: $('#about .bigCircle').offset(),
						smallCirclePositions: [$('#ac1').offset(), $('#ac2').offset(), $('#ac3').offset()]};
		
		stage.addClass('hidden');
		// Let the manager know that this page is now hidden. Include the position of the big circle in the event information.
		$(instance).trigger(sillypog.events.OUTRO_COMPLETE, params);
	}
	
	// Export
	return About;
	
})(jQuery);