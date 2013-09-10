huskies
=======
method or function processor before execution.

!["huskies"](http://images4.fanpop.com/image/photos/17400000/Siberian-Huskies-dogs-17473305-500-375.jpg)

Install for component
=====================
  
  Install with [component(1)](http://component.io):

    $ component install brighthas/huskies

Install for node
==================

    npm install huskies

version
=======
0.0.9
    
API
===
```javascript
var wrap = huskies(method)
          .use(middle1)
          .set(...)
          .use(middle2)
          .set(...)
          .seal();
```          

middleware list
================
* [huskies/lock](https://github.com/huskies/lock) - Lock method according to options, is huskies framework's middle
* [huskies/strict](https://github.com/huskies/strict) - strict method ,convert and validate arguments, is huskies middleware.

How write middle
=================

Example:

```javascript
function middle(avgs,options,locals,exec){
    // avgs is arguments array object.
    // options is wrap.set() args , is only read.
    // locals is share data .
    // exec(false) break default execute and break after middles.
    // exec(avgs) in advance of the function.
}
```

Example:
========
```javascript
var huskies = require("./");

function num_validator(avgs,num,locals,exec){
     if(avgs.length !== (num[0] | 2)){
        throw {name:"len error",
               message:"arguments length must 3."}
     }
}

function test(name,age,id){
    console.log(name);
}

wrap = 
    huskies(test)
   .use(num_validator)
   .set(3) // if set 3 , then no throw , otherwise throw error.
   .seal();
   
wrap("leo",25,"id001");
```

LICENSE
=======
MIT
