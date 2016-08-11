# tedjs.aml.std
Advanced Markup Language - Standard

## --- What is AML? ---
this is a library for [tedjs](https://github.com/poryagrand/tedjs).
this is just a basic library for tedjs to improve it.
it has aml vaiables and some elements with function to help.


## --- AML:std  Elements ---

### :: Name Space and ID
NameSpace | ID
--------- | ----------
STD | system.aml.std

### :: AML Inline Executer
you can run any javascript function in html with out any `<script/>` Element.
#### .: Example 1
```HTML
<b><i> {{ js : return "This a Test" }} </i></b>
```
Output: _**`This a Test`**_
#### .: Example 2
```HTML
<b><i> {{ js : 2 }} </i></b>
```
Output: _**`undefined`**_
#### .: Example 3
```HTML
<b><i> {{ js : anyFunction([Arguments]) }} </i></b>
```
Output: _**`undefined`**_
#### .: Example 4
```HTML
<b><i> {{ aml : x }} </i></b>
```
Output: _**`[VALUE]`**_

### :: AML Variable
aml has its own variable declaration. it means that if you declare any variables at any level of elements, all children of that element will can access to that variables.
to declare you can use `var` attribute in target element.
```HTML
{{aml:x}}
<element var="x = 1; y = 'test'; z = [1,2,3]">
       {{ aml : y }}
       <sub-element>
            {{aml : z}}
       </sub-element>
</element>
```
Output: 
```TEXT
{{aml:x}}
'test'
[1,2,3]
```
you can also use javascript functions to add , edit or get the variables value. 
### :: AML:std  Object
after including this library (Download or online Library) like this:
```javascript
var System = include("system.aml.std");
```
you will have an object that is containing the AML:std Objects.
#### .: System.aml.addVar()
Structure:
```javascript
System.aml.addVar(
    variable : Object,
    element : HTMLElement
) : Number
```
with this function you will be able to add or edit a variable.
if the variable be exist , it will edit it other wise it will add a new variable to the target `DOM`.
##### .:: Example :
```javascript
System.aml.addVar(
   {
      name : "x",
      value : 1
   },
   tedApi.elm("body")
)
```

#### .: System.aml.varValue()
Structure:
```javascript
System.aml.varValue(
    variableName : String,
    element : HTMLElement
) : any
```
if the variable were existed,it will return its value otherwise it will return undefined
##### .:: Example :
```javascript
System.aml.varValue(
   "x",
   tedApi.elm("body")
)
```

#### .: System.aml.varExist()
Structure:
```javascript
System.aml.varExist(
    variableName : String,
    element : HTMLElement
) : Boolean
```
if the variable were existed,it will return tre it will return false
##### .:: Example :
```javascript
System.aml.varExist(
   "x",
   tedApi.elm("body")
)
```

#### .: System.aml.module()
Structure:
```javascript
System.aml.module(
    amlName : String,
) : Module
```
with this function you can access to the target's element (the element must have the `aml` attribute,because this function ,find the element from this attribute) modules that are global or are created by you.
all modules will returned as an object.if there were be any error , it will be returned as an object with `type`:`error` and a `message` that is, its error message.

##### .:: Example :
```HTML
<element aml="elm"></element>
<script>
    var AML_Elem = System.aml.module("elm");
</script>
```

#### .: `[Module]`.control()
Structure:
```javascript
[Module].control(
    callback : Function,
) : Module
```
this function that is one of module's function , used for controling target element easily.you can define any aml variable more simple.you have access to local functions of `__GLOBALS()__`.you have access to its children that has `aml` attribute as an object. control send `__GLOBALS()__` functions as the first argument and the element as `this`.

##### .:: Example :
```html
<element aml="elm" var="x=[1,2,3]">
   <sub aml="esub">
      {{ js: return ({{ aml: j }})() }}
      <sub>{{ aml: x }}</sub>
   </sub>
</element>
<script>
    var elem = System.aml.module("elm");
    elem.control(function(a){
        a.vars.j = function(){return 2;}; // declare aml variable
        a.vars.x = 2; // edit  declared aml variable but in here because the control function  run before element compiling so you can't access to undeclared variables.
        /*
           a.bind("click",function(){...});
            -> using local functions
        */
        console.log(a.esub) // log `sub` element Module
    });
</script>
```
Output: 
```text
2
1,2,3
```


#### .: System.aml.creatModule()
Structure:
```javascript
System.aml.creatModule(
    options : Object,
) : Boolean
```
with this function you can create your modules like `[Module].control()`.you can create module for special elements.you can specify the time of module execution.every property that is needed to insert into the `option` object , has come in table below:

property name | property description | property type
--------------|----------------------|--------------
name|this is the name of module like `control`|`String`
function|this is the core of your module.with this you can control the activities in module. it has one argument that is an object. it has 3 function(explained in table below) , one object(`option` object) as property `main` and the target element as property `self` . the `this` pointer is pointing to the target element.|`Function`
global|it is an object of needed functions that all specified elements can use them if you want.|`Object`
local|this is like `global` but before defining any function , you must set its tagname and next , set the object of functions. you can specify the tag name of element you want to access functions.|`Object`
before|this is a boolean value to access to your module that run before compiling each element.|`Boolean`
after|this is a boolean value to access to your module that run after compiling each element.|`Boolean`
elm|with this property you can set that which elements you want to access to this module. if leave if empty , it means that you allow every dom to have access to it.|`Array`
##### .:: Local Functions
in property `function` you have access to 3 functions that is available from the first argument of `function`. they are explained in table below:

Function | Explanation
---------|------------
`[arg1]`.createBasic()|with this function you will be able to create the base object of you module that contain the `global` functions , `local` functions and the Ability of accessing the aml variables.this function will return that object and you can  use The Object every where you want.
`[arg1]`.runFunctions()|this function has one input argument that accept an object of functions(object that is returned from `[arg1].createBasic()`) . when you run this function , it will run the modules that has contain a function and send the object to them as the first argument.
`[arg1]`.Functions()|with this function you can controle all current module's inputs. this function accept a function as its first argument and send the current module's inputs as the first argument of input function.you can this function more that one and the Module manager will execute them in order.this function can be a replace for `[arg1].runFunctions()` to handle the module's inputs.


##### .:: Example : `control` Module
```javascript
System.aml.creatModule(
   name:"control",
   global: {
        ...
        attr: function () { 
            var ARG = [this.self, arguments[0], arguments[1]]; 
            return tedApi.attr.apply(window, ARG);
        },
        ...
    },
    local:{},
    function:function($){
        var option = $.createBasic();
        $.runFunctions(option);
    },
    before:true,
    after:false,
    elm:[]
);
```

##### .:: Example : `test` Module
```javascript
System.aml.creatModule(
   name:"test",
   global: {
        glob:function(){ [Doing Something] }
    },
    local:{
        "elm1":{
            func1:function(){[Doing Something]}
        },
        "elm2":{
            func2:function(){[Doing Something]}
        }
    },
    function:function($){
        var option = $.createBasic();
        $.Functions(function(input){
            input.call(option,2);
        });
    },
    before:true,
    after:true,
    elm:["elm1","elm2","elm3"]
);
```
```html
<elm1 aml="elm1"></elm1>
<elm2 aml="elm2"></elm2>
<elm3 aml="elm3"></elm3>
<elm4 aml="elm4"></elm4>

<script>
    var elm1 = System.aml.module("elm1"),
        elm2 = System.aml.module("elm2"),
        elm3 = System.aml.module("elm3"),
        elm3 = System.aml.module("elm4");
    elm1.test(function(a){
        this.vars.test = 2; // create aml variable
        console.log(a); // log 2
        this.glob(); // run the `glob` function
        this.func1(); // run the `func1` function
        this.func2(); // throw an error . this element has no access to this function
    });
    elm2.test(function(a){
        this.vars.test = 2; // create aml variable
        console.log(a); // log 2
        this.glob(); // run the `glob` function
        this.func2(); // run the `func1` function
        this.func1(); // throw an error . this element has no access to this function
    });
    elm3.test(function(a){
        this.vars.test = 2; // create aml variable
        console.log(a); // log 2
        this.glob(); // run the `glob` function
        this.func1(); // throw an error . this element has no access to this function
        this.func2(); // throw an error . this element has no access to this function
    });
    elm4.test(function(a){}); // there is no `test` module for this element
</script>
```


### :: AML Elements
Now it's time to introduce the AML Elements:
#### .: Element `import`:
this is an element to send request and receive data.
```HTML
<import
   src="[URL]"
   parse="[Data Type]"
   save="[JavaScript Variable]"
   success="[Success Callback]"
   error="[Error Callback]"
   async
></import>
```
##### .:: Attribute `src` (Required)
with this attribute you can set the destination file url that you want to receive its data .it is `required`
##### .:: Attribute `parse` (Optional)
you can set the data type to tell function to parse data in type you want.
it can parse data in these types:
`text`(default) , `html` , `xml` , `json` ,`js` , `css` , `image`
##### .:: Attribute `save` (Optional)
with this attribute you can save the `http Request` content in a Global Javascript Variable. so you can access it from every where.just need to put a name in the attribute.
if you don't set this attribute , it will set the recived content into the element innerHTML.
##### .:: Attribute `Success` (Optional)
this is a callback function attribute. you can set javascript functions to call when the `request` has done correctly.
##### .:: Attribute `Error` (Optional)
this is like `Success` Attribute. but The difference is that in this case , it will call when an error occurred.
##### .:: Attribute `Async` (Optional)
this element will send request synchronously in default.this attribute is a non value attribute . just if you use this , the element will send request asynchronously.
##### .:: Example : `CSS` 
```html
<import src="test.css" parse="css" success="SuccessFunc()"></import> <!-- It is Like <link/> -->
```
##### .:: Example : `javascript` 
```html
<import src="test.js" parse="js" success="SuccessFunc()" error="ErrorFunc()"></import> <!-- It is Like <script/> -->
```

##### .:: Example : `image` 
```html
<import src="test.png" parse="image" success="SuccessFunc()" error="ErrorFunc()"></import> <!-- It is Like <img/> -->
```

##### .:: Example 1 
###### .:: `page.format` Content ::.
```
this file can be every thing.js , css , html , json , ...
it is not important.
...
```
###### .:: `index.html` Content ::.
```html
<import src="page.format" parse="[Any Kind]" success="SuccessFunc(content,xhr,this)" error="ErrorFunc()"></import> 
```
because there is no `save` attribute , so it is not different to define the `parse` attribute or not . it will inserted as a text inner of element html.

###### .:: `Output` Content ::.
```
this file can be every thing.js , css , html , json , ...
it is not important.
...
```

##### .:: Example 2
###### .:: `page.json` Content ::.
```json
{
  "a":1,
  "b":"test"
}
```
###### .:: `index.html` Content ::.
```html
<import src="page.json" save="store" parse="json" success="SuccessFunc(content,xhr,this)" error="ErrorFunc()">
    {{
       var text = "";
       tedApi.each(store,new Function("i",'text += i+":"+this+",";'));
       return text;
    }}
</import> 
```
###### .:: `Output` Content ::.
```
a:1,b:test
```

#### .: Element `switch`:
this is like `switch` operator in all Programing language.
```html
<switch cond="[Statement]">
    ...
    <case cond="[Statement]" break>
        [Any Text]
    </case>
       ...
</switch>
```
##### .:: Attribute `cond` :
this attribute is use for checking the correctness of the value to compare with the `case` element's `cond` attribute to see if which ones are same.
##### .:: Attribute `break` :
this attribute is just use in `case` element . when you want to break the `switch` statement if the condition of the element and the `switch` element were be the same , use this attribute. otherwise it will check other cases to end.
##### .:: Example 1:
```html
<body var="x=2;y=2">
    <switch cond="{{aml:x}}">
        this text will not be shown
        <case cond="{{aml:y}}">It is Y</case>
        <case cond="4" break>It is 4</case>
        <case cond="{{js:return 2}}">It is 2</case>
    </switch>
</body>
```
##### .:: `Output` Content:
```
It is Y
It is 2
```

##### .:: Example 2:
```html
<body var="x=3;y=4">
    <switch cond="{{aml:x}}">
        this text will not be shown
        <case cond="{{aml:y}}">It is Y</case>
        <case cond="3" break>It is 3</case>
        <case cond="{{js:return 3}}">It is js:3</case>
    </switch>
</body>
```
##### .:: `Output` Content:
```
It is 3
```
#### .: Element `if`:
with this element you can show or hide any content. it is a condition element.
```html
<if
    is="[Statement]"
    not="[Statement]"
>
</if>
```
##### .:: Example 1:
```html
<body var="x=2">
    <if is="{{aml:x}} == 2">True</if>
</body>
```
is equal to this `javascript` code.
```javascript
if(x == 2){
    return "True";
}
```
##### .:: `Output` Content:
```html
True
```
##### .:: Example 2:
```html
<body var="x=2">
    <if is="{{aml:x}} != 2">True</if>
</body>
```
is equal to this `javascript` code.
```javascript
if(!(x != 2)){
    return "True";
}
```
##### .:: `Output` Content:
```html
True
```
#### .: Element `for`:
this element is use for show data sequentially(append or replace).
```html
<for
    from="[Number]"
    to="[Number]"
    step="[TIME,Number]"
    stepback="[TIME,Number]"
    infinity
    is="[Statement]"
    append
>
</for>
```
attribute name | attribute description
---------------|----------------------
from|with this you can initial the loop variable. it must be a number.
to|this attribute is for specify the desired value.
infinity|if you use this instead of `to` , it will continue looping to infinity. it has no value.
step|with this you can set that how many steps do you want to go forward every loop. it accept number or a time in these formats:`[Number]`[`ms`,`s`,`m`,`h`]. if you use the time formats it will increase one unit.
stepback| it is like `step` but the difference is that it is mean go to backward. if you use the time formats it will decrease one unit.
is|it is a extra conditional attribute , that you can set extra conditions to the loop. it accept `javascript` language.
append| this is a non-value attribute . the element will replace every new data with the old ones in default. but if you use this attribute , it will cause that append data after the old one.

##### `NOTE`: 
inner the element you can use an `AML` Variable that is `{{aml:for}}`. it value is the current value of loop variable.
##### .:: Example 1:
```html
<body var="x=3" >
    <for from="0" to="5" step="1" is="{{aml:x}} != this.for">
        {{ js: this.parentNode.for = {{aml:for}}; return ""; }}
        {{aml:for}}
    </for>
</body>
```
##### `Output` Content:
```
3
```
##### .:: Example 2:
```html
<body var="x=3" >
    <for from="0" infinity stepback="1s" append>
        {{aml:for}}
    </for>
</body>
```
##### `Output` Content:
```
-1 -2 -3 -4 -5 ...
```
#### .: Element `go`:
with this element you can redirect a page after a time.
```html
<go
   to="[URL]"
   after="[TIME]"
>
</go>
```
##### .:: Example 1:
```html
<go to="https://google.com"></go>
```
this will redirect the page to `google.com` after immediately.
##### .:: Example 2:
```html
<go to="https://google.com" after="5s"></go>
```
this will redirect the page to `google.com` after 5 second.
you can use `ms`,`s`,`m`,`h`


#### .: Element `def`:
this is a template element.with this you can define a template of HTML elements.
```html
<def
   name="[String]"
>
</go>
```
##### .:: Example:
Filename: `def.html`:
```html
<def name="ift">
    <if is="true">true</if>
</def>
<def name="iff">
    <if not="false">false</if>
</def>
```
Filename: `index.html`:
```html
<import src="def.html" parse="html"></import>

<def-ift></def-ift>

<def-iff></def-iff>
```
`Output`:
```
true
false
```



#### .: Element `func`:
this element is like `def` but the difference is that in this element you can define input arguments. it is like creating a new element. to add argument you must add attribute like this : `[Func Name]`-`[Attribute Name]`= "`[Argument Variable]`"
```html
<func
   name="[String]"
>
</go>
```
##### .:: Example:
Filename: `func.html`:
```html
<func name="tedFuncName" tedFuncName-num="x">
    <if is="{{aml:x}} == 3">
        This Is {{aml:x}}
        <for from="0" to="{{aml:x}} * 3" step="1s" append>
            {{js: return System.aml.amlVar(this,"for")}}
        </for>
    </if>
    <if not="{{aml:x}} == 3">
        It Is Not 3
        <br/> 
        It Is {{aml:x}}
    </if>
</func>
```
Filename: `index.html`:
```html
<import src="func.html" parse="html"></import>

<tedFuncName num="3"></tedFuncName>
<tedFuncName num="4"></tedFuncName>
```
`Output`:
```
12345678
It Is Not 3 
It Is '4'
```

### :: AML Attributes
Besides the elements, Ted js Attributes as well.
#### .: Attribute `change`:
this attribute is use for elements that support `onchange` or `oninput` event.
```html
<element 
    change="[AML Attribute]"
>
</element>
```
##### .:: Example:
```html
<input type="text" aml="amlInput"/>
<span change="amlInput">
    {{aml: amlInput_val}}
</span>
```
in this case if you type sumthing in `input` element , the `span` element will Reaction to it and will show the `value` of it.

#### .: Attribute `repeat`:
this attribute is use for elements that support `onchange` or `oninput` event.
```html
<element 
    repeat="[Expressions]"
>
</element>
```
in `[Expressions]` you must use Expressions in formats bellow:

Expression | Description
-----------|------------
`[Start Number]` to `[End Number]`| if you use this Expression ,you will have a loop that start from`[Start Number]` and end at `[End Number]`.to access the current loop position number you can use `{{aml: [tagName]_loop}}`
`[Variable]` in `[Object]`| with this you can loop inside `object` and `Array`.
`[Object]` as `[Key Variable]`=>`[Value Variable]`| it is like php , you can set any `Object` And `Array` as a `key` and its `value`.

Remember that every attribute except `repeat` that you use in the element , will use in copied elements.
##### .:: Example:
```html
<table var="x=3;g=[1,2,3,4]">
        <tr repeat="0 to {{aml:x}}" style="color:red">
            <td>A: {{return {{aml:g}} [ {{aml:tr_loop}} ]}}</td>
        </tr>
        <tr repeat="i in {{g}}" style="color:blue">
            <td>B: {{aml: i }}</td>
        </tr>
        <tr repeat="{func:function(){},a:1,b:'test'} as key=>value" style="font-size:20px">
            <td>C: {{aml: key }} : {{aml: value }}</td>
        </tr>
</table>
```
##### `Output` Source:
```html
<table var="x=3;g=[1,2]">
        <tr repeat="0 to 1" style="color:red">
            <td>A: 1</td>
        </tr>
        <tr style="color:red">
            <td>A: 2</td>
        </tr>
        <tr repeat="i in [1,2]" style="color:blue">
            <td>B: 1</td>
        </tr>
        <tr style="color:blue">
            <td>B: 2</td>
        </tr>
        <tr repeat="{func:function(){},a:1,b:'test'} as key=>value" style="font-size:20px">
            <td>C: 'a' : 1</td>
        </tr>
        <tr style="font-size:20px">
            <td>C: 'b' : 'test'</td>
        </tr>
</table>
```

