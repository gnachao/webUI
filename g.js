/* ---------------------------------------------------- *
 *  LIBRARY : the code is running when called           *
\* ---------------------------------------------------- */
(function(window){'use strict';

  function getElement(el){
    var retVal = el;
    if(typeof el === 'string') retVal = document.getElementById(el);
    return isElement(retVal) ? retVal : document.body;
  }

  function isElement(selector){
    return (typeof HTMLElement !== "undefined" ? selector instanceof HTMLElement 
      : selector && typeof selector === "object" && selector !== null 
        && selector.nodeType === 1 && typeof selector.nodeName==="string");
  }

  function isNode(selector){
    return (typeof Node !== "undefined" ? selector instanceof Node 
      : selector && typeof selector === "object" 
        && typeof selector.nodeType === "number" 
        && typeof selector.nodeName==="string");
  }

  function getTreeStructure(obj, arr)
  {
    var originObj = typeof arguments[2] === 'undefined' ? obj : arguments[2]; // solve circular refference

    if(typeof obj === 'object' && !(obj instanceof Array))
    {
      for(var k in obj)
      {
        try
        {
          if(obj[k] !== originObj && typeof obj[k] === 'object')
          {
            if(obj[k] instanceof Array)
            {
              arr.push({text: k, children: []});
              for(var i=0; i<obj[k].length; i++)
                getTreeStructure(obj[k][i], arr[arr.length - 1]['children'], originObj);
            }
            else if(Object.keys(obj[k]).length > 0)
            {
              arr.push({text: k, children: []});
              getTreeStructure(obj[k], arr[arr.length - 1]['children'], originObj);
            }
          }
          else 
            arr.push({text: k});  
        } catch(e) {
          arr.push({text: k, children: [{text: 'unreachable'}]});
        }
      }
    }
  }

  // function json2Tree(arrJson, target, style)
  // {
  //   // default target
  //   target = getElement(target);

  //   if(arrJson instanceof Array && isElement(target))
  //   {
  //     // create root container for tree
  //     if(target.tagName !== 'LI')
  //     {
  //       if(typeof style === 'undefined') style = 'ui-tree' // default style
  //       target = appendChild(target, 'div', {attr:{'class':style}})
  //     }

  //     if(arrJson.length > 0)
  //     {
  //       var ul = appendChild(target, 'ul');

  //       for(var i=0; i<arrJson.length; i++)
  //       {
  //         if(typeof arrJson[i].text === 'string')
  //         {
  //           var li = appendChild(ul, 'li'),
  //               a = appendChild(li, 'a', {text: arrJson[i].text});

  //           cssAdd(a, 'no-user-select');
  //           if(typeof arrJson[i].link !== 'undefined')
  //           {
  //             a.setAttribute('href', arrJson[i].link)
  //             cssAdd(a, 'focus')
  //           }

  //           if(arrJson[i].children instanceof Array && arrJson[i].children.length > 0)
  //           {
  //             cssAdd(a, 'ui-tree-close focus');
  //             $( a ).click( function( ) {
  //               cssToggle(this, 'ui-tree-close');
  //               cssToggle(this, 'ui-tree-open');
  //               $( this ).parent().children( 'ul' ).slideToggle( 'fast' );
  //             });
  //             json2Tree(arrJson[i].children, li);
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  
  function json2Tree(arrJson, target, style)
  {
    // default target
    target = getElement(target);

    if(arrJson instanceof Array && isElement(target))
    {
      // create root container for tree
      if(target.tagName !== 'LI')
      {
        if(typeof style === 'undefined') style = 'ui-tree' // default style
        target = appendChild(target, 'div', {attr:{'class':style}})
      }

      if(arrJson.length > 0)
      {
        var ul = appendChild(target, 'ul');

        for(var i=0; i<arrJson.length; i++)
        {
          if(typeof arrJson[i].text === 'string')
          {
            var li = appendChild(ul, 'li'),
                a = appendChild(li, 'a', {text: arrJson[i].text});

            cssAdd(a, 'no-user-select');
            if(typeof arrJson[i].link !== 'undefined')
            {
              a.setAttribute('href', arrJson[i].link)
              cssAdd(a, 'focus')
            }

            if(arrJson[i].children instanceof Array && arrJson[i].children.length > 0)
            {
              cssAdd(a, 'ui-tree-close focus');
              $( a ).click( function( ) {
                cssToggle(this, 'ui-tree-close');
                cssToggle(this, 'ui-tree-open');
                $( this ).parent().children( 'ul' ).slideToggle( 'fast' );
              });
              json2Tree(arrJson[i].children, li);
            }
          }
        }
      }
    }
  }

  function getTree(obj)
  {
    if(obj instanceof Array)
      json2Tree(obj);
    else if(typeof obj == 'object')
    {
      var tree = [];
      getTreeStructure(obj, tree);
      json2Tree(tree);  
    }
  }

  function print(obj, opt)
  { //opt = {target: ,newline: true, clear: true}
    var pEl, newline = false, clear = false;

    // setting up options keys
    if (typeof opt === 'object')
    {
      for (var k in opt)
      {
        switch (k.toLowerCase())
        {
          case 'target': pEl = document.getElementById(opt[k]); break;
          case 'newline': if(typeof opt[k] === 'boolean') newline = opt[k]; break;
          case 'clear': if(typeof opt[k] === 'boolean') clear = opt[k]; break;
          default: break;
        }
      }
    } 
    if (typeof pEl === 'undefined' || pEl === null) pEl = g.appendChild(document.body, 'div', {attr:{'id':g.makeRandStr(10)}});
    else { if(clear) pEl.innerHTML = '';}

    // print based on obj type
    if(newline && (typeof obj === 'string' || (obj instanceof Array && typeof obj[0] !== 'object'))) for(var i = 0; i<obj.length; i++) pEl.innerHTML += obj[i] + '<br>';  
    else if(!newline && (typeof obj === 'string' || (obj instanceof Array && typeof obj[0] !== 'object'))) pEl.innerHTML += obj;  
    else if(typeof obj === 'object' && typeof JSON !== 'undefined')
    {
      if(newline && obj instanceof Array) for(var i = 0; i<obj.length; i++) pEl.innerHTML += JSON.stringify(obj[i]) + '<br><br>';
      else 
      {
        if(newline) {
          var num = 0;
          for(var k in obj) pEl.innerHTML += '<br><br>[' + k + ']   ' + JSON.stringify(obj[k]);
        }
        else pEl.innerHTML += JSON.stringify(obj);
      }
    } 
    else pEl.innerHTML += obj;
  }

  function isObjEql(a, b) {
    var aProps = Object.getOwnPropertyNames(a),
        bProps = Object.getOwnPropertyNames(b);

    if (aProps.length != bProps.length) return false;

    for (var i = 0; i < aProps.length; i++) if (a[aProps[i]] !== b[aProps[i]]) return false; 

    return true;
  }

  function compareValue(value1, operator, value2)
  {

    var opt = {'=':'===', '==':'===', '===':'===', '<>':'!==', '!=':'!==', '!==':'!==', '>':'>', '>=':'>=', '<':'<', '<=':'<='};
    if(typeof opt[operator] !== 'undefined' && typeof value1 !== 'undefined' && typeof value2 !== 'undefined')
    {
      if(opt[operator] === '===') return (value1 === value2);
      else if(opt[operator] === '!==') return (value1 !== value2);
      else if(opt[operator] === '>') return (value1 > value2);
      else if(opt[operator] === '>=') return (value1 >= value2);
      else if(opt[operator] === '<') return (value1 < value2);
      else if(opt[operator] === '<=') return (value1 <= value2);
    }
    return false;
  }

  function indexOf (arr, key)
  {// key js date
    if(typeof toJsDate(key) !== 'undefined')
    {
      for(var i=0; i<arr.length; i++) if (typeof toJsDate(arr[i]) !== 'undefined' && arr[i].getTime() === key.getTime()) return i; 
      return -1;
    }
    else if(typeof key === 'object' && !(key instanceof Array))
    {// object key
      for(var i=0; i<arr.length; i++) if (isObjEql(arr[i], key)) return i; 
      return -1;
    }
    else 
    { // key is everything
      for(var i=0; i<arr.length; i++) if (arr[i] === key) return i; 
      return -1;
    }
    return arr.indexOf(key);
  }
  function spliceM(arr, idxList)
  {// delete array arr by a list of index
    var retVal = [];
    if(arr instanceof Array && idxList instanceof Array)
      for(var i=0; i<idxList.length; i++) retVal.push(arr.splice(idxList[i] - i, 1)[0]);
    return retVal;
  }
  /*
  USE: Navigator Object
  Parameter: undefined | string | string string
    @ undefined : no argument 
      [x] it will return the object of all info
    @ string : name/version
      [x] return a version or browser name: Chrome, Firefox, MSIE
    @ string string : name, version | version, name
      [x] return an object of two keys and values, name and version.
  Return: 
    << browser name, version, an object of both, or an object of all info.  
    << false if failed
  Support: IE6, Chrome45, Safari8, Firefox40
  */
  function browser(){
    var name='', version='';
      var userAgent = navigator.userAgent.toLowerCase();
      var appVer = navigator.appVersion.toLowerCase();

      var IE = navigator.appName.toLowerCase().indexOf('microsoft internet explorer') > -1;
      var safari = userAgent.indexOf('safari') != -1 && userAgent.indexOf('chrome') === -1;
      var chrome = userAgent.indexOf('safari') != -1 && userAgent.indexOf('chrome') > -1;
      var firefox = userAgent.indexOf('firefox') !== -1;

      if(IE){
        var start = appVer.indexOf('msie') + 5;
        var stop = appVer.indexOf('; windows');
        name = 'MSIE';
        version = appVer.slice(start, stop);
      }

      if(safari){
        var start = appVer.indexOf('version') + 8;
        var stop = appVer.indexOf('safari');
      name = 'Safari';
        version = appVer.slice(start, stop); 
      }

      if(chrome){
        var start = appVer.indexOf('chrome') + 7;
        var stop = appVer.indexOf('safari');
      name = 'Chrome';
        version = appVer.slice(start, stop); 
    }

    if(firefox){
      var start = userAgent.indexOf('firefox') + 8;
      name = 'Firefox';
      version = userAgent.slice(start, userAgent.length);
    }

    var argLen = arguments.length;

    var validArg = (argLen === 0 && 'undefined') ||
             (argLen === 1 && (arguments[0] === 'name' || arguments[0] === 'version')) ||
             (argLen === 2 && ((arguments[0] === 'name' && arguments[1] === 'version') || 
              arguments[0] === 'version' && arguments[1] === 'name'))

    if(validArg){
      switch(argLen){
        case 0:
          return {
            name: name,
            version: version,
              appCodeName: navigator.appCodeName,
              appName: navigator.appName,
              appVersion: navigator.appVersion,
              cookieEnabled: navigator.cookieEnabled,
              language: navigator.language,
              onLine: navigator.onLine,
              platform: navigator.platform,
              product: navigator.product,
              userAgent: navigator.userAgent
          }
        case 1: 
          return arguments[0] === 'name' ? name : version;
        case 2:
          return {
            name: name,
            version: version
          }

      }
    } else {
      return false;
    }
  }

  function getRegExpGlb(delimStr)
  {
    var reqExpStr = "";
    for(var i=0; i<delimStr.length; i++) reqExpStr += delimStr[i] + '|';
    reqExpStr = reqExpStr.substring(0, reqExpStr.length - 1);
    return new RegExp(reqExpStr, "g");
  }

  function sort (arr, order, type, key)
  {// order = 'up/down/ascending/descending' | type = 'string/date'
    if(typeof order !== 'undefined') order = g.sortOrder[order.toLowerCase().trim()];
    if(typeof order === 'undefined') order = 'up';
    type = typeof type === 'undefined' ? 'string' : type.toLowerCase();

    switch(type)
    {
      case 'date':
        order === 'up' ? arr.sort(function(a,b){return new Date(a) - new Date(b);}) : arr.sort(function(a,b){return new Date(b) - new Date(a);});
        break;
      case 'json':
        order === 'up' ? arr.sort(function(a, b) { return a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;}) : arr.sort(function(b, a) { return a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;});
        break;
      default: // string
        if(typeof key !== 'undefined' && key === 'length')
        {
          order === 'up' ? arr.sort(function(a, b){return a.length - b.length}) : arr.sort(function(a, b){return b.length - a.length});
        }
        else
        {
          order === 'up' ? arr.sort(function(a,b){return a.localeCompare(b);}) : arr.sort(function(a,b){return b.localeCompare(a);});
        }
    }

    return true;
  }

  function getHtmlCode(el){
    el = get(el)[0];
    if(typeof el !== 'undefined')
      return el.innerHTML.replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  }

  // verify if an obj has keys, which 'key1 key2 key3...'
  function inObject(obj, key, caseIn){
    var keys = key.split(' '), found = 0;
    if(!caseIn)
      caseIn = false;

    if(caseIn){
      for(var i = 0; i < keys.length; i++){
        for(var k in obj) 
          if(k.toLowerCase() === keys[i].toLowerCase())
            found++
      }
    }
    else{  
      for(var i = 0; i < keys.length; i++){ 
        for(var k in obj)
          if(k === keys[i]){found++}
      }
    }
    return found === keys.length;
  }

  function getObjKey(obj, key){
    for(var k in obj)
      if(k.toLowerCase() === key.toLowerCase()){return k}
    return null;
  }

  // return index number if found; otherwise, -1. caseIn = true means case insensitive.
  function inArray(array, value, caseIn){
    if(!Array.prototype.indexOf || !!caseIn) {
      if(caseIn) {
        for(var i=0; i<array.length; i++)
          if(value.toLowerCase() === array[i].toLowerCase())
            return i;
      }
      else {  
        for(var i=0; i<array.length; i++)
          if(value === array[i])
            return i;
      }

      return -1;
    }
    else
      return array.indexOf(value);
  }

  function makeRandStr(length){
      var text = "",
          possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
          len = typeof arguments[0] === 'number' ? arguments[0] : 0;

      for( var i=0; i < len; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
  }

  function month(month, opt){
    var m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], 
        fm = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        retVal = null;

    if(typeof month === 'number' && month < 12){
      var abbr = typeof opt !== 'undefined' && typeof opt.abbr !== 'undefined' ? opt.abbr : true,
          format = typeof opt !== 'undefined' && typeof opt.format !== 'undefined' ? opt.format : 'c'; 
      retVal = abbr ? m[month] : fm[month];
      return format === 'c' ? retVal : format === 'u' ? retVal.toUpperCase() : format === 'l' ? retVal.toLowerCase() : null;      
    }
    else if (typeof month === 'string'){
      month = month.substring(0,3).toLowerCase();
      for(var i=0; i<m.length; i++){
        if(month === m[i].toLowerCase()) return i;
      }
    }

    return retVal;
  }

  function day(day, opt){
    var d = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], 
        fd = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        retVal = null;

    if(typeof day === 'number' && day < 7){
      var abbr = typeof opt !== 'undefined' && typeof opt.abbr !== 'undefined' ? opt.abbr : true,
          format = typeof opt !== 'undefined' && typeof opt.format !== 'undefined' ? opt.format : 'c'; 
      retVal = abbr ? d[day] : fd[day];
      return format === 'c' ? retVal : format === 'u' ? retVal.toUpperCase() : format === 'l' ? retVal.toLowerCase() : null;      
    }
    else if (typeof day === 'string'){
      day = day.substring(0,3).toLowerCase();
      for(var i=0; i<d.length; i++){
        if(day === d[i].toLowerCase()) return i;
      }
    }

    return retVal;
  }

  function getFirstOrLastDay (opt){
    if(typeof opt === 'object')
    {
      var y, m, date, get;
      for(var k in opt)
      {
        switch(k.toLowerCase())
        {
          case 'y': y = typeof opt[k] === 'number' ? opt[k] : typeof opt[k] === 'string' ? parseInt(opt[k]) : null; break;
          case 'm': m = typeof opt[k] === 'number' ? opt[k] - 1 : typeof opt[k] === 'string' ? parseInt(opt[k]) - 1 : null; break;
          case 'date': 
            date = toJsDate(date)
            if (typeof date !== 'undefined')
            {
              y = date.getFullYear();
              m = date.getMonth();
            }
            break;
          case 'get': get = 'firstlastboth'.indexOf(opt[k]) === -1 ? null : opt[k]; break;
          default: break;
        }
      }

      if( get === null && y === null || m === null || typeof y === 'undefined' || typeof m === 'undefined') return
      else return get === 'first' ? new Date(y, m, 1) : get === 'last' ? new Date(y, m + 1, 0) : [new Date(y, m, 1), new Date(y, m + 1, 0)];
    }
  }

  function getFirstDay ()
  {
    if (arguments.length == 1) return getFirstOrLastDay({date: arguments[0], get: 'first'});
    else if (arguments.length == 2) return getFirstOrLastDay({y: arguments[0], m: arguments[1], get: 'first'});
  }

  function getLastDay (date){
    if (arguments.length == 1) return getFirstOrLastDay({date: arguments[0], get: 'last'});
    else if (arguments.length == 2) return getFirstOrLastDay({y: arguments[0], m: arguments[1], get: 'last'});
  }

  function datediff(datepart, sDate, eDate)
  {
    sDate = toJsDate(sDate);
    eDate = toJsDate(eDate);

    if(typeof sDate !== 'undefined' && typeof eDate !== 'undefined')
    {
      switch(datepart.toLowerCase())
      {
        case 'day': case 'd': case 'dd': 
          var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
          return Math.round((eDate.getTime() - sDate.getTime())/oneDay);
          //Math.abs()
        default: break;
      }
    }
  }

  // return js date of any given date string of supported formats
  function toJsDate(datestr) {
    var retVal; // return js date; undefined will be return if the date string formats is not recogized.
    
    if (datestr instanceof Date) 
    { // need not to be converted
      return datestr;
    }
    else if(typeof datestr === 'string')
    { 
      if (datestr.replace(/ /g, '') === '') return;

      /* 3/15 | 3/14/15 | 03/14/15 | 14-Mar-15 | March 14, 2015 | 3/14/2015 | 14-Mar-2015 | Wednesday, January 14, 2015 | none date string */
      var month = {'JAN':1, 'FEB':2, 'MAR':3, 'APR':4, 'MAY':5, 'JUN':6, 'JUL':7, 'AUG':8, 'SEP':9, 'OCT':10, 'NOV':11, 'DEC':12},
          day = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
          dates, // array to store parts of given date string
          d, // day, optional
          m, // month from 0 to 11 
          y, // year, if 2 digits, we will assum to use the frist 2 digts of current year.
          twoDigitThisYear = new Date().getFullYear().toString().substring(0,2); // two digits of the current year to add to 

      // break date string into parts
      dates = datestr.replace(/\s\s+|,|-|\//g, " ").toUpperCase().split(" ");

      for(var i=0; i<dates.length; i++) {
        if(dates[i].length == 0) dates.splice(i, 1);
        if(dates[i].indexOf(':') > -1) {// remove times
          dates.splice(i, dates.length);
          break;
        }
        if (i == 3) break; // current support format study only 4 parts
      } 
      // assign d, m, y correctly
      if(dates.length == 2){ // mm-dd | dd-mmm  Note: assuming year is the current year, full month name accepted
        d = isNaN(dates[0]) ? dates[1] : isNaN(dates[1]) ? dates[0] : dates[1];
        m = isNaN(dates[0]) ? month[dates[0].substring(0,3)] : isNaN(dates[1]) ? month[dates[1].substring(0,3)] : dates[0];
        y = new Date().getFullYear();
      }
      else if(dates.length == 3){ // m/dd/yy | mm/dd/yy | d-mmm-yy | dd-mmm-yy | mmm dd, yyyy | m/dd/yyyy | dd-mmm-yyyy | yyyy-mm-dd | Note: full month name accepted
        d = dates[0].length == 4 ? dates[2] : isNaN(dates[0]) ? dates[1] : isNaN(dates[1]) ? dates[0] : dates[1];
        m = dates[0].length == 4 ? dates[1] : isNaN(dates[0]) ? month[dates[0].substring(0,3)] : isNaN(dates[1]) ? month[dates[1].substring(0,3)] : dates[0];
        y = dates[0].length == 4 ? dates[0] : dates[2].length == 4 ? dates[2] : dates[2].length === 2 ? twoDigitThisYear + dates[2] : null;
      }
      else if(dates.length == 4){ // ddd, mmm dd, yyyy
        if(day.indexOf(dates[0].substring(0,3)) > -1){
          d = isNaN(dates[1]) ? dates[2] : isNaN(dates[2]) ? dates[1] : dates[2];
          m = isNaN(dates[1]) ? month[dates[1].substring(0,3)] : isNaN(dates[2]) ? month[dates[2].substring(0,3)] : dates[1];
          y = dates[3].length == 4 ? dates[3] : dates[3].length === 2 ? twoDigitThisYear + dates[3] : null;
        }
      }

      // create js date using new Date()
      if(typeof m !== 'undefined'){
        d = parseInt(d);
        m = parseInt(m) - 1;
        y = parseInt(y);
        if( d <= 31 && m <= 11 && y !== null) retVal = new Date(y, m, d);
      }
    }
    return retVal;
  }

  // Calculate color brightness. color can be hex, rgb(), rgba(), color name. Return -1 if faile
  function brightness(color){

    if(typeof color === 'string')
      color = colorTo(color);
    if(color !== -1){
      return Math.round(Math.sqrt(
        color.r * color.r * .241 + 
        color.g * color.g * .691 + 
        color.b * color.b * .068));
    }
    return -1;
  }

  function color(color, random, min, max)
  {
    var colors = {'AliceBlue':'#F0F8FF','AntiqueWhite':'#FAEBD7','Aqua':'#00FFFF','Aquamarine':'#7FFFD4', 'Azure':'#F0FFFF','Beige':'#F5F5DC','Bisque':'#FFE4C4','Black':'#000000','BlanchedAlmond':'#FFEBCD','Blue':'#0000FF','BlueViolet':'#8A2BE2','Brown':'#A52A2A','BurlyWood':'#DEB887','CadetBlue':'#5F9EA0','Chartreuse':'#7FFF00','Chocolate':'#D2691E','Coral':'#FF7F50','CornflowerBlue':'#6495ED','Cornsilk':'#FFF8DC','Crimson':'#DC143C','Cyan':'#00FFFF','DarkBlue':'#00008B','DarkCyan':'#008B8B','DarkGoldenRod':'#B8860B','DarkGray':'#A9A9A9','DarkGreen':'#006400','DarkKhaki':'#BDB76B','DarkMagenta':'#8B008B','DarkOliveGreen':'#556B2F','DarkOrange':'#FF8C00','DarkOrchid':'#9932CC','DarkRed':'#8B0000','DarkSalmon':'#E9967A','DarkSeaGreen':'#8FBC8F','DarkSlateBlue':'#483D8B','DarkSlateGray':'#2F4F4F','DarkTurquoise':'#00CED1','DarkViolet':'#9400D3','DeepPink':'#FF1493','DeepSkyBlue':'#00BFFF','DimGray':'#696969','DodgerBlue':'#1E90FF','FireBrick':'#B22222','FloralWhite':'#FFFAF0','ForestGreen':'#228B22','Fuchsia':'#FF00FF','Gainsboro':'#DCDCDC','GhostWhite':'#F8F8FF','Gold':'#FFD700','GoldenRod':'#DAA520','Gray':'#808080','Green':'#008000','GreenYellow':'#ADFF2F','HoneyDew':'#F0FFF0','HotPink':'#FF69B4','IndianRed':'#CD5C5C','Indigo':'#4B0082','Ivory':'#FFFFF0','Khaki':'#F0E68C','Lavender':'#E6E6FA','LavenderBlush':'#FFF0F5','LawnGreen':'#7CFC00','LemonChiffon':'#FFFACD','LightBlue':'#ADD8E6','LightCoral':'#F08080','LightCyan':'#E0FFFF','LightGoldenRodYellow':'#FAFAD2','LightGray':'#D3D3D3','LightGreen':'#90EE90','LightPink':'#FFB6C1','LightSalmon':'#FFA07A','LightSeaGreen':'#20B2AA','LightSkyBlue':'#87CEFA','LightSlateGray':'#778899','LightSteelBlue':'#B0C4DE','LightYellow':'#FFFFE0','Lime':'#00FF00','LimeGreen':'#32CD32','Linen':'#FAF0E6','Magenta':'#FF00FF','Maroon':'#800000','MediumAquaMarine':'#66CDAA','MediumBlue':'#0000CD','MediumOrchid':'#BA55D3','MediumPurple':'#9370DB','MediumSeaGreen':'#3CB371','MediumSlateBlue':'#7B68EE','MediumSpringGreen':'#00FA9A','MediumTurquoise':'#48D1CC','MediumVioletRed':'#C71585','MidnightBlue':'#191970','MintCream':'#F5FFFA','MistyRose':'#FFE4E1','Moccasin':'#FFE4B5','NavajoWhite':'#FFDEAD','Navy':'#000080','OldLace':'#FDF5E6','Olive':'#808000','OliveDrab':'#6B8E23','Orange':'#FFA500','OrangeRed':'#FF4500','Orchid':'#DA70D6','PaleGoldenRod':'#EEE8AA','PaleGreen':'#98FB98','PaleTurquoise':'#AFEEEE','PaleVioletRed':'#DB7093','PapayaWhip':'#FFEFD5','PeachPuff':'#FFDAB9','Peru':'#CD853F','Pink':'#FFC0CB','Plum':'#DDA0DD','PowderBlue':'#B0E0E6','Purple':'#800080','RebeccaPurple':'#663399','Red':'#FF0000','RosyBrown':'#BC8F8F','RoyalBlue':'#4169E1','SaddleBrown':'#8B4513','Salmon':'#FA8072','SandyBrown':'#F4A460','SeaGreen':'#2E8B57','SeaShell':'#FFF5EE','Sienna':'#A0522D','Silver':'#C0C0C0','SkyBlue':'#87CEEB','SlateBlue':'#6A5ACD','SlateGray':'#708090','Snow':'#FFFAFA','SpringGreen':'#00FF7F','SteelBlue':'#4682B4','Tan':'#D2B48C','Teal':'#008080','Thistle':'#D8BFD8','Tomato':'#FF6347','Turquoise':'#40E0D0','Violet':'#EE82EE','Wheat':'#F5DEB3','White':'#FFFFFF','WhiteSmoke':'#F5F5F5','Yellow':'#FFFF00','YellowGreen':'#9ACD32'}
    
    if(typeof color === 'string' && (color.toLowerCase() === 'name' || color.toLowerCase() === 'code') && random === true)
    {
      var randNum = getRandomInt(0, Object.keys(colors).length - 1),
          c = color === 'name' ? g.color('name')[randNum] : g.color('code')[randNum];
      if(typeof min === 'number' && typeof max === 'number') 
      {
        var level = brightness(c);
        while(!(min < level && level < max))
        {
          c = g.color(color, true)
          level = brightness(c);
        } 
      }

      return c
    }

    if(typeof color === 'string' && color.toLowerCase() === 'name') return Object.keys(colors);
    else if(typeof color === 'string' && color.toLowerCase() === 'code')
    {
      var codes = [];
      for(var k in colors) codes.push(colors[k]);
      return codes;
    }
    else if(typeof color === 'string')
    {
      for(var cName in colors)
      {
        if(color.toLowerCase() === cName.toLowerCase()) return colors[cName];
        else if(color === colors[cName]) return cName;
      }
    }
    else return colors;
  }

  function colorTo(color, colorType, retType)
  {
    if(typeof color === 'string')
    {
      var r, g, b, a = 1.0,
          retType = typeof retType === 'string' ? retType : 's';

      if(color.charAt(0) !== '#' && 
        color.charAt(0).toLowerCase() !== 'r' && 
        color.charAt(0).toLowerCase() !== 'h') color = color(color);

      if(color.charAt(0) === '#')
      {
        r = color.substring(1,3);
        r = parseInt(r, 16); // convert hex to integer
        g = color.substring(3,5);
        g = parseInt(g, 16); 
        b = color.substring(5,7);
        b = parseInt(b, 16);
      }
      else if(color.charAt(0) === 'r' || color.charAt(0) === 'R')
      {
        var cArr = color.replace(/[rgba()]/g,'').split(',');
        r = parseFloat(cArr[0]);
        g = parseFloat(cArr[1]);
        b = parseFloat(cArr[2]);
        a = cArr.length === 4 ? parseFloat(cArr[3]) : 1.0;
      }
      else if(color.charAt(0).toLowerCase() === 'h')
      {
        var hsl = color.replace(/[hsl()]/g,'').split(','),
            h = parseFloat(hsl[0]),
            s = parseFloat(hsl[1]),
            l = parseFloat(hsl[2]),
            m, c, x;

        if (!isFinite(h)) h = 0;
        if (!isFinite(s)) s = 0;
        if (!isFinite(l)) l = 0;

        h /= 60;
        if (h < 0) h = 6 - (-h % 6);
        h %= 6;

        s = Math.max(0, Math.min(1, s / 100));
        l = Math.max(0, Math.min(1, l / 100));

        c = (1 - Math.abs((2 * l) - 1)) * s;
        x = c * (1 - Math.abs((h % 2) - 1));

        if (h < 1) {
          r = c;
          g = x;
          b = 0;
        } else if (h < 2) {
          r = x;
          g = c;
          b = 0;
        } else if (h < 3) {
          r = 0;
          g = c;
          b = x;
        } else if (h < 4) {
          r = 0;
          g = x;
          b = c;
        } else if (h < 5) {
          r = x;
          g = 0;
          b = c;
        } else {
          r = c;
          g = 0;
          b = x;
        }

        m = l - c / 2
        r = Math.round((r + m) * 255)
        g = Math.round((g + m) * 255)
        b = Math.round((b + m) * 255)
      }

      if(typeof colorType === 'string')
      {
        switch(colorType.toLowerCase())
        {
          case 'hex':
            r = r.toString(16); g = g.toString(16); b = b.toString(16);
            return ( "#" + (r.length == 1 ? '00' : r) + (g.length == 1 ? '00' : g) + (b.length == 1 ? '00' : b) ).toUpperCase();
          case 'rgb':
          case 'rgba':
            return retType === 's' ? 'rgba(' + r + ', ' + g + ', ' + b + ',' + a + ')' : [r,g,b,a];
          case 'hsl':
            r /= 255; g /= 255; b /= 255;      
            var max = Math.max(r, g, b), min = Math.min(r, g, b), 
                h = 0, s = 0, l = (max + min) / 2;

            if(min != max)
            {
              //calculate s
              if(l < 0.5) s = (max - min) / (max + min);
              else s = (max - min) / (2.0 - max - min);

              // calculate h
              if(r == max) h = (g - b) / (max - min);
              else if(g = max) h = 2.0 + (b - r)/(max - min);
              else h = 4.0 + (r - g) / (max - min);
            }

            l *= 100; s *= 100; h *= 60;
            if(h < 0) h += 360;
            l = Math.round(l * 100) / 100;
            s = Math.round(s * 100) / 100;
            h = Math.round(h * 100) / 100;
            return retType === 's' ? 'hsl('+h+', '+s+'%, '+l+'%)' : [h, s, l];
          default:
            break;
        }  
      }

      return {r:r, g:g, b:b, a:a}; 
    }
  }

  function contrastBg(bgColor, darkColor, brightColor){
    if(!darkColor)
      darkColor = 'black';
    if(!brightColor)
      brightColor = 'white' 

    return brightness(bgColor) === -1 ? -1 : brightness(bgColor) < 130 ? brightColor : darkColor;
  }

  function getRandomInt(min, max) 
  {// min & max are included
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /*Return: an array of HTMLElement, [HTMLElement]
    Use:
    1. check if elment exist in doc and always return back as HTMLElement.
       if(fn(idString/HTMLElement).length > 0), fn(idString/HTMLElement)[0] will return an el
    2. get an array of elment by filter
       fn(idString/HTMLElement|.|*|'','id:,class:,tag:')
  */
  function get(el, by, level){
    var list = []
    if(!by){//id string or element -> elment
      if(isElement(el))
        list.push(el);
      else if(document.getElementById(el) !== null){
        list.push(document.getElementById(el));
      }
    }
    else{//search by id, class, attr, tag
      if(el==='*' || el==='.' || el===''){
        el = document;
      }

      var opt = by.split(':')[0].replace(/ /g,'').toLowerCase(),
      search = by.split(':')[1];

      switch(opt){
        case 'id':
          return get(search);
        case 'class':
          if(!level && !!document.getElementsByClassName){
            var htmlCollection = el.getElementsByClassName(search);
            for(var i=0; i<htmlCollection.length; i++)
              list.push(htmlCollection[i]);
          }
          else if(level === 1){
            var nodes = el.childNodes;
            for(var i=0; i<nodes.length; i++)
              if(nodes[i].nodeType === 1 && cssHas(nodes[i],search))
                list.push(nodes[i]);
          }
          break;
        case 'tag':
          if(!!document.getElementsByTagName){
            var htmlCollection = el.getElementsByTagName(search);
            for(var i=0; i<htmlCollection.length; i++)
              list.push(htmlCollection[i]);
          }
          break;
        default:
          return list;
      }
    }
    return list;
  }

  /* Use
     1. return value of an attribute
        fn(el, attribute)
     2. set the attribute and value
        fn(el, attribute, value)
     3. set multiple attributes and values
        fn(el, {'attribute':value, 'attribute':value, ...})
  */
  function attr(el, attr, value){
    el = typeof el === 'string' ? document.getElementById(el) : el;
    if(!!el && !!attr && !value && typeof attr === 'string')
      return el.getAttribute(attr);
    else if(!!el && !!attr && !value && typeof attr === 'object')//set multiple attr & value
      for(var k in attr)
        el.setAttribute(k, attr[k]);
    else if(!!el && !!attr && !!value)
      el.setAttribute(attr, value);
  }

  /*  Use:
      1. Add event listener, attachEvent, or event binding. 
         fn(target, event, listener, useCapture, wantsUntrusted)
  */
  function addEvent(t, e, l, usecapt, wantuntr){
    if(!usecapt)
      usecapt = false;
    if(!!t && !!e && !!l){
      t = get(t)[0];
      if(t.addEventListener){
        if(!wantuntr)
          t.addEventListener(e,l,usecapt)
        else
          t.addEventListener(e,l,usecapt,wantuntr)
      }
      else if(t.attachEvent)
        t.attachEvent('on'+e,l)
      else
        t['on'+e] = l;
    }
  }

  function removeEvent(t,e,l,usecapt){
    if(!usecapt)
      usecapt = false;

    if(!!t && !!e && !!l){
      t = get(t)[0];
      if(t.removeEventListener)
        t.removeEventListener(e,l,usecapt);
      else if(t.detachEvent)
        t.detachEvent('on'+e,l);
    }
  }

  function enableTab(id) 
  {
    var el = document.getElementById(id);
    el.onkeydown = function(e) {
      if (e.keyCode === 9) { // tab was pressed
        // get caret position/selection
        var val = this.value,
        start = this.selectionStart,
        end = this.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        this.value = val.substring(0, start) + '\t' + val.substring(end);

        // put caret at right position again
        this.selectionStart = this.selectionEnd = start + 1;

        // prevent the focus lose
        return false;
      }
    };
  }

  /* Return: true/false
     Use:
     1. check if doc.header has a .className, #idName, or tagName style. 
        fn('.className/#idName/tag')
     2. check if the el has one ore more class names.
        fn(idString/HTMLElement, 'class1 class2,...')
  */
  function cssHas(el, selector){
    if(!!el && !selector){//search internal style in document.header
      var styles = get('.','tag:style');
      for(var i=0; i<styles.length; i++){//per style tag
        var ruleSets = styles[i].innerHTML.split('}');
        for(var j=0; j<ruleSets.length; j++){//per rules set, selector{...}
          if (el === ruleSets[j].split('{')[0].replace(/\r?\n|\r| /g,''))
            return true;
        }
      }
    }
    else if(!!el && !!selector){//search class that applied to el
      el = get(el)[0];
      var classes = el.className.split(' '),//classes of element 
          selectors = selector.replace(/\./g,'').split(' '),//verified classes
          foundCounter = 0;

      for(var j=0; j<selectors.length; j++){
        for(var i=0; i<classes.length; i++){
          if(classes[i]===selectors[j]){
            foundCounter++;
            break;
          }
        }
      }
      return foundCounter===selectors.length;
    }
    return false;
  }

  // get property of an element
  function cssGet(el, property){
     if(!!el && !!property && get(el).length > 0 && typeof property === 'string'){
        el = get(el)[0];
        var win = window || document.defaultView,
           bgStr;
        if(win.getComputedStyle){
           bgStr = win.getComputedStyle(el, null).getPropertyValue(property);
        }
        return typeof bgStr === 'undefined' ? -1 : bgStr;
     }
  }

  /* Use
     1. fn('.className{rule1;rule2;...}') // add css class declaration written in string to doc.header
     2. fn('.className', [rule1,rule2,...]) // add css class declaration written in array to doc.header
     3. fn('idString'/HTMLElement, 'className1 className2,...') = add class(s) to el
     4. fn('idString'/HTMLElement, '.className{rule1;rule2;...}') = add a class to el & css class declaration writtent in string to doc.header
     5. fun('idString'/HTMLElement, '.className', [rule1,rule2,...]) = add a class to el & css class declaration writtent in array to doc.header
  */
  function cssAdd(){
    if(arguments.length === 1 && typeof arguments[0] === 'string')// add styleStr to doc.header
      addStyleStr(arguments[0]);
    else if(arguments.length === 2){
      if(arguments[1] instanceof Array)// add styleArr to doc.header
        addStyleStr(arguments[0]+'{'+arguments[1].join(';')+'}');
      else if(typeof arguments[1] === 'string' && arguments[1].indexOf('{') === -1 && arguments[1].indexOf('}') === -1)//add class(s) to el
        addClassToEl(get(arguments[0])[0],arguments[1]);
      else if(typeof arguments[1] === 'string' && arguments[1].indexOf('{') > -1 && arguments[1].indexOf('}') > -1)//add a class to el & that class declaration written in string to doc.header
        addClassToEl(get(arguments[0])[0], addStyleStr(arguments[1]));
    }
    else if(arguments.length === 3){//add a class to el & that class declaration written in array to doc.header
        addStyleStr(arguments[1]+'{'+arguments[2].join(';')+'}');
        addClassToEl(get(arguments[0])[0],arguments[1]);
    }

    function addClassToEl(el, _class){
      var classes = _class.replace(/ +(?= )/g,'').split(' ');
      for(var i=0; i<classes.length; i++){   
        if(!cssHas(el,classes[i])){
          if(el.className.length > 0)
            el.className += ' ';
          el.className += classes[i].replace(/\.|\#/g, '');   
        }
      }
    }
    function addStyleStr(style){
      var name = style.split('{')[0],
          styleEl;
        

      if(get('','tag:style').length === 0){
        styleEl = appendChild(document.head, 'style');
      }
      else
        styleEl = get('','tag:style')[0];

      if(!cssHas(name))
        styleEl.innerHTML += style;
      return name;
    }
  }

  /* Use:
     1. remove one or more .className/#idString/tagName{...} from doc.header
        fn('.className1/#idString1/tagName1, .className2/#idString2/tagName2, ...') 
     2. remove one or more class from el
        fn(idString/HTMLElement, 'className1, className2, ...')
     3. remove all classes from el
        fn(idString/HTMLElement, '.|*|all' )
     4. remove one or more class from el and doc.header
        fn(idString/HTMLElement, 'className1, className2,...', true)
  */
  function cssRemove(el, selectors, both){
    if(!!el && !selectors && !both){
      removeFromDoc(el);
    }
    else{
      el = get(el)[0];
      if(!!el && !!selectors && !both){
        if(selectors.replace(/ /g,'') === '.' || selectors.replace(/ /g,'') === '*' || selectors.replace(/ /g,'') === 'all')
              el.removeAttribute('class')
           removeFromEl(selectors)
        }
        else if(!!el && !!selectors && !!both && both === true){
           removeFromEl(selectors);
           selectors = selectors.split(' ').join(' .')
           selectors = '.' + selectors;
           removeFromDoc(selectors);//must be added dot
        }
     }

      function removeFromDoc(selectorsStr){
        var styles = get('.','tag:style'),
            selArr = selectorsStr.replace(/ +(?= )/g,'').split(' ');
        for(var s=0; s < selArr.length; s++){//per selector param search
          var selector = selArr[s].replace(/ /g,'').toLowerCase();
          for(var i=0; i<styles.length; i++){//per style tag
            var declarations = styles[i].innerHTML.split('}');
            for(var j=0; j < declarations.length; j++){//per decaration
              var rule = declarations[j].split('{')[0].replace(/\r?\n|\r| /g,'').toLowerCase();
                if(selector === rule)
                  styles[i].innerHTML = styles[i].innerHTML.replace(declarations[j]+'}','');   
            }
          }
        }
     }

      function removeFromEl(selectorsStr){
        var selArr = selectorsStr.replace(/ +(?= )|\./g,'').split(' '),
          elClasses = el.className.replace(/ +(?= )/g,'').split(' ');
        for(var i=0; i<selArr.length; i++){
          for(var j=0; j<elClasses.length; j++)
            if(selArr[i] === elClasses[j])
              el.className = el.className.replace(selArr[i],'')
        }
        el.className = el.className.replace(/ +(?= )/g,'');
        if(el.className.length === 0)
           el.removeAttribute('class')
     }
  }

  function cssToggle(el, className){
     cssHas(el, className) ? cssRemove(el,className) : cssAdd(el,className);
  }

  function width(el)
  {
    var w;
    if(arguments.length === 0)
    {
      w = window.innerWidth 
      || document.documentElement.clientWidth //IE 8, 7, 6, 5
      || document.body.clientWidth; //IE 8, 7, 6, 5
    }
    else if(arguments.length === 1 && (typeof arguments[0] === 'string' && (arguments[0].toLowerCase() === 'scroll' || arguments[0].toLowerCase() === 'scrollbar')))
    {
      var temp = appendChild(document.body,'div');
      temp.style.width = '100px';
      temp.style.overflow = 'scroll';
      var viewportWidth = width(temp);
      removeChild(temp, true);
      return  100 - viewportWidth <= 0 ? 0 : 100 - viewportWidth;
    }
    else if(arguments.length === 1 && ((typeof arguments[0] === 'string' && arguments[0] !== '') || isElement(arguments[0])))
    {
      el = isElement(arguments[0]) ? arguments[0] : document.getElementById(arguments[0]);
      if(el !== null) w = el.innerWidth || el.clientWidth;
    }
    return w;
  }
  function height(el)
  {
    var h;
    if(arguments.length === 0){
      h = window.innerHeight
      || document.documentElement.clientHeight //IE 8, 7, 6, 5
      || document.body.clientHeight; //IE 8, 7, 6, 5
    }else if(arguments.length === 1 && ((typeof arguments[0] === 'string' && arguments[0] !== '') || isElement(arguments[0]))){
      el = isElement(arguments[0]) ? arguments[0] : document.getElementById(arguments[0]);
      if(el !== null) h = el.innerHeight || el.clientHeight;
    }
    return h;
  }
  function hasScrollbar(el)
  {
    el = isElement(el) ? el : document.getElementById(el);
    if(el !== null) return el.scrollHeight - el.clientHeight > 0
  }
  /*return -> child HTMLElement
    Use:
      1. fn(parent, child)
      2. fn(parent, child, {before: <before el>, text: '', attr: {}})     
  */
  function appendChild(parent, child, opt){
    var pEl = arguments[0], // parent element 
        cEl = arguments[1], // child element
        opt = arguments[2]; // options when adding

    pEl = typeof pEl === 'string' ? document.getElementById(pEl) : arguments[0];
    cEl = typeof cEl === 'string' ? document.createElement(cEl) : cEl;   

    if(pEl !== null && typeof pEl !== 'undefined' && typeof cEl !== 'undefined'){
      if(typeof opt === 'undefined') {// append without options
        pEl.appendChild(cEl);
      } 
      else {// append with options
        var before = false, bEl;
        for(var k in opt){
          if(k.toLowerCase() === 'before'){
            bEl = typeof opt[k] === 'string' ? document.getElementById(opt[k]) : opt[k];
            before = true;
          }
          if(k.toLowerCase() === 'text'){
            var textNode = document.createTextNode(opt[k]);
            cEl.appendChild(textNode);
          }
          if(k.toLowerCase() === 'attr'){
              attr(cEl, opt[k]);
          }
        }
        before && bEl !== null ? pEl.insertBefore(cEl, bEl) : pEl.appendChild(cEl);
      }               
    }

    return cEl;
  }

  /* return -> true/false
     - fn() : remove all nodes under doc.body 
     - fn(idString/HTMLElement, (false)) : remove all childs under el
     - fn(idString/HTMLElement, true) : remove all children and el
     - fn(idString/HTMLElement, 0) : remove first child node type element
  */
  function removeChild(el, opt){
    if(typeof el === 'undefined' && typeof opt === 'undefined'){
      while(document.body.firstChild)
        document.body.removeChild(document.body.firstChild)
      return document.body.childNodes.length === 0;
    }
    else{
      el = get(el)[0];
      if(typeof opt === 'number'){
        var nodes = el.childNodes, count = 0;
        for(var i = 0; i < nodes.length; i++){
          if(nodes[i].nodeType === 1){
            if(count === opt){
              el.removeChild(nodes[i])
              break;
            }
            else
              count++;
          }
        }
      }
      else if(typeof opt === 'boolean' || typeof opt === 'undefined'){
        if(opt === true)
          el.parentNode.removeChild(el);
        else{
          while(el.firstChild)
            el.removeChild(el.firstChild);
          return el.parentNode.hasChildNodes()
        }  
      }
    }
  }

  function hasChild(pEl, cEl){
     if(!!pEl && !!cEl){
        pEl = get(pEl)[0];
        cEl = get(cEl)[0];
        var nodes = pEl.childNodes;
        for(var i=0; i<nodes.length; i++)
           if(nodes[i] === cEl) return true;
        return false;
     }
     return 'Parent and child node parameters must be provided';
  }

  function uiSelectM(pEl){
    var sel = pEl.nodeName.toLowerCase() === 'select' ? pEl : appendChild(pEl, 'select', {attr:{'class':'form-control ui-sel-m', 'id':'report-list'}});
    sel.multiple = true;

    var checkOpt = function(opt){
      attr(opt, 'ticked', '1');
      
      var value = attr(opt, 'gValue');
      if(value === null){
        attr(opt, 'gValue', opt.innerHTML);
        value = opt.innerHTML;              
      } 

      opt.innerHTML = value + ' ✔';
      cssToggle(opt, 'ui-sel-m-selected');
    }

    var uncheckOpt = function(opt){
      attr(opt, 'ticked', '0');
      opt.innerHTML = attr(opt, 'gValue');
      opt.removeAttribute('gValue');
      cssToggle(opt,'ui-sel-m-selected')
    }

    var onclickOpt = function(e){
      if(this.multiple){
        var opt = this[this.selectedIndex];
        var tick = attr(opt, 'ticked'); 
        tick === '0' || tick === null ? checkOpt(opt) : uncheckOpt(opt);
        e.stopPropagation();
      }
    }

    addEvent(sel, 'click', onclickOpt);

    return sel;
  }

  function uiSelect(pEl, retCont)
  {
    pEl = isElement(pEl) ? pEl : document.getElementById(pEl);

    if(pEl !== null)
    {
      var sel, selCont;
      if(pEl.nodeName.toLowerCase() === 'select' && !cssHas(sel, 'sel'))
      {// if pEl is a select node that is not yet transformed
        sel = pEl;
        selCont = appendChild(pEl.parentNode, 'span');
        appendChild(selCont, sel);
        if(!sel.hasAttribute('id')) attr(sel, 'id', makeRandStr(10));

      }
      else
      {//make new select and place it inside the parent node pEl
        selCont = appendChild(pEl, 'span');
        sel = appendChild(selCont, 'select', {attr: {'id':makeRandStr(10)}});
      }

      cssAdd(selCont, 'ui-sel-standard')
      cssAdd(sel, 'ui-sel');

      return retCont ? [sel, selCont] : sel; 
    }
    return false;
  }

  function uiSelectIcon(el, content, className)
  {
    var uiSel = uiSelect(el, true);
    if(uiSel !== false && typeof content !== 'undefined')
    {
      var sel = uiSel[0], selCon = uiSel[1],
          yesIcon = text = content.indexOf('glyphicon') > -1,
          className = typeof className === 'string' ? className : 'ui-sel-xs',
          classStr = yesIcon ? 'ui-sel-icon-text ' + content + ' ' + className : 'ui-sel-icon-text ' + className,
          text = yesIcon ? '' : content;

      text = appendChild(selCon, 'span', {text: text, before: sel, attr: {'class':classStr}});
      
      cssRemove(selCon, 'ui-sel-standard')
      cssAdd(selCon, 'ui-sel-icon')
      selCon.style.width = text.offsetWidth + 'px';
      selCon.style.height = text.offsetHeight + 'px';
      sel.style['padding-left'] = selCon.offsetWidth + 'px';

      return sel;
    }
    return false;
  }

  function uiSelectAddArray(sel, arr, optgroup){
    if(typeof sel !== 'undefined' && typeof arr !== 'undefined'){
      var optg, opt;
      sel = get(sel)[0];

      // add optgroup
      if(typeof optgroup === 'string' && optgroup !== ''){
        optg = appendChild(sel, 'optgroup');
        optg.label = optgroup;
      }
      else
        optg = sel;

      // populate arr items to sel
      for(var i=0; i<arr.length; i++){
        opt = appendChild(optg, 'option', {text:arr[i]});
        attr(opt, 'ticked', 0);
      }
    }
  }

  /*Use:
    1. fn(selectObj, option, index) -> add an option
    2. fn(selectObj, array, optgroup) -> add an array
    3. fn(selectObj, {optgroup:array, optgroup:array})
  */
  function uiSelectAdd(sel, data, opt){
    if(typeof data === 'string'){
      var index = typeof opt === 'undefined' ? sel.length : opt;
      appendChild(sel, 'option', {text: data, before: sel[index]});
    }
    else if(data instanceof Array){
      uiSelectAddArray(sel, data, opt);
    }
    else if(typeof data === 'object' && !(data instanceof Array)){
      for(var g in data)
        uiSelectAddArray(sel, data[g], g)
    }
  }

  function uiSelectRemove(sel, nameOrIdx)
  {
    sel = sel.nodeName.toLowerCase() === 'select' ? sel : document.getElementById(sel);
    if(sel !== null)
    {
      if(typeof nameOrIdx === 'undefined') removeChild(sel);
      else if(typeof nameOrIdx === 'number') sel.remove(nameOrIdx);
      else if(typeof nameOrIdx === 'string') for(var i=0; i<sel.length; i++) if(sel.options[i].value === nameOrIdx) {sel.remove(i)}
    }
  }

  function uiFileInput(input){
    var inputCont = appendChild(input.parentNode, 'div', {attr:{'class':'file-brow-cont btn btn-default no-user-select','id':document.body.childNodes.length}});
    appendChild(inputCont, input)
    cssAdd(".file-brow-cont:before{content:'Choose File: No file chosen';}")
    addEvent(input, 'change', function(e){
      var files = e.target.files, names = '';
      for (var i = 0; i < files.length; i++) names += files[i].name + ', ';
      names = names.substring(0,names.length-2);
      cssRemove('.file-brow-cont:before');
      cssAdd(".file-brow-cont:before{content:'Choose File: " + names + "';}")
    })
  }

  function uiTabGroup (parentElement) {
    var pEl = typeof arguments[0] === 'string' ? document.getElementById(arguments[0]) : arguments[0];
    if(pEl !== null){
      //tab container
      var tabFrame = appendChild(pEl, 'div', {attr:{'class':'uiTab-frame'}});
      
      //tab title container
      var titleFrame = appendChild(tabFrame, 'div', {attr:{'class':'uiTab-title-frame'}});

      //tab body container
      var bodyFrame = appendChild(tabFrame, 'div', {attr:{'class':'uiTab-body-frame'}});
    }

    return {title: titleFrame, body: bodyFrame, tgroup: tabFrame};
  }

  function uiTab (tgroup, titleStr, contentStr) {
    // title 
    var index = tgroup.title.childNodes.length,
        title = appendChild(tgroup.title, 'div', {text: typeof titleStr === 'string' ? titleStr : '', attr:{'class':'uiTab-title', 'tabIndex':index}}),
        body = appendChild(tgroup.body, 'div', {text: typeof contentStr === 'string' ? contentStr : '', attr:{'class':'uiTab-body', 'tabIndex':index}});
    
    if(tgroup.body.childNodes.length > 1)
      body.style.display = 'none';

    // perform actions when click on title
    addEvent(title, 'click', function(){
      //title clicked effect
      var titleNodes = this.parentNode.childNodes;
      for(var i=0; i<titleNodes.length; i++){
        titleNodes[i].setAttribute('class', 'uiTab-title no-user-select');
      }
      this.setAttribute('class', 'uiTab-title no-user-select uiTab-title-clicked');

      //hide all and show one that corresponding to cocked title
      var bodyNodes = tgroup.body.childNodes;
      for(var i=0; i<bodyNodes.length; i++){
        bodyNodes[i].style.display = bodyNodes[i].getAttribute('tabIndex') === this.getAttribute('tabIndex') ? 'table' : 'none';
      }
    });

    return {title: title, body: body}
  }

  function uiDate (parentElement, dateFieldTitle, dateInput){
    var pEl = typeof arguments[0] === 'string' ? document.getElementById(arguments[0]) : arguments[0],
        title = typeof arguments[1] === 'string' ? arguments[1]+': ' : '',
        container = appendChild(pEl, 'span', {text: title}),
        dInput = typeof arguments[2] === 'undefined' ? appendChild( container, 'input') : typeof arguments[2] === 'string' && document.getElementById(arguments[2]) !== null ? document.getElementById(arguments[2]) : arguments[2];
    
    container.appendChild(dInput);//if input is given, move it to container
    dInput.setAttribute('type', 'text');
    cssAdd(dInput, 'ui-date');
    $( dInput ).datepicker();

    return dInput;
  }

  /*
  Parameter: string/HTMLElement, number
      @ string/HTMLElement : element to be animated. Can be passed as id attribute string or HTMLElement object
      @ duration : animation duration
  Task: [x] slide in & out from right
  */
  function toggleFromRight(element, duration){
      var elmnt = (element instanceof HTMLElement) ? element : document.getElementById(element);
      var width = elmnt.offsetWidth;
      var id = '#' + elmnt.id;
      
      var slideDirection = elmnt.getAttribute('slide') === 'in' ? 'out' : 'in';
      elmnt.setAttribute('slide', slideDirection);
      elmnt.getAttribute('slide') === 'out' ? elmnt.style.display = 'table' : elmnt.style.display = 'none';

      $(id).animate({
          'right': '-'+width, 
          'width': 'toggle',
      }, duration );
  } 

  /*
  Parameter: string/HTMLElement, number
      @ string/HTMLElement : element to be animated. Can be passed as id attribute string or HTMLElement object
      @ duration : animation duration
  Task: [x] slide in & out from left
  */
  function toggleFromLeft(element, duration){
      var elmnt = (element instanceof HTMLElement) ? element : document.getElementById(element);
      var width = elmnt.offsetWidth;
      var id = '#' + elmnt.id;
      $(id).animate({
          'left': '-'+width, 
          'width': 'toggle',
      }, duration );
  }

  function define(){
    var lib = {};
    
    lib.sortOrder = {'up':'up', 'down':'down', 'ascending':'up', 'asc':'up', 'descending':'down', 'desc':'down'};

    lib.print = function(){ return print.apply(this, arguments); }
    lib.getRegExpGlb = function(){ return getRegExpGlb.apply(this, arguments); }
    lib.sort = function(){ return sort.apply(this, arguments); }
    lib.browser = function(){ return browser.apply(this, arguments); }
    lib.isElement = function() { return isElement.apply(this, arguments); }
    lib.isObjEql = function() { return isObjEql.apply(this, arguments); }
    lib.compareValue = function() { return compareValue.apply(this, arguments); }
    lib.indexOf = function() { return indexOf.apply(this, arguments); }
    lib.spliceM = function() { return spliceM.apply(this, arguments); }
    lib.makeRandStr = function(){ return makeRandStr.apply(this, arguments); }
    lib.color = function () { return color.apply(this, arguments); }; 
    lib.colorTo = function () { return colorTo.apply(this, arguments); }; 
    lib.brightness = function () { return brightness.apply(this, arguments); }; 
    lib.month = function () { return month.apply(this, arguments); }
    lib.datediff = function () { return datediff.apply(this, arguments); }
    lib.day = function () { return day.apply(this, arguments); }
    lib.getFirstDay = function () { return getFirstDay.apply(this, arguments); }
    lib.getLastDay = function () { return getLastDay.apply(this, arguments); }
    lib.toJsDate = function(){ return toJsDate.apply(this, arguments); }
    lib.has = function () { return arguments[0] instanceof Array ? inArray.apply(this, arguments) : inObject.apply(this, arguments); }
    lib.contrastBg = function () { return contrastBg.apply(this, arguments); }
    lib.get = function () { return get.apply(this, arguments); }
    lib.getRandomInt = function () { return getRandomInt.apply(this, arguments); }
    lib.attr = function () { return attr.apply(this, arguments); }
    lib.cssHas = function () { return cssHas.apply(this, arguments); }
    lib.cssGet = function () { return cssGet.apply(this, arguments); }
    lib.cssAdd = function(){ return cssAdd.apply(this, arguments); }
    lib.cssRemove = function(){ return cssRemove.apply(this, arguments); }
    lib.cssToggle = function () { return cssToggle.apply(this, arguments); }
    lib.appendChild = function(){ return appendChild.apply(this, arguments); }
    lib.removeChild = function(){ return removeChild.apply(this, arguments); }
    lib.width = function(){ return width.apply(this, arguments); }
    lib.height = function(){ return height.apply(this, arguments); }
    lib.hasScrollbar = function(){ return hasScrollbar.apply(this, arguments); }
    lib.hasChild = function(){ return hasChild.apply(this, arguments); }
    lib.addEvent = function(){ return addEvent.apply(this, arguments); }
    lib.removeEvent = function(){ return removeEvent.apply(this, arguments); }
    lib.uiSelect = function(){ return uiSelect.apply(this, arguments); }
    lib.uiSelectIcon = function(){ return uiSelectIcon.apply(this, arguments); }
    lib.uiSelectM = function(){ return uiSelectM.apply(this, arguments); }
    lib.uiSelectAdd = function(){ return uiSelectAdd.apply(this, arguments); }
    lib.uiSelectRemove = function(){ return uiSelectRemove.apply(this, arguments); }
    lib.uiFileInput = function () { return uiFileInput.apply(this, arguments); }
    lib.toggleFromRight = function(){ toggleFromRight.apply(this, arguments); }
    lib.toggleFromLeft = function(){ return toggleFromLeft.apply(this, arguments); }
    lib.uiTabGroup = function(){ return uiTabGroup.apply(this, arguments); }
    lib.uiTab = function(){ return uiTab.apply(this, arguments); }
    lib.uiDate = function(){ return uiDate.apply(this, arguments); }
    lib.getTree = function(){ return getTree.apply(this, arguments); }
    return lib;
  }

  typeof lib === 'undefined' ? window.lib = window.g = define() : console.log("gjs is already defined.");

})(window);


/****************************************************************************
  Workbook object buitl on the top of xlsx.js, shim.js, g, $
*****************************************************************************/
(function(window){'use strict';

  /* Open File
  ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇*/
  /*[ HELPER ]****************************************************************/
  function fixdata(data) 
  {
    var o = "", l = 0, w = 10240;
    for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
    o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
    return o;
  }

  /*[ MAIN ]****************************************************************/
  function xlsxHtmlInput(e, fn, clear)
  {
    var rABS = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined",
        files = e.target.files,
        clear = typeof fn === 'boolean' ? fn : typeof clear === 'boolean' ? clear : false;

    if(clear) Workbook.Files = {}

    for (var i = 0; i < files.length; i++) 
    {// multiple file 
      (function(f){//closure needed to assign correct file name 
        var reader = new FileReader();
        reader.onload = function(e) {
          var data = e.target.result, wb_f;
          if(rABS) 
          {
            wb_f = XLSX.read(data, {type: 'binary'});
          } 
          else 
          {//IE
            var arr = fixdata(data);
            wb_f = XLSX.read(btoa(arr), {type: 'base64'});
          }

          Workbook.Files[f.name] = wb_f;
          if(Object.keys(WB.Files).length == files.length && typeof fn === 'function') fn();//callback func perform only when all file are saved.
        };
        if(rABS) reader.readAsBinaryString(f);
        else reader.readAsArrayBuffer(f);
      })(files[i]);
    }
  }

  /* Get Sheet/Column Names
  ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇*/
  /*[ HELPER ]****************************************************************/
  function cellTypeConverter(sheet, opt)
  {//opt = {jsdate: ,number: }
    var jsdate, number, // opt keys
        range = XLSX.utils.decode_range(sheet['!ref']);

    if(typeof opt !== 'undefined')
    {
      for (var k in opt)
      {
        switch(k.toLowerCase())
        {
          case 'jsdate': jsdate = opt[k]; break;
          case 'number': number = opt[k]; break;
          default: break;
        }
      }
    }

    for(var R = range.s.r; R <= range.e.r; ++R) {
      for(var C = range.s.c; C <= range.e.c; ++C) {
        var cell = sheet[XLSX.utils.encode_cell({c:C, r:R})];

        if(cell && cell.t === 'n') // currently xlsx.js is not supporting JS Date. Any date will fall into type 'n'
        {
          if (typeof jsdate === 'boolean' && jsdate) cell.w = typeof g.toJsDate(cell.w) === 'undefined' ? cell.w : g.toJsDate(cell.w); // attemp to convert possible date
          if (typeof number === 'boolean' && number) cell.w = typeof g.toJsDate(cell.w) !== 'undefined' ? cell.w : parseFloat(cell.w) == cell.v ? parseFloat(cell.w) : cell.w;
        }
      }
    }
  }
  function getHeaderFromASheet(sheet) {
    if(typeof sheet['!ref'] !== 'undefined')
    {
      var headers = [],
          range = XLSX.utils.decode_range(sheet['!ref']),
          C, R = range.s.r; // start in the first row 

      for(C = range.s.c; C <= range.e.c; ++C) 
      {
        var cell = sheet[XLSX.utils.encode_cell({c:C, r:R})],
            hdr = "Column " + C; // empty column header
        if(cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        headers.push(hdr);
      }
      return headers;
    }
  }

  /*[ MAIN ]****************************************************************/
  function getSheet(o)
  {
    var names = Object.keys(WB.Files),
        wb_f, sheet_name, worksheet,
        type = '', // return format
        jsdate, // if true, convert date cell to JS Date when possible.
        number; // if true, convert all number cell to number

    if(names.length > 0){ // make sure wb store a spreatsheet file at least
      if(typeof o === 'undefined')
      {
        wb_f = WB.Files[names[0]];
        sheet_name = wb_f.SheetNames[0]; 
        type = 'sheet'; 
        jsdate = false;      
      }
      else
      {
        wb_f = typeof o.wb === 'undefined' ? WB.Files[names[0]] : typeof o.wb === 'string' ? WB.Files[o.wb] : o.wb;
        sheet_name = typeof o.sheet === 'undefined' ? wb_f.SheetNames[0] : isNaN(o.sheet) ? o.sheet : wb_f.SheetNames[o.sheet];
        type = typeof o.type === 'undefined' ? 'sheet' : o.type.toLowerCase();
        jsdate = typeof o.jsdate ===  'boolean' ? o.jsdate : false;
        number = typeof o.number === 'boolean' ? o.number : false; 
      }

      worksheet = wb_f.Sheets[sheet_name];
      if(jsdate || number) cellTypeConverter(worksheet, {jsdate: jsdate, number: number});
      
      switch(type){
        case 'json':
          return XLSX.utils.sheet_to_json(worksheet);
        case 'csv':
          return XLSX.utils.sheet_to_csv(worksheet);
        default:
          return worksheet;
      }
    }

    return false;
  }
  function getHeader(o) 
  {
    if(o instanceof Array)
    {// [{row},], array of json represent sheet, --> [colName1,]
      var colNames = [];
      for(i=0; i<o.length; i++)
      {
        for(var k in o[i])
        {
          if(colNames.indexOf(k) == -1) colNames.push(k);
        }
      }
      return colNames;
    }
    else if(typeof o === 'undefined')
    {// first file, first sheet  
      var retVal = {};

      for(var f in WB.Files){

        var wb_f = WB.Files[f], 
            sheets = wb_f.SheetNames;

        retVal[f] = {};
        for(var i=0; i<sheets.length; i++){
          retVal[f][sheets[i]] = getHeaderFromASheet(getSheet({wb: wb_f, sheet: sheets[i]}));
        }
      }

      return retVal;
    }
    else
    {// {wb: ,sheet:}
      var olocal = {};
      if(typeof o.wb !== 'undefined') olocal.wb = o.wb;
      if(typeof o.sheet !== 'undefined') olocal.sheet = o.sheet;

      return getHeaderFromASheet(getSheet(olocal));
    }
  }
  function styleTable(table, o)
  {
    // style table, row, col
    var hasOpt = typeof o !== 'undefined',
        tblClass = 'tbl tbl-striped',
        hasStyle = hasOpt && typeof o.style !== 'undefined',
        hasStyleTable = hasStyle && typeof o.style.table !== 'undefined',
        hasStyleRow = hasStyle && typeof o.style.row !== 'undefined',
        hasStyleCol = hasStyle && typeof o.style.col !== 'undefined', i;

    if(hasStyleTable && typeof o.style.table === 'string') tblClass = o.style.table;
    $(table).addClass(tblClass);

    if(hasStyleRow && o.style.row instanceof Array)
    {
      var row = o.style.row;
      for(i=0; i<row.length; i++)
      {
        var rowNum = Object.keys(row[i])[0],
            rowClass = row[i][rowNum];
        if(rowNum == 0) $('#'+table.id+' > thead > tr').addClass(rowClass);
        else if(rowNum === 'event') $('#'+table.id+' > tbody > tr:nth-child(even)').addClass(rowClass);
        else if(rowNum === 'odd') $('#'+table.id+' > tbody > tr:nth-child(odd)').addClass(rowClass);
        else $('#'+table.id+' > tbody > tr:nth-child('+rowNum+')').addClass(rowClass);
      }
    }

    if(hasStyleCol && o.style.col instanceof Array)
    {
      var col = o.style.col;
      for(i=0; i<col.length; i++)
      {
        var colNum = Object.keys(col[i])[0],
            colClass = col[i][colNum];
        if(colNum === 'event') $('#'+table.id+' > tbody > tr > td:nth-child(even)').addClass(colClass);
        else if(colNum === 'odd') $('#'+table.id+' > tbody > tr > td:nth-child(odd)').addClass(colClass);
        else $('#'+table.id+' > tbody > tr > td:nth-child('+colNum+')').addClass(colClass);          
      }
    }
  }

  /* Print to page
  ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇*/
  /*[ MAIN ]****************************************************************/
  function printJson(arrJson, o)
  {
    if(arrJson instanceof Array)
    {
      // setting option keys
      var target, footer;
      if(typeof o !== 'undefined')
      {
        for(var k in o)
        {
          switch(k.toLowerCase())
          {
            case 'target': 
              target = o[k]; 
              if(typeof target === 'string') target = document.getElementById(target);
              break;
            case 'footer':
              footer = o['footer'];
              if(typeof footer !== 'boolean') footer = false;
              break;
            default: break;
          }
        }
      }
      if(typeof target === 'undefined' || target === null) target = document.body;

      // prepare to create table
      var table = g.appendChild(target, 'table', {attr:{'id':g.makeRandStr(10)}}),
          thead = g.appendChild(table, 'thead'),
          headerRow = g.appendChild(thead, 'tr'),// append row header <tr> to table
          tbody = g.appendChild(table, 'tbody'),
          colNames = getHeader(arrJson), i, j, thcell, tr, cell, text;

      // append <th> to row header
      for(i=0; i<colNames.length; i++)
      {
        thcell = g.appendChild(headerRow, 'th', {text: colNames[i]});
      }

      // append row <tr> to table
      var len = footer ? arrJson.length - 1 : arrJson.length;
      for(i=0; i<len; i++)
      {
        tr = g.appendChild(tbody, 'tr');
        for(j=0; j<colNames.length; j++)
        {
          text = typeof arrJson[i][colNames[j]] === 'undefined' ? "" : arrJson[i][colNames[j]];
          cell = g.appendChild(tr, 'td', {text: text});
        }
      }
      // make last row as footer
      if(footer)
      {
        var lastR = arrJson[arrJson.length - 1];
        thead = g.appendChild(table, 'thead');
        headerRow = g.appendChild(thead, 'tr');
        for(j=0; j<colNames.length; j++)
        {
          var text = typeof lastR[colNames[j]] === 'undefined' ? "" : lastR[colNames[j]];
          thcell = g.appendChild(headerRow, 'th', {text:text});
        }
      }
    }

    styleTable(table, o);
    return typeof table !== 'undefined' ? table : false;
  }
  function printSheet(sheet, o)
  {
    var range = XLSX.utils.decode_range(sheet['!ref']),
        pEl = typeof o === 'undefined' ? document.body : typeof o.target === 'undefined' ? document.body : typeof o.target === 'string' ? document.getElementById(o.target) : o.target,
        table = g.appendChild(pEl, 'table', {attr:{'id':g.makeRandStr(10)}}),
        thead = g.appendChild(table, 'thead'),
        tbody = g.appendChild(table, 'tbody');

    for(var R = range.s.r; R <= range.e.r; ++R) 
    {
      var tr = R === 0 ? g.appendChild(thead, 'tr') : g.appendChild(tbody, 'tr');
      for(var C = range.s.c; C <= range.e.c; ++C) 
      {
        var cellTag = R === 0 ? 'th' : 'td', 
            cellText = "",
            cell = sheet[XLSX.utils.encode_cell({c:C, r:R})];
        if(cell && cell.t) cellText = XLSX.utils.format_cell(cell);
        g.appendChild(tr, cellTag, {text: cellText});
      }
    }

    styleTable(table, o);
    return typeof table !== 'undefined' ? table : false;
  }
  function printWb(wb, o)
  {
    var hasOpt = typeof o !== 'undefined',
        pEl = typeof o === 'undefined' ? document.body : typeof o.target === 'undefined' ? document.body : typeof o.target === 'string' ? document.getElementById(o.target) : o.target,
        wbDiv = g.appendChild(pEl, 'div', {attr:{'id':g.makeRandStr(10)}}),
        ul = document.createElement('ul'),
        sheets = wb.SheetNames;

    // add each sheet to wbDiv
    for(var i=0; i<sheets.length; i++){
      var sheet = wb.Sheets[sheets[i]],
          sheetDiv = g.appendChild(wbDiv, 'div', {attr:{'id':g.makeRandStr(10)}});

      // add tab to ul
      var li = g.appendChild(ul, 'li');
      g.appendChild(li, 'a', {text: sheets[i], attr: {'href':'#'+sheetDiv.id}});

      // add content container
      var tblOpt = {};
      if(hasOpt)
      {
        o.target = sheetDiv.id;
        tblOpt = o;
      }
      else 
      {
        tblOpt.target = sheetDiv.id;
      }
      printSheet(sheet, tblOpt);
    }

    // sheet setting 
    var hasOptPos = hasOpt && typeof o.position !== 'undefined',
        hasOptSort = hasOpt && typeof o.sortable !== 'undefined',
        pos = 'top', style = 'wb-sm', sortable = false;

    if(hasOptPos && typeof o.position === 'string' && 'topbottom'.indexOf(o.position.toLowerCase()) > -1) pos = o.position;
    if(hasOptSort && typeof o.sortable === 'boolean' && o.sortable) sortable = o.sortable;
    if(hasOpt && typeof o.style !== 'undefined' && typeof o.style.sheet !== 'undefined' && typeof o.style.sheet === 'string') style = o.style.sheet;

    pos === 'bottom' ? wbDiv.appendChild(ul) : wbDiv.insertBefore(ul, wbDiv.firstChild);

    // jQuery tabs transform and make sortable if needed
    var tabs = $(wbDiv).tabs().addClass(style);
    if(sortable)
    {
      tabs.find( ".ui-tabs-nav" ).sortable({
        axis: "x",
        stop: function() {
          tabs.tabs( "refresh" );
        }
      });    
    }
  }
  function print(o)
  {
    var o = arguments[0],
        pEl = typeof o === 'undefined' ? document.body : typeof o.target === 'undefined' ? document.body : typeof o.target === 'string' ? document.getElementById(o.target) : o.target,
        dir = g.appendChild(pEl, 'div', {attr:{'id':g.makeRandStr(10)}}),
        ul = g.appendChild(dir, 'ul');

    for(var f in WB.Files){
      var wb = WB.Files[f],
          wbDiv = g.appendChild(dir, 'div', {attr:{'id':g.makeRandStr(10)}});

      var li = g.appendChild(ul, 'li');
      g.appendChild(li, 'a', {text: f, attr: {'href':'#'+wbDiv.id}});

      var wbArg = {};
      if(typeof o !== 'undefined')
      {
        o.target = wbDiv.id;
        wbArg = o;
      }
      else 
      {
        wbArg.target = wbDiv.id;
      }
      if(typeof wbArg.style !== 'undefined') wbArg.style.sheet = 'wb-inner-sm';
      else wbArg.style = {sheet: 'wb-inner-sm'};
      wbArg.position = 'bottom';
      printWb(wb, wbArg);
    }
    $( dir ).tabs().addClass( "wb-sm wb-outer" );

    // set hight of inner sheet 
    g.cssAdd('.wb-inner-sm > .ui-tabs-panel {height:' + (window.innerHeight - $(ul).height() - 40) + 'px;}')
  }

  /* SQL Methods
  ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇*/
  /*[ HELPER ]****************************************************************/
  function selectColumn(select_, from_){
    var retVal = [];

    if(typeof select_ === 'string' && select_ !== '*') select_ = [select_];

    for(var i=0; i<from_.length; i++)
    {
      var r = {}, has = false;

      if(select_ === '*') r = from_[i];
      else 
        for(var j=0; j<select_.length; j++) if(typeof from_[i][select_[j]] !== 'undefined') r[select_[j]] = from_[i][select_[j]];

      if(!has) retVal.push(r);
    }
    return retVal;
  }
  function compare(arrJson, operator, operand, yesDelete)
  {
    var retVal = [], deleteIdx = [];
    if(arrJson instanceof Array 
      && typeof operator === 'string' 
      && operand instanceof Array && operand.length % 2 == 0
      && typeof yesDelete === 'boolean')
    {
      for(var i=0; i<arrJson.length; i++)
      {
        var satifiedRow = true;
        for(var j=0; j<operand.length; j += 2)
        {
          var colName = operand[j],
              value = operand[j+1],
              cnp = getFnArg(colName), // [fn, colName] or 'colName'
              v = cnp instanceof Array ? executeBuiltInFn(cnp[0], arrJson[i][cnp[1]]) : arrJson[i][cnp];
          satifiedRow = satifiedRow && typeof v !== 'undefined' && g.compareValue(v, operator, value);
          if(!satifiedRow) break;    
        }
        if(satifiedRow) yesDelete ? deleteIdx.push(i) : retVal.push(arrJson[i]); 
      }
      if(yesDelete) retVal = g.spliceM(arrJson, deleteIdx)
    }
    return retVal;
  }
  function inNotIn(arrJson, operator, operand, yesDelete)
  {
    var retVal = [], deleteIdx = [];

    if(arrJson instanceof Array 
      && (operator.toLowerCase() === 'in' || operator.toLowerCase() === 'not in')  
      && operand instanceof Array && operand.length % 2 == 0
      && typeof yesDelete === 'boolean')
    {
      for(var i=0; i<arrJson.length; i++)
      {
        var satifiedRow = true;
        for(var j=0; j<operand.length; j += 2)
        {
          var colName = operand[j], list = operand[j+1] instanceof Array ? operand[j+1] : [operand[j+1]];
          if(typeof arrJson[i][colName] !== 'undefined')
          {
            if(operator === 'in') satifiedRow = satifiedRow && (list.indexOf(arrJson[i][colName]) > -1); 
            else satifiedRow = satifiedRow && (list.indexOf(arrJson[i][colName]) == -1);  
          }
          else satifiedRow = false;
          if(!satifiedRow) break;  
        }
        if(satifiedRow) yesDelete ? deleteIdx.push(i) : retVal.push(arrJson[i]);
      }
      if(yesDelete) retVal = g.spliceM(arrJson, deleteIdx)
    }
    return retVal;
  }
  function between(arrJson, start, end, fields, selectOrDelete)
  {    
    var a = arrJson,
        start = typeof g.toJsDate(start) !== 'undefined' ? g.toJsDate(start) : typeof start === 'number' ? start : null,
        end = typeof g.toJsDate(end) !== 'undefined' ? g.toJsDate(end) : typeof end === 'number' ? end : null,
        retVal = [], deleteIdx = [], dateCompare = start instanceof Date;

    if( a instanceof Array && start !== null && end !== null 
        && (typeof fields === 'string' || fields instanceof Array) 
        && ( typeof start === 'number' || start instanceof Date) 
        && ( typeof end === 'number' || end instanceof Date)) 
    {
      fields = typeof fields === 'string' ? [fields] : fields; 
      for(var i=0; i<a.length; i++)
      { 
        var satifiedRow = true;
        for(var j=0; j<fields.length; j++)
        {
          var v = a[i][fields[j]];
          if(dateCompare) satifiedRow = typeof v !== 'undefined' && typeof g.toJsDate(v) !== 'undefined' ? (start <= v) && (v <= end) : false;
          else satifiedRow = typeof v === 'number' ? (start <= v) && (v <= end) : false;
          if(!satifiedRow) break;
        }

        if(satifiedRow)
        {
          selectOrDelete ? retVal.push(a[i]) : deleteIdx.push(i);
        } 
      }
      if(!selectOrDelete) retVal = g.spliceM(arrJson, deleteIdx)
    }
    return retVal;
  }
  function year(jsdate) {
    var y = jsdate instanceof Date ? jsdate : new Date(jsdate);
    return y.getFullYear();
  }
  function month(jsdate) {
    var y = jsdate instanceof Date ? jsdate : new Date(jsdate);
    return y.getMonth() + 1;
  }
  function getFnArg(str) {
    var openParen = str.indexOf('('),
        closeParen = str.indexOf(')');
    if(openParen !== -1 && closeParen !== -1)
    {
      var fn, colName;
      colName = str.slice(openParen + 1, closeParen);
      fn = str.slice(0, openParen);
      return [fn, colName]
    }
    else return str; 
  }
  function executeBuiltInFn(fn, v) 
  {
    if(typeof fn === 'string')
    {
      switch(fn.toLowerCase())
      {
        case 'year': return year(v);
        case 'month': return month(v);
        default: break;
      }
    }
  }

  function countItemArray(arr, delimiterStr, options)
  {
    var count = {};
    if(arr instanceof Array)
    {
      // setting up options
      var delimiter, empty = false, null_ = false, undefined_ =  false;
      
      if(typeof options === 'undefined' && typeof delimiterStr !== 'undefined' && typeof delimiterStr === 'object') options = delimiterStr;
      else if(typeof delimiterStr !== 'undefined' && typeof delimiterStr === 'string') delimiter = delimiterStr

      if(typeof options !== 'undefined')
      {
        for(var k in options)
        {
          switch(k.toLowerCase())
          {
            case 'delimiter': if(typeof options[k] === 'string') delimiter = options[k]; break;
            case 'empty': if(typeof options[k] === 'boolean') empty = options[k]; break;
            case 'null': if(typeof options[k] === 'boolean') null_ = options[k]; break;
            case 'undefined': if(typeof options[k] === 'boolean') undefined_ = options[k]; break;
            default: break;
          }
        }
      }

      if(typeof delimiter !== 'undefined' && typeof delimiter === 'string')
      {
        var temp = [];
        for(var i=0; i<arr.length; i++) 
        {
          if(typeof arr[i] !== 'undefined' && arr[i] !== '' && arr[i] !== null)
          {
            var items = arr[i].replace(g.getRegExpGlb(delimiter), ';').split(';');
            for(var j=0; j<items.length; j++)
            {
              var item = items[j].trim() 
              if(item !== '') temp.push(item);
            } 
          }
          else if(empty && arr[i] === '') temp.push('empty string');
          else if(null_ && arr[i] === null) temp.push('null');
          else if(undefined_ && typeof arr[i] === 'undefined') temp.push('undefined'); 
        }
        arr = temp;
      }

      // start counting
      for(var i=0; i<arr.length; i++) count[arr[i]] = typeof count[arr[i]] === 'undefined' ? 1 : count[arr[i]] + 1; 
    }
    return count;
  }
  function countDate (arr, by, utc)
  { 
    var list = {};
    if(arr instanceof Array){
      by = by.toLowerCase();
      if (by === 'my') by = 'ym';
      if (by === 'dmy') by = 'ymd';
      switch(by){
        case 'y': // count by year
          for(var i=0; i<arr.length; i++){
            var d = new Date(arr[i]),
                yy = d.getFullYear();

            list[yy] = typeof list[yy] === 'undefined' ? 1 : list[yy] + 1; 
          }
          break;
        case 'm': // count by month : jan - dec
          for(var i=0; i<arr.length; i++){
            var d = new Date(arr[i]),
                mm = d.getMonth();

            list[g.month(mm)] = typeof list[g.month(mm)] === 'undefined' ? 1 : list[g.month(mm)] + 1; 
          }
          break;
        case 'd': // count by day : 1 to 31
          for(var i=0; i<arr.length; i++){
            var d = new Date(arr[i]),
                dd = d.getDate();
            list[dd] = typeof list[dd] === 'undefined' ? 1 : list[dd] + 1; 
          }
          break;
        case 'day': // count by day name : Monday to Sunday
          for(var i=0; i<arr.length; i++){
            var d = new Date(arr[i]),
                dd = d.getDay();

            list[g.day(dd)] = typeof list[g.day(dd)] === 'undefined' ? 1 : list[g.day(dd)] + 1; 
          }
          break;
        case 'ym': // count by year
          for(var i=0; i<arr.length; i++){
            var d = new Date(arr[i]),
                yy = d.getFullYear(),
                mm = d.getMonth(),
                key = typeof utc === 'boolean' && utc ? Date.UTC(yy, mm) : yy + '-' + g.month(mm);

            list[key] = typeof list[key] === 'undefined' ? 1 : list[key] + 1; 
          }
          break;
        case 'ymd': // count by year
          for(var i=0; i<arr.length; i++){
            var d = new Date(arr[i]),
                yy = d.getFullYear(),
                mm = d.getMonth(),
                dd = d.getDate(),
                key = typeof utc === 'boolean' && utc ? Date.UTC(yy, mm, dd) : yy + ',' + (mm + 1) + ',' + dd;

            list[key] = typeof list[key] === 'undefined' ? 1 : list[key] + 1; 
          }
          break;
        default:
          break;
      }
    }

    return list;
  }
  function obj2aOfa(o)
  {// {k:v,} -> [[k,v],]
    var list = [];
    for(var k in o) list.push([k, o[k]]);
    return list;
  }
  function obj2aOfo(o, kName, vName)
  {// {k:v,} -> [{kName:k, vName: },]
    var list = [];
    kName = typeof kName === 'undefined' ? 'Column Key' : kName;
    vName = typeof vName === 'undefined' ? 'Column Value' : vName;

    for(var k in o)
    {
      var item = {}; // IE need this line
      item[kName] = k;
      item[vName] = o[k];
      list.push(item);        
    }  

    return list;
  }
  /*[ MAIN ]****************************************************************/
  function select(select_, from_, where_)
  {
    var retVal = []; // result array

    if(from_ instanceof Array && (select_ instanceof Array || typeof select_ === 'string'))
    {
      var a = from_; // shallow copy of the origional array for all operations.
      // setting up where_ keys
      var in_, notIn, between_, unique, orderBy, compountStmt = [], limit;
      if(typeof where_ !== 'undefined')
      {
        for(var k in where_)
        {
          switch(k.toLowerCase())
          {
            case 'top':
            case 'limit':
            case 'rownum': limit = where_[k]; break;
            case '=':
            case '<>':
            case '!=': 
            case '>': 
            case '>=':
            case '<':
            case '<=': compountStmt.push(k); compountStmt.push(where_[k]); break;
            case 'in': in_ = where_[k]; break;
            case 'not in': notIn = where_[k]; break;
            case 'between': between_ = where_[k]; break;
            case 'unique': unique = where_[k]; break;
            case 'order by': orderBy = where_[k]; break;
            default: break;
          }
        }
      }

      // select required columns to execute statemnts. if select_ === '*', skip this
      // this step is important to be done for performance
      var columnNames = [], cn;
      if(typeof where_!== 'undefined' && typeof select_ === 'string' && select_ !== '*') columnNames.push(select_);
      else if(typeof where_!== 'undefined' && select_ instanceof Array) for(var i=0; i<select_.length; i++) columnNames.push(select_[i]);

      if(columnNames.length > 0)
      {
        // column names to execute IN statement 
        if(in_ instanceof Array){
          for(var i=0; i<in_.length; i += 2) if(columnNames.indexOf(in_[i]) == -1) columnNames.push(in_[i]);
        }
        // column names to execute NOT IN statement 
        if(notIn instanceof Array){
          for(var i=0; i<notIn.length; i += 2) if(columnNames.indexOf(notIn[i]) == -1) columnNames.push(notIn[i]);
        }
        // column names to execute BETWEEN statement
        if(between_ instanceof Array && !(between_[0] instanceof Array)) 
        {       
          if(typeof between_[2] === 'string' && columnNames.indexOf(between_[2]) == -1) columnNames.push(between_[2]);
          else if(between_[2] instanceof Array)
          {
            for(var i=0; i<between_[2].length; i++)
            {
              name = between_[2][i];
              if(columnNames.indexOf(name) == -1) columnNames.push(name);
            }
          }
        } 
        else if(between_ instanceof Array && between_[0] instanceof Array)
        {
          for(var i=0; i<between_.length; i++)
          {
            if(typeof between_[i][2] === 'string' && columnNames.indexOf(between_[i][2]) == -1) columnNames.push(between_[i][2]);
            else if(between_[i][2] instanceof Array)
            {
              for(var j=0; j<between_[i][2].length; j++)
              {
                name = between_[i][2][j];
                if(columnNames.indexOf(name) == -1) columnNames.push(name);
              }
            }
          }
        }
        // column name to execute COMPOUND statement
        if(compountStmt.length > 0)
        {
          for(var i=0; i<compountStmt.length; i += 2)
          {
            var operand = compountStmt[i+1];
            for(var j=0; j<operand.length; j += 2)
              if(columnNames.indexOf(operand[j]) == -1) columnNames.push(operand[j]);
          }
        }

        // column name to execute ORDER BY stetemnt
        if(orderBy instanceof Array && columnNames.indexOf(orderBy[0]) == -1) columnNames.push(orderBy[0])
        else if(typeof orderBy === 'string' && columnNames.indexOf(orderBy) == -1) columnNames.push(orderBy) 

        a = selectColumn(columnNames, a);
      }

      // filter by IN statement 
      if(in_ instanceof Array && in_.length % 2 == 0) a = inNotIn(a, 'in', in_, false)

      // filter by NOT IN statment
      if(notIn instanceof Array && notIn.length % 2 == 0) a = inNotIn(a, 'not in', notIn, false)

      // filter by BETWEEN 
      if(between_ instanceof Array && between_[0] instanceof Array) 
      {
        for(var i=0; i<between_.length; i++) 
        {
          if(between_[i].length == 3) a = between(a, between_[i][0], between_[i][1], between_[i][2], true);
        }
      }
      else if(between_ instanceof Array && between_.length == 3 && !(between_[0] instanceof Array)) a = between(a, between_[0], between_[1], between_[2], true);

      // filter by COMPOUND statement using comparitive operator
      if(compountStmt.length > 0)
      {
        for(var i=0; i<compountStmt.length; i += 2) a = compare(a, compountStmt[i], compountStmt[i+1], false);
      }

      // select columns base on user desire
      a = selectColumn(select_, a);

      // filter by uniueness
      unique = typeof unique === 'boolean' ? unique : false;
      if(unique)
      {
        for(var i=0; i<a.length; i++) if(g.indexOf(retVal, a[i]) === -1) retVal.push(a[i]);  
      } 
      else retVal = a;

      // ORDER BY statement
      if(orderBy instanceof Array || typeof orderBy === 'string')
      {
        var order = orderBy instanceof Array ? orderBy[1] : 'up', 
            col = orderBy instanceof Array ? orderBy[0] : orderBy;
        g.sort(retVal, order, 'json', col);
      }
    }

    // SELECT TOP, LIMIT, ROWNUM: limit numbers of record to return
    if(typeof limit === 'number')
    {
      retVal = retVal.slice(0, limit);
    }

    return retVal;
  }
  function delete_(from_, where_)
  {
    var retVal = [];
    if(from_ instanceof Array && typeof where_ === 'undefined')
    {
      while(from_.length > 0) from_.splice(0,1);
    }
    else if(from_ instanceof Array)
    {
      // setting up where_ keys
      var in_, notIn, between_, compountStmt = [], orderBy;
      if(typeof where_ !== 'undefined')
      {
        for(var k in where_)
        {
          switch(k.toLowerCase())
          {
            case '=':
            case '<>':
            case '!=': 
            case '>': 
            case '>=':
            case '<':
            case '<=': compountStmt.push(k); compountStmt.push(where_[k]); break;
            case 'in': in_ = where_[k]; break;
            case 'not in': notIn = where_[k]; break;
            case 'between': between_ = where_[k]; break;
            case 'order by': orderBy = where_[k]; break;
            default: break;
          }
        }
      }

      // delete by BETWEEN 
      if(between_ instanceof Array && between_[0] instanceof Array) 
      {
        for(var i=0; i<between_.length; i++) 
        {
          if(between_[i].length == 3) retVal = between(from_, between_[i][0], between_[i][1], between_[i][2], false);
        }
      }
      else if(between_ instanceof Array && between_.length == 3 && !(between_[0] instanceof Array)) retVal = between(from_, between_[0], between_[1], between_[2], false);

      // delete by IN statement 
      if(in_ instanceof Array && in_.length % 2 == 0) retVal = retVal.concat(inNotIn(from_, 'in', in_, true));

      // delete by NOT IN statment
      if(notIn instanceof Array && notIn.length % 2 == 0) retVal = retVal.concat(inNotIn(from_, 'not in', notIn, true));

      // delete by COMPOUND statement using comparitive operator
      if(compountStmt.length > 0)
      {
        for(var i=0; i<compountStmt.length; i += 2) retVal = retVal.concat(compare(from_, compountStmt[i], compountStmt[i+1], true));
      }

      // ORDER BY statement
      if(orderBy instanceof Array || typeof orderBy === 'string')
      {
        var order = orderBy instanceof Array ? orderBy[1] : 'up', 
            col = orderBy instanceof Array ? orderBy[0] : orderBy;
        g.sort(from_, order, 'json', col);
      }
      return retVal;
    }
  }
  function column(colName, from_, where_)
  {
    // if user want to order by a column name in the order of string length
    var orderByLength, top;
    if(typeof where_ !== 'undefined' 
      && typeof where_['order by'] !== 'undefined' 
      && ((typeof where_['order by'] === 'string' && where_['order by'] === 'length')
          || (where_['order by'] instanceof Array && where_['order by'].length == 2 
              && where_['order by'][0] == 'length')))
    {
      orderByLength = where_['order by'] instanceof Array && where_['order by'].length == 2 ? where_['order by'][1] : 'up';
      delete where_['order by'];
      var topStr;
      if(typeof where_['top'] !== 'undefined') topStr = 'top';
      else if(typeof where_['limit'] !== 'undefined') topStr = 'limit';
      else if(typeof where_['rownum'] !== 'undefined') topStr = 'rownum';
      top = where_[topStr];
      delete where_[topStr];
    }

    var retVal = [], colRs = select(colName, from_, where_),
        delimiter, unique = false;

    if(typeof where_ !== 'undefined')
    {
      for(var k in where_)
      {
        switch(k.toLowerCase())
        {
          case 'delimiter': delimiter = where_[k]; break;
          case 'unique': if(typeof where_[k] === 'boolean') unique = where_[k]; break;
          default: break;
        }
      }
    }
     
    for(var i=0; i<colRs.length; i++) 
    {
      var k = Object.keys(colRs[i])[0];
      if(typeof colRs[i][k] !== 'undefined')
      {
        if(typeof delimiter !== 'undefined' && typeof k !== 'undefined')
        {
          var items = colRs[i][k].replace(g.getRegExpGlb(delimiter), ';').split(';');
          for(var j=0; j<items.length; j++)
          {
            var item = items[j].trim() 
            if(unique && item !== '') 
            { 
              if(retVal.indexOf(item) === -1) retVal.push(item);
            }
            else if(item !== '') retVal.push(item);
          }   
        }
        else retVal.push(colRs[i][k]);
      }
    }

    // order by string length
    if(typeof orderByLength !== 'undefined' && retVal instanceof Array) 
    {
      g.sort (retVal, orderByLength, 'string', 'length');
      if(typeof top === 'number') retVal = retVal.slice(0,top);
    }
    return retVal.length == 1 ? retVal[0] : retVal;
  }
  function count()
  {
    var retVal, arr, countOpt = {}, 
        ciaDelimStr, ciaOpt = {}, cia = false, // cia = count item in array 
        cdaCountFormat, utc = false, cda = false; // cda = count date in array

    if(arguments[0] instanceof Array && typeof arguments[1] === 'string' && 'ymddayymmyymddmy'.indexOf(arguments[1].toLowerCase()) > -1)
    {//cda | (array, format, options)
      arr = arguments[0];
      cdaCountFormat = arguments[1];
      if(typeof arguments[2] === 'object')
      {
        countOpt = arguments[2];
        if(typeof countOpt['utc'] === 'boolean') utc = countOpt['utc'];
      } 
      cda = true;
    }
    else if( arguments[0] instanceof Array 
        || (arguments[0] instanceof Array && typeof arguments[1] === 'string' && 'ymddayymmyymddmy'.indexOf(arguments[1].toLowerCase()) === -1) 
        || (arguments[0] instanceof Array && typeof arguments[1] === 'object' && !(arguments[1] instanceof Array)) 
        || (arguments[0] instanceof Array && typeof arguments[1] === 'string' && typeof arguments[2] === 'object')) 
    {// cia | (array) (array, delimiter), (array, options), (array, string, object)
      arr = arguments[0];
      if(typeof arguments[1] === 'object') ciaOpt = arguments[1];
      else if(typeof arguments[1] === 'string' && typeof arguments[2] === 'object') ciaOpt = arguments[2];
      if(typeof arguments[1] === 'string') ciaOpt['delimiter'] = arguments[1];
      cia = true;
    }
    else if(typeof arguments[0] === 'string' && arguments[1] instanceof Array && arguments.length == 2)
    {// (colName, arrJson)
      cia = true;
      arr = column(arguments[0], arguments[1]);
    }
    else if(typeof arguments[0] === 'string' && arguments[1] instanceof Array && typeof arguments[2] === 'object' && !(arguments[2] instanceof Array))
    {// (colname, arrJson, options)
      countOpt = arguments[2];
      if(typeof countOpt['by date'] === 'undefined')
      {// cia in arrJson
        cia = true;
        arr = column(arguments[0], arguments[1], countOpt);
        ciaOpt = countOpt;
      }
      else if(typeof countOpt['by date'] === 'string' && 'ymddayymmyymddmy'.indexOf(countOpt['by date'].toLowerCase()) > -1)
      {// cid in arrJson
        cda = true;
        arr = column(arguments[0], arguments[1], countOpt);
        cdaCountFormat = countOpt['by date'];
        utc = countOpt['utc'];
      }
      else if(countOpt['by date'] instanceof Array)
      {//count(colName, arr, {'by date': ['date col', 'format', utc, hts]}) -> {item1:{{date:num},},}
        var countCol = arguments[0],
            byDateCol = countOpt['by date'][0], 
            format = countOpt['by date'][1], 
            utc = typeof countOpt['by date'][2] === 'undefined' ? false : countOpt['by date'][2], 
            hts = typeof countOpt['by date'][3] === 'undefined' ? false : countOpt['by date'][3], 
            rs = select([countCol, byDateCol], arguments[1], countOpt), //rs = [{countCol: , byDateCol:}]
            countRs = {}; //{item: [dates,]}

        g.sort(rs, 'up', 'json', byDateCol);

        // getting all item in countRs = {item: [date1,]}
        if(typeof countOpt['delimiter'] === 'string' && countOpt['delimiter'] !== '')
        {// rs = [{countCol: , byDateCol:}] with tokenize
          var temp = [];
          for(var i=0; i<rs.length; i++) 
          {
            if(typeof rs[i] !== 'undefined' && typeof rs[i][countCol] !== 'undefined' && typeof rs[i][byDateCol] !== 'undefined')
            {
              var items = rs[i][countCol].replace(g.getRegExpGlb(countOpt['delimiter']), ';').split(';');
              for(var j=0; j<items.length; j++)
              {
                var item = items[j].trim(), date = rs[i][byDateCol];
                if(typeof countRs[item] === 'undefined') countRs[item] = [date];
                else countRs[item].push(date);
              } 
            }
          }
        }
        else 
        {// no tokenize
          for(var i=0; i<rs.length; i++) 
          {
            var item = rs[i][countCol], date = rs[i][byDateCol];
            if(typeof rs[i] !== 'undefined' && typeof item !== 'undefined' && typeof date !== 'undefined')
            {
              item.trim();
              if(typeof countRs[item] === 'undefined') countRs[item] = [date];
              else countRs[item].push(date);  
            }
          }
        }

        // counting dates 
        for(var k in countRs) countRs[k] = countDate (countRs[k], format, utc);

        // format countRs to match highcharts time series
        if(hts)
        {
          for(var k in countRs) countRs[k] = obj2aOfa(countRs[k]);
          if(utc)
          {
            for(var k in countRs) 
            {
              var itemCount = countRs[k];
              for(var i=0; i<itemCount.length; i++)
              {
                countRs[k][i][0] = parseInt(itemCount[i][0]) 
              }
            }  
          }
          countRs = obj2aOfo(countRs, "name", "data");
          g.sort(countRs, 'up', 'json', "name");
        }

        return countRs;
      }
    }

    if(cia) retVal = countItemArray(arr, ciaOpt);
    else if(cda) retVal = countDate(arr, cdaCountFormat, utc);

    if(typeof countOpt['total'] === 'boolean' && countOpt['total'])
    {
      var total = 0;
      for(var k in retVal) total += retVal[k];
      retVal['total'] = total; 
    }

    return retVal;
  }
  
  function makePctColumn(colNames, from_, pctColName)
  {// from_[colName]*100/sum(colName,from_)
    colNames = colNames instanceof Array ? colNames : [colNames];
    pctColName = pctColName instanceof Array ? pctColName : [pctColName];  
    var pctColNameList = [];
    for(var c=0; c<colNames.length; c++)
    {
      var colName = colNames[c],
          pctCol = typeof pctColName[c] === 'string' ? pctColName[c] : colNames.length == 1 ? '%' : pctColNameList.indexOf(colName + ' in %') == -1 ? colName + ' in %' : (colName + ' in % ' + c),
          total = sum(colName, from_);
      pctColNameList.push(pctCol);
      for(var i=0; i<from_.length; i++) 
      {
        if(typeof from_[i][colName] === 'number')
          from_[i][pctCol] = Math.round(((from_[i][colName] * 100) / total) * 100) / 100 + "%";
      }
    }
  }
  function makeSumRow(colNames, from_, sumRowName, sumRowNameCol)
  {//([rowNeededSum,], arrJson, 'total', putTotalUnderThisCol)
    var headers = getHeader(from_);
    if((typeof colNames === 'string' || colNames instanceof Array) && from_ instanceof Array)
    {
      var sumRow = {};
      if(typeof colNames === 'string') colNames = [colNames];
      for(var i=0; i<colNames.length; i++)
      {
        if(headers.indexOf(colNames[i]) > -1) sumRow[colNames[i]] = sum(colNames[i], from_);
      }
      if(typeof sumRowName !== 'undefined' && typeof sumRowNameCol !== 'undefined') sumRow[sumRowNameCol] = sumRowName;
      from_.push(sumRow);
    }
  }
  function avg(colName, from_, where_)
  {
    var list, total=0, count=0;

    if(arguments.length == 1 && arguments[0] instanceof Array) list = arguments[0];
    else
    {
      list = column(colName, from_, where_);
      if(typeof list === 'number') list = [list];
    } 

    for(var i=0; i<list.length; i++)
    {
      if(typeof list[i] === 'number')
      {
        total += list[i];
        count++;  
      }
    }

    return Math.round((total / count) * 100) / 100;
  }
  function sum(colName, from_, where_)
  {
    var list, total=0, pct = true;

    if(arguments.length == 1 && arguments[0] instanceof Array) list = arguments[0];
    else list = column(colName, from_, where_);

    for(var i=0; i<list.length; i++)
    {
      if(typeof list[i] === 'string' && typeof parseInt(list[i].replace('%','')) === 'number') list[i] = parseFloat(list[i].replace('%',''));
      else pct = false;
      if(typeof list[i] === 'number') total += list[i];
    }
    return pct ? (Math.round(total * 100) / 100).toString() + '%' : (Math.round(total * 100) / 100);
  }
  function getDateRange(colName, from_)
  {
    var sDate = column(colName, from_, {'order by': colName, 'limit': 1}),
        eDate = column(colName, from_, {'order by': [colName,'down'], 'limit': 1});
    return [sDate, eDate];
  }
  function format(o, opt)
  {
    var names, format;
    
    if(o instanceof Array && typeof opt === 'object')
    {// [{kName: k, vName: v},], fn(arrJson, {old:new,})
      var olds = Object.keys(opt);
      for(var i=0; i<o.length; i++)
      {
        for(var k in o[i])
        {
          if(olds.indexOf(k) > -1)
          {
            o[i][opt[k]] = o[i][k];
            delete o[i][k];
          }
        }
      }
    }
    else if(typeof o === 'object' && typeof opt === 'object')
    { //fn({k:v,}, {name: ['name', 'y'], format: 'aoj'})

      // setting up option keys
      for(var k in opt)
      {
        switch(k.toLowerCase())
        {
          case 'name': names = opt[k]; break;
          case 'format': format = opt[k].toLowerCase(); break;
          default: break;
        }
      }

      if (format === 'aoj')
      {
        var nameK = 'Column A', nameV = 'Column B', list = [];
        if (names instanceof Array && names.length >= 1) nameK = names[0];
        if (names instanceof Array && names.length >= 2) nameV = names[1];

        for(var k in o)
        {
          var item = {}; // IE need this line
          item[nameK] = k;
          item[nameV] = o[k];
          list.push(item);        
        }  

        return list;
      }
      else if (format === 'aoa')
      {
        var list = [];
        for(var k in o) list.push([k, o[k]]);
        return list;
      }
    }
    else if (typeof g.toJsDate(o) !== 'undefined' && typeof opt === 'string')
    { // dateStr, format
      var d = new Date(o),
          yyyy = d.getFullYear(),
          mm = d.getMonth(),
          dd = d.getDate(),
          day = d.getDay();

      opt = opt.replace('dddd', g.day(day, {abbr: false}))
               .replace('ddd', g.day(day))
               .replace('dd', dd)
               .replace('mmmm', g.month(mm, {abbr: false}))
               .replace('mmm', g.month(mm))
               .replace('yyyy', yyyy)
               .replace('yy', yyyy.toString().substring(2))
               .replace('mm', mm + 1);

      return opt;
    }
  }

  function define()
  {
    var Workbook = {};
   
    Workbook.Files = {};

    Workbook.htmlInput = function(){ return xlsxHtmlInput.apply(this, arguments); }
    Workbook.getSheet = function(){ return getSheet.apply(this, arguments); }
    Workbook.getHeader = function(){ return getHeader.apply(this, arguments); }

    Workbook.printJson = function(){ return printJson.apply(this, arguments); }
    Workbook.print = function(){ return print.apply(this, arguments); }
    Workbook.printWb = function(){ return printWb.apply(this, arguments); }
    Workbook.printSheet = function(){ return printSheet.apply(this, arguments); }

    Workbook.select = function(){ return select.apply(this, arguments); }
    Workbook.delete = function(){ return delete_.apply(this, arguments); }
    Workbook.column = function(){ return column.apply(this, arguments); }
    Workbook.count = function(){ return count.apply(this, arguments); }
    Workbook.sum = function(){ return sum.apply(this, arguments); }
    Workbook.avg = function(){ return avg.apply(this, arguments); }
    Workbook.makePctColumn = function(){ return makePctColumn.apply(this, arguments); }
    Workbook.makeSumRow = function(){ return makeSumRow.apply(this, arguments); }
    Workbook.getDateRange = function(){ return getDateRange.apply(this, arguments); }
    Workbook.obj2aOfo = function(){ return obj2aOfo.apply(this, arguments); }

    Workbook.addTotalRow = function(){ return addTotalRow.apply(this, arguments); }
    Workbook.addPercentageColumn = function(){ return addPercentageColumn.apply(this, arguments); }
    Workbook.format = function(){ return format.apply(this, arguments); }
    
    return Workbook;
  }

  typeof Workbook === 'undefined' ? window.Workbook = window.WB = define() : console.log("Workbook is already defined.");

})(window);







