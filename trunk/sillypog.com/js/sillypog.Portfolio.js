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
	
	var physicsTimer;
	
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
		// Start the physics updating
		physicsTimer = setInterval(updatePhysics, 1000 / 60);
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
		
			
		/*var fakeCircle = $('<a href="'+data.url+'"><div class="portfolioCircle"><img svg-src="'+data.icon+'" /></div></a>').appendTo($('#contents',stage)),
			radius = fakeCircle.width() / 2;
			fakeCircle.remove();
		
		console.log(radius);*/
		// Create the innerElement so we can accurately measure the radius before we put it together with the link and anchor elements. jQuery won't measure correctly with the anchor present.
		var segmentRadians = (Math.PI * 2) / 6,
			direction = new sillypog.geom.Vector(),
			area = $('.area', stage),
			innerElement$ = $('<div class="portfolioCircle"><img svg-src="'+data.icon+'" /></div>').appendTo($('#contents',stage)),
			radius = innerElement$.width() / 2,
			boundRectangle = new sillypog.geom.Rectangle(radius, radius, area.width()-radius, area.height()-radius),
			outerElement$ = $('<li class="movable"><a href="'+data.url+'" /></li>').appendTo($('#contents',stage));
		
		$('a',outerElement$).append(innerElement$);	// Merge the 2 pieces together
		outerElement$.on('mouseenter', function(){
			TweenLite.to($('#description',stage).text(data.description),0.25,{css:{alpha:1}});
		});
		outerElement$.on('mouseleave', function(){
			TweenLite.to($('#description',stage),0.25,{css:{alpha:0}});
		});
		
		var circle = new sillypog.display.Circle(area.width()*0.5, area.height()*0.5, outerElement$);
		circle.physics.setBounds(boundRectangle);
		circle.physics.mass = 10;
			
		direction.rotate(segmentRadians * index);
		direction.scale(40);
		circle.physics.applyForce(direction);
		
		return circle;
	}
	
	function outroComplete(){
		stage.addClass('hidden');
		// Let the manager know that this page is now hidden. Include the position of the big circle in the event information.
		$(instance).trigger(sillypog.events.OUTRO_COMPLETE);
	}
	
	function updatePhysics(){
		var stopPhysics = true;
		for (var i=0, l=circles.length; i<l; i++){
			var circle = circles[i];
			var friction = circle.physics.calculateFriction(0.5);
			circle.physics.applyForce(friction);
			circle.update();
			if (circle.physics.velocity.mag() > 0){
				stopPhysics = false;
			}
		}
		if (stopPhysics){
			clearInterval(physicsTimer);
		}
		console.log('update');
	}
	
	// Export
	return Portfolio;
	
})(jQuery);