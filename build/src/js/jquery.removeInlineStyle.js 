(function($){
	/**
	* @param styleName The name of the style to be removed, eg 'opacity'
	*/
	$.fn.removeInlineStyle = function(styleName){
		
		return this.each(function(){
			
			var $this = $(this);		
			var style = $this.attr('style');
			if (!style){
				return;	// Abort if there are no styles to search
			}
			
			var styles = style.split(';');
			
			// Loop over all styles until we find a match to the styleName parameter
			for (var i=styles.length-1; i>-1; i--){
				// Remove leading whitespace
				styles[i] = styles[i].replace(/^\s\s*/, '');
				if (styles[i].indexOf(styleName+':') === 0){
					styles.splice(i,1);	// Remove the match style
					break;	// Don't need to keep looking
				}
			}

			$this.attr('style', styles.join(';'));	// Write out the modified styles
		});
	};
})(jQuery);
