var sillypog = sillypog || {}; 
sillypog.Articles = (function($){
	'use strict';
	
	var instance;
	var stage;
	
	//----------
	// Constructor
	//----------
	var Articles = function($stage){
		instance = this;
		stage = $stage;
	};
	
	Articles.prototype.show = function(){
		console.log('Articles.show');
		stage.removeClass('hidden');
	}
	
	Articles.prototype.intro = function(){
		this.show();
	}
	
	Articles.prototype.outro = function(){
		outroComplete();
	}
	
	Articles.prototype.changeSubpage = function(subpage){
		console.log('Articles.showSubpage',subpage);
		
		// Clear current subpage
		stage.empty();
		// Load next
		if (subpage){
			$.ajax('articles/'+subpage+'/index.html', {dataType:'html', success:function(data){
				stage.append(data);
				$('[svg-src]', stage).loadSVG();
				
				// Wrap the text around the circle
				var circulator = new sillypog.Circulator();
				$('p', stage).each(function(){
					circulator.circulate($(this), $('.articleCircle'), true);
				});
			}});
		}
	}
	
	function outroComplete(){
		stage.addClass('hidden');
		// Let the manager know that this page is now hidden. Include the position of the big circle in the event information.
		$(instance).trigger(sillypog.events.OUTRO_COMPLETE);
	}
	
	return Articles;
})(jQuery);