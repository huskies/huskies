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
    