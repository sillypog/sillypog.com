var sillypog = sillypog || {}; 
sillypog.Circulator = (function($){
	'use strict';
	
	
	var Circulator = function Circulator(){
		console.log('Circulator.constructor');
	};
	
	Circulator.prototype.circulate = function(paragraph, circle, rightJustify){
	
		
		// Get the circles position
		var circleCenter = this.getCircleCenter(circle),
	
			// If we want to preserve a certain amount of spacing around the circle we can do this
			circleMargin = circle.css('margin-right').replace(/[^-\d\.]/g, '') *1,    // Strip off the units and other stuff
	
			radius = (circle.width() / 2) + circleMargin;
			this.f = rightJustify ? this.findByLine : this.findByBlock;
		
			this.f(paragraph, circleCenter, radius);
	
	};

	Circulator.prototype.getCircleCenter = function(circle){
		var position = circle.position();
		position.top += circle.width() / 2;
		position.left += circle.width() / 2;
		return position;
	};

	/**
	* For this version, try replacing the lines as we go.
	* Then we can follow the process in the debugger.
	*/
	Circulator.prototype.findByLine = function(paragraph, circleCenter, radius){
	
		// Break it into words
		paragraph.lettering('words');
		
		var lines = [],
			words = $('[class^="word"]', paragraph),
			numWords = words.length,
			wordIndex = 0,
			word = words.eq(wordIndex),
			wordPosition, linePosition;
	
		
		// While there are still words, keep going and put them into lines
		while (wordIndex < numWords){
	
			// Calculate the appropriate margin for the line starting with that word
			linePosition = wordPosition = word.position();
			var margin = this.getLineMargin(linePosition, word.height(), circleCenter, radius, word),
				line = '',
				wordsOnLine = [];
			
			// Apply negative margin to current word
			word.css('margin-left',margin);
	
			
			// See which words are on the top line and put them in a new span with the correct margin
			while((wordIndex < numWords) && (wordPosition.top == linePosition.top)){ 
				line += word.text() + ' '; // All lines will end in a space.
				wordsOnLine.push(word);
				// Set up for next word
				wordIndex++;
				word = words.eq(wordIndex);
				wordPosition = word.position();
			}
			var span = '<span class="line'+lines.length+'" style="margin-left:'+margin+'px;">'+line+'<br/></span>';
			lines.push(span);
			
			// Remove all of the words on the line and replace with the line span
			for (var i = wordsOnLine.length-1; i > -1; i--){
				wordsOnLine[i].remove();
			}
			// Also remove any lines we already added
			$('[class^="line"]',paragraph).remove();
			// Create spans from all the lines we have and prepend them
			paragraph.prepend(lines.join(''));
		}
	};
	
	Circulator.prototype.findByBlock = function(paragraph, circleCenter, radius){
		paragraph.lettering('smartlines');
	
	
		var circulator = this;    
		$('[class^="line"]', paragraph).each(function(){
			var line = $(this);
			var margin = circulator.getLineMargin(line.position(), line.height(), circleCenter, radius);
			line.css('margin-left',margin);
		});
	};
	
	/**
	
	* We want to know what the horizontal distance should be in order to make the hypoteneuse equal the radius.
	* We can then apply negative margin to line left to bring it to that point.
	*/
	Circulator.prototype.getLineMargin = function(line, lineHeight, circle, radius){
		var dy = (line.top + lineHeight*0.5) - circle.top,
			dXgoal = Math.sqrt((radius*radius) - (dy*dy)),
			dXcurrent = line.left - circle.left,
	
			margin = ((dXcurrent - dXgoal) *-1);
		return margin;
	};
	
	return Circulator;
})(jQuery);
