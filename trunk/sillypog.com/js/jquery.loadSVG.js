(function($){
	/**
	* @param fallbackFormat Alternative format to use if SVG not supported, eg 'png'. Default is 'png'.
	* @param imagePath Path to images if other than 'svg/', 'png/', etc.
	*/
	$.fn.loadSVG = function(fallbackFormat, imagePath){
		fallbackFormat = fallbackFormat || 'png';	// Supply default
		
		// Determine the available formats, prefer SVG
		var imageFormat = Modernizr.svg ? 'svg' : fallbackFormat;
		
		imagePath = imagePath === undefined ? imageFormat + '/' : imagePath;	// If no imagePath is supplied, assume it is in folder named after the imageFormat (eg svg/image.svg). Need to allow empty string as an option
		
		return this.each(function(){
			// Replace the temporary x-src attribute with the appropriate src link
			var $this = $(this);		
			var imgName = $this.attr('svg-src');
			var path = imagePath+imgName+'.'+imageFormat;
			$this.attr('src',path).removeAttr('svg-src');
		});
	}
})(jQuery);