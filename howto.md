#UISelect

##Change style of html <select> 

```javascript

   // change without option
   g(<select>).select();

   // change with option
   var opt = {
      title:'', 
      placeholder: '',
      body: 'css class'/{property:'value'}
      tail:{property:'value'}
   }
   g(<select>).select(opt);

   // example
   g('selectId').select({
      title: 'Report',
      placeholder: 'Select a report',
      body: {
         'font-size':'20px',
         border: 'solid 2px #458B74',
         'border-radius':'5px',
         background: '#7FFFD4'
      },
      tail: {
         content: 'glyphicon-menu-down',
         color: '#E0EEEE',
         background: 'rgba(1,1,1,0.4)',
         'box-shadow': '-1px 1px 10px rgba(1,1,1,0.5)'
      }
   });

```

Note: 
   - when writing css object like body or tail, some properties like 'font-size' need to in single/souble quote.  
   - opt > body 
      + apply using css class Or
      + apply using css object, tested properties: font-size, border, border-raius, background
   - opt > tail
      + css class name can't not be applied.
      + apply using css object, tested proper: content, color, border, background
      + content: support text, symbol, or glyphicons class name. 
      + http://glyphicons.bootstrapcheatsheets.com/

##Add header to html <select>
   The header has three features:
   - One/Multiple: switch select between one and multiple and start working with both modes 
   - Clear: clear all selected 

##Get options as an array







