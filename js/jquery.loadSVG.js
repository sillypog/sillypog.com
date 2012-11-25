(function($){
	$.fn.loadSVG = function(fallbackFormat, imagePath){
		fallbackFormat = fallbackFormat || 'png';	// Supply default
		
		// Determine the available formats, prefer SVG
		var imageFormat = Modernizr.svg ? 'svg' : fallbackFormat;
		
		imagePath = imagePath || imageFormat;	// If no imagePath is supplied, assume it is in folder named after the imageFormat (eg svg/image.svg)
		
		this.each(function(){
			// Replace the temporary x-src attribute with the appropriate src link
			var $this = $(this);		
			var imgName = $this.attr('svg-src');
			var path = imagePath+'/'+imgName+'.'+imageFormat;
			$this.attr('src',path).removeAttr('svg-src');
		});
	}
}(jQuery));