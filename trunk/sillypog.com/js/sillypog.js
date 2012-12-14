// Create a namespace for templates
var sillypog = sillypog || {};
sillypog.templates = {};

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
		console.log('Document ready');
		
		// Compile templates
		$('[type="text/x-jQuery-tmpl"]').compileTemplates(templates);
		
		// Set the source for any .dynamicImg classes
		$('[svg-src]').loadSVG();	// Uses custom plugin
		
		viewManager = new sillypog.ViewManager();
		// Transitions are added after the initial page set up so they won't run first time.
		viewManager.specifyTransition('','portfolio', transitionAboutPortfolio);
		viewManager.specifyTransition('','links', transitionAboutLinks);
		
		// Circulate
		var circulator = new sillypog.Circulator();
		$('#aboutText > p').each(function(){
			circulator.circulate($(this), $('.bigCircle'), true);
		});
		
	});
	
	function transitionAboutPortfolio(){
		console.log('transitionAboutPortfolio');
		
		exitAbout(enterPortfolio);
	
		function enterPortfolio(){
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
		  var finalTop = ($('.area', $portfolio).height() / 2) - (finalWidth / 2);
		  TweenLite.to($bigCircle, 0.5, {css:{width:finalWidth, height:finalWidth, borderRadius:finalWidth, left:finalLeft, top:finalTop, backgroundColor:"rgba(153,51,102,1)"}});
		  TweenLite.to($('#pc1',$portfolio), 0.5, {css:{width:finalWidth, height:finalWidth, left:finalLeft, top:finalTop}, delay:0.1});
		  TweenLite.to($('#pc2',$portfolio), 0.5, {css:{width:finalWidth, height:finalWidth, left:finalLeft, top:finalTop}, delay:0.2});
		  TweenLite.to($('#pc3',$portfolio), 0.5, {css:{left:finalLeft, top:finalTop}, delay:0.3, onComplete:function(){$('[id^="pc"]',$portfolio).remove(); portfolio.showContents()}}); 
		  
		  
		  // Start loading portfolio contents
			portfolio = portfolio || new sillypog.Portfolio($portfolio);
		}
	}
	
	function transitionAboutLinks(){
		exitAbout(enterLinks);
		
		function enterLinks(){
		  	$('#about').addClass('hidden');
		  	var $links = $('#links').removeClass('hidden');
			
			links = links || new sillypog.Links($links, $('#contact'));
		}
	}
	
	function exitAbout(onComplete){
		// Fade the text out and just leave the bubbles
		$('#aboutText>p').each(function(index){
			TweenLite.to($(this), 0.5, {css:{alpha:0}, ease:Quint.easeIn, delay:0.25 * index});
		});
		TweenLite.to($('#about header > *'), 1, {css:{alpha:0}, ease:Quint.easeIn, onComplete:onComplete});
	}
	
	
}(jQuery, sillypog.templates));