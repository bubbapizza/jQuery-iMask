/***************
 *  This is a library for handling date string masks.  Date strings 
 *  must be of the form mm/dd/yyyy or dd/mm/yy or yy/mm/dd, etc.
 *  It is strictly design to work with digits and slashes, thats it.
 * 
 ***************/

datemask = {

   CENTURY_START : 1920,


   /******
    *  Small function to strip out anything that doesn't belong in a 
    *  date string.  This means all non-digit characters except 
    *  forward slashes.
    ******/
   _stripMask : function(str) {
      var output = '';
      var slashCount = 0;
   
      for (var i = 0; i < str.length; i += 1) {
   
         /* 
          *  Only allow digits and the first two forward slashes 
          */

         /*** DIGIT ***/
         if (keylib.isDigit(str[i])) {
            output += str[i];
   
         /*** SLASH ***/
         } else if (str[i] == '/') {

            /* Only take the first two slashes. */
            if (slashCount < 2) {
               output += str[i]
            } // endif

            slashCount += 1;

         } // endif
      } // endfor

      return output;
   }, // endfunction



   /******
    *  Small function to determine the number of year digits.
    ******/
   yearDigits : function(mask) {
      if ((mask.search('yyyy') == -1) &&
          (mask.search('YYYY') == -1)) {
         return 2;
      } else {
         return 4;
      } // endif
   }, // endfunction
   


   /******
    *  Small function to determine if a year is a leap year or not.
    ******/
   leapYear : function(year, mask) {
      var century;
      var cutOffYear;

      /* If we don't know the year, assume it's a leap year. */
      if (year == null) {
         return true;
      } // endif


      /* If the mask specifies a 2-digit year, then convert the year
         to a 4 digit number so the rest of our algorithm works
         properly. */
      if (this.yearDigits(mask) == 2) {
         century = parseInt(this.CENTURY_START / 100) * 100;
         cutOffYear = this.CENTURY_START - century;
         
         /* If the 2-digit year is less than the last 2 digits of
            the start of the century, then the 2-digit year is for
            the *next* century. */
         if (year < cutOffYear) {
            year += century + 100;
         } else {
            year += century;
         } // endif
      } // endif


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
   monthDays : function(month, year, mask) {
      var daysOfMonth = {
         "normal" : [null, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
         "leapyr" : [null, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      } 

      if (this.leapYear(year, mask)) {
         return daysOfMonth["leapyr"][month];
      } else {
         return daysOfMonth["normal"][month];
      } // endif
   }, // endfunction

      

   /******
    *  Small function to determine if the day is valid, given also
    *  the year and month.
    ******/
   validDay : function(day, month, year, mask) {

      /* The day must be at least 1 or more. */
      if (day <= 0) { 
         return false;
      } // endif 

      /* If we don't know the month, then the day can be at most 31. */
      if (month == 0) {
         return (day <= 31);

      /* We know the month, so just check the day against the number
         of days in the month. */
      } else {
         return (day <= this.monthDays(month, year, mask));
      } // endif

   }, // endfunction



   /******
    *  Small function to determine if the month is valid given 
    *  the number of days. 
    ******/
   validMonth : function(day, month, year, mask) {

      /* Obviously, the month has to be between 1 & 12. */
      if (month <= 0 || month > 12) { 
         return false;

      /* We know the day so make sure it's less than the number of 
         days in the month. */
      } else {
         return (day <= this.monthDays(month, year, mask));
      } // endif

   }, // endfunction



   /******
    *  Apply a date mask to a string.  YearStart is an optional parameter
    *  that is only needed when 2 digit year masks are used.
    *  Masks are some combination of mm, MM, dd, DD, yy, yyyy, YY, YYYY
    *  separated by slashes.
    *   
    *  When applying the mask, the algorithm tries to do a best guess as
    *  to which slot to put each digit of the date string into.
    ******/
   wearMask : function(dateStr, mask, centuryStart) {
      var maskPtr;
      var day = 0;
      var month = 0;
      var year = null;
      var oldDay;
      var oldMonth;
      var oldYear;
      var dayDigits = 0;
      var monthDigits = 0;
      var yearDigits = 0;
      var maxYearDigits = this.yearDigits(mask);
      var output = '';
      var feb29 = false;
   
      /* If centuryStart was specified override CENTURY_START. */
      if (centuryStart) {
         this.CENTURY_START = centuryStart;
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
                  if (   (dayDigits == 0)
                      || (dayDigits == 1 && day == 0)) {
                     output += maskChr;
   
                  } else if (dayDigits == 1) {
                     output = output.slice(0, -1) + ' ' + 
                              output.slice(-1);
                     dayDigits = 2;
                  } // endif
   
               /*
                *  Otherwise, we must have a digit so see where it
                *  fits in the day digit slots.
                */
               } else if (keylib.isDigit(dateStr[strPtr])) {
   
                  /** FIRST DIGIT **/
                  if (dayDigits == 0) {
                     day = parseInt(dateStr[strPtr]);

                     /* If the first digit of the day > 3 then there's
                        no way the next digit is a day digit. */
                     if (day > 3) {
                        output += ' ' + dateStr[strPtr];
                        dayDigits = 2;
                        strPtr += 1;

                     /* We may or may not have a 2nd day digit coming so 
                        keep on going. */
                     } else {

                        /* If we got a zero, blank out the first digit. */
                        if (day == 0) {
                           output += ' ';
                        } else {
                           output += dateStr[strPtr];
                        } // endif

                        dayDigits = 1;
                        strPtr += 1;
                     } // endif
                        
   
                  /** 2ND DIGIT **/
                  } else if (dayDigits == 1) { 
                     day = day * 10 + parseInt(dateStr[strPtr]);

                     /* Check to make sure the 2nd digit produces a valid
                        day number.  If so, then use it for the 2nd 
                        digit of the day slot. */
                     if (this.validDay(day, month, year, mask)) {
                        output += dateStr[strPtr];
                        dayDigits = 2;
                        strPtr += 1;

                     /* We don't have a valid 2nd digit for the day so
                        we're done with days. */
                     } else {
                        
                        /* If we got two zeros in a row, then just show
                           a single mask character. */
                        if (day == 0) {
                           output += maskChr;
                        } else {
                           output = output.slice(0, -1) + ' ' + 
                                    output.slice(-1);
                        } // endif

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
                *  '/' character, then we're done with entering months.  
                */
               if (   dateStr[strPtr] == undefined
                   || dateStr[strPtr] == '/') {
                  if (   (monthDigits == 0)
                      || (monthDigits == 1 && month == 0)) {
                     output += maskChr;
                     
                  } else if (monthDigits == 1) {
                     output = output.slice(0, -1) + ' ' + 
                              output.slice(-1);
                     monthDigits = 2;
                     
                  } // endif
   
               /*
                *  Otherwise, if we have a digit then see where it
                *  fits in the month digit slots.
                */
               } else if (keylib.isDigit(dateStr[strPtr])) {

                  /** FIRST DIGIT **/
                  if (monthDigits == 0) {
                     month = parseInt(dateStr[strPtr]);

                     /* If the first digit of the month > 1 then there's
                        no way the next digit is a month digit. */
                     if (month > 1) {

                        /* Check to make sure the first digit is a 
                           valid month, given the number of days
                           & year entered so far. */
                        if (this.validMonth(day, month, year, mask)) {
                           output += ' ' + dateStr[strPtr];
                           monthDigits = 2;
                           strPtr += 1;

                        /* We got a bad digit for months.  Fill in the
                           month slot with a mask characters. */
                        } else {
                           output += maskChr;
                        } // endif

                     /* We may or may not have a 2nd month digit coming so 
                        keep on going. */
                     } else {

                        /* If we got a zero, blank out the first digit. */
                        if (month == 0) {
                           output += ' ';
                        } else {
                           output += dateStr[strPtr];
                        } // endif

                        monthDigits = 1;
                        strPtr += 1;
                     } // endif
                        
   
                  /** 2ND DIGIT **/
                  } else if (monthDigits == 1) { 
                     oldMonth = month;
                     month = month * 10 + parseInt(dateStr[strPtr]);

                     /* Check to make sure the 2nd digit produces a valid
                        month number.  If so, then use it for the 2nd 
                        digit of the month slot. */
                     if (month > 1 && month <= 12) {

                        /* Check to make sure month is valid given the
                           the number of days & year entered so far. */
                        if (this.validMonth(day, month, year, mask)) {
                           output += dateStr[strPtr];
                           strPtr += 1;

                        /* 
                         *  We got a bad 2nd digit for the month based on 
                         *  the current number of days we already have.
                         *  At this point, the first digit MUST be a
                         *  0 or a 1.  
                         *
                         *  If the first digit was a zero, we skip the 
                         *  months and just show the mask character.
                         *
                         *  If the first digit was one, then we set the
                         *  month to January which is fine since it has
                         *  31 days and the day will never be more than 
                         *  that.
                         */
                        } else {
                           month = oldMonth;

                           if (month == 0) {
                              output += maskChr;
                           } else {
                              output = output.slice(0, -1) + ' ' + 
                                       output.slice(-1);
                           } // endif
                  
                        } // endif

                        monthDigits = 2;

                     /* We don't have a valid 2nd digit for the month so
                        we're done with months. */
                     } else {
                        month = oldMonth;

                        /* If we got two zeros in a row, then just show
                           a single mask character. */
                        if (month == 0) {
                           output += maskChr;
                        } else {
                           output = output.slice(0, -1) + ' ' + 
                                    output.slice(-1);
                        } // endif

                        monthDigits = 2;
                     } // endif

                  } // endif
   
               } // endif 
   
            break; 
                     
   
            /*** YEARS ***/
            case 'y':
            case 'Y':

               /*
                *  If we ran out of dateStr characters, or we hit the
                *  '/' character, then we're done entering years.
                */
               if (   dateStr[strPtr] == undefined
                   || dateStr[strPtr] == '/') {

                  output += maskChr;
                  yearDigits += 1;

               /*
                *  Otherwise, if we have a digit then check to make sure
                *  the user only enters a leap year if the month/day is
                *  Feb 29.
                */
               } else if (keylib.isDigit(dateStr[strPtr])) {
                  year = 10 * year + parseInt(dateStr[strPtr]);
                  feb29 = (month == 2 && day == 29);


                  /* FIRST DIGITS */
                  if (yearDigits < (maxYearDigits - 1)) { 
                     output += dateStr[strPtr];
                     strPtr += 1;

                  /* LAST DIGIT */
                  } else if (yearDigits == (maxYearDigits - 1)) {

                     /* If it's not Feb 29 OR it is Feb 29 but the year
                        entered is a leap year, then we're ok. */
                     if (!feb29 || (feb29 && this.leapYear(year, mask))) {

                        output += dateStr[strPtr];
                        strPtr += 1;

                     /* We did not get a leap year when we needed one
                        so we're done. */
                     } else {
                        output += maskChr;
                     } // endif
                        
                  } // endif


                  yearDigits += 1;
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
