/***************
 *  This is a library for handling numeric string masks.
 * 
 ***************/



var myMask = ">>>,>>9.999";
var myInt = "1234";
var myDec = "02";

DIGITS = '0123456789';
DECIMAL_CHR = '.';
GROUP_CHR = ',';

/******
 *  Simple function to test a character to see if it's a digit.
 ******/
isDigit = function(str) {
   return (DIGITS.indexOf(str[0]) >= 0);
} // endfunction



/******
 *  Simple function to strip out all non-numeric info from a string and
 *  strip out any leading zeros. 
 ******/
stripAlpha = function(str) {
   var output = '';

   for (var i = 0; i < str.length; i += 1) {
      if (isDigit(str[i]) || str[i] == '-' || str[i] == DECIMAL_CHR) {
         output += str[i];
      } // endif
   } // endfor

   /* Strip off leading zeros. */
   output = output.replace(/^0+/, '');

   return output;
} // endfunction
      

/******
 *  Small function to clean up a numeric string and split it into
 *  two pieces at the decimal point.
 ******/
splitNumStr = function(numStr) {
   var strInt, strDec; 

   /* Strip out any junk from the strings. */
   numStr = stripAlpha(numStr);

   /* Figure out the integer and decimal portions of the number. */
   [intStr, decStr] = numStr.split(DECIMAL_CHR);
   decStr = (decStr == undefined) ? '' : decStr;

   return [intStr, decStr];
} // endfunction


/******
 *  Small function to split the number mask into integer and decimal
 *  portions.
 ******/
splitNumMask = function(numMask) {
   var intMask, decMask; 

   /* Figure out the integer and decimal portions of the number. */
   [intMask, decMask] = numMask.split(DECIMAL_CHR);
   decMask = (decMask == undefined) ? '' : decMask;

   return [intMask, decMask];
} // endfunction




/******
 *  Apply a number mask to a string.  
 ******/
wearNumMask = function(numStr, mask) {
   var intStr, decStr, intMask, decMask; 
   var maskPtr;
   var output = '';


   /* Break the number and the mask into their respective integer and
      decimal portions */
   [intStr, decStr] = splitNumStr(numStr);
   [intMask, decMask] = splitNumMask(mask);
   
 
   /****** INTEGER PORTION ******/

   /*
    *  Loop backwards through all the characters in the mask.
    *  One, by one we check the mask characters against the 
    *  string and figure out what to do.
    */
   intStrPtr = intStr.length - 1;
   for(maskPtr = intMask.length - 1; maskPtr >= 0;  maskPtr--) {
      
      /* Check the current mask character. */
      maskChr = intMask.charAt(maskPtr);
      switch(maskChr) {

         /*** OPTIONAL DIGIT ***/
         case '>':

            /* Check to see if we have a number to fill in a number 
               slot.  If so, use it.*/
            if (intStrPtr >= 0) {
               if (isDigit(intStr[intStrPtr])) {
                  output = intStr[intStrPtr] + output;
                  intStrPtr -= 1;
               } // endif
            } // endif
         break;


         /*** FORCED DIGIT ***/
         case '9':

            /* Check to see if we have a number to fill in a number 
               slot.  If so, use it. */
            if (intStrPtr >= 0) {
               output = intStr[intStrPtr] + output;
               intStrPtr -= 1;

            /* No more numbers, pad with a zero. */
            } else {
               output = '0' + output;
            } // endif
         break;


         /*** MINUS SIGN ***/
         case '-':
            
            /* The only way we can show a minus sign is if the string
               has a matching minus sign in the right spot. */
            if (intStr[intStrPtr] == '-') {
               output = '-' + output;
               intStrPtr -= 1;
            } // endif
         break;

  
         /*** GROUP CHARACTER ***/
         case GROUP_CHR:

            /* As long as we still have characters in the string left
               AND the next character is a digit, then we can put in a 
               group character. */
            if ((intStrPtr >= 0) && (isDigit(intStr[intStrPtr]))) {
               output = GROUP_CHR + output;
            } // endif
         break;


         /*** OTHER CHARACTERS ***/
         default:
            intStrPtr -= 1;
         break;
      } // endswitch
   } //endfor

   
   /*
    *  Check for number too large for mask!!!
    */
   if (intStrPtr > 0) {
      throw "MASK SIZE EXCEEDED";
   } // endif



   /****** DECIMAL PORTION ******/

   /* If we don't have a decimal mask then we're done. */
   if (decMask.length <= 0) { 
      return output;
   } // endif


   /*
    *  Loop forwards through all the characters in the decimal
    *  portion of the mask.  One, by one we check the mask characters 
    *  against the string and figure out what to do.
    */
   if (decStr.length == 0) {
      decStrPtr = -1;
   } else {
      decStrPtr = 0;
   } // endif

   output += '.';
   for(maskPtr = 0; maskPtr < decMask.length;  maskPtr += 1) {
      
      /* Check the current mask character. */
      maskChr = decMask.charAt(maskPtr);
      switch(maskChr) {

         /*** FORCED DIGIT ***/
         case '9':

            /* Check to see if we have a number to fill in a number 
               slot.  If so, use it. */
            if (decStr[decStrPtr]) {
               output += decStr[decStrPtr];
               decStrPtr += 1;

            /* No more numbers, pad with a zero. */
            } else {
               output += '0';
            } // endif
         break;


         /*** OTHER CHARACTERS ***/
         default:
            intStrPtr += 1;
         break;
      } // endswitch
   } //endfor

   return output;

} // endfunction


