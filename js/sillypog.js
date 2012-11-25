(function($){
	
	console.log("Sillypog:*");
	
	var imageFormat;	// SVG is prefered, PNG as fallback
	
	/**
	* Document ready function
	*/
	$(function(){
		console.log('Document ready');
		
		// Determine the image format
		var jObj = $('.svg');
		imageFormat = jObj.length ? 'svg' : 'png';
		
		// Set the source for any .dynamicImg classes
		console.log('dynamicImg found: '+$('.dynamicImg').length);
		$('.dynamicImg').each(setImageSrc);
	});
	
	/**
	* Deliver the appropriate image type based on browser features.
	* SVG is the preferred type, PNG is the alternative.
	* Function is designed to be called by jQuery each method.
	*/
	function setImageSrc(index, Element){		
		var imgName = $(this).attr('src');
		var path = imageFormat+'/'+imgName+'.'+imageFormat;
		$(this).attr('src',path);
	}
}(jQuery));