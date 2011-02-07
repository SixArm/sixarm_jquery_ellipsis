// jQuery.ellipsis plugin 
//
// Truncate text that has too many rows to fit within its parent element.
// The default is to append an ellipsis to any text that is truncated.
//
// Example:
//   $('.foo').ellipsis();
//
// Options:
//   rows: maximum number of rows of text you want; default is 1.
//   append: string to add to truncated text; default is an ellipsis.

(function( $ ){
    $.fn.ellipsis = function(options) {

        var settings = {
            'rows'   : 1,
            'append' : '\u2026'
        };
        
        if ( options ) { 
            $.extend( settings, options );
        }

        var letterDiv = $("<div id='ellipsis_letter' style='position:absolute; visibility:hidden;'>X</div>");

        function letterDivHeight(container){
            container.append(letterDiv);
            var height = letterDiv.height();
            letterDiv.remove();
            return height;
        }

 	      return this.each(function() {
	          var $this = $(this);
            var targetHeight = letterDivHeight($this) * settings['rows'];

            // If the text is short enough to fit as-is, 
            // then we return immediately without any changes.
            // This is the most common case in our web apps.
            if ($this.height() <= targetHeight) return;

            var text = $this.text(); // shorthand
            var textOriginal = text; // constant
            var textSuccessful = ""; // the longest successful match so far
            var append = settings['append']; // shorthand

            // Find the longest successful fit via squeeze play.
            //   - minPos: the str pos of the shortest known success
            //   - maxPos: the str pos of the longest known failure
            //   - midPos: the str pos of the midpoint between min & max
            var minPos = 0; 
            var midPos;
            var maxPos = $this.text().length - 1;

            // During the squeeze play, keep track of the text for speed.
            // The squeeze doesn't actually need to keep track of maxText, 
            // but it has been helpful in practice for browser debugging.
            var minText = "";
            var midText;
            var maxText;

            // Squeeze play: each time through, cut the distance in half
            while (minPos + 1 < maxPos){
                midPos = ((maxPos - minPos) / 2) + minPos;
                midText = textOriginal.substring(0, midPos) + append;
                $this.text(midText);
                if ($this.height() <= targetHeight){
                    minPos = midPos;
                    minText = midText;
                } else {
                    maxPos = midPos;
                    maxText = midText;
                }
            }
            $this.text(minText);

        });
    };
})( jQuery );


