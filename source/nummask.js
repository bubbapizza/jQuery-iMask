/***************
 *  This is a library for handling numeric string masks.
 * 
 ***************/


DECIMAL_CHR = '.';
GROUP_CHR = ',';

/******
 *  Small function to strip out anything that doesn't belong in a 
 *  number.  This includes all alphabetic characters, non-leading
 *  negative signs, and multiple decimal points.
 *  or minus sign.  This also  strips out any leading zeros.  
 ******/
stripAlpha = function(str) {
   var output = '';
   var allow_minus_sign = true;
   var allow_decimal_point = true;
   var allow_zeros = false;

   for (var i = 0; i < str.length; i += 1) {

      /* Allow a single leading minus sign. */
      if (str[i] == '-' && allow_minus_sign) {
         output += str[i];
         allow_minus_sign = false;

      /* Allow a single decimal point.  Once we hit the decimal point,
         we can also allow zeros. */
      } else if (str[i] == DECIMAL_CHR && allow_decimal_point) {
         output += str[i];
         allow_decimal_point = false;
         allow_zeros = true;

      } else if (keylib.isDigit(str[i])) {

         /* Check for a digit from 1-9. */
         if (allow_zeros || str[i].match(/[1-9]/)) {
            output += str[i];

            /* Once we hit a non-zero digit, no minus signs allowed
               but zeros are now allowed. */
            allow_minus_sign = false;
            allow_zeros = true;
         } // endif
      } // endif

   } // endfor

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
               if (keylib.isDigit(intStr[intStrPtr])) {
                  output = intStr[intStrPtr] + output;
                  intStrPtr -= 1;
               } // endif
            } // endif
         break;


         /*** FORCED DIGIT ***/
         case '9':

            /* If we still have some characters in the integer portion
               of the string, figure out what to put in this slot. */
            if (intStrPtr >= 0) {

               /* If we're at the minus sign, we've run out of 
                  numbers so fill with a zero. */
               if (intStr[intStrPtr] == '-') {
                  output = '0' + output;

               /* If we've got a digit, use it. */
               } else if (keylib.isDigit(intStr[intStrPtr])) {
                  output = intStr[intStrPtr] + output;
                  intStrPtr -= 1;
               } // endif

            /* No more numbers, fill the slot with a zero. */
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
            if ((intStrPtr >= 0) && (keylib.isDigit(intStr[intStrPtr]))) {
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
   if (intStrPtr >= 0) {
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

   /* If the string doesn't have a decimal portion, we have to set the
      pointer to a negative value so we don't index errors. */
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


