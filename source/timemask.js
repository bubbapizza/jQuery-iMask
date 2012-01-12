/***************
 *  This is a library for handling time string masks.
 * 
 ***************/

timemask = {

   /******
    *  Small function to strip out anything that doesn't belong in a 
    *  time string.  This means all non-digit characters except ':' and
    *  'a', 'A', 'p' or 'P'. 
    ******/
   stripMask : function(str) {
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
            output += str[i].toLowerCase();
            found_ampm = true;
         } // endif
      } // endfor
       
      return output;
   }, // endfunction
         
   
   
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
   wearMask : function(timeStr, mask) {
      var maskPtr, strPtr;
      var hours = 0;
      var minutes = 0;
      var seconds = 0;
      var output = '';
      var hrs_digits = 0;
      var min_digits = 0;
      var sec_digits = 0;
      var am_flag = true;
   
   
      /* Figure out what the time format is and return if we get a 
         bogus mask. */
      var normal_time = (mask[0] == '>');
      var military_time = !normal_time;
      if (military_time == false && normal_time == false) {
         return "00:00:00";
      } // endif
   
   
      /* Strip out bad characters from the time string. */
      timeStr = this.stripMask(timeStr);
   
      strPtr = 0;
      for(maskPtr = 0; maskPtr < mask.length;  maskPtr += 1) {
         
         /* Check the current mask character. */
         maskChr = mask.charAt(maskPtr);
         switch(maskChr) {
   
            /*** HOURS ***/
            case 'h':
            case 'H':
            case '>':
   
               /*
                *  If we ran out of timeStr characters, or we hit the
                *  am/pm indicator, or we hit the ':' character, then
                *  we're done with entering hours.  Just put zeros in 
                *  the remaining slots.
                */
               if (   timeStr[strPtr] == undefined
                   || timeStr[strPtr] == 'a'
                   || timeStr[strPtr] == 'p'
                   || timeStr[strPtr] == ':') {
                  if (hrs_digits == 0) {
                     if (military_time) {
                        output = '00';
                     } else {
                        output = '12';
                     } // endif
                     hrs_digits = 2;
   
                  } else if (hrs_digits == 1) {
                     output = '0' + output; 
                     hrs_digits = 2;
                  } // endif
   
               /*
                *  Otherwise, we must have a digit so see where it
                *  fits in the hours digit slots.
                */
               } else if (keylib.isDigit(timeStr[strPtr])) {
   
                  /** FIRST DIGIT **/
                  if (hrs_digits == 0) {
                     hours = parseInt(timeStr[strPtr]);
   
                     /* For military time, the first digit can be max
                        of 2 and for normal time, the first digit can be
                        max of 1.  If the current digit exceeds those
                        then there's no way we have any more valid hours 
                        digits coming after that. */ 
                     print(hours, military_time, normal_time);
                     if (   (hours > 2 && military_time)
                         || (hours > 1 && normal_time)) { 
                        output += '0' + timeStr[strPtr];
                        hrs_digits = 2;
                        strPtr += 1;
   
                     /* We may or may not have a 2nd digit so keep 
                        going. */
                     } else {
                        output += timeStr[strPtr];
                        hrs_digits = 1;
                        strPtr += 1;
                     } // endif
   
   
                  /** 2ND DIGIT **/
                  } else if (hrs_digits == 1) { 
                     hours = hours * 10 + parseInt(timeStr[strPtr]);
   
                     /* Check to make sure the 2nd digit produces a valid
                        number of hours.  If so then use it for the 2nd 
                        digit of the hours slot. */
                     if (   (hours < 24 && military_time)
                         || (hours < 13 && normal_time)) {
                        output += timeStr[strPtr];
                        hrs_digits = 2;
                        strPtr += 1;
   
                     /* We don't have a valid 2nd digit, so the hours slots 
                        are now all filled up. */
                     } else {
                        output += '0';
                        hrs_digits = 2;
                     } // endif
                  } // endif
               } // endif
   
            break;
   
            
            /*** MINUTES ***/
            case 'm':
            case 'M':
                    
               /*
                *  If we ran out of timeStr characters, or we hit the
                *  am/pm indicator, or we hit the ':' character, then
                *  we're done with entering minutes.  Just put zeros in 
                *  the remaining slots.
                */
               if (   timeStr[strPtr] == undefined
                   || timeStr[strPtr] == 'a'
                   || timeStr[strPtr] == 'p'
                   || timeStr[strPtr] == ':') {
                  if (min_digits == 0) {
                     output += '00';
                     min_digits = 2;
                  } else if (min_digits == 1) {
                     output += '0';
                     min_digits = 2;
                  } // endif
   
               /*
                *  Otherwise, if we have a digit then see where it
                *  fits in the minutes digit slots.
                */
               } else if (keylib.isDigit(timeStr[strPtr])) {
   
                  /** FIRST DIGIT **/
                  if (min_digits == 0) {
                     minutes = parseInt(timeStr[strPtr]);
   
                     /* If the first minutes digit is > 5 then it MUST
                        go in the slot for the 2nd digit and there's no 
                        way we have any more valid minutes digits coming
                        after that. */
                     if (minutes > 5) {
                        output += '0' + timeStr[strPtr];
                        min_digits = 2;
                        strPtr += 1;
   
                     /* We may or may not have a 2nd digit so keep on
                        going. */
                     } else {
                        output += timeStr[strPtr];
                        min_digits = 1;
                        strPtr += 1;
                     } // endif
                        
   
                  /** 2ND DIGIT **/
                  } else if (min_digits == 1) { 
                     output += timeStr[strPtr];
                     min_digits = 2;
                     strPtr += 1;
                  } // endif
               } // endif 
   
            break; 
                     
   
            /*** SECONDS ***/
            case 's':
            case 'S':
                    
               /*
                *  If we ran out of timeStr characters, or we hit the
                *  am/pm indicator, then we're done with entering seconds.  
                *  Just put zeros in the remaining slots.
                */
               if (   timeStr[strPtr] == undefined
                   || timeStr[strPtr] == 'a'
                   || timeStr[strPtr] == 'p'
                   || timeStr[strPtr] == ':') {
                  if (sec_digits == 0) {
                     output += '00';
                     sec_digits = 2;
                  } else if (sec_digits == 1) {
                     output += '0';
                     sec_digits = 2;
                  } // endif
   
               /*
                *  Otherwise, if we have a digit then see where it
                *  fits in the seconds digit slots.
                */
               } else if (keylib.isDigit(timeStr[strPtr])) {
   
                  /** FIRST DIGIT **/
                  if (sec_digits == 0) {
                     seconds = parseInt(timeStr[strPtr]);
   
                     /* If the first seconds digit is > 5 then it MUST
                        go in the slot for the 2nd digit and there's no 
                        way we have any more valid seconds digits coming
                        after that. */
                     if (seconds > 5) {
                        output += '0' + timeStr[strPtr];
                        sec_digits = 2;
                        strPtr += 1;
   
                     /* We may or may not have a 2nd digit so keep on
                        going. */
                     } else {
                        output += timeStr[strPtr];
                        sec_digits = 1;
                        strPtr += 1;
                     } // endif
                        
   
                  /** 2ND DIGIT **/
                  } else if (sec_digits == 1) { 
                     output += timeStr[strPtr];
                     sec_digits = 2;
                     strPtr += 1;
                  } // endif
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
               null;
            break;
         } // endswitch
      } //endfor
   
   
   
      /*** AM/PM FLAG ***/
      if (normal_time) {
         for ( ; timeStr[strPtr] ;  strPtr += 1) {
            if (timeStr[strPtr] == 'p') {
               am_flag = false;
            } // endif
         } // endfor
    
         output += am_flag ? " AM" : " PM";
      } // endif 
   
   
      return output;
   } // endfunction
   
}
