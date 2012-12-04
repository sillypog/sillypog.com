var sillypog = sillypog || {}; 
sillypog.Portfolio = (function($){
	'use strict';
	
	//----------
	// Private properties
	//----------
	var instance;	// Allow private properties to call public methods
	
	var stage;	// jQuery object of the DOM element
	var stageSizeInfo;
	
	var contents;
	var showContentsOnReady;
	
	var circles = [];
	var circleSizeInfo;
	
	//----------
	// Constructor
	//----------
	var Portfolio = function($stage){
		console.log('Portfolio: Constructor');
		
		instance = this;
		
		stage = $stage;
		stageSizeInfo = {width:stage.width(), height:$('.area',stage).height()};
		loadContents();
	};
	
	//----------
	// Public methods
	//----------
	Portfolio.prototype.showContents = function(){
		console.log('Portfolio.showContents');
		if (!contents){
			console.log('Portfolio.showContents waiting for load');
			showContentsOnReady = true;
			return;
		} 
		
		console.log('Building out',contents.length,'links');
		
		// Clear the stage
		$('.movable', stage).remove();
		// Create circle representations and pop them out from the center
		for (var i=0, l=contents.length; i < l; i++){
			circles[i] = createCircle(contents[i],i);
		}
		// Process the icons
		$('[svg-src]').loadSVG();
	}
	
	Portfolio.prototype.showArticle = function(showArticle){
	}
	
	//----------
	// Private methods
	//----------
	var loadContents = function loadContents(){
		console.log('Portfolio.loadContents');
		$.getJSON('json/contents.json', function(data){
			
			contents = data.articles;
			onContentsLoaded();
		});
	}
	
	var onContentsLoaded = function onContentsLoaded(){
		// Dispatch event? // Resolve deferred?
		console.log('Contents loaded', contents);
		if (showContentsOnReady){
			instance.showContents();
		}
	}
	
	var createCircle = function(data, index){
		if (!circleSizeInfo){
			circleSizeInfo = {};
			var fakeCircle = $('<div class="portfolioCircle" />').appendTo(stage);
			circleSizeInfo.width = fakeCircle.width();
			
			// Get the central position we're going to be creating circles at
			circleSizeInfo.left = (stage.width() / 2) - (circleSizeInfo.width / 2);
			circleSizeInfo.top = ($('.area', stage).height() / 2) - (circleSizeInfo.width / 2);
			
			fakeCircle.remove();
		}
		
		var circle = $('<li class="movable"><a href="'+data.url+'"><div class="portfolioCircle"><img svg-src="'+data.icon+'" /></div></a></li>').css({left:circleSizeInfo.left, top:circleSizeInfo.top}).appendTo($('#contents',stage));
		
		circle.on('mouseenter', function(){
			TweenLite.to($('#description',stage).text(data.description),0.25,{css:{alpha:1}});
		});
		circle.on('mouseleave', function(){
			TweenLite.to($('#description',stage),0.25,{css:{alpha:0}});
		});
		
		// For now I'll use Tween but I think I'd rather just apply a vector and let them start moving. Then I can adjust the vectors based on whatever forces I want to apply
		TweenLite.to(circle, 0.5, {css:{top:Math.random() * (stageSizeInfo.height-circleSizeInfo.width), left:Math.random() * (stageSizeInfo.width-circleSizeInfo.width), alpha:0.8}, delay:index*0.2});
		
		return circle;
	}
	
	// Export
	return Portfolio;
	
})(jQuery);