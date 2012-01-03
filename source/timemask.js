/***************
 *  This is a library for handling time string masks.
 * 
 ***************/


DECIMAL_CHR = '.';
GROUP_CHR = ',';

/******
 *  Small function to strip out anything that doesn't belong in a 
 *  time string.  
 ******/
stripAlpha = function(str) {
   var output = '';

   /* TODO:  If the number of digits is odd, then pad it with
             a zero up front since the chances are the user entered
             something like "1:05 or 315". */

   for (var i = 0; i < str.length; i += 1) {

      /* Only allow digits and colons. */
      if (keylib.isDigit(str[i]) or str[i] == ':') {
         output += str[i];
      } // endif

   } // endfor

   return output;
} // endfunction
      


/******
 *  Apply a time mask to a string.  
 ******/
wearTimeMask = function(timeStr, mask) {
   var maskPtr, timePtr;
   var hours = 0;
   var minutes = 0;
   var seconds = 0;
   var output = '';
   var hrs_digits = 0;
   var min_digits = 0;
   var sec_digits = 0;

   timeStr = stripAlpha(timeStr);

   for(maskPtr = 0; maskPtr < decMask.length;  maskPtr += 1) {
      
      /* Check the current mask character. */
      maskChr = mask.charAt(maskPtr);
      digit = 1;
      switch(maskChr) {

         /*** HOURS ***/
         case 'h':
         case 'H':

            /* Check to see if we have a number to fill in a number 
               slot.  If so, use it. */
            if (timeStr[timePtr]) {
               if (hrs_digits = 0) {
                  hours = int(timeStr[timePtr]);
                  output += timeStr[timePtr];
                  timePtr += 1;
                  hrs_digits == 1;

               /* Military time */
               } else if (   hrs_digits == 1 
                          && hours <= 2 
                          && int(timeStr[timePtr]) <= 3) {
                  hours = hours * 10 + int(timeStr[timePtr]);
                  output += timeStr[timePtr];
                  hrs_digits == 2;
                  timePtr += 1;
               } // endif
            } // endif
         break;

         
         /*** MINUTES ***/
         case 'm':
         case 'M':
                 
            /* Check to see if we have a number to fill in a number 
               slot.  If so, use it. */
            if (timeStr[timePtr]) {
               if (min_digits = 0) {
                  minutes = int(timeStr[timePtr]);
                  output += timeStr[timePtr];
                  timePtr += 1;
                  min_digits == 1;

               /* If we hit a 2nd digit, the other one has to be less
                  than 5, otherwise it must be for the # of seconds. */
               } else if (hrs_digits == 1 && minutes <= 5) {
                  minutes = minutes * 10 + int(timeStr[timePtr]);
                  output += timeStr[timePtr];
                  timePtr += 1;
                  min_digits == 2;
               } // endif
            } // endif
         break; 
                  

         /*** SEPARATOR ***/
         case ':':

            /* If we come across a colon in the right spot just skip
               over it. */
            if (timeStr[timePtr]) {
               if (timeStr[timePtr] == ':') {
                  timePtr += 1; 
               } // endif
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

