/***************
 *  This is a library for handling time string masks.
 * 
 ***************/

timemask = {

   MILITARY_TIME : 'military',
   NORMAL_TIME : 'normal', 

   /******
    *  Small function to strip out anything that doesn't belong in a 
    *  time string.  This means all non-digit characters except 
    *  'a', 'A', 'p' or 'P'.
    ******/
   _stripMask : function(str) {
      var output = '';
      var first_colon = false;
      var found_ampm = false;
   
      for (var i = 0; i < str.length && found_ampm == false; i += 1) {
   
         /* Only allow digits and the first colon. */
         if (keylib.isDigit(str[i]) 
             || (!first_colon && str[i] == ':')) {
            output += str[i];
            if (str[i] == ':') {
               first_colon = true;
            } // endif
   
         /* If we found an 'a' or 'p', we've hit the end, nothing else
            matters. */
         } else if (str[i].toLowerCase() == 'a' ||
                    str[i].toLowerCase() == 'p') {
            output += str[i].toLowerCase();
            found_ampm = true;
         } // endif
      } // endfor

      /* For normal time strings, strip off leading zeros and/or the 
         leading colon.  For military time, strip out colons. */
      if (found_ampm) {
         output = output.replace(/(^0+)*:*0*/, '');
      } else {
         output = output.replace(/:/, '');
      } // endif
       
      return output;
   }, // endfunction



   /******
    *  Small function that returns whether or not a string is 
    *  military or normal time. 
    ******/
   timeType : function(str) {
      var stripped = this._stripMask(str);

      if (stripped.indexOf('a') > 0 || stripped.indexOf('p') > 0) {
         return this.NORMAL_TIME;
      } else {
         return this.MILITARY_TIME;
      } // endif
   }, // endfunction 


   /******
    *  Small function that returns whether or not a mask is 
    *  military or normal time. 
    ******/
   maskType : function(mask) {
      if (mask[0] == '>') {
         return this.NORMAL_TIME;
      } else {
         return this.MILITARY_TIME;
      } // endif
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
      timeStr = this._stripMask(timeStr);
     
   
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
                        output = '0';
                     } // endif
                     hrs_digits = 2;
   
                  } else if (hrs_digits == 1) {
                     if (military_time) {
                        if (output == '1' || output == '2') {
                           output = output + '0'; 
                        } else {
                           output = '0' + output; 
                        } // endif
                     } // endif
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
                     if (   (hours > 2 && military_time)
                         || (hours > 1 && normal_time)) { 
                        if (normal_time) {
                           output += '' + timeStr[strPtr];
                        } else { 
                           output += '0' + timeStr[strPtr];
                        } // endif
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
                        if (military_time) {
                           output = output.slice(0, -1) + '0' + 
                                    output.slice(-1);
                        } // endif
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
   }, // endfunction


   /******
    *  To determine the next cursor position, we need the following
    *  parameters:
    *     pos  -> the current cursor position
    *     chr  -> the event (a.k.a. what key was pressed)
    *     timeStr  -> the current time in the input field
    *     mask -> the time mask
    ******/
   newCursorPos : function(lastPos, chr, timeStr, mask) {
      var fsm, hrsDigits, currState, currEvent;
      var militaryFSM = new Array();
      var ampm1DigitHrFSM = new Array();
      var ampm2DigitHrFSM = new Array();
      var hrs;

      /* We MUST have a mask length of 5 or 8 */
      if (mask.length != 5 && mask.length != 8) {
         return 0;
      } // endif


      var eventID = {
         "0"  : 0,
         "1"  : 1,
         "2"  : 2,
         "3"  : 3,
         "4"  : 4,
         "5"  : 5,
         "6"  : 6,
         "7"  : 7,
         "8"  : 8,
         "9"  : 9,
         ":"  : 10,
         "ap" : 11
      }

      var stateCursorPos = {
         "0"  : 0,
         "1"  : 1,
         "2"  : 2,
         "3"  : 3,
         "4"  : 4,
         "5"  : 5,
         "6"  : 6,
         "7"  : 7,
         "8"  : 8,
         "9"  : 9
      } 


      /****** 5 DIGIT MASK ******/

      militaryFSM[5] = {
      //       0    1    2    3    4    5    6    7    8    9    :
      "0"  : ["1", "1", "1", "2", "2", "2", "2", "2", "2", "2", "3"],
      "1"  : ["2", "2", "2", "2", "4", "4", "5", "5", "5", "5", "3"],
      "2"  : ["4", "4", "4", "4", "4", "4", "5", "5", "5", "5", "3"],
      "3"  : ["4", "4", "4", "4", "4", "4", "5", "5", "5", "5", "3"],
      "4"  : ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "4"],
      "5"  : ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"]}

      ampm1DigitHrFSM[5] = {
      //      0    1    2    3    4    5    6    7    8    9    :   ap
      "0" : ["0", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2", "5"],
      "1" : ["X", "X", "X", "3", "3", "3", "4", "4", "4", "4", "2", "5"],
      "2" : ["3", "3", "3", "3", "3", "3", "4", "4", "4", "4", "2", "5"],
      "3" : ["4", "4", "4", "4", "4", "4", "4", "4", "4", "4", "3", "5"],
      "4" : ["4", "4", "4", "4", "4", "4", "4", "4", "4", "4", "4", "5"],
      "5" : ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"]}

      ampm2DigitHrFSM[5] = {
      //      0    1    2    3    4    5    6    7    8    9    :   ap
      "0" : ["X", "1", "X", "X", "X", "X", "X", "X", "X", "X", "3", "6"],
      "1" : ["2", "2", "2", "X", "X", "X", "X", "X", "X", "X", "3", "6"],
      "2" : ["4", "4", "4", "4", "4", "4", "5", "5", "5", "5", "3", "6"],
      "3" : ["4", "4", "4", "4", "4", "4", "5", "5", "5", "5", "3", "6"],
      "4" : ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "4", "6"],
      "5" : ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "6"],
      "6" : ["6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6"]}


      /****** 8 DIGIT MASK ******/

      militaryFSM[8] = {
      //       0    1    2    3    4    5    6    7    8    9    :
      "0"  : ["1", "1", "1", "2", "2", "2", "2", "2", "2", "2", "3"],
      "1"  : ["2", "2", "2", "2", "4", "4", "5", "5", "5", "5", "3"],
      "2"  : ["4", "4", "4", "4", "4", "4", "5", "5", "5", "5", "3"],
      "3"  : ["4", "4", "4", "4", "4", "4", "5", "5", "5", "5", "6"],
      "4"  : ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "6"],
      "5"  : ["7", "7", "7", "7", "7", "7", "8", "8", "8", "8", "6"],
      "6"  : ["7", "7", "7", "7", "7", "7", "8", "8", "8", "8", "6"],
      "7"  : ["8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "7"],
      "8"  : ["8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8"]}

      ampm1DigitHrFSM[8] = {
      //      0    1    2    3    4    5    6    7    8    9    :   ap
      "0" : ["0", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2", "8"],
      "1" : ["X", "X", "X", "3", "3", "3", "4", "4", "4", "4", "2", "8"],
      "2" : ["3", "3", "3", "3", "3", "3", "4", "4", "4", "4", "5", "8"],
      "3" : ["4", "4", "4", "4", "4", "4", "4", "4", "4", "4", "5", "8"],
      "4" : ["6", "6", "6", "6", "6", "6", "7", "7", "7", "7", "5", "8"],
      "5" : ["6", "6", "6", "6", "6", "6", "7", "7", "7", "7", "5", "8"],
      "6" : ["7", "7", "7", "7", "7", "7", "7", "7", "7", "7", "6", "8"],
      "7" : ["7", "7", "7", "7", "7", "7", "7", "7", "7", "7", "7", "8"],
      "8" : ["8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8"]}

      ampm2DigitHrFSM[8] = {
      //      0    1    2    3    4    5    6    7    8    9    :   ap
      "0" : ["X", "1", "X", "X", "X", "X", "X", "X", "X", "X", "3", "9"],
      "1" : ["2", "2", "2", "X", "X", "X", "X", "X", "X", "X", "3", "9"],
      "2" : ["4", "4", "4", "4", "4", "4", "5", "5", "5", "5", "3", "9"],
      "3" : ["4", "4", "4", "4", "4", "4", "5", "5", "5", "5", "6", "9"],
      "4" : ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "6", "9"],
      "5" : ["7", "7", "7", "7", "7", "7", "8", "8", "8", "8", "6", "9"],
      "6" : ["7", "7", "7", "7", "7", "7", "8", "8", "8", "8", "6", "9"],
      "7" : ["8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "7", "9"],
      "8" : ["8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "9"],
      "9" : ["9", "9", "9", "9", "9", "9", "9", "9", "9", "9", "9", "9"]}

      /*
       *  Figure out the current state.
       */
      currState = parseInt(lastPos);

      /*
       *  Figure out what the current event is.
       */
      if (chr == 'a' || chr == 'p') {
         currEvent = 'ap';
      } else {
         currEvent = chr;
      } // endif
     
      /* 
       *  Figure out what finite state machine to use.
       */
      if (this.maskType(mask) == this.MILITARY_TIME) {
         fsm = militaryFSM[mask.length];
      } else if (this.maskType(mask) == this.NORMAL_TIME) {
         hrsDigits = timeStr.slice(0, timeStr.indexOf(':')).length;
         if (hrsDigits == 1) { 
            fsm = ampm1DigitHrFSM[mask.length]; 
         } else if (hrsDigits == 2) {
            fsm = ampm2DigitHrFSM[mask.length]; 
         } // endif
      } // endif


      /* 
       *  Figure out the new cursor position.
       */
      if (fsm) {
         newState = fsm[currState][eventID[currEvent]];

         /* If we get an X for next state, that means we have to use
            the opposite finite state machine. */
         if (newState == "X") {
            if (hrsDigits == 1) {
               fsm = ampm2DigitHrFSM[mask.length];
            } else {
               fsm = ampm1DigitHrFSM[mask.length];
            } // endif
            
            newState = fsm[currState][eventID[currEvent]];
         } else if (newState == "1a" || newState == "1b") {
            newState = fsm[newState][eventID[currEvent]];
         } // endif

         return stateCursorPos[newState];
      } // endif
   
      return 0;
   } // endfunction
}



