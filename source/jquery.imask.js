/******
 *  This is a function that returns character or string that corresponds
 *  to the keycode pressed.  
 *  
 *  @param {integer} key
 *    This is the keycode returned by a keystroke event
 *  @param {boolean} shift
 *    If true, this will return characters that would result if the
 *    shift key was held down while the key was pressed.
 *  
 ******/
chrFromKey: function(key, shift) {
   var chr = ''
     , keys = {
            8 : "backspace"
        ,   9 : "tab"
        ,  13 : "enter"
        ,  16 : "shift"
        ,  17 : "ctrl"
        ,  18 : "alt"
        ,  19 : "pause/break"
        ,  20 : "caps-lock"
        ,  27 : "escape"
        ,  33 : "page-up"
        ,  34 : "page-down"
        ,  35 : "end"
        ,  36 : "home"
        ,  37 : "left-arrow"
        ,  38 : "up-arrow"
        ,  39 : "right-arrow"
        ,  40 : "down-arrow"
        ,  45 : "insert"
        ,  46 : "delete"
        ,  48 : "0"
        ,  49 : "1"
        ,  50 : "2"
        ,  51 : "3"
        ,  52 : "4"
        ,  53 : "5"
        ,  54 : "6"
        ,  55 : "7"
        ,  56 : "8"
        ,  57 : "9"
        ,  65 : "a"
        ,  66 : "b"
        ,  67 : "c"
        ,  68 : "d"
        ,  69 : "e"
        ,  70 : "f"
        ,  71 : "g"
        ,  72 : "h"
        ,  73 : "i"
        ,  74 : "j"
        ,  75 : "k"
        ,  76 : "l"
        ,  77 : "m"
        ,  78 : "n"
        ,  79 : "o"
        ,  80 : "p"
        ,  81 : "q"
        ,  82 : "r"
        ,  83 : "s"
        ,  84 : "t"
        ,  85 : "u"
        ,  86 : "v"
        ,  87 : "w"
        ,  88 : "x"
        ,  89 : "y"
        ,  90 : "z"
        ,  91 : "left-window-key"
        ,  92 : "right-window-key"
        ,  93 : "select-key"
        ,  96 : "numpad-0"
        ,  97 : "numpad-1"
        ,  98 : "numpad-2"
        ,  99 : "numpad-3"
        , 100 : "numpad-4"
        , 101 : "numpad-5"
        , 102 : "numpad-6"
        , 103 : "numpad-7"
        , 104 : "numpad-8"
        , 105 : "numpad-9"
        , 106 : "multiply"
        , 107 : "add"
        , 109 : "subtract"
        , 110 : "decimal-point"
        , 111 : "divide"
        , 112 : "f1"
        , 113 : "f2"
        , 114 : "f3"
        , 115 : "f4"
        , 116 : "f5"
        , 117 : "f6"
        , 118 : "f7"
        , 119 : "f8"
        , 120 : "f9"
        , 121 : "f10"
        , 122 : "f11"
        , 123 : "f12"
        , 144 : "num-lock"
        , 145 : "scroll-lock"
        , 186 : "semi-colon"
        , 187 : "equal-sign"
        , 188 : "comma"
        , 189 : "dash"
        , 190 : "period"
        , 191 : "forward-slash"
        , 192 : "grave-accent"
        , 219 : "open-bracket"
        , 220 : "back-slash"
        , 221 : "close-braket"
        , 222 : "single-quote"
       } 
     , shiftkeys = {
            8 : "backspace"
        ,   9 : "tab"
        ,  13 : "enter"
        ,  16 : "shift"
        ,  17 : "shift-ctrl"
        ,  18 : "shift-alt"
        ,  19 : "pause/break"
        ,  20 : "caps-lock"
        ,  27 : "escape"
        ,  33 : "page-up"
        ,  34 : "page-down"
        ,  35 : "end"
        ,  36 : "home"
        ,  37 : "left-arrow"
        ,  38 : "up-arrow"
        ,  39 : "right-arrow"
        ,  40 : "down-arrow"
        ,  45 : "insert"
        ,  46 : "delete"
        ,  48 : ")"
        ,  49 : "!"
        ,  50 : "@"
        ,  51 : "#"
        ,  52 : "$"
        ,  53 : "%"
        ,  54 : "^"
        ,  55 : "&"
        ,  56 : "*"
        ,  57 : "("
        ,  65 : "A"
        ,  66 : "B"
        ,  67 : "C"
        ,  68 : "D"
        ,  69 : "E"
        ,  70 : "F"
        ,  71 : "G"
        ,  72 : "H"
        ,  73 : "I"
        ,  74 : "J"
        ,  75 : "K"
        ,  76 : "L"
        ,  77 : "M"
        ,  78 : "N"
        ,  79 : "O"
        ,  80 : "P"
        ,  81 : "Q"
        ,  82 : "R"
        ,  83 : "S"
        ,  84 : "T"
        ,  85 : "U"
        ,  86 : "V"
        ,  87 : "W"
        ,  88 : "X"
        ,  89 : "Y"
        ,  90 : "Z"
        ,  91 : "shift-left-window-key"
        ,  92 : "shift-right-window-key"
        ,  93 : "select-key"
        ,  96 : "numpad-0"
        ,  97 : "numpad-1"
        ,  98 : "numpad-2"
        ,  99 : "numpad-3"
        , 100 : "numpad-4"
        , 101 : "numpad-5"
        , 102 : "numpad-6"
        , 103 : "numpad-7"
        , 104 : "numpad-8"
        , 105 : "numpad-9"
        , 106 : "multiply"
        , 107 : "+"
        , 109 : "-"
        , 110 : "."
        , 111 : "/"
        , 112 : "shift-f1"
        , 113 : "shift-f2"
        , 114 : "shift-f3"
        , 115 : "shift-f4"
        , 116 : "shift-f5"
        , 117 : "shift-f6"
        , 118 : "shift-f7"
        , 119 : "shift-f8"
        , 120 : "shift-f9"
        , 121 : "shift-f10"
        , 122 : "shift-f11"
        , 123 : "shift-f12"
        , 144 : "num-lock"
        , 145 : "scroll-lock"
        , 186 : ":"
        , 187 : "+"
        , 188 : "<"
        , 189 : "_"
        , 190 : ">"
        , 191 : "?"
        , 192 : "grave-accent"
        , 219 : "{"
        , 220 : "|"
        , 221 : "}"
        , 222 : '"'
       };

   console.log("key=", key, keys[key]); 

   /* Shift number-pad numbers to corresponding character codes. */
   if (key >= 96 && key <= 105) { 
      key -= 48; 

   /* MINUS SIGN */
   } else if (key == 109 || key == 189 || key == 45) {
      return '-';

   /* PERIOD */
   } else if (key == 190 || key == 46) {
      return '.';
   } // endif

   return keys[key];
}, // endfunction



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
    * @param {String}    options.type (number|fixed)
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
    * @param {Function} [options.sanity]
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
      },

      initialize: function(node, options) {
         this.node    = node;
         this.domNode = node[0];
         this.options = $.extend({}, this.options, this.options[options.type] || {}, options);
         var self     = this;

    
         if (this.isNumber()) {
            this.node.css("text-align", "right");
     
            /* If we have a mask, figure out the decDigits option. */
            var decPos = this.options.mask.indexOf(this.options.decSymbol);
            if (decPos > 0) {
               this.options.decDigits = 
                  this.options.mask.length - decPos - 1;
            } // endif
         } // endif

         this.node
            .bind( "mousedown click", function(ev) { 
               ev.stopPropagation(); ev.preventDefault(); } )

            .bind( "mouseup",  function() { 
               self.onMouseUp .apply(self, arguments); } )

            .bind( "keydown",  function() { 
               self.onKeyDown .apply(self, arguments); } )

            .bind( "keypress", function() { 
               self.onKeyPress.apply(self, arguments); } )

            .bind( "focus",    function() { 
               self.onFocus   .apply(self, arguments); } )

            .bind( "blur",     function() { 
               self.onBlur    .apply(self, arguments); } );
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

         ev.stopPropagation();
         ev.preventDefault();

         if( this.isFixed() ) {
            var p = this.getSelectionStart();
            this.setSelection(p, (p + 1));
         } else if(this.isNumber() ) {
            this.setCursorEnd();
         } // endif
      }, // endfunction



      /***********
       * KEY DOWN
       ***********/
      onKeyDown: function(ev) {
         console.log('keydown', ev);

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
            if(this.isFixed()) {
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
                     if( this._isViableFixedInput( p, chr ) ) {
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
            } else if (this.isNumber()) {

               /* See which key was pressed. */
               switch(ev.which) {

                  /* For cursor movement keys, we don't do anything, 
                     just let the browser do it's thing. */
                  case 35: // END
                  case 36: // HOME
                  case 37: // LEFT
                  case 38: // UP
                  case 39: // RIGHT
                  case 40: // DOWN
                     break;

                  /* For backspace & delete, format the number, then 
                     apply the key and format the number afterwards. */
                  case 8:  // backspace
                  case 46: // delete
                     var self = this;
                     setTimeout(function(){
                        self.formatNumber();
                     }, 1);
                     break;


                  /* For all other keys we fire a valid or invalid 
                     trigger. */
                  default:
                     ev.preventDefault();

                     /* Figure out whay key the user pressed and check
                        to see if it was bogus or not. */
                     var chr = this.chrFromEv(ev);
                     if( this._isViableNumericInput(chr) ) {

                        var range = new Range(this);
                        var val = this.sanityTest(range.replaceWith(chr));

                        /* 
                         *  We got a valid key so run the sanity check 
                         *  against the new value and trigger the 'valid'
                         *  event.
                         */
                        if(val !== false) {
                           this.updateSelection( chr );
                           this.formatNumber();
                        } // endif
                        this.node.trigger( "valid", ev, this.node );

                     /* Bogus key - trigger the 'invalid' event. */
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

         /* Make sure this event doesn't trigger anything else higher
            up in the DOM. */
         ev.stopPropagation();
         ev.preventDefault();

         console.log("showmask=" + this.options.showMask);
         if (this.options.showMask) {
            var mask = this.options.mask.toLowerCase()
            this.domNode.value = 
              this._wearMask(this.domNode.value, mask);
         } //endif 

         /* Run the sanity test on the text field's value. */
         this.sanityTest( this.domNode.value );


         /* 
          *  This is a weird way to position the cursor but that's what this
          *  code does.  One millisecond after the onFocus event triggers,
          *  a function is called for positioning the cursor.
          */
         var self = this;
         setTimeout( 
               function(){
                  if (self.isFixed()) {
                     self.selectFirst();
                  } else if (self.isNumber()) {
                     self.setCursorIntStart();
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
       *  This method is the workhorse of cursor movement.  It selects
       *  text from cursor position 'a' to cursor position 'b'.  
       *  After calling this function, the current cursor position will
       *  be set to position 'b'.
       *
       *  Instead of passing two distinct integers, 'a' and 'b', you can
       *  pass an array with 2 elements in it.
       *
       *  NOTE: Positions a and b are ALWAYS computed from left to
       *  right, even if you're updating a numeric field.  
       *  
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
       *  Return the position for the start of the currently selected 
       *  text.  This may or may not be the current cursor position.
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
       *  Return the position for the end of the currently selected 
       *  text.  This may or may not be the current cursor position.
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


      /****** 
       *  Return a 2 element array containing the start & end of
       *  the current selection.  
       ******/
      getSelectionRange : function(){
         return [ this.getSelectionStart(), this.getSelectionEnd() ];
      }, // endfunction



      /************ CURSOR POSITIONING **********/
     
      /****** 
       *  Move the cursor to the end of the text field.
       ******/
      setCursorEnd: function() {
         var len = this.domNode.value.length;
         this.setSelection(len, len);
      }, // endfunction


      /****** 
       *  Move the cursor to the gap immediately to the left of the
       *  decimal point for a numeric mask.
       ******/
      setCursorIntStart: function() {
         var pos;

         if (this.isNumber()) {
            pos = this.domNode.value.length - this.options.decDigits - 1;
            this.setSelection(pos, pos);
         } // endif 
      }, // endfunction
      

      /****** 
       *  Move the cursor to the gap immediately to the right of the
       *  decimal point for a numeric mask.
       ******/
      setCursorDecStart: function() {
         var pos;

         if (this.isNumber()) {
            pos = this.domNode.value.length - this.options.decDigits;
            this.setSelection(pos, pos);
         } // endif 
      }, // endfunction




      /************ SELECT FIXED FIELD CHARACTERS **********/

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


      /****** 
       *  Select the previous updateable character in the field.
       ******/
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


      /****** 
       *  Select the next updateable character in the field.
       ******/
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
            var sanityCheck = sanity(str, p);

            /* See if we got a boolean back.  If so, just return it. */
            if(typeof(sanityCheck) == 'boolean') {
               return sanityCheck;

            /* If we got an undefined value back, don't return anything */
            } else if(typeof(sanityCheck) != 'undefined') {

               /* If this field is a string mask, apply the mask to 
                  the returned sanity value and show it in the input
                  field. */
               if( this.isFixed() ){
                  var p = this.getSelectionStart();
                  var mask = this.options.mask.toLowerCase()

                  this.domNode.value = this._wearMask(sanityCheck, mask);
                  this.setSelection( p, p+1 );
                  this.selectNext();

               /* For numbers, format the sanity value into a number and
                  display it in the input field. */
               }else if( this.isNumber() ){
                  var range = new Range( this );
                  this.domNode.value = sanityCheck;
                  this.setSelection( range );
                  this.formatNumber();
               } // endif

               return false;
            } // endif

         } // endif
      }, // endfunction



      /******
       *  This function checks to see if a fixed input character is
       *  valide based on the current cursor position.
       ******/
      _isViableFixedInput : function( p, chr ){
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
       *  This function checks to make sure the given character is
       *  a valid keystroke that can be pressed while typing in a number. 
       ******/
      _isViableNumericInput : function(chr){
         /* See if the character is a numeric digit. */
         var validDigit = !(this.options.validNumbers.indexOf( chr ) < 0);

         /* The character may also be a decimal symbol. */
         return validDigit || (chr == this.options.decSymbol)
      }, // endfunction



/**************** MASKING ********************/

      /******
       *  Apply this field's mask to a given string.
       ******/
      _wearMask: function(str, mask) {

         /* If this is a number field, format it as a number and leave. */
         if (this.isNumber()) { 
            var self = this;
            setTimeout(function(){
               self.formatNumber();
            }, 1);
            return;
         } // endif


            
         var output = ""
          , chrSets = {
              '9' : 'validNumbers'
            , 'a' : 'validAlphas'
            , 'x' : 'validAlphaNums'
         };

         /*
          *  Loop through all the characters in the mask.
          *  One, by one we check the mask characters against the 
          *  string and figure out what to do.
          */
         strPtr = 0;
         for(var maskPtr = 0; maskPtr < mask.length; maskPtr++) {
            
            /* Check the current mask character. */
            maskChr = mask.charAt(maskPtr);
            switch(maskChr) {

               /*** PLACEHOLDER CHARACTERS ***/
               case '9':
               case 'a':
               case 'x':

                  /* Get the list of valid characters to check against. */
                  validChrSet = this.options[chrSets[maskChr]];
                  strChr = str.charAt(strPtr++).toLowerCase();

                  /* If we have a valid character in the string, then
                     it goes in the output string. */
                  if ((validChrSet.indexOf(strChr) >= 0) &&
                      (strChr != "")) { 
                     output += strChr;

                  /* Otherwise, it's bogus so put an empty character. */
                  } else {
                     output += this.options.maskEmptyChr;
                  } // endif
                     
                  break;


               /*** OTHER CHARACTERS ***/
               default:
                  /* Other characters automatically go in the output. */
                  output += maskChr;

                  /* If the current string character actually matches the 
                     mask character, then we have to increment the string
                     character pointer. */
                  if( str.charAt(strPtr) == maskChr ){
                     strPtr += 1;
                  } // endif

                  break;
            } // endswitch
         } // endfor
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
            a digit, period or negative sign. */
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
       *  Format a number field based on the options set.
       ******/
      formatNumber: function() {
         var cleanVal; 
         var range = new Range(this);
         var strInteger;
         var strDecimal;
         var regExp;
         console.log("formatNumber");
         console.log(range);

         /******* FIXED NUMBER MASK ******/

         /* 
          *  If this field has a number mask, then apply it and we're
          *  done. 
          */
         if (this.options.mask) {
            this.domNode.value = wearNumMask(
               this.domNode.value, this.options.mask);

               /* Reset the selection range. */
               this.setSelection( range );
            return;
         } // endif



         /******* VARIABLE NUMBER MASK *******/ 

         /* Clean up the input value by stripping away the mask and any
            leading zeros. */
         cleanVal = this.stripMask().replace(/^0+/, '' );
          
         /* If the cleaned up number has less digits than the number
            of decimal digits, then then we have to pad it with zeros. */
         for(var i = cleanVal.length; i <= this.options.decDigits; i++) {
            cleanVal = "0" + cleanVal;
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
               regExp, "$1"+ this.options.groupSymbol +"$2");
         } // endwhile


         /* 
          *  Put everything together and save it in the input field.
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


   /*********
    *  The Range object is used for getting the currently selected
    *  text of the iMask field passed to it.  
    *
    *  @param {object} obj
    *    the iMask object that this range is for.
    *  @param {integer} len
    *    The length of the value in the input field
    *  @param {Array(2)} range
    *    The start and end position of the currently selected text.
    *********/
    
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


/**************** JQUERY PLUGIN STUFF *************/

   $.fn.iMask = function(options){
      this.each(function(){
         new iMask($(this), options);
      });
   };
})(jQuery);
