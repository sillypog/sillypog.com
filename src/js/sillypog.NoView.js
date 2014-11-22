var sillypog = sillypog || {};
sillypog.NoView = (function(){
	'use strict';
	
	function NoView(){}
	
	/**
	* This will be called when the first screen of the application is needed.
	*/
	NoView.prototype.outro = function(){
		$(this).trigger(sillypog.events.OUTRO_COMPLETE);
	};
	
	return NoView;

})();
