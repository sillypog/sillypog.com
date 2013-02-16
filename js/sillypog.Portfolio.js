var sillypog = sillypog || {}; 
sillypog.Portfolio = (function($){
	'use strict';
	
	//----------
	// Private properties
	//----------
	var instance;	// Allow private properties to call public methods
	var stage;	// jQuery object of the DOM element
	
	var contentModel;
	var showOnContents = false;
	
	var circles = [];
	var circleSizeInfo;
	
	var physicsTimer;
	
	//----------
	// Constructor
	//----------
	var Portfolio = function($stage, _contentModel){
		instance = this;
		stage = $stage;
		contentModel = _contentModel;
	};
	
	//----------
	// Public methods
	//----------
	/**
	* Params contains the bigCirclePosition we need to line up with
	*/
	Portfolio.prototype.intro = function(params){
		console.log('Portfolio.intro');
		
		// Params are only there if we came from the about page at this point
		if (!params){
			this.show();
			return;
		}
		
		// Apply an instance of the placeholder template
		$.tmpl(sillypog.templates.PORTFOLIO_INTRO_PLACEHOLDER, {}).appendTo(stage);
		$('[svg-src]',stage).loadSVG();
		
		stage.removeClass('hidden');
		
		// Match circle positions to what we've been passed
		var $bigCircle = $('.bigCircle', stage).offset(params.bigCirclePosition);
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
		TweenLite.to($('#pc3',stage), 0.5, {css:{left:finalLeft, top:finalTop}, delay:0.3, onComplete:function(){instance.show()}}); 
	}
	
	Portfolio.prototype.outro = function(){
		outroComplete();
	}
	
	Portfolio.prototype.show = function(){
		console.log('Portfolio.show');
		
		// If the contentModel data is ready, we can show.
		// Otherwise, wait until it is
		if (!contentModel.ready){
			showOnContents = true;
			return;
		}
		
		var contents = contentModel.next(6);
		
		// Clear the stage
		$('.movable', stage).remove();
		stage.removeClass('hidden');
		
		// Get stage dimensions
		var stageSizeInfo = {width:stage.width(), height:$('.area',stage).height()};
		
		// Create circle representations and pop them out from the center
		for (var i=0, l=contents.length; i < l; i++){
			circles[i] = createCircle(contents[i], i, stageSizeInfo);
		}
		// Process the icons
		$('[svg-src]').loadSVG();
		// Start the physics updating
		physicsTimer = setInterval(updatePhysics, 1000 / 60);
	}
	
	Portfolio.prototype.contentsLoaded = function(e){
		if (showOnContents){
			showOnContents = false;
			instance.show();
		}
	}
	
	//----------
	// Private methods
	//----------
	
	
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
		// Remove any added elements
		stage.addClass('hidden');
		$('.movable', stage).remove();
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