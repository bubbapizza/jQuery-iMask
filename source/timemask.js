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
   var maskPtr, strPtr;
   var hours = 0;
   var minutes = 0;
   var seconds = 0;
   var output = '';
   var hrs_digit = 0;
   var min_digit = 0;
   var sec_digit = 0;

   mask = mask.toLowerCase()

   /* Figure out what the time format is and return if we get a 
      bogus mask. */
   var military_time = (mask[0] == 'h');
   var normal_time = (mask[0] == '>');
   if (military_time == false and normal_time == false) {
      return "00:00:00";
   } // endif


   /* Strip out bad characters from the time string. */
   timeStr = stripAlpha(timeStr);

   strPtr = 0;
   for(maskPtr = 0; maskPtr < mask.length;  maskPtr += 1) {
      
      /* Check the current mask character. */
      maskChr = mask.charAt(maskPtr);
      print (maskChr, strPtr);
      print ("output='" + output + "'");
      digit = 1;
      switch(maskChr) {

         /*** HOURS ***/
         case 'h':
         case 'H':

            /* Check to see if we have a number to fill in an 'h'
               slot.  If so, use it. */
            if (timeStr[strPtr]) {
               if (keylib.isDigit(timeStr[strPtr])) {

                  /** FIRST DIGIT **/
                  if (hrs_digits == 0) {
                     hours = parseInt(timeStr[strPtr]);

                     /* If the first digit is > 2 AND its military time,
                        then there's no way we have any more valid hours 
                        digits coming after that. */ 
                     if (hours > 2) { 
                        output = '0' + timeStr[strPtr];
                        hrs_digits == 2;
                        strPtr += 1;

                     /* We may or may not have a 2nd digit so keep 
                        going. */
                     } else {
                        output += timeStr[strPtr];
                        hrs_digits == 1;
                        strPtr += 1;
                     } // endif
   

                  /** 2ND DIGIT **/
                  } else if (hrs_digits == 1) { 
                     hours = hours * 10 + parseInt(timeStr[strPtr]);

                     /* If the second digit is less than 24 then we can
                        use it for the 2nd digit of the hours slot. */
                     if (hours < 24) {
                        output += timeStr[strPtr];
                        hrs_digits = 2;
                        strPtr += 1;

                     /* We don't have a 2nd digit, so the hours slots 
                        are now all filled up. */
                     } else {
                        hrs_digits = 2;
                     } // endif
                  } // endif

            } // endif
         break;

         
         /*** MINUTES ***/
         case 'm':
         case 'M':
                 
            /* Check to see if we have a number to fill in a number 
               slot.  If so, use it. */
            if (timeStr[strPtr]) {
               if (min_digits == 0) {
                  minutes = parseInt(timeStr[strPtr]);
                  output += timeStr[strPtr];
                  min_digits = 1;

               /* If we hit a 2nd digit, the other one has to be less
                  than 5, otherwise it must be for the # of seconds. */
               } else if (hrs_digits == 1 && minutes <= 5) {
                  minutes = minutes * 10 + parseInt(timeStr[strPtr]);
                  output += timeStr[strPtr];
                  min_digits = 2;
               } // endif

               strPtr += 1;
            } // endif
         break; 
                  

         /*** SEPARATOR ***/
         case ':':

            /* If we come across a colon in the right spot just skip
               over it. */
            if (timeStr[strPtr]) {
               if (timeStr[strPtr] == ':') {
                  strPtr += 1; 
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

