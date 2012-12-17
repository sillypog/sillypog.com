var sillypog = sillypog || {}; 
sillypog.Portfolio = (function($){
	'use strict';
	
	//----------
	// Private properties
	//----------
	var instance;	// Allow private properties to call public methods
	var stage;	// jQuery object of the DOM element
	
	var contents;
	var showOnReady;
	
	var circles = [];
	var circleSizeInfo;
	
	//----------
	// Constructor
	//----------
	var Portfolio = function($stage){
		instance = this;
		stage = $stage;
	};
	
	//----------
	// Public methods
	//----------
	
	
	/**
	* Params contains the bigCirclePosition we need to line up with
	*/
	Portfolio.prototype.intro = function(params){
		stage.removeClass('hidden');
		
		// Start loading portfolio contents
		if (!contents){
			loadContents();
		}
		
		// Match circle positions to what we've been passed
		/*var $bigCircle = $('.bigCircle', stage).offset(params.bigCirclePosition);
		$('[id^="pc"]', stage).each(function(index){
			$(this).offset(params.smallCirclePositions[index]);
		});
		
		// Bring them all into the center 
		var finalWidth = $('#pc3').width();
		var finalLeft = (stage.width() / 2) - (finalWidth / 2);
		var finalTop = ($('.area', stage).height() / 2) - (finalWidth / 2);
		TweenLite.to($bigCircle, 0.5, {css:{width:finalWidth, height:finalWidth, borderRadius:finalWidth, left:finalLeft, top:finalTop, backgroundColor:"rgba(153,51,102,1)"}});
		TweenLite.to($('#pc1',stage), 0.5, {css:{width:finalWidth, height:finalWidth, left:finalLeft, top:finalTop}, delay:0.1});
		TweenLite.to($('#pc2',stage), 0.5, {css:{width:finalWidth, height:finalWidth, left:finalLeft, top:finalTop}, delay:0.2});
		TweenLite.to($('#pc3',stage), 0.5, {css:{left:finalLeft, top:finalTop}, delay:0.3, onComplete:function(){$('[id^="pc"]',stage).remove(); instance.show()}}); */
		this.show();
	}
	
	Portfolio.prototype.outro = function(){
		outroComplete();
	}
	
	Portfolio.prototype.show = function(){
		console.log('Portfolio.show');
		if (!contents){
			console.log('Portfolio.show waiting for load');
			showOnReady = true;
			return;
		} 
		
		console.log('Building out',contents.length,'links');
		
		// Get stage dimensions
		var stageSizeInfo = {width:stage.width(), height:$('.area',stage).height()};
		
		// Clear the stage
		$('.movable', stage).remove();
		// Create circle representations and pop them out from the center
		for (var i=0, l=contents.length; i < l; i++){
			circles[i] = createCircle(contents[i], i, stageSizeInfo);
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
		if (showOnReady){
			instance.show();
		}
	}
	
	var createCircle = function(data, index, stageSizeInfo){
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
	
	function outroComplete(){
		stage.addClass('hidden');
		// Let the manager know that this page is now hidden. Include the position of the big circle in the event information.
		$(instance).trigger(sillypog.events.OUTRO_COMPLETE);
	}
	
	// Export
	return Portfolio;
	
})(jQuery);