# jQuery iMask Plugin

  A jQuery input masking plugin.

## Including

  Include either `jquery-imask.js` or `jquery-imask-min.js` from the dist directory

## Demos

  http://cwolves.github.com/jQuery-iMask/

## Example

```js
$('#input').iMask({
    type : 'number'
});

$('#input').iMask({
      type : 'fixed'
    , mask : '99/99/99'
})
```

## Options

```
type (number|fixed)
mask Mask using 9,a,x notation
maskEmptyChr   [ Default = ' ' ]
validNumbers   [ Default = '1234567890' ]
validAlphas    [ Default = 'abcdefghijklmnopqrstuvwxyz' ]
validAlphaNums [ Default = 'abcdefghijklmnopqrstuvwxyz1234567890' ]
groupDigits    [ Default = 3 ]
decDigits      [ Default = 2 ]
currencySymbol
groupSymbol    [ Default = ',' ]
decSymbol      [ Default = '.' ]
showMask       [ Default = true ]
stripMask      [ Default = false ]

number Override options for when validating numbers only
number.stripMask [ Default = false ]
number.showMask  [ Default = false ]
```

#Events

```
onValid
onInvalid
```


## Features
- Static Masking
   - Mask numbers, letters
   - Customize list of valid numbers & letters
   - Special symbols are displayed but un-selectable
   - Optionally only show the mask while user is entering
- Numeric Masking
    - Control currency symbol, decimal & thousands seperator, # of digits
- Events
    - onValid
    - onInvalid

The core code for the iMask plugin was originally created for MooTools by Fabio Zendhi Nagao (http://zendold.lojcomm.com.br/imask/)