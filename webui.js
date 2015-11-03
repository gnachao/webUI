/*
  
*/
(function(window){'use strict';

  function define(){
    var gjs = function(o){

      function isElement(selector){
        return (typeof HTMLElement !== "undefined" ? selector instanceof HTMLElement : selector && typeof selector === "object" && selector !== null && selector.nodeType === 1 && typeof selector.nodeName==="string");
      }

      function isNode(selector){
        return (typeof Node !== "undefined" ? selector instanceof Node : selector && typeof selector === "object" && typeof selector.nodeType === "number" && typeof selector.nodeName==="string");
      }

      function selectorPath(el){
        var path = '', pEl = el;
        while(pEl !== document.body){
          pEl = pEl.parentNode;
          path = pEl.nodeName + ' > ' + path;
        }
        return path;
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

      // Convert Color Name <--> Hex. If faile, return -1.
      function color(color){
        if(!!color && typeof color === 'string'){
          var colors = {'AliceBlue':'#F0F8FF','AntiqueWhite':'#FAEBD7','Aqua':'#00FFFF','Aquamarine':'#7FFFD4', 'Azure':'#F0FFFF','Beige':'#F5F5DC','Bisque':'#FFE4C4','Black':'#000000','BlanchedAlmond':'#FFEBCD','Blue':'#0000FF','BlueViolet':'#8A2BE2','Brown':'#A52A2A','BurlyWood':'#DEB887','CadetBlue':'#5F9EA0','Chartreuse':'#7FFF00','Chocolate':'#D2691E','Coral':'#FF7F50','CornflowerBlue':'#6495ED','Cornsilk':'#FFF8DC','Crimson':'#DC143C','Cyan':'#00FFFF','DarkBlue':'#00008B','DarkCyan':'#008B8B','DarkGoldenRod':'#B8860B','DarkGray':'#A9A9A9','DarkGreen':'#006400','DarkKhaki':'#BDB76B','DarkMagenta':'#8B008B','DarkOliveGreen':'#556B2F','DarkOrange':'#FF8C00','DarkOrchid':'#9932CC','DarkRed':'#8B0000','DarkSalmon':'#E9967A','DarkSeaGreen':'#8FBC8F','DarkSlateBlue':'#483D8B','DarkSlateGray':'#2F4F4F','DarkTurquoise':'#00CED1','DarkViolet':'#9400D3','DeepPink':'#FF1493','DeepSkyBlue':'#00BFFF','DimGray':'#696969','DodgerBlue':'#1E90FF','FireBrick':'#B22222','FloralWhite':'#FFFAF0','ForestGreen':'#228B22','Fuchsia':'#FF00FF','Gainsboro':'#DCDCDC','GhostWhite':'#F8F8FF','Gold':'#FFD700','GoldenRod':'#DAA520','Gray':'#808080','Green':'#008000','GreenYellow':'#ADFF2F','HoneyDew':'#F0FFF0','HotPink':'#FF69B4','IndianRed':'#CD5C5C','Indigo':'#4B0082','Ivory':'#FFFFF0','Khaki':'#F0E68C','Lavender':'#E6E6FA','LavenderBlush':'#FFF0F5','LawnGreen':'#7CFC00','LemonChiffon':'#FFFACD','LightBlue':'#ADD8E6','LightCoral':'#F08080','LightCyan':'#E0FFFF','LightGoldenRodYellow':'#FAFAD2','LightGray':'#D3D3D3','LightGreen':'#90EE90','LightPink':'#FFB6C1','LightSalmon':'#FFA07A','LightSeaGreen':'#20B2AA','LightSkyBlue':'#87CEFA','LightSlateGray':'#778899','LightSteelBlue':'#B0C4DE','LightYellow':'#FFFFE0','Lime':'#00FF00','LimeGreen':'#32CD32','Linen':'#FAF0E6','Magenta':'#FF00FF','Maroon':'#800000','MediumAquaMarine':'#66CDAA','MediumBlue':'#0000CD','MediumOrchid':'#BA55D3','MediumPurple':'#9370DB','MediumSeaGreen':'#3CB371','MediumSlateBlue':'#7B68EE','MediumSpringGreen':'#00FA9A','MediumTurquoise':'#48D1CC','MediumVioletRed':'#C71585','MidnightBlue':'#191970','MintCream':'#F5FFFA','MistyRose':'#FFE4E1','Moccasin':'#FFE4B5','NavajoWhite':'#FFDEAD','Navy':'#000080','OldLace':'#FDF5E6','Olive':'#808000','OliveDrab':'#6B8E23','Orange':'#FFA500','OrangeRed':'#FF4500','Orchid':'#DA70D6','PaleGoldenRod':'#EEE8AA','PaleGreen':'#98FB98','PaleTurquoise':'#AFEEEE','PaleVioletRed':'#DB7093','PapayaWhip':'#FFEFD5','PeachPuff':'#FFDAB9','Peru':'#CD853F','Pink':'#FFC0CB','Plum':'#DDA0DD','PowderBlue':'#B0E0E6','Purple':'#800080','RebeccaPurple':'#663399','Red':'#FF0000','RosyBrown':'#BC8F8F','RoyalBlue':'#4169E1','SaddleBrown':'#8B4513','Salmon':'#FA8072','SandyBrown':'#F4A460','SeaGreen':'#2E8B57','SeaShell':'#FFF5EE','Sienna':'#A0522D','Silver':'#C0C0C0','SkyBlue':'#87CEEB','SlateBlue':'#6A5ACD','SlateGray':'#708090','Snow':'#FFFAFA','SpringGreen':'#00FF7F','SteelBlue':'#4682B4','Tan':'#D2B48C','Teal':'#008080','Thistle':'#D8BFD8','Tomato':'#FF6347','Turquoise':'#40E0D0','Violet':'#EE82EE','Wheat':'#F5DEB3','White':'#FFFFFF','WhiteSmoke':'#F5F5F5','Yellow':'#FFFF00','YellowGreen':'#9ACD32'}

          for(var cName in colors){
            if(color.toLowerCase() === cName.toLowerCase()){
              return colors[cName];
            } 
            else if(color === colors[cName]){
              return cName;
            }        
          }

          return -1;

          // if colors key store only lower-case-color-name & need to return only hex color code.
          // if (typeof colors[arguments[0].toLowerCase()] != 'undefined')
          //       return colors[arguments[0].toLowerCase()];
        }
      }

      // convert #RRGGBB, rgb(), rgba() to object {R: #, G: #, B: #, A: #.#} or 'rgba(r, g, b, a)' when asString = true.
      // return -1 if failed
      function rgba(color, asString){
        if(!!color && typeof color === 'string'){
          color = color.charAt(0) === '#' ? color : color(color) === -1 ? '-1' : color(color);
          var r, g, b, a;
          if(color.charAt(0) === '#'){
            r = color.substring(1,3);
            r = parseInt(r, 16); // convert hex to integer
            g = color.substring(3,5);
            g = parseInt(g, 16); 
            b = color.substring(5,7);
            b = parseInt(b, 16);
            a = 1.0;
          }
          else if(color.charAt(0) === 'r' || color.charAt(0) === 'R'){
            var cArr = color.replace(/[rgba()]/g,'').split(',');
            r = cArr[0];
            g = cArr[1];
            b = cArr[2];
            a = cArr.length === 4 ? cArr[3] : 1.0;
          }

          if(typeof r !== 'undefined' && typeof g !== 'undefined' && typeof b !== 'undefined' && typeof a !== 'undefined'){
            if(!!asString && asString)
              return 'rgba(' + r + ', ' + g + ', ' + b + ',' + a + ')';
            else 
              return {R:r, G:g, B:b, A:a}; 
          }

          return -1;
        }
      }

      // Calculate color brightness. color can be hex, rgb(), rgba(), color name. Return -1 if faile
      function brightness(color){
        if(typeof color === 'string')
          color = rgba(color);
        
        if(color !== -1){
          return Math.round(Math.sqrt(
            color.R * color.R * .241 + 
            color.G * color.G * .691 + 
            color.B * color.B * .068));
        }
        return -1;
      }

      function contrastBg(bgColor, darkColor, brightColor){
        if(!darkColor)
          darkColor = 'black';
        if(!brightColor)
          brightColor = 'white' 

        return brightness(bgColor) === -1 ? -1 : brightness(bgColor) < 130 ? brightColor : darkColor;
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
        if(get(el).length > 0)
          el = get(el)[0];
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
          if(get('','tag:style').length === 0)
            styleEl = appendChild(document.head, 'style');
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

      /* return -> child HTMLElement
      Use:
         1. add child node to parent node
            fn(idString/HTMLElement, childTag/childHTMLElement) 
         2. add child node to parent node with before node and text
            fn(idString/HTMLElement, childTag/childHTMLElement, {before:idString/HTMLElement, text:''})
            fn(parent, child, {before: beforeThisNode, text: ''})
         3. add child node to parent node using object as arg for extra setting
            fn({
               parent: idString/HTMLElemnt, 
               child: tag/HTMLElement,
               before: idString/HTMLElment, 
               text: ''
               attr: [{
                  name: '',
                  value: ''
               }],
               css: [{
                  name: '',
                  value: ''
               }]
            })      
      */
      function appendChild(parent, child, opt){
        var cEl, pEl;
        if(!!child)
          cEl = typeof child === 'string' ? document.createElement(child) : child;
        if(!!parent)
          pEl = get(parent)[0];

        if(!!parent && !!child && !opt)
          pEl.appendChild(cEl);
        else if(!!parent && !!child && !!opt){
          var beforeFlag = false;
          for(var k in opt){
            if(k.toLowerCase() === 'before'){
              bEl = get(opt[k])[0];
              beforeFlag = true;
            }
            if(k.toLowerCase() === 'text'){
              var textNode = document.createTextNode(opt[k]);
              cEl.appendChild(textNode);
            }
          }
          beforeFlag ? pEl.insertBefore(cEl, bEl) : pEl.appendChild(cEl);
        }
        else if(!!parent && typeof parent === 'object' && !child && !opt){
          var bEl, cText, attr, css;
          for(var k in parent){
            if(k.toLowerCase() === 'child'){cEl = parent[k]}
            if(k.toLowerCase() === 'parent'){pEl = parent[k]}
            if(k.toLowerCase() === 'before'){bEl = parent[k]}
            if(k.toLowerCase() === 'text'){cText = parent[k]}
            if(k.toLowerCase() === 'attr'){attr = parent[k]}
            if(k.toLowerCase() === 'css'){css = parent[k]}
          }
          pEl = get(pEl)[0];
          bEl = get(bEl)[0]; 
          cEl = typeof cEl === 'string' ? document.createElement(cEl) : cEl;

          // set attributes
          if (typeof attr !== 'undefined')
            for(var i=0; i<attr.length; i++)
              cEl.setAttribute(attr[i].name, attr[i].value);

          // apply css
          if(typeof css !== 'undefined')
            for(var i=0; i<css.length; i++)
              cEl.style[css[i].name] = css[i].value;

          // add text to child node
          if(typeof cText !== 'undefined'){
            var textNode = document.createTextNode(cText);
            cEl.appendChild(textNode); 
          }

          // append child
          if(typeof bEl !== 'undefined')
            pEl.insertBefore(cEl, bEl);
          else
            pEl.appendChild(cEl);
        }

        return typeof cEl === 'undefined' ? false : cEl;
      }

      /* return -> true/false
         - fn() : remove all nodes under doc.body 
         - fn(idString/HTMLElement, (false)) : remove all childs under el
         - fn(idString/HTMLElement, true) : remove all children and el
      */
      function removeChild(el, alsoRemoveEl){

        if(!el && !alsoRemoveEl){//remove all nodes under doc.body
          while(document.body.firstChild)
            document.body.removeChild(document.body.firstChild)
            return document.body.childNodes.length === 0;
        }

        if(!!el && !alsoRemoveEl)
            alsoRemoveEl = false
         
        el = get(el)[0];         
        if(alsoRemoveEl){//remove el and it's children
          el.parentNode.removeChild(el);
          return true;
        }
        else{//remove only el children
          while(el.firstChild)
            el.removeChild(el.firstChild);
            return el.parentNode.hasChildNodes()
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

      function select(pEl, opt){
        var selEl,//select  
            contEl,//select container
            mainContEl;// if there is title, this will be the main container
        
        if(get(pEl).length > 0){
          pEl = get(pEl)[0];//select parent

          // manipulate element
          if(pEl.nodeName.toLowerCase() === 'select'){//change style
            selEl = pEl;
            if(!cssHas(selEl,'sel')){//style is not yet changed
              contEl = appendChild(selEl.parentNode,'span');
              appendChild(contEl, selEl);
            }
          }
          else{//create select and append to pEl
            contEl = appendChild(pEl, 'span');
            selEl = appendChild(contEl, 'select')
          }

          cssAdd(contEl, 'sel-cont sel-tail')
          cssAdd(selEl, 'sel');
          attr(contEl,'id','gSelect' + get('.','class:sel-cont').length);
          attr(selEl, 'id', contEl.id + '-' + contEl.childNodes.length);

          if(!!opt){
            var bodyCss = '#' + contEl.id + '{',//.sel-cont css rules
                tailCss = '#' + contEl.id + '.sel-tail:before{',//.sel-tail:before css rules
                title, plcHold, body, tail;

            for(var k in opt){
              if(k.toLowerCase() === 'title'){title = opt[k]};
              if(k.toLowerCase() === 'placeholder'){plcHold = opt[k]};
              if(k.toLowerCase() === 'body'){body = opt[k]};
              if(k.toLowerCase() === 'tail'){tail = opt[k]};
            }

            // title
            if(typeof title !== 'undefined' && title !== ''){
              mainContEl = appendChild(contEl.parentNode, 'span');
              title = appendChild(mainContEl, 'div', {text:title});
              appendChild(mainContEl, contEl);
              cssAdd(title, 'sel-title');
            }

            // set placeholder
            if(typeof plcHold !== 'undefined'){
              cssAdd('#' + contEl.id + ".sel-tail:after{content:'" + plcHold + "'}");
              attr(selEl, 'placeholder', plcHold);
              selEl.selectedIndex = -1;
              var removePlcHold = function(){
                if(this.selectedIndex > -1)
                  cssRemove('#' + this.parentNode.id + '.sel-tail:after');
              }
              addEvent(selEl, 'change', removePlcHold);
            }

            // body
            if(typeof body === 'string')
              cssAdd(contEl, body);
            else if(typeof body === 'object'){
              for(var k in body)
                bodyCss += k + ':' + body[k] + ';';
            }
            cssAdd(bodyCss + '}');
            selEl.style['padding-right'] = contEl.offsetHeight + 10 + 'px';
            if(inObject(body,'font') || inObject(body,'font-size'))
                tailCss += 'width:' + contEl.offsetHeight + 'px;';

            // tail
            if(typeof tail === 'object'){
              var isGlyphicon = false;
              if(inObject(tail, 'content', true)){
                var content = tail[getObjKey(tail,'content')];
                if(content.indexOf('glyphicon') > -1){
                  var glyphContent = appendChild(contEl,'span');

                  cssAdd(glyphContent,'sel-tail-glyph glyphicon ' + content);
                  glyphContent.style['margin-left'] = '-' + contEl.offsetHeight + 'px';
                  glyphContent.style['width'] = contEl.offsetHeight + 'px';
                  glyphContent.style['height'] = contEl.clientHeight + 'px';
                  glyphContent.style['line-height'] = contEl.clientHeight + 'px';

                  if(inObject(tail, 'color'))
                    glyphContent.style.color = tail[getObjKey(tail,'color')];

                  tailCss += "content:'';";
                  isGlyphicon = true;
                }
              }

              for(var k in tail){
                if(k.toLowerCase() === 'content'){
                  if(!isGlyphicon)
                    tailCss += k + ":'" + tail[k] + "';";
                }
                else if(k.toLowerCase() === 'color' && isGlyphicon){}
                else 
                  tailCss += k + ':' + tail[k] + ';';
              }
            }  

            if(tailCss.length > 28)
              cssAdd(tailCss + '}');

            if(typeof title !== 'undefined'){
              title.style['line-height'] = contEl.offsetHeight + 'px';
              title.style['font-size'] = cssGet(contEl, 'font-size');
            }
          }
        }

        return {select: selEl, container: typeof mainContEl !== 'undefined' ? mainContEl : contEl};
      }

      function selectHeader(gSel, opt){

        if(typeof gSel !== 'undefined'){
          var sel = gSel.select,// select tag
              selCont = gSel.container,// seletct tag container
              cont,// main container
              title = get(selCont, 'class:sel-title')[0],
              clear, // clear all selected opt 
              display, // display only selected or select in multiple mode
              sRmSwitch; // single or multiple select container

          if(typeof opt === 'object'){
            for(var k in opt){
              if(k.toLowerCase() === 'clear'){clear = opt[k]};
              if(k.toLowerCase() === 'display'){display = opt[k]};
            }
          }
          
          // main container
          cont = appendChild(selCont.parentNode, 'div');
          sel.setAttribute('style', 'width:' + (selCont.offsetWidth + 30) + 'px');
          cont.style.width = selCont.offsetWidth + 'px';

          // if there is title, move it to header  
          if(typeof title !== 'undefined'){
            var newTitle = appendChild(cont, 'span', {text: title.innerHTML});
            cssAdd(newTitle, 'sel-header-title no-user-select');
            removeChild(title, true);
            cssAdd('.sel-header-title{width:' + (cont.offsetWidth - 170) + 'px}');
          }

          // single/multiple switch
          sRmSwitch = appendChild(cont, 'span', {text: 'Multiple'})
          cssAdd(sRmSwitch, 'sel-header no-user-select')
          attr(sRmSwitch, 'gSelect', sel.id);

          // clear button
          clear = appendChild(cont, 'span', {text: 'Clear'});
          cssAdd(clear, 'sel-header no-user-select')
          attr(clear, 'gSelect', sel.id);

          // display button
          display = appendChild(cont, 'span', {text: 'Selected'});
          cssAdd(display, 'sel-header no-user-select')
          attr(display, 'gSelect', sel.id);

          appendChild(cont, selCont);
          sel.selectedIndex = -1;

          // event listener fn
          var onclicksRmSwitch = function(e){
            var thisSelect = get(attr(this,'gSelect'))[0];

            // switch M <--> 1
            this.innerHTML = this.innerHTML === 'Multiple' ? 'One' : 'Multiple';
            thisSelect.multiple = thisSelect.multiple === true ? false : true; 
            cssToggle(thisSelect, 'sel-in-mlt');
            thisSelect.selectedIndex = -1;

            // ticked sign and background on opt should only appear when select is in multiple mode.
            var opts = thisSelect.options;
            for(var i = 0; i < opts.length; i++){
              var gValue = attr(opts[i], 'gValue'); 
              if(gValue !== null){
                var temp = opts[i].innerHTML;
                opts[i].innerHTML = gValue;
                attr(opts[i], 'gValue', temp); 
              }
            } 

            // if glyphicon is used in tail, hide it in multiple mode
            var glyph = get(thisSelect.parentNode, 'class:sel-tail-glyph')[0];
            if(typeof glyph !== 'undefined')
              cssToggle(glyph, 'hide-vis');
            cssToggle(thisSelect.parentNode, 'sel-tail')

            if(cssHas('.sel-header-title')){
              cssRemove('.sel-header-title');
              cssAdd('.sel-header-title{width:' + (thisSelect.parentNode.offsetWidth - 180) + 'px}');
            }

            e.stopPropagation();
          }

          var checkOpt = function(opt){
            attr(opt, 'ticked', '1');
            
            var value = attr(opt, 'gValue');
            if(value === null){
              attr(opt, 'gValue', opt.innerHTML);
              value = opt.innerHTML;              
            } 

            opt.innerHTML = value + ' ✔';
            cssToggle(opt, 'sel-opt-selected');
          }

          var uncheckOpt = function(opt){
            attr(opt, 'ticked', '0');
            opt.innerHTML = attr(opt, 'gValue');
            opt.removeAttribute('gValue');
            cssToggle(opt,'sel-opt-selected')
          }

          var onclickOpt = function(e){
            if(this.multiple){
              var opt = this[this.selectedIndex];
              var tick = attr(opt, 'ticked'); 
              tick === '0' || tick === null ? checkOpt(opt) : uncheckOpt(opt);
              e.stopPropagation();
            }
          }

          var onclickClear = function(e){
            var sel = get(attr(this, 'gSelect'))[0];
            for(var i = 0; i < sel.options.length; i++){
              if(attr(sel[i],'ticked') === '1')
                uncheckOpt(sel[i]);
            }
            sel.selectedIndex = -1;
            cssAdd('#' + sel.parentNode.id + ".sel-tail:after{content:'" + attr(sel, 'placeholder') + "'}");

            // if(this.parentNode.parentNode.childNodes.length > 2)
            // gjs.removeChild(sWin,false);
            // gjs.appendChild(sWin, 'span', {text: 'Nothing is selected.'})
            // sWin = this.parentNode.nextSibling.nextSibling;
            
            e.stopPropagation();
          }

          var onclickDisplay = function(e){
            var sel = get(attr(this, 'gSelect'))[0],
                pEl = sel.parentNode,
                sWin;// display window show only selected opt(s)

            this.innerHTML = this.innerHTML === 'Selected' ? 'Selecting' : 'Selected';

            // make selected display 
            sWin = appendChild(pEl,'div');
            

            // opts = gjs.Select.getArray(sel,'s');
            // gjs.attr(sWin,{'id':pEl.id+'Selected','class':'select'});

          // // populate selected item
          // for(var i=0; i<opts.length; i++){
          // var item = gjs.appendChild(sWin,'div'),
          // opt = gjs.appendChild(item, 'span',{text:opts[i].text.slice(0,opts[i].text.length-2)}),
          // closeBtn = gjs.appendChild(item, 'span', {text:'✘'});
          // opt.setAttribute('index',opts[i].index);
          // gjs.cssAdd(item,'select-opt-item');
          // gjs.cssAdd(closeBtn,'select-opt-item-btn');
          // gjs.cssAdd(opt,'select-opt-item-opt');
          // gjs.addEvent(closeBtn,'click',onclickOptItem);
          // }

          // //hide select
          // gjs.cssAdd(sel,'hide-dis')

          // //display message if nothing is elected   
          // if(opts.length === 0)
          // gjs.appendChild(sWin, 'span', {text: 'Nothing is selected.'})
          // } 
          // else 
          // {//show all
          // this.innerHTML = 'Show: Selected';
          // gjs.cssRemove(sel,'hide-dis')
          // gjs.removeChild(pEl.id+'Selected',true)
          // }

          // e.stopPropagation();
          }

          addEvent(sRmSwitch, 'click', onclicksRmSwitch);
          addEvent(sel, 'click', onclickOpt);
          addEvent(clear, 'click', onclickClear);
          addEvent(display, 'click', onclickDisplay);
        }
      }

      /* Use:
        1. get array of all options 
           fn(sel,'.|*|all',(true/false))
        2. get array of selected options
           fn(sel,'s',(true/false))
        3. get array of options under a specified optgroup
           fn(sel,'g:optgroup',(true/false))
        4. get array of selected options under a specified optgroup
           fn(sel,'sg:optgroup',(true/false))
        5. get array of optgroup
           fn(sel,'g',(true/false))
        Note:
           - textOnly is used to specified return format
              * textOnly = undefined | false --> [<opt>,<opt>,...], array of opt tag
              * textOnly = true --> ['opt','opt',...], array of opt value string 
           - opt.text -> option title or value string
           - opt.index -> index number of an option
      */
      // getArray: function(sel, filter, textOnly){
      //   var arr = [];
      //   if(!!sel && !!filter){
      //      sel = gjs.get(sel)[0];
      //      if(!textOnly)
      //         textOnly = false;

      //      if(filter === '.' || filter === '*' || filter.toLowerCase() === 'all')
      //      {//use 1
      //         if(textOnly)
      //            for(var i=0; i<sel.options.length; i++)
      //               arr.push(sel[i].value)
      //         else
      //            for(var i=0; i<sel.options.length; i++)
      //               arr.push(sel[i]);
      //      }
      //      else if(filter.toLowerCase() === 's')
      //      {//use 2
      //         if(textOnly){
      //            for(var i=0; i<sel.options.length; i++){
      //               if(gjs.attr(sel[i],'ticked') === '1')
      //                  arr.push(sel[i].value)
      //            }
      //         }
      //         else{
      //            for(var i=0; i<sel.options.length; i++){
      //               if(gjs.attr(sel[i],'ticked') === '1')
      //                  arr.push(sel[i])
      //            }
      //         }
      //      }
      //      else if(filter.toLowerCase() === 'g')
      //      {//use 3
      //         var optgroups = gjs.get(sel,'tag:optgroup');
      //         if(textOnly)
      //            for(var i=0; i<optgroups.length; i++)
      //               arr.push(optgroups[i].label)
      //         else 
      //            return optgroups;
      //      }
      //      else if(filter.toLowerCase().split(':')[0]==='g' && gjs.inArray(filter.split(':')[1],gjs.Select.getArray(sel,'g',true),true) > -1)
      //      {//use 4
      //         var optgs = gjs.Select.getArray(sel, 'g'), optg;
      //         if(textOnly){
      //            for(var i=0; i<optgs.length; i++){
      //               if(optgs[i].label.toLowerCase() === filter.split(':')[1].toLowerCase()){
      //                  optg = optgs[i];
      //                  var opts = gjs.get(optg, 'tag:option');
      //                  for(var j=0; j<opts.length; j++)
      //                     arr.push(opts[j].value);
      //                  break;
      //               }
      //            }
      //         }
      //         else{
      //            for(var i=0; i<optgs.length; i++){
      //               if(optgs[i].label.toLowerCase() === filter.split(':')[1].toLowerCase()){
      //                  optg = optgs[i]
      //                  return gjs.get(optg, 'tag:option');
      //               }
      //            }  
      //         }
      //      }
      //      else if(filter.toLowerCase().split(':')[0]==='sg' && gjs.inArray(filter.split(':')[1],gjs.Select.getArray(sel,'g',true),true) > -1)
      //      {//use 5
      //         var opts = gjs.Select.getArray(sel,'g:'+filter.split(':')[1]);
      //         if(textOnly){
      //            for(var i=0; i<opts.length; i++)
      //               if(opts[i].getAttribute('ticked')==='1')
      //                  arr.push(opts[i].value)
      //         }
      //         else{
      //            for(var i=0; i<opts.length; i++)
      //               if(opts[i].getAttribute('ticked')==='1')
      //                  arr.push(opts[i])
      //         }
      //      }
      //   }
      //   return arr;
      // }

      // reveal modules
      return {
        // utils
        has: function(k, caseIn){
          if(o instanceof Array)
            return inArray(o, k, caseIn)
          else if(typeof o === 'object')
            return inObject(o, k, caseIn)
        },
        color: function(){return color(o)},
        rgba: function(asString){return rgba(o,asString)},
        brightness: function(){return brightness(o)},
        contrastBg: function(dark, bright){return contrastBg(o, dark, bright)},
        get: function(opt){return get(o,opt)},
        attr: function(a,v){return attr(o,a,v)},
        cssHas: function(s){return !o ? cssHas(s) : cssHas(o,s)},
        cssGet: function(prop){return cssGet(o,prop)},
        cssAdd: function(r,arr){!o ? !arr ? cssAdd(r) : cssAdd(r, arr) : !arr ? cssAdd(o,r) : cssAdd(o,r,arr);},
        cssRemove: function(s,b){!o ? !b ? cssRemove(s) : cssRemove(s,b) : !b ? cssRemove(o,s) : cssRemove(o,s,b);},
        cssToggle: function(c){cssToggle(o,c)},
        appendChild: function(child, opt){return !o ? appendChild(child) : appendChild(o, child, opt);},
        removeChild: function(b){return !b ? removeChild(o) : removeChild(o,b)},
        hasChild: function(ch){return hasChild(o,ch)},
        addEvent: function(e,l,usecapt,wantuntr){addEvent(o,e,l,usecapt,wantuntr)},
        removeEvent: function(e,l,usecapt){removeEvent(o,e,l,usecapt)},
        // select or dropdown list
        select: function(opt){return !opt ? select(o) : select(o, opt)},
        selectHeader: function(opt){return !opt ? selectHeader(o) : selectHeader(o, opt)},
      }
    }




  //    addArray: function(sel, arr, optgroup){
  //       if(!!sel && !!arr){
  //          sel = gjs.get(sel)[0];
  //          var optParent = sel;
  //          // add optgroup
  //          if(!!optgroup && optgroup !== ''){
  //             var optg = gjs.appendChild(sel,'optgroup');
  //             gjs.attr(optg,'label',optgroup);
  //             optParent = optg;
  //          }
  //          // populate arr items to sel
  //          for(var i=0; i<arr.length; i++){
  //             var opt = gjs.appendChild(optParent,'option',{text:arr[i]});
  //             gjs.attr(opt,{'ticked':0,'value':arr[i]});
  //          }
  //       }
  //    },
  //    // o = {'optgroup':arr,...}
  //    addObject: function(sel, o){
  //       if(!!sel && !!o && gjs.get(sel).length === 1){
  //          sel = gjs.get(sel)[0];
  //          for(var g in o){
  //             gjs.Select.addArray(sel, o[g], g)
  //          }
  //       }
  //    },


  //    /* Use: 
  //       1. get object of all option
  //          fn(sel,'.|*|all',(true/false))
  //       2. get object of all selected option
  //          fn(sel,'s',(true/false))
  //       3. get object of options under specified optgroup
  //          fn(sel,'g:optgroup,optgroup,...',(true/false))
  //       4. get object of selectedoptions under specified optgroup
  //          fn(sel, 'sg:optgroup,optgroup,...',(true/false))
  //       Note:
  //          - return object: {'optgroup':[opt1,opt2,...],...}
  //          - textOnly = true will return array of option tag; otherwise, array option value/string 
  //    */
  //    getObject: function(sel, filter, textOnly){
  //       if(!!sel && !!filter && gjs.get(sel).length === 1){
  //          sel = gjs.get(sel)[0];
  //          var o = {},
  //             optgs = gjs.Select.getArray(sel, 'g');

  //          if(!textOnly)
  //             textOnly = false;

  //          if(filter === '.' || filter === '*' || filter.toLowerCase() === 'all')
  //          {//use 1
  //             for(var i=0; i<optgs.length; i++)
  //                o[optgs[i].label] = gjs.Select.getArray(sel,'g:'+optgs[i].label,textOnly)
  //          }
  //          else if(filter === 's')
  //          {//use 2
  //             for(var i=0; i<optgs.length; i++){
  //                var optArr = gjs.Select.getArray(sel,'sg:'+optgs[i].label,textOnly);
  //                if(optArr.length > 0)
  //                   o[optgs[i].label] = optArr;
  //             } 
  //          }
  //          else if(filter.toLowerCase().split(',')[0].split(':')[0]==='g' && gjs.inArray(filter.split(',')[0].split(':')[1],gjs.Select.getArray(sel,'g',true),true)>-1)
  //          {//use 3
  //             var optgs = filter.split(':')[1].split(',');
  //             for(var i=0; i<optgs.length; i++)
  //                o[optgs[i]] = gjs.Select.getArray(sel,'g:'+optgs[i],textOnly)
  //          }
  //          else if(filter.toLowerCase().split(',')[0].split(':')[0]==='sg' && gjs.inArray(filter.split(',')[0].split(':')[1],gjs.Select.getArray(sel,'g',true),true)>-1)
  //          {//use 4
  //             var optgs = filter.split(':')[1].split(',');
  //             for(var i=0; i<optgs.length; i++)
  //                o[optgs[i]] = gjs.Select.getArray(sel,'sg:'+optgs[i],textOnly)
  //          }

  //          return o;
  //       }
  //    },
  //    /* Use:
  //       1. perform callback function when user change or click on option
  //          fn(sel,fn(clickedOpt))
  //          Note: it passed the current opt to callback function.
  //    */
  //    run: function(sel, fn){
  //       if(!!sel && typeof fn === 'function'){
  //          sel = gjs.get(sel)[0];
  //          var func = function() {
  //              fn(this[this.selectedIndex]);
  //          }
  //          var changeEvent = function(){
  //             if(this.multiple){
  //                gjs.removeEvent(this,'change',func)
  //                gjs.addEvent(this,'click',func);
  //             }
  //             else{
  //                gjs.removeEvent(this,'click',func)
  //                gjs.addEvent(this,'change',func);
  //             }
  //          }
  //          gjs.addEvent(sel,'click',changeEvent);
  //          sel.multiple ? gjs.addEvent(sel,'click',func) : gjs.removeEvent(this,'change',func);
  //       }
  //    },
  // }

    return gjs;
  }

    //define globally if it doesn't already exist
    if(typeof(gjs) === 'undefined')
        window.gjs = window.g = define();
    else
        console.log("gjs already defined.");
})(window);
