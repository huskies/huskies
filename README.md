huskies
=======
method or function processor before execution.

!["huskies"](http://stuffpoint.com/husky/image/50775-husky-husky-wallpaper-26.jpg)

Install
========

    npm install huskies

Version
=======
0.0.4
    
API
===
```javascript
var wrap = huskies(method)
          .use(middle1)
          .set(...)
          .use(middle2)
          .set(...)
```          

How write middle
=================

Example:

```javascript
function middle(avgs,options,locals,exec){
    // avgs is arguments array object.
    // options is wrap.set() args.
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
     if(avgs.length !== (num | 2)){
        throw {name:"len error",
               message:"arguments length must 3."}
     }
}

function test(name,age,id){
    console.log(name);
}

var wrap = 
    huskies(test)
   .use(num_validator)
   .set(3); // if set 3 , then no throw , otherwise throw error.
   
   wrap("leo",25,"id001");
```

LICENSE
=======
MIT