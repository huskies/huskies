module.exports = huskies;
var uuid = require("node-uuid");

function huskies(fun){
    
    var middles = []
       ,globalLocals = {}
       ,isSeal = false
       ,localsName = uuid.v1()
       ,optionsRepo = []; 
    
    function wrap(){
    
        var args = Array.prototype.slice.call(arguments, 0)
           ,self = this
           ,result 
           ,locals
           ,breakExec = false;
           
        if(isGlobal(this)){
            locals = globalLocals;
        }else if(this[localsName]){
            locals = this[localsName];
        }else{
            Object.defineProperty(this,localsName,{
                value: {},
                writable: true,
                enumerable: false,
                configurable: true
            })
            locals = this[localsName];
        }
        
        function exec(avgs){
            breakExec = true;
            if(Array.isArray(avgs)){
                result = fun.apply(self,avgs);
            }else if(avgs !== false){
                throw new Error("exec args error, must false or array.");
            }
        }
        
        for(var i=0,len=middles.length;i<len && !breakExec;i++){
            var options = optionsRepo[i];
            var middle = middles[i];
            middle(args,options,locals,exec);
        }
        
        if(!breakExec){
            exec(args);
        }
        
        return result;
        
    }
    
    wrap.use = function(middle){
        if(isSeal) return this;
        middles.push(middle);
        optionsRepo.push(undefined);
        return this;
    }
    
    wrap.seal = function(){
        if(isSeal) return this;
        isSeal = true;
        // freeze options.
        optionsRepo.forEach(function(o){
            try{Object.freeze(o)}catch(e){}
        });
        return this;
    }
    
    wrap.set = function(){
        if(isSeal) return this;
        
        // this middle parameter type.
        var paramType = middles[middles.length-1].paramType;
        
        // convert arguments to Array.
        var avgs = Array.prototype.slice.call(arguments, 0);

        // pop last options from optionsRepo
        var options = optionsRepo.pop();

        // merge array params to json params.
        function arr2json(){
           for(var i=0,j=0,len = parseInt((avgs.length+1)/2);i<len;i++){
                options[avgs[j]] = avgs[j+1];
                j+=2;
           }    
        }
        
        // merge json params obj.
        function mergeJson(){
            for(var k in avgs){
                if(avgs.hasOwnProperty(k)){
                    options[k] = avgs[k];
                }
            }
        }
        
        switch(paramType){
            case "single":
                options = avgs[0];
            break;
            case "array":
                if(!options){
                    options = [];
                }
                options = options.concat(avgs);
            break;
            case "json":
                if(!options) {
                    options = {}
                }
                if(avgs.length === 1){
                    mergeJson();
                }else{
                    arr2json();
                }
            break;
            default:     
                // Mean is first set.
                // The first parameter that determines the type of the parameter after.
                if(!options){
                    if(avgs.length === 1 && typeof avgs[0] === "object" && avgs[0] !== null){
                        options = avgs[0];
                    }else{
                        options = avgs;
                    }                
                }else{
                    
                    // Array type.
                    if(Array.isArray(options)){
                        if(avgs.length === 1 && Array.isArray(avgs[0])){ 
                            options = options.concat(avgs[0]);
                        }else{
                            options = options.concat(avgs);
                        }
                        
                    // JSON type.
                    }else{
                        if(avgs.length === 1){
                            mergeJson();
                        }else{
                            arr2json();
                        }
                    }
                }
            break;
        }   
        
        optionsRepo.push(options);
        
        return this;

    }
    
    return wrap;
    
}

function isGlobal(obj){
    if(typeof window !== "undefined"){
        return obj === window;
    }else{
        return obj === global;
    }
}
