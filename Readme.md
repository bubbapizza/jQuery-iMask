# jQuery iMask Plugin

  A jQuery input masking plugin.

## Including

  Include either `jquery-imask.js` or `jquery-imask-min.js` from the dist directory

## Example

```js
$('#input').iMask({
    type : 'number'
});

$('#input').iMask({
      type : 'fixed'
    , mask : '99/99/99'
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