//"use strict";
/**
* Simple Calculator
* Based of Shunting Yard Algorithm
*
*/


 var shuntyard = (function(){
function factorial(n) {
    if(n === 1 || n === 0) {
        return n;
    }
    return factorial(n - 1) * n;
}

var optab = {"+": {"preced": 5, "assoc": 1}, 
             "-": {"preced": 5, "assoc": 1},
             "*": {"preced": 6, "assoc": 1},
             "/": {"preced": 6, "assoc": 1},
             "^": {"preced": 7, "assoc": 0}};

var mapfns = {"cos": Math.cos, "sin": Math.sin, "tan": Math.tan, "!": factorial, "log": Math.log, "sqrt": Math.sqrt, "pow": Math.pow };


function isNumeric(token) {
    return !isNaN(parseFloat(token)) && isFinite(token);
}

function isFunction(token) {
    return mapfns.hasOwnProperty(token);
}

function isOperator(token) {
    return optab.hasOwnProperty(token);
}

function isLowerPrecedence(tk1, tk2) {
    if((optab[tk1]["preced"] <= optab[tk2]["preced"]) && (optab[tk1]["assoc"] === 1)) {
       return 1;
       }
    if((optab[tk1]["preced"] < optab[tk2]["preced"]) && (optab[tk1]["assoc"] === 0)) {
        return 1;
    }
        
       
    return 0;
}

function shuntyard(tokens) {
    var output = [], opStack = [], i, token;
    for (i = 0; i < tokens.length; i++) {
        token = tokens[i];
        if(token === '' || token === ' ') {
            continue;
        }
        if (isNumeric(token)) {
            output.push(parseFloat(token));
            continue;
        }
        if (isFunction(token)) {
            opStack.push(token);
            continue;
        }
        if (token === "pi" ){
            output.push(Math.PI);
            continue;
        }
        if (isOperator(token)){
            if (opStack.length === 0) {
                
            }
            else if (opStack[opStack.length - 1] === "(") {
                
            }
            else if (isLowerPrecedence(token, opStack[opStack.length - 1])) {
                output.push(opStack.pop());
                while(opStack[0] !== undefined && isLowerPrecedence(token, opStack[opStack.length - 1])){

                    output.push(opStack.pop());
                }
  
            }
            opStack.push(token);
            
        }
        if (token === "(") {
            opStack.push(token);
        }
        
        if(token ===  ",") {
            var slen = opStack.length;
            var top = opStack.pop() , j;
            j = 0;
            while (j < slen && top !== "(") {
                output.push(top);
                top = opStack.pop();
                j++;
            }
            opStack.push(top);
            console.log(output);
            console.log(opStack);
            //throw new Error("Expression lacked (");
            if(j + 1 === slen) {
                throw new Error("Expression lacked (");
            }
            
        }
        if (token === ")") {
            var tt = opStack.pop();
            while(tt !== "(") {
                output.push(tt);
                 tt = opStack.pop();
                console.log(tt);
            }
            
            tt = opStack.pop();
            console.log(tt);
            isFunction(tt)? output.push(tt) : opStack.push(tt);
            
        }

        
      
    }
    if (opStack.length > 0){
        var len = opStack.length, k;
        for (k = 0; k < len; k++) {
            console.log(output);
            output.push(opStack.pop());
            
        }
        
    }
    return output;
    
    
}
     
     return shuntyard;
    
 })();

function tokenizer(str) {
    return str.split(/(\s|,|[a-z]+|\/|\(|\))/);
}    
    
var stret =  "2 - 3 - 8 * 2 + 20";///"pow(90 + 23 - 4 , 45) + 4 ^ 2 + sin(34)"; //"2 - 3 -  4 * 2 + 45 

var dot = tokenizer(stret);
dot;
shuntyard(dot);