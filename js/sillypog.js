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
		$('[svg-src]').loadSVG();	// Uses custom plugin
		
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
		  // Grab the positions before we hide the about section and it becomes unreadable
		  var smallCirclePositions = [$('#ac1').offset(), $('#ac2').offset(), $('#ac3').offset()];
		  // Hide the about layer
		  $('#about').addClass('hidden');
		  // Create a new layer for portfolio that has the circles in the same positions.
		  var $portfolio = $('#portfolio').removeClass('hidden');
		  // Make all the bubbles group together and go solid
		  var $bigCircle = $('.bigCircle', $portfolio).offset(bigCirclePosition);
		  $('[id^="pc"]', $portfolio).each(function(index){
			  $(this).offset(smallCirclePositions[index]);
		  });
		  // Bring them all into the center 
		  var finalWidth = $('#pc3').width();
		  var finalLeft = ($portfolio.width() / 2) - (finalWidth / 2);
		  var finalTop = ($('#area').height() / 2) - (finalWidth / 2);
		  TweenLite.to($bigCircle, 0.5, {css:{width:finalWidth, height:finalWidth, borderRadius:finalWidth, left:finalLeft, top:finalTop, backgroundColor:"rgba(153,51,102,1)"}});
		  TweenLite.to($('#pc1',$portfolio), 0.5, {css:{width:finalWidth, height:finalWidth, left:finalLeft, top:finalTop}, delay:0.1});
		  TweenLite.to($('#pc2',$portfolio), 0.5, {css:{width:finalWidth, height:finalWidth, left:finalLeft, top:finalTop}, delay:0.2});
		  TweenLite.to($('#pc3',$portfolio), 0.5, {css:{left:finalLeft, top:finalTop}, delay:0.3, onComplete:function(){$('[id^="pc"]',$portfolio).remove();}});
		  
		  // Spread them out as the contents come in
		}
	}
	
	
}(jQuery));