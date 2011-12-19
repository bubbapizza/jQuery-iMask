var myMask = ">>>,>>9.999";
var myInt = "1234";
var myDec = "02";


DECIMAL_CHR = '.';
GROUP_CHR = ',';

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
   for(var maskPtr = mask.length - 1; maskPtr > 0;  maskPtr--) {
      
      /* Check the current mask character. */
      maskChr = mask.charAt(maskPtr);
      switch(maskChr) {

         /*** OPTIONAL DIGIT ***/
         case '>':

            /* Check to see if we have a number to fill in a number 
               slot.  If so, use it.*/
            if (strIntPtr >= 0) {
               output = strInt[strIntPtr] + output;
               strIntPtr -= 1;
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

            /* As long as we still have characters in the string left,
               we can put in a group character. */
            if (strIntPtr >= 0) {
               output = GROUP_CHR + output;
            } // endif
         break;
      } // endswitch
   } //endfor

   return output;
} // endfunction


var result = wearNumMask(myInt, myDec, myMask);

print (result);
