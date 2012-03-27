/***************
 *  This is a library for handling date string masks.  Date strings 
 *  must be of the form mm/dd/yyyy or dd/mm/yy or yy/mm/dd, etc.
 *  It is strictly design to work with digits and slashes, thats it.
 * 
 ***************/

datemask = {

   DEFAULT_YEARSTART : 1920,


   /******
    *  Small function to strip out anything that doesn't belong in a 
    *  date string.  This means all non-digit characters except 
    *  forward slashes.
    ******/
   _stripMask : function(str) {
      var output = '';
      var slashCount = 0;
      var digits = false;
   
      for (var i = 0; i < str.length; i += 1) {
   
         /* 
          *  Only allow digits and the first two forward slashes 
          */

         /*** DIGIT ***/
         if (keylib.isDigit(str[i])) {
            /* If we have no digits yet, ignore leading zeros. */
            if (!digits && str[i] != '0') {
               digits = true;
            } // endif

            if (digits) {
               output += str[i];
            } // endif
   
         /*** SLASH ***/
         } else if (str[i] == '/') {

            /* If we have some digits entered, we may or may not
               be able to use the '/' character. */
            if (digits) {
               if (slashCount < 2) {
                  output += str[i]
               } // endif
   
               slashCount += 1;
            } // endif

            digits = false;
         } // endif
      } // endfor

      return output;
   }, // endfunction



   /******
    *  Small function to determine if a year is a leap year or not.
    ******/
   leapYear : function(year) {
      if (year < 0 || (year % 4) != 0) {
         return false;
      } // endif

      if ((year % 400) != 0 && (year % 100) == 0) {
         return false;
      } // endif

      return true;
   }, // endfunction



   /******
    *  Small function to determine the number of days in a month.
    ******/
   monthDays : function(month, year) {
      var daysOfMonth = {
         "normal" : [null, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
         "leapyr" : [null, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      } 

      if (this.leapYear(year)) {
         return daysOfMonth["leapyr"][month];
      } else {
         return daysOfMonth["normal"][month];
      } // endif
   }, // endfunction

      

   /******
    *  Small function to determine if the day is valid, given also
    *  the year and month.  This function assumes that the month
    *  and year are either:
    *
    *     1) greater than 0 and valid or
    *     2) equal to 0  
    ******/
   validDay : function(day, month, year) {

      /* The day must be at least 1 or more. */
      if (day <= 0) { 
         return false;
      } // endif 

      /* If we don't know the month, then the day can be at most 31. */
      if (month == 0) {
         return (day <= 31);

      /* We know the month, so just check the day against the number
         of days in the month.  Note: even if we don't know the year
         (i.e. the year == 0), we still get the right number of 
         possible days for February because 0 is a leap year. */
      } else {
         return (day <= this.monthDays(month, year));

   } // endfunction



   /******
    *  Apply a date mask to a string.  YearStart is an optional parameter
    *  that is only needed when 2 digit year masks are used.
    *  Masks are some combination of mm, MM, dd, DD, yy, yyyy, YY, YYYY
    *  separated by slashes.
    *   
    *  When applying the mask, the algorithm tries to do a best guess as
    *  to which slot to put each digit of the date string into.
    ******/
   wearMask : function(dateStr, mask, yearStart) {
      var maskPtr;
      var day = 0;
      var month = 0;
      var year = 0;
      var dayDigits = 0;
      var monthDigits = 0;
      var yearDigits = 0;
   
      /* If no yearStart was specified, assume DEFAULT_YEARSTART. */
      if (!yearStart) {
         yearStart = DEFAULT_YEARSTART;
      } // endif

      /* Strip out bad characters from the time string. */
      dateStr = this._stripMask(dateStr);
     
   
      strPtr = 0;
      for(maskPtr = 0; maskPtr < mask.length;  maskPtr += 1) {
         
         /* Check the current mask character. */
         maskChr = mask.charAt(maskPtr);
         switch(maskChr) {
   
            /*** DAYS ***/
            case 'd':
            case 'D':
   
               /*
                *  If we ran out of dateStr characters, or we hit the
                *  '/' character, then we're done with entering days.  
                */
               if (   dateStr[strPtr] == undefined
                   || dateStr[strPtr] == '/') {
                  if (dayDigits == 0) {
                     output += "dd"
   
                  } else if (dayDigits == 1) {
                     output = ' ' + output;
                     dayDigits = 2;
                  } // endif
   
               /*
                *  Otherwise, we must have a digit so see where it
                *  fits in the hours digit slots.
                */
               } else if (keylib.isDigit(dateStr[strPtr])) {
   
                  /** FIRST DIGIT **/
                  if (dayDigits == 0) {
                     day = parseInt(dateStr[strPtr]);

                     /* If the first digit of the day > 3 then there's
                        no way the next digit is a day digit. */
                     if (day > 3) {
                        output += ' ' + dateStr[strPtr];
                        dayDigits == 2;
                        strPtr += 1;

                     /* We may or may not have a 2nd day digit coming so 
                        keep on going. */
                     } else {
                        output += dateStr[strPtr];
                        dayDigits = 1;
                        strPtr += 1;
                     } // endif
                        
   
                  /** 2ND DIGIT **/
                  } else if (dayDigits == 1) { 
                     day = day * 10 + parseInt(dateStr[strPtr]);

                     /* Check to make sure the 2nd digit produces a valid
                        number of days.  If so, then use it for the 2nd 
                        digit of the day slot. */
                     if (this.validDay(day, month, year)) {
                        output += dateStr[strPtr];
                        dayDigits = 2;
                        strPtr += 1;

                     /* We don't have a valid 2nd digit for the day so
                        we're done with days. */
                     } else {
                        output += output.slice(0, -1) + ' ' + 
                                  output.slice(-1);
                        dayDigits = 2;
                     } // endif

                  } // endif
               } // endif
   
            break;
   
            
            /*** MONTHS ***/
            case 'm':
            case 'M':
                    
               /*
                *  If we ran out of dateStr characters, or we hit the
                *  am/pm indicator, or we hit the ':' character, then
                *  we're done with entering minutes.  Just put zeros in 
                *  the remaining slots.
                */
               if (   dateStr[strPtr] == undefined
                   || dateStr[strPtr] == '/') {
                  if (monthDigits == 0) {
                     null;
                     
                  } else if (monthDigits == 1) {
                     null;
                     
                  } // endif
   
               /*
                *  Otherwise, if we have a digit then see where it
                *  fits in the minutes digit slots.
                */
               } else if (keylib.isDigit(dateStr[strPtr])) {
   
                  /** FIRST DIGIT **/
                  if (monthDigits == 0) {
                     null;       
   
                  /** 2ND DIGIT **/
                  } else if (monthDigits == 1) { 
                     null;
                  } // endif
               } // endif 
   
            break; 
                     
   
            /*** YEARS ***/
            case 'y':
            case 'Y':
                    
               /*
                *  If we ran out of dateStr characters, or we hit the
                *  am/pm indicator, then we're done with entering seconds.  
                *  Just put zeros in the remaining slots.
                */
               if (   dateStr[strPtr] == undefined
                   || dateStr[strPtr] == '/') {
                  if (yearDigits == 0) {
                     null;
                     
                  } else if (yearDigits == 1) {
                     null;
                  } // endif
   
               /*
                *  Otherwise, if we have a digit then see where it
                *  fits in the seconds digit slots.
                */
               } else if (keylib.isDigit(dateStr[strPtr])) {
   
                  /** FIRST DIGIT **/
                  if (yearDigits == 0) {
                     null;    
   
                  /** 2ND DIGIT **/
                  } else if (yearDigits == 1) { 
                     null;
                  } // endif
               } // endif 
   
            break; 
   
   
            /*** SEPARATOR ***/
            case '/':
   
               /* If we come across a slash in the right spot just skip
                  over it. */
               if (dateStr[strPtr]) {
                  if (dateStr[strPtr] == '/') {
                     strPtr += 1; 
                  } // endif
               } // endif
   
               output += '/';
   
            break;
       
   
            /*** OTHER CHARACTERS ***/
            default:
               null;
            break;
         } // endswitch
      } //endfor
   
   
      return output;
   } // endfunction
}
