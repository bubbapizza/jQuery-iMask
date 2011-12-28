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
   return (DIGITS.indexOf(str[0]) > 0);
} // endfunction



/******
 *  Apply this field's number mask.  Pass the integer and
 *  decimal portions of the number separately.
 ******/
wearNumMask = function(strInt, strDec, mask) {
   var decPtr, intMask, decMask;
   var output = '';


   /* Figure out the integer portion of the mask and the
      decimal portion of the mask. */
   decPtr = mask.indexOf(DECIMAL_CHR);
   if (decPtr < 0) {
      intMask = mask;
      decMask = '';
   } else {
      intMask = mask.substring(0, decPtr);
      decMask = mask.substring(decPtr + 1);
   } // endif

 
   /****** INTEGER PORTION ******/

   /*
    *  Loop backwards through all the characters in the mask.
    *  One, by one we check the mask characters against the 
    *  string and figure out what to do.
    */
   strIntPtr = strInt.length - 1;
   for(var maskPtr = mask.length - 1; maskPtr >= 0;  maskPtr--) {
      
      /* Check the current mask character. */
      maskChr = mask.charAt(maskPtr);
      switch(maskChr) {

         /*** OPTIONAL DIGIT ***/
         case '>':

            /* Check to see if we have a number to fill in a number 
               slot.  If so, use it.*/
            if (strIntPtr >= 0) {
               if (isDigit(strInt[strIntPtr])) {
                  output = strInt[strIntPtr] + output;
                  strIntPtr -= 1;
               } // endif
            } // endif
         break;


         /*** FORCED DIGIT ***/
         case '9':

            /* Check to see if we have a number to fill in a number 
               slot.  If so, use it. */
            if (strIntPtr >= 0) {
               output = strInt[strIntPtr] + output;
               strIntPtr -= 1;

            /* No more numbers, pad with a zero. */
            } else {
               output = '0' + output;
            } // endif
         break;


         /*** MINUS SIGN ***/
         case '-':
            
            /* The only way we can show a minus sign is if the string
               has a matching minus sign in the right spot. */
            if (strInt[strIntPtr] == '-') {
               output = '-' + output;
               strIntPtr -= 1;
            } // endif
         break;

  
         /*** GROUP CHARACTER ***/
         case GROUP_CHR:

            /* As long as we still have characters in the string left
               AND the next character is a digit, then we can put in a 
               group character. */
            if ((strIntPtr >= 0) && (isDigit(strInt[strIntPtr]))) {
               output = GROUP_CHR + output;
            } // endif
         break;


         /*** OTHER CHARACTERS ***/
         default:
         break;
      } // endswitch
   } //endfor

   
   /*
    *  Check for number too large for mask!!!
    */
   if (strIntPtr > 0) {
      throw "MASK SIZE EXCEEDED";
   } else { 
      return output;
   } // endif

} // endfunction


