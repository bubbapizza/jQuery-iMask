var myMask = ">>>,>>9.999".
var myInt = "1234".
var myDec = "02".



/******
 *  Apply this field's number mask.  Pass the integer and
 *  decimal portions of the number separately.
 ******/
wearNumMask = function(strInt, strDec, mask) {
   var mask, decPtr, intMask, decMask;

   console.log("_wearNumMask", strInt, strDec);

   /* Figure out the integer portion of the mask and the
      decimal portion of the mask. */
   decPtr = mask.indexOf(this.options.decSymbol);
   if (decPtr < 0) {
      intMask = mask;
      decMask = '';
   } else {
      intMask = mask.substring(0, decPtr);
      decMask = mask.substring(decPtr + 1);
   } // endif


   /*
    *  Loop through all the characters in the mask.
    *  One, by one we check the mask characters against the 
    *  string and figure out what to do.
    */
   strPtr = 0;
   for(var maskPtr = 0; maskPtr < mask.length; maskPtr++) {
      
      /* Check the current mask character. */
      maskChr = mask.charAt(maskPtr);
      switch(maskChr) {

         /*** PLACEHOLDER CHARACTERS ***/
         case '9':
         case 'a':
         case 'x':

            /* Get the list of valid characters to check against. */
            validChrSet = this.options[chrSets[maskChr]];
            strChr = str.charAt(strPtr++).toLowerCase();

            /* If we have a valid character in the string, then
               it goes in the output string. */
            if ((validChrSet.indexOf(strChr) >= 0) &&
                (strChr != "")) { 
               output += strChr;

            /* Otherwise, it's bogus so put an empty character. */
            } else {
               output += this.options.maskEmptyChr;
            } // endif
               
            break;


         /*** OTHER CHARACTERS ***/
         default:
            /* Other characters automatically go in the output. */
            output += maskChr;

            /* If the current string character actually matches the 
               mask character, then we have to increment the string
               character pointer. */
            if( str.charAt(strPtr) == maskChr ){
               strPtr += 1;
            } // endif

            break;
      } // endswitch
   } //endfor

   return;
} // endfunction


var result = wearNumMask(myInt, myDec, myMask);

print (result);
