(function($){
	var $chk = function(obj){
		return !!(obj || obj === 0);
	};

	/**
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
	 * @param {Function} [options.onFocus]
	 * @param {Function} [options.onBlur]
	 * @param {Function} [options.onValid]
	 * @param {Function} [options.onInvalid]
	 * @param {Function} [options.onKeyDown]
	 * @param {Number}   [options.groupDigits=3]
	 * @param {Number}   [options.decDigits=2]
	 * @param {String}   [options.currencySymbol]
	 * @param {String}   [options.groupSymbol=',']
	 * @param {String}   [options.decSymbol='.']
	 * @param {Boolean}  [options.showMask=true]
	 * @param {Boolean}  [options.stripMask=false]
	 * @param {Object}   [options.number] Override options for when validating numbers only
	 * @param {Boolean}  [options.number.stripMask=false]
	 * @param {Boolean}  [options.number.showMask=false]
	 */
	var iMask = function(){
		this.initialize.apply(this, arguments);
	};

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

			if(options.type == "number") this.node.css("text-align", "right");

			this.node
				.bind("mousedown click", function(ev){ ev.stopPropagation(); ev.preventDefault(); })

				.bind("mouseup",  this.onMouseUp.bind(this)  )
				.bind("keydown",  this.onKeyDown.bind(this)  )
				.bind("keypress", this.onKeyPress.bind(this) )
				.bind("focus",    this.onFocus.bind(this)    )
				.bind("blur",     this.onBlur.bind(this)     );
		},

		onMouseUp: function(ev) {
			ev.stopPropagation();
			ev.preventDefault();

			if(this.options.type == "fixed") {
				var p = this.getSelectionStart();
				this.setSelection(p, (p + 1));
			} else if(this.options.type == "number") {
				this.setEnd();
			}
		},

		onKeyDown: function(ev) {
			if(ev.ctrlKey || ev.altKey || ev.metaKey) {
				return;

			} else if(ev.which == 13) { // enter
				this.node.blur();

				this.submitForm(this.node);

			} else if(!(ev.which == 9)) { // tab
				ev.preventDefault();

				if(this.options.type == "fixed") {
					var p = this.getSelectionStart();
					switch(ev.which) {
						case 8: // Backspace
							this.updSelection(p, this.options.maskEmptyChr);
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
							this.updSelection(p, this.options.maskEmptyChr);
							this.selectNext();
							break;
						default:
							var chr = this.chrFromEv(ev);
							if(this.isViableInput(p, chr)) {
								if(ev.shiftKey)
									{this.updSelection(p, chr.toUpperCase());}
								else
									{this.updSelection(p, chr);}
								this.node.trigger("valid", ev, this.node);
								this.selectNext();
							} else {
								this.node.trigger("invalid", ev, this.node);
							}
							break;
					}
				} else if(this.options.type == "number") {
					switch(ev.which) {
						case 8:  // backspace
						case 46: // delete
							this.popNumber();
							break;
						default:
							var chr = this.chrFromEv(ev);
							if(this.options.validNumbers.indexOf(chr) >= 0) {
								var val = this.sanityTest(this.domNode.value + chr);
								if(val !== false){
									this.pushNumber(chr);
								}
								this.node.trigger("valid", ev, this.node);
							} else {
								this.node.trigger("invalid", ev, this.node);
							}
							break;
					}
				}
			}
		},

		onKeyPress: function(ev) {
			var key = ev.which || ev.keyCode;

			if(
				   !(key == 9) // tab
				&& !(key == 13) // enter
				&& !(ev.ctrlKey || ev.altKey || ev.metaKey)
			) {
				ev.preventDefault();
				ev.stopPropagation();
			}
		},

		onFocus: function(ev) {
			ev.stopPropagation();
			ev.preventDefault();

			this.options.showMask && (this.domNode.value = this.wearMask(this.domNode.value));
			this.sanityTest(this.domNode.value);

			var self = this;

			setTimeout( function(){
				self[ self.options.type === "fixed" ? 'selectFirst' : 'setEnd' ]();
			}, 1 );
		},

		onBlur: function(ev) {
			ev.stopPropagation();
			ev.preventDefault();

			if(this.options.stripMask)
				this.domNode.value = this.stripMask();
		},

		selectAll: function() {
			this.setSelection(0, this.domNode.value.length);
		},

		selectFirst: function() {
			for(var i = 0, len = this.options.mask.length; i < len; i++) {
				if(this.isInputPosition(i)) {
					this.setSelection(i, (i + 1));
					return;
				}
			}
		},

		selectLast: function() {
			for(var i = (this.options.mask.length - 1); i >= 0; i--) {
				if(this.isInputPosition(i)) {
					this.setSelection(i, (i + 1));
					return;
				}
			}
		},

		selectPrevious: function(p) {
			if(!$chk(p)){ p = this.getSelectionStart(); }

			if(p <= 0) {
				this.selectFirst();
			} else {
				if(this.isInputPosition(p - 1)) {
					this.setSelection(p - 1, p);
				} else {
					this.selectPrevious(p - 1);
				}
			}
		},

		selectNext: function(p) {
			if(!$chk(p)){ p = this.getSelectionEnd(); }

			if(p >= this.options.mask.length) {
				this.selectLast();
			} else {
				if(this.isInputPosition(p)) {
					this.setSelection(p, (p + 1));
				} else {
					this.selectNext(p + 1);
				}
			}
		},

		setSelection: function(a, b) {
			if(this.domNode.setSelectionRange) {
				this.domNode.focus();
				this.domNode.setSelectionRange(a, b);
			} else if(this.domNode.createTextRange) {
				var r = this.domNode.createTextRange();
				r.collapse();
				r.moveStart("character", a);
				r.moveEnd("character", (b - a));
				r.select();
			}
		},

		updSelection: function(p, chr) {
			var value = this.domNode.value;
			var output = "";
			output += value.substring(0, p);
			output += chr;
			output += value.substr(p + 1);
			this.domNode.value = output;
			this.setSelection(p, (p + 1));
		},

	 	setEnd: function() {
			var len = this.domNode.value.length;
			this.setSelection(len, len);
		},

		getSelectionStart: function() {
			var p = 0;
			if(this.domNode.selectionStart) {
				if(typeof(this.domNode.selectionStart) == "number") p = this.domNode.selectionStart;
			} else if(document.selection) {
				var r = document.selection.createRange().duplicate();
				r.moveEnd("character", this.domNode.value.length);
				p = this.domNode.value.lastIndexOf(r.text);
				if(r.text == "") p = this.domNode.value.length;
			}
			return p;
		},

		getSelectionEnd: function() {
			var p = 0;
			if(this.domNode.selectionEnd) {
				if(typeof(this.domNode.selectionEnd) == "number")
					{p = this.domNode.selectionEnd;}
			} else if(document.selection) {
				var r = document.selection.createRange().duplicate();
				r.moveStart("character", -this.domNode.value.length);
				p = r.text.length;
			}
			return p;
		},

		isInputPosition: function(p) {
			var mask = this.options.mask.toLowerCase();
			var chr = mask.charAt(p);
			if("9ax".indexOf(chr) >= 0)
				return true;
			return false;
		},

		sanityTest: function(str, p){
			var sanity = this.options.sanity;

			if(sanity instanceof RegExp){
				return sanity.test(str);
			}else if($.isFunction(sanity)){
				var ret = sanity(str, p);
				if(typeof(ret) == 'boolean'){
					return ret;
				}else if(typeof(ret) != 'undefined'){
					if(this.options.type == 'fixed'){
						var p = this.getSelectionStart();
						this.domNode.value = this.wearMask(ret);
						this.setSelection(p, p+1);
						this.selectNext();
					}else if(this.options.type == 'number'){
						this.domNode.value = ret;
						this.formatNumber();
					}
					return false;
				}
			}
		},

		isViableInput: function(p, chr) {
			var mask   = this.options.mask.toLowerCase();
			var chMask = mask.charAt(p);

			var val = this.domNode.value.split('');
			val.splice(p, 1, chr);
			val = val.join('');

			var ret = this.sanityTest(val, p);
			if(typeof(ret) == 'boolean'){ return ret; }

			if(({
				'9' : this.options.validNumbers,
				'a' : this.options.validAlphas,
				'x' : this.options.validAlphaNums
			}[chMask] || '').indexOf(chr) >= 0){
				return true;
			}
//			var nextIndex = this.options.mask.indexOf(chr, 

			return false;
		},

		wearMask: function(str) {
			var mask = this.options.mask.toLowerCase();
			var output = "";

			for(var i = 0, u = 0, len = mask.length; i < len; i++) {
				switch(mask.charAt(i)) {
					case '9':
						if((this.options.validNumbers.indexOf(str.charAt(u).toLowerCase()) >= 0) && (str.charAt(u) != "")) {
							output += str.charAt(u++);
						} else {
							output += this.options.maskEmptyChr;
						}
						break;

					case 'a':
						if((this.options.validAlphas.indexOf(str.charAt(u).toLowerCase()) >= 0) && (str.charAt(u) != "")) {
							output += str.charAt(u++);
						} else {
							output += this.options.maskEmptyChr;
						}
						break;

					case 'x':
						if((this.options.validAlphaNums.indexOf(str.charAt(u).toLowerCase()) >= 0) && (str.charAt(u) != "")) {
							output += str.charAt(u++);
						} else {
							output += this.options.maskEmptyChr;
						}
						break;

					default:
						output += mask.charAt(i);
						if(str.charAt(u) == mask.charAt(i)){
							u++;
						}

						break;
				}
			}
			return output;
		},

		stripMask: function() {
			var value = this.domNode.value;
			if("" == value) return "";
			var output = "";
			if(this.options.type == "fixed") {
				for(var i = 0, len = value.length; i < len; i++) {
					if((value.charAt(i) != this.options.maskEmptyChr) && (this.isInputPosition(i)))
						{output += value.charAt(i);}
				}
			} else if(this.options.type == "number") {
				for(var i = 0, len = value.length; i < len; i++) {
					if(this.options.validNumbers.indexOf(value.charAt(i)) >= 0)
						{output += value.charAt(i);}
				}
			}
			return output;
		},

		chrFromEv: function(ev) {
			var chr = '', key = ev.which;

			if(key >= 96 && key <= 105){ key -= 48; } // shift number-pad numbers to corresponding character codes
			chr = String.fromCharCode(key);           // key pressed as a lowercase string
			return chr;
		},

		pushNumber: function(chr) {
			this.domNode.value = this.domNode.value + chr;
			this.formatNumber();
		},

		popNumber: function() {
			this.domNode.value = this.domNode.value.substring(0, (this.domNode.value.length - 1));
			this.formatNumber();
		},

		formatNumber: function() {
			// stripLeadingZeros
			var str2 = this.stripMask();
			var str1 = "";
			for(var i = 0, len = str2.length; i < len; i++) {
				if('0' != str2.charAt(i)) {
					str1 = str2.substr(i);
					break;
				}
			}

			// wearLeadingZeros
			str2 = str1;
			str1 = "";
			for(var len = str2.length, i = this.options.decDigits; len <= i; len++) {
				str1 += "0";
			}
			str1 += str2;

			// decimalSymbol
			str2 = str1.substr(str1.length - this.options.decDigits)
			str1 = str1.substring(0, (str1.length - this.options.decDigits))

			// groupSymbols
			var re = new RegExp("(\\d+)(\\d{"+ this.options.groupDigits +"})");
			while(re.test(str1)) {
				str1 = str1.replace(re, "$1"+ this.options.groupSymbol +"$2");
			}

			this.domNode.value = this.options.currencySymbol + str1 + this.options.decSymbol + str2;
		},

		getObjForm: function() {
			return this.node.getClosest('form');
		},

		submitForm: function() {
			var form = this.getObjForm();
			form.trigger('submit');
		}
	};

	$.fn.iMask = function(options){
		this.each(function(){
			new iMask($(this), options);
		});
	};
})(jQuery);