(function($){
	
	console.log("Sillypog:*");
	
	/**
	* Document ready function
	*/
	$(function(){
		console.log('Document ready');
		
		// Set the source for any .dynamicImg classes
		$('.dynamicImg').loadSVG();	// Uses custom plugin
	});
	
	
}(jQuery));