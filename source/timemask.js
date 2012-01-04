/***************
 *  This is a library for handling time string masks.
 * 
 ***************/


/******
 *  Small function to strip out anything that doesn't belong in a 
 *  time string.  This means all non-digit characters except ':' and
 *  'a', 'A', 'p' or 'P'. 
 ******/
stripAlpha = function(str) {
   var output = '';
   var found_ampm = false;

   for (var i = 0; i < str.length && found_ampm == false; i += 1) {

      /* Only allow digits and colons. */
      if (keylib.isDigit(str[i]) || str[i] == ':') {
         output += str[i];

      /* If we found an 'a' or 'p', we've hit the end, nothing else
         matters. */
      } else if (str[i].toLowerCase() == 'a' ||
                 str[i].toLowerCase() == 'p') {
         output += str[i];
         found_ampm = true;
      } // endif
   } // endfor

    
   return output;
} // endfunction
      


/******
 *  Apply a time mask to a string. To differentiate between military
 *  time and am/pm time, use one of the following masks for military time:
 *     hh:mm  
 *     HH:MM
 *     hh:mm:ss
 *     HH:MM:SS
 * 
 *  For am/pm time, use one of the following masks:
 *     >h:mm 
 *     >H:MM
 *     >h:mm:ss
 *     >H:MM:SS
 *   
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

   /* Strip out bad characters from the time string. */
   timeStr = stripAlpha(timeStr);

   timePtr = 0;
   for(maskPtr = 0; maskPtr < mask.length;  maskPtr += 1) {
      
      /* Check the current mask character. */
      maskChr = mask.charAt(maskPtr);
      print (maskChr, timePtr);
      print ("output='" + output + "'");
      digit = 1;
      switch(maskChr) {

         /*** HOURS ***/
         case 'h':
         case 'H':
            print(timeStr[timePtr], "processing H");

            /* Check to see if we have a number to fill in a number 
               slot.  If so, use it. */
            if (timeStr[timePtr]) {
               if (hrs_digits == 0) {
                  print("check 1");
                  hours = parseInt(timeStr[timePtr]);
                  output += timeStr[timePtr];
                  hrs_digits = 1;

               /* Military time */
               } else if (hrs_digits == 1) { 
                  hours = hours * 10 + parseInt(timeStr[timePtr]);
                  if (hours < 24) {
                     output += timeStr[timePtr];
                     hrs_digits = 2;
                  } // endif
               } // endif

               timePtr += 1;
            } // endif
         break;

         
         /*** MINUTES ***/
         case 'm':
         case 'M':
                 
            /* Check to see if we have a number to fill in a number 
               slot.  If so, use it. */
            if (timeStr[timePtr]) {
               if (min_digits == 0) {
                  minutes = parseInt(timeStr[timePtr]);
                  output += timeStr[timePtr];
                  min_digits = 1;

               /* If we hit a 2nd digit, the other one has to be less
                  than 5, otherwise it must be for the # of seconds. */
               } else if (hrs_digits == 1 && minutes <= 5) {
                  minutes = minutes * 10 + parseInt(timeStr[timePtr]);
                  output += timeStr[timePtr];
                  min_digits = 2;
               } // endif

               timePtr += 1;
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

            output += ':';

         break;
    

         /*** OTHER CHARACTERS ***/
         default:
            intStrPtr += 1;
         break;
      } // endswitch
   } //endfor

   return output;

} // endfunction

