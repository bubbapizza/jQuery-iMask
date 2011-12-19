(function($){
   var $chk = function(obj){
      return !!(obj || obj === 0);
   };

   /******
    * Masks an input with a pattern
    * @class
    * @requires jQuery
    * @name jQuery.iMask
    * @param {Object}    options
    * @param {String}    options.type (number|fixed|time)
    * @param {String}    options.mask Mask using 9,a,x notation
    * @param {String}   [options.maskEmptyChr=' ']
    * @param {String}   [options.validNumbers='1234567890']
    * @param {String}   [options.validAlphas='abcdefghijklmnopqrstuvwxyz']
    * @param {String}   [options.validAlphaNums='abcdefghijklmnopqrstuvwxyz1234567890']
    * @param {Number}   [options.groupDigits=3]
    * @param {Number}   [options.decDigits=2]
    * @param {String}   [options.currencySymbol]
    * @param {String}   [options.groupSymbol=',']
    * @param {String}   [options.decSymbol='.']
    * @param {Boolean}  [options.showMask=true]
    * @param {Boolean}  [options.stripMask=false]
    * @param {Boolean}  [options.ampmTime=true]
    * @param {Function} [options.sanity]
    * @param {Object}   [options.number] Override options for when validating numbers only
    * @param {Boolean}  [options.number.stripMask=false]
    * @param {Boolean}  [options.number.showMask=false]
    ******/
   var iMask = function(){
      this.initialize.apply(this, arguments);
   }; // endfunction

   iMask.prototype = {
      options: {
         maskEmptyChr   : ' ',

         validNumbers   : "1234567890",
         validAlphas    : "abcdefghijklmnopqrstuvwxyz",
         validAlphaNums : "abcdefghijklmnopqrstuvwxyz1234567890",

         groupDigits    : 3,
         decDigits      : 2,
         currencySymbol : '',
         groupSymbol    : ',',
         decSymbol      : '.',
         showMask       : true,
         stripMask      : false,

         lastFocus      : 0,

         number : {
            stripMask : false,
            showMask  : false
         }
      },

      initialize: function(node, options) {
         this.node    = node;
         this.domNode = node[0];
         this.options = $.extend({}, this.options, this.options[options.type] || {}, options);
         var self     = this;

         if(options.type == "number") this.node.css("text-align", "right");

         this.node
            .bind( "mousedown click", function(ev){ ev.stopPropagation(); ev.preventDefault(); } )
            .bind( "mouseup",  function(){ self.onMouseUp .apply(self, arguments); } )
            .bind( "keydown",  function(){ self.onKeyDown .apply(self, arguments); } )
            .bind( "keypress", function(){ self.onKeyPress.apply(self, arguments); } )
            .bind( "focus",    function(){ self.onFocus   .apply(self, arguments); } )
            .bind( "blur",     function(){ self.onBlur    .apply(self, arguments); } );
      }, // endfunction


      isFixed  : function(){ return this.options.type == 'fixed';  },
      isNumber : function(){ return this.options.type == 'number'; },
      isTime   : function(){ return this.options.type == 'time'; },


      allowKeys : {
            8 : 1 // backspace
         ,  9 : 1 // tab
         , 13 : 1 // enter
         , 35 : 1 // end
         , 36 : 1 // home
         , 37 : 1 // left
         , 38 : 1 // up
         , 39 : 1 // right
         , 40 : 1 // down
         , 46 : 1 // delete
      }, 


/**************** EVENTS ********************/

      /***********
       * MOUSE UP
       ***********/
      onMouseUp: function( ev ) {
         console.log("mouseup");

         ev.stopPropagation();
         ev.preventDefault();

         if( this.isFixed() ) {
            var p = this.getSelectionStart();
            this.setSelection(p, (p + 1));
         } else if(this.isNumber() ) {
            this.setEnd();
         } // endif
      }, // endfunction



      /***********
       * KEY DOWN
       ***********/
      onKeyDown: function(ev) {
         console.log("keydown");

         /****** CTRL, ALT, META KEYS******/
         if(ev.ctrlKey || ev.altKey || ev.metaKey) {
            return;

         /****** ENTER KEY ******/
         } else if(ev.which == 13) { // enter
            this.node.blur();

            this.submitForm(this.node);

         /****** NON-TAB KEYS ******/
         } else if(!(ev.which == 9)) { // tab

            /* 
             *  See if we're updating a fixed-format string.
             */
            if(this.options.type == "fixed") {
               ev.preventDefault();

               var p = this.getSelectionStart();
               switch(ev.which) {
                  case 8: // Backspace
                     this.updateSelection( this.options.maskEmptyChr );
                     this.selectPrevious();
                     break;
                  case 36: // Home
                     this.selectFirst();
                     break;
                  case 35: // End
                     this.selectLast();
                     break;
                  case 37: // Left
                  case 38: // Up
                     this.selectPrevious();
                     break;
                  case 39: // Right
                  case 40: // Down
                     this.selectNext();
                     break;
                  case 46: // Delete
                     this.updateSelection( this.options.maskEmptyChr );
                     this.selectNext();
                     break;
                  default:
                     var chr = this.chrFromEv(ev);
                     if( this.isViableInput( p, chr ) ) {
                        this.updateSelection( 
                           ev.shiftKey ? chr.toUpperCase() : chr );
                        this.node.trigger("valid", ev, this.node);
                        this.selectNext();
                     } else {
                        this.node.trigger("invalid", ev, this.node);
                     } // endif
                     break;
               } // endswitch


            /*
             *  See if we're updating a number.
             */
            } else if(this.options.type == "number") {

               /* See which key was pressed. */
               var p = this.getSelectionStart();
               switch(ev.which) {
                  case 35: // END
                  case 36: // HOME
                  case 37: // LEFT
                  case 38: // UP
                  case 39: // RIGHT
                  case 40: // DOWN
                     break;
                  case 8:  // backspace
                  case 46: // delete
                     var self = this;
                     setTimeout(function(){
                        self.formatNumber();
                     }, 1);
                     break;

                  default:
                     ev.preventDefault();

                     var chr = this.chrFromEv( ev );
                     console.log(p, chr);
                     if( this.isViableInput( p, chr ) ) {
                        var range = new Range( this );
                        console.log("RANGE=",range);
                        var val = this.sanityTest( range.replaceWith( chr ) );

                        if(val !== false){
                           this.updateSelection( chr );
                           this.formatNumber();
                        }
                        this.node.trigger( "valid", ev, this.node );
                     } else {   
                        this.node.trigger( "invalid", ev, this.node );
                     } // endif 
                     break;
               } // endswitch

            } // endif 
         } // endif 
      }, // endfunction



      /***********
       * KEY PRESS
       ***********/
      onKeyPress: function(ev) {
         console.log("keypress");

         /* jQuery should normalize the keyCode property to 'which' but
            just in case it doesn't, 'or' it with keyCode. */
         var key = ev.which || ev.keyCode;

         /* 
          *  If this is not an allowed key AND none of the ctrl, alt 
          *  or meta keys are pressed, then stop propagation of this 
          *  event so nothing happens. 
          */
         if ( !( this.allowKeys[ key ] ) && 
              !(ev.ctrlKey || ev.altKey || ev.metaKey)
            ) {

            ev.preventDefault();
            ev.stopPropagation();
         } // endif 
      }, // endfunction



      /***********
       * FOCUS
       ***********/
      onFocus: function(ev) {
         console.log("focus");

         /* Make sure this event doesn't trigger anything else higher
            up in the DOM. */
         ev.stopPropagation();
         ev.preventDefault();

         if (this.options.showMask) {
             this.domNode.value = this.wearMask(this.domNode.value);
         } //endif 

         /* Run the sanity test on the text field's value. */
         this.sanityTest( this.domNode.value );

         var self = this;

         /* 
          *  This is a weird way to position the cursor but that's what this
          *  code does.  One millisecond after the onFocus event triggers,
          *  either selectFirst or the setEnd method gets called, depending
          *  on the mask type. 
          */
         setTimeout( 
               function(){
                  if (self.options.type === "fixed") {
                     return self['selectFirst']();
                  } else {
                     return self['setEnd']();
                  } // endif
               } //endfuction
               , 1 
            );
      }, // endfunction



      /***********
       * BLUR
       ***********/
      onBlur: function(ev) {

         /* Prevent the blur event from going anywhere else. */
         ev.stopPropagation();
         ev.preventDefault();

         /* 
          *  If the stripMask option is set, strip the mask from the
          *  input value and display it.
          */
         if(this.options.stripMask)
            this.domNode.value = this.stripMask();
      }, // endfunction



/**************** TEXT SELECTION ********************/

      /****** 
       *  Select the entire value of the input field.
       ******/
      selectAll: function() {

         this.setSelection(0, this.domNode.value.length);
      }, // endfunction

     
      /****** 
       *  Select the first updateable character in the field.
       ******/
      selectFirst: function() {

         /* 
          *  Search through each character in the mask until we hit a
          *  non-mask character.  Once we hit one, select that character
          *  in the input field.
          */
         for(var i = 0, len = this.options.mask.length; i < len; i++) {
            if(this.isInputPosition(i)) {
               this.setSelection(i, (i + 1));
               return;
            } // endif
         } // endfor

      }, // endfunction



      /****** 
       *  Select the last updateable character in the field.
       ******/
      selectLast: function() {

         /* 
          *  Search backwards through each character in the mask until we 
          *  hit a non-mask character.  Once we hit one, select that 
          *  character in the input field.
          */
         for(var i = (this.options.mask.length - 1); i >= 0; i--) {
            if(this.isInputPosition(i)) {
               this.setSelection(i, (i + 1));
               return;
            } // endif
         } // endfor
      }, // endfunction



      selectPrevious: function(p) {
         if( !$chk(p) ){ p = this.getSelectionStart(); }

         if(p <= 0) {
            this.selectFirst();
         } else {
            if(this.isInputPosition(p - 1)) {
               this.setSelection(p - 1, p);
            } else {
               this.selectPrevious(p - 1);
            } // endif
         } // endif
      }, // endfunction

      selectNext: function(p) {
         if( !$chk(p) ){ p = this.getSelectionEnd(); }

         if( this.isNumber() ){
            this.setSelection( p+1, p+1 );
            return;
         } // endif

         if( p >= this.options.mask.length) {
            this.selectLast();
         } else {
            if(this.isInputPosition(p)) {
               this.setSelection(p, (p + 1));
            } else {
               this.selectNext(p + 1);
            } // endif
         } // endif
      }, // endfunction


      /****** 
       *  This method is the workhorse of cursor movement.  It selects
       *  text from cursor position a to cursor position b.  Optionally,
       *  you can leave out 'b' and just pass an array with 2 elements
       *  in it.
       ******/
      setSelection: function( a, b ) {

         /* 
          *  See if an array was passed.  If it was, then b will be
          *  the second value of the array. 
          */
         a = a.valueOf();
         if( !b && a.splice ){
            b = a[1];
            a = a[0];
         }

         /* If the browser supports setSelectionRange, then just 
            call it. */
         if(this.domNode.setSelectionRange) {
            this.domNode.focus();
            this.domNode.setSelectionRange(a, b);

         /* We are using shitty internet explorer so use createTextRange
            to select the text. */
         } else if(this.domNode.createTextRange) {
            var r = this.domNode.createTextRange();
            r.collapse();
            r.moveStart("character", a);
            r.moveEnd("character", (b - a));
            r.select();
         } // endif

      }, // endfunction



      /****** 
       *  Replace the currently selected text with the given string.
       ******/
      updateSelection: function( chr ) {
         var value = this.domNode.value
          ,  range = new Range( this )
          , output = range.replaceWith( chr );

         this.domNode.value = output;
         if( range[0] === range[1] ){
            this.setSelection( range[0] + 1, range[0] + 1 );
         }else{
            this.setSelection( range );
         } // endif
      }, // endfunction


      /****** 
       *  Move the cursor to the end of the text field.
       ******/
      setEnd: function() {
         var len = this.domNode.value.length;
         this.setSelection(len, len);
      }, // endfunction


      /****** 
       *  Return a 2 element array containing the start & end of
       *  the current selection.  
       ******/
      getSelectionRange : function(){
         return [ this.getSelectionStart(), this.getSelectionEnd() ];
      }, // endfunction


      /******
       *  Return the cursor position for the start of the currently
       *  selected text.
       ******/
      getSelectionStart: function() {
         var result = 0,
             selectStart = this.domNode.selectionStart;

         /* 
          *  If we're on a browser that supports the selectionStart method,
          *  then just check to make sure the result is a number and 
          *  return it. 
          */
         if( selectStart ) {
            if( typeof( selectStart ) == "number" ){
               result = selectStart;
            } // endif

         /* 
          *  Our browser doesn't support selectionStart so maybe we can 
          *  hack around it with the document.selection property.
          */
         } else if( document.selection ){
            var r = document.selection.createRange().duplicate();
            r.moveEnd( "character", this.domNode.value.length );
            result = this.domNode.value.lastIndexOf( r.text );
            if( r.text == "" ){
               result = this.domNode.value.length;
            } // endif
         } // endif

         return result;
      }, // endfunction



      /******
       *  Return the cursor position for the end of the currently
       *  selected text.
       ******/
      getSelectionEnd: function() {
         var result = 0,
             selectEnd = this.domNode.selectionEnd;

         /* 
          *  If we're on a browser that supports the selectionEnd method,
          *  then just check to make sure the result is a number and 
          *  return it. 
          */
         if( selectEnd ) {
            /* If selectEnd is a number, then return the number. */
            if( typeof( selectEnd ) == "number"){
               result = selectEnd;
            } // endif

         /* 
          *  Our browser doesn't support selectionEnd so maybe we can 
          *  hack around it with the document.selection property.
          */
         } else if( document.selection ){
            var r = document.selection.createRange().duplicate();
            r.moveStart( "character", -this.domNode.value.length );
            result = r.text.length;
         } // endif

         return result;
      }, // endfunction



/**************** VALIDATION ********************/

      /****** 
       *  Determine if position p is part of the mask or input value.
       ******/
      isInputPosition: function(p) {
         var mask = this.options.mask.toLowerCase();
         var chr = mask.charAt(p);
         return !!~"9ax".indexOf(chr);
      }, // endfunction


      /******
       *  Run the sanity test on the field.  We pass the non-masked
       *  value of the input field to the sanity function/regexp.
       *  This test is used for custom input validation.
       ******/  
      sanityTest: function( str, p ){
         var sanity = this.options.sanity;

         /* If the sanity option is a regular expression, then just
            test the input value against the regexp.  This will
            return either true or false. */
         if(sanity instanceof RegExp){
            return sanity.test(str);


         /* If the sanity option is a function, then pass the function
            the input value PLUS the character position. */ 
         }else if($.isFunction(sanity)){
            var ret = sanity(str, p);

            /* See if we got a boolean back.  If so, just return it. */
            if(typeof(ret) == 'boolean'){
               return ret;

            /* If we got an undefined value back, don't return anything */
            }else if(typeof(ret) != 'undefined'){

               /* If this field is a string mask, apply the mask to 
                  the returned sanity value and show it in the input
                  field. */
               if( this.isFixed() ){
                  var p = this.getSelectionStart();
                  this.domNode.value = this.wearMask( ret );
                  this.setSelection( p, p+1 );
                  this.selectNext();

               /* For numbers, format the sanity value into a number and
                  display it in the input field. */
               }else if( this.isNumber() ){
                  var range = new Range( this );
                  this.domNode.value = ret;
                  this.setSelection( range );
                  this.formatNumber();
               } // endif

               return false;
            } // endif

         } // endif
      }, // endfunction



      /******
       *  This method returns boolean value indicating if the given 
       *  character, typed at the given cursor position is valid.
       ******/
      isViableInput: function(p, chr) {

         /* For fixed string fields, call isViableFixedInput. */
         if (this.isFixed()) {
            return this.isViableFixedInput(p, chr);

         /* For number fields, call isViableNumericInput. */
         } else if (this.isNumber()) {
            return this.isViableNumericInput(p, chr);
         } // endif 

      }, // endfunction


      /******
       *  Called from isViableInput, used for validating fixed strings.
       ******/
      isViableFixedInput : function( p, chr ){
         var mask   = this.options.mask.toLowerCase();
         var chMask = mask.charAt(p);

         var val = this.domNode.value.split('');
         val.splice( p, 1, chr );
         val = val.join('');

         var ret = this.sanityTest( val, p );
         if(typeof(ret) == 'boolean'){ return ret; }

         if(({
            '9' : this.options.validNumbers,
            'a' : this.options.validAlphas,
            'x' : this.options.validAlphaNums
         }[chMask] || '').indexOf(chr) >= 0){
            return true;
         } // endif

         return false;
      }, // endfunction


      /******
       *  Called from isViableInput, used for validating numbers.
       ******/
      isViableNumericInput : function( p, chr ){
         return !!~this.options.validNumbers.indexOf( chr );
      }, // endfunction



/**************** MASKING ********************/

      /******
       *  Apply this field's mask to a given string.
       ******/
      wearMask: function(str) {
         var   mask = this.options.mask.toLowerCase()
          ,  output = ""
          , chrSets = {
              '9' : 'validNumbers'
            , 'a' : 'validAlphas'
            , 'x' : 'validAlphaNums'
         };

         for(var i = 0, u = 0, len = mask.length; i < len; i++) {
            switch(mask.charAt(i)) {
               case '9':
               case 'a':
               case 'x':
                  output += 
                     ((this.options[ chrSets[ mask.charAt(i) ] ].indexOf( str.charAt(u).toLowerCase() ) >= 0) && ( str.charAt(u) != ""))
                        ? str.charAt( u++ )
                        : this.options.maskEmptyChr;
                  break;

               default:
                  output += mask.charAt(i);
                  if( str.charAt(u) == mask.charAt(i) ){
                     u++;
                  } // endif

                  break;
            } // endswitch
         }
         return output;
      }, // endfunction



      /******
       *  This method strips off the input mask for fixed strings and 
       *  strips off any non-numeric characters for numbers.
       ******/
      stripMask: function() {
         var output = ""
           , chr = ''
           , value = this.domNode.value;


         /* Don't do anything if the input field is empty */
         if(value == "") {
            return "";
         } // endif


         /* For strings, strip off the mask characters. */
         if( this.isFixed() ) {

            for(var i = 0, len = value.length; i < len; i++) {
               chr = value.charAt(i);
               if((chr != this.options.maskEmptyChr) && 
                  (this.isInputPosition(i))) {
                  output += chr;
               } // endif 
            } // endfor

         /* For numbers, all we do is strip out anything that's not 
            a digit. */
         } else if( this.isNumber() ) {
            for(var i = 0, len = value.length; i < len; i++) {

               chr = value.charAt(i);
               if(this.options.validNumbers.indexOf(chr) >= 0) {
                  output += chr;
               } // endif

            } // endfor
         } // endif

         return output;
      }, // endfunction



      /******
       *  Convert the event keycode from a number to a character.
       *  All upper case keycodes get converted to lower case.
       ******/
      chrFromEv: function(ev) {
         var chr = ''
           , key = ev.which;

         /* Shift number-pad numbers to corresponding character codes. */
         if(key >= 96 && key <= 105) { 
            key -= 48; 
         } // endif  

         /* Convert the key pressed to lower case. */
         chr = String.fromCharCode(key).toLowerCase(); 

         return chr;
      }, // endfunction



      /******
       *  Format a number field based on the options set.
       ******/
      formatNumber: function() {
         var cleanVal; 
         var range = new Range(this);
         var strInteger;
         var strDecimal;
         var regExp;


         /* Clean up the input value by stripping away the mask and any
            leading zeros. */
         cleanVal = this.stripMask().replace(/^0+/, '' );
          
         /* If the cleaned up number has less digits than the number
            of decimal digits, then then we have to pad it with zeros. */
         for(var i = cleanVal.length; i <= this.options.decDigits; i++) {
            cleanVal += "0";
         } // endfor


         /* Figure out the decimal and integer portion of the number. */
         strDecimal = cleanVal.substr(
            cleanVal.length - this.options.decDigits)
         strInteger = cleanVal.substring(
            0, (cleanVal.length - this.options.decDigits))

         /* 
          *  Add grouping symbols to the integer portion using a regular
          *  expression. 
          */

         /* Build the regular expression string for groups of digits. */
         regExp = new RegExp(
            "(\\d+)(\\d{"+ this.options.groupDigits +"})");

         /* Put commas in between the digit groups. */
         while(regExp.test(strInteger)) {
            strInteger = strInteger.replace(
               re, "$1"+ this.options.groupSymbol +"$2");
         } // endwhile


         /* 
          *  Insert the newly formatted number into the input field. 
          */
         this.domNode.value = this.options.currencySymbol + 
            strInteger + this.options.decSymbol + strDecimal;

         
         /* Reset the selection range. */
         this.setSelection( range );
      }, // endfunction



      /******
       *  Submit the form that this  input field is part of.
       ******/
      submitForm: function() {
         var form = this.node.getClosest('form');

         form.trigger('submit');
      } // endfunction
   };



/**************** RANGE OBJECT ********************/

   function Range( obj ) {
      this.range = obj.getSelectionRange();
      this.len   = obj.domNode.value.length
      this.obj   = obj;

      this['0']  = this.range[0];
      this['1']  = this.range[1];
   } // endfunction

   Range.prototype = {
      valueOf : function(){
         var len = this.len - this.obj.domNode.value.length;
         return [ this.range[0] - len, this.range[1] - len ];
      }, // endfunction

      replaceWith : function( str ){
         var  val = this.obj.domNode.value
          , range = this.valueOf();

         return val.substr( 0, range[0] ) + str + val.substr( range[1] );
      } // endfunction
   };


   $.fn.iMask = function(options){
      this.each(function(){
         new iMask($(this), options);
      });
   };
})(jQuery);
