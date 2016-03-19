"use strict";

/*
* Copy Right
* Freely we received and freely do we give
* Owner Emeka L.
*/

/**
* This is a simple calculator with basic trigonometry function
* Addition, Division, Multiplication, Substraction.
* Trigonometrics function: sin, and cos
* Log function, and constant PI
* Ex 12 + 90 + (23 -9) + sin(0.3) + pi
*/

var CALC;

(function (CALC) {
    //Token types
    var PLUS = 0;
    var MINUS = 1;
    var MUILT = 2;
    var DIV = 3;
    var LPAREN = 4;
    var RPAREN = 5;
    var NUM = 6;
    var BFN = 10;
    var EOL = 20;
    var Tokenizer  = (function () {
            var tokens = [];
            
            /**
            * This is Token constructor
            * Private
            * @param {number} -- type of token
            * @param {string} --  lexeme
            */
    
            function Token(type, val) {
                this.type = type;
                this.tval = val;    
            }
            
            /**
            * 
            * Private
            * @param {object} -- token object
            * Add to list
            */       
            function addToken(token) {
                tokens.push(token);
            }
     
            /**
            * http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
            * @param {string} n -- Test if n is numeric values
            * @return {boolean} 
            * 
            */
            function isNumeric(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }
    
            /**
            * http://stackoverflow.com/questions/9862761/how-to-check-if-character-is-a-letter-in-javascript
            * @param {string} char -- Test if char is alphabet
            * @return {boolean} 
            */ 
            function isLetter(char) {
                return char.length === 1 && char.match(/[a-z]/i);
            }
        
            /**
            * 
            * Private
            * @param {string} -- string to be tokenize
            * @param {string} -- inbuilt functions
            * @return -- list of tokens
            */

            function generate(source, inbuiltfn) {      
                var tOperator = "+-*/\(\)", len = source.length, i = 0, ch, rindex, newToken, acc = "";

                while (i < len) {
                    ch = source.charAt(i);
                    rindex = tOperator.indexOf(ch);
                    if (rindex >= 0) {
                        newToken = new Token(rindex, ch);
                        addToken(newToken); 
                    } else if (isNumeric(ch)) {
                        acc += ch;
                        i++;
                        ch = source.charAt(i);
                        while (isNumeric(ch) || ch === ".") {
                            acc += ch;
                            i++;
                            if (i === len) { break; }
                            ch = source.charAt(i);
                        }
                        if (!isNumeric(acc)) {throw new Error("Your value should be numerical"); }
                        newToken = new Token(NUM, acc);
                        addToken(newToken);
                        acc = "";
                        i--;
                    } else if (isLetter(ch)) {
                        acc += ch;
                        i++;
                        ch = source.charAt(i);
                        while (isLetter(ch)) {
                            acc += ch;
                            i++;
                            ch = source.charAt(i);
                        }
                        if (inbuiltfn.hasOwnProperty(acc)) {
                            newToken = new Token(BFN, acc);
                            addToken(newToken);
                            acc = "";
                            i--;
                        } else {
                            throw new Error("This function is not inbuilt and unknown" + acc);
                        }              
                    }
                    i++;                  
                } 
                // A hack to void getting undefined at the end of array elemments
                addToken(new Token(EOL, "EOL"));
                return tokens;
                }
    
            /**
            * This is Tokenizer constructor
            * @param {string} -- source code
            * @param {string} --  lexeme
            */
            function Tokenizer(source){ 
                var mapfns = {"cos": Math.cos, "sin": Math.sin, "log": Math.log, "sqrt": Math.sqrt, "pi": Math.PI };
                this.src = source;
                this.tokens = generate(source, mapfns);
                this.inbuiltfn = mapfns;
            }
            return Tokenizer;
        })();

    CALC.Tokenizer = Tokenizer;
    var Parser = (function () {
            var tk;
             /**
            * This is Parser constructor
            * @param {array} -- list of token
            * @param {object} -- map of selected functions
            */
            function Parser(tokens, bfn) {
                this.tokens = tokens;
                this.nativefns = bfn;
            }
            
            /**
            * @param {string} --  lexeme
            * @return {object} -- return Token object
            * 
            */
    
            Parser.prototype.nextToken = function () {
                return this.tokens.shift();
        
            };
            /**
            * @param {number} -- type of token
            * @return {boolean}   
            */
            Parser.prototype.peek  = function (tokenType) {
                return tokenType === tk.type;
            };
            /**
            * @param {number} -- type of token
            * @return {object} -- returns next token
            */    
            Parser.prototype.expected = function (tokenType) {
                if (this.peek(tokenType)) {
                    return this.nextToken();
                } else {
                    throw new Error("Expected token of type " + tokenType + " but found " + this.tokens[0].type);
                }
            };
    

            Parser.prototype.match = function (tokenType) {
                return this.peek(tokenType);
            };
            /**
            * @param {object} -- object of token
            * @return {number} -- returns numerical value 
            */
            Parser.prototype.factor = function (token) {
                var vexp;
                switch (token.type) {
                case NUM:
                    return parseFloat(token.tval);
                case BFN:
                    var fn =  this.nativefns[token.tval];
                    if (token.tval === "pi") {return fn; }
                    tk  = this.nextToken();
                    tk =  this.expected(LPAREN);
                    vexp = this.expression(tk);
                    if (!this.peek(RPAREN)) { throw new Error("Expected \) but found somethinf else"); }
                    return fn(vexp);
                case LPAREN:
                    tk = this.nextToken();
                    vexp = this.expression(tk);
                    if (!this.peek(RPAREN)) { throw new Error("Expected \) but found somethinf else"); }
                    return vexp;
                default:
                    throw new Error("Failed to interpret your token");
                }
            };

            /**
            * @param {object} -- object of token
            * @return {number} -- returns numerical value 
            */
            Parser.prototype.term = function (token) {
                var res = this.factor(token), les;
                tk = this.nextToken();
                while ((tk.type === MUILT) || (tk.type === DIV)) {
                    if (tk.type === 2) {
                        tk = this.nextToken();
                        les = this.factor(tk);
                        res = res * les;
                    } else {
                        tk = this.nextToken();
                        les = this.factor(tk);
                        if (les === 0) { throw new Error("Division by zero not allowed"); }
                        res = res / les;             
                    }
                    if  (tk.type === EOL) {break; }
                    tk = this.nextToken();
                }
                return res;
            };
        
            /**
            * @param {object} -- object of token
            * @return {number} -- returns numerical value 
            */    
            Parser.prototype.expression = function (token) {
                var res = this.term(token), les;
                while ((tk.type === PLUS) || (tk.type === MINUS)) {
                    if (tk.type === PLUS) {
                        tk = this.nextToken();
                        les = this.term(tk);
                        res = les + res;
                    } else {
                        tk = this.nextToken();
                        les = this.term(tk);
                        res = res - les;
                    }
                    if(tk.type === EOL) {break; }
                    //tk = this.nextToken();
                }
                return res;
            };
            /**
            * Recursive descent parser (instant calculation)
            * @return {number} -- returns numerical value 
            */
            Parser.prototype.calc = function () {
                return this.expression(this.nextToken());
            };
    
            return Parser; 
        })();
    CALC.Parser = Parser;

})(CALC || (CALC = {}));


/**
* Simple unit tests
*
*/

var test1 = "(45 / 5) + 20 + sin(1.2) + pi";
var tk1 = new CALC.Tokenizer(test1);
var parse1 = new CALC.Parser(tk1.tokens, tk1.inbuiltfn);
if (parse1.calc() === 33.073631739557015) {
    console.log("test1 passed");
} else {
    console.log("test1 failed");
}

var test3 = "100/50";
var tk3 = new CALC.Tokenizer(test3);
var parse3 = new CALC.Parser(tk3.tokens, tk3.inbuiltfn);
if (parse3.calc() === 2) {
    console.log("test1 passed");
} else {
    console.log("test1 failed");
}


var test4 = "8*7+10";
var tk4 = new CALC.Tokenizer(test4);
var parse4 = new CALC.Parser(tk4.tokens, tk4.inbuiltfn);
if (parse4.calc() === 66) {
    console.log("test1 passed");
} else {
    console.log("test1 failed");

}


var test5 = "89 / 3 * 2";
var tk5 = new CALC.Tokenizer(test5);
var parse5 = new CALC.Parser(tk5.tokens, tk5.inbuiltfn);
if(parse5.calc() === 59.333333333333336) {
    console.log("test1 passed");
} else {
    console.log("test1 failed");

}



//var test2 = "90 / 0";
var test2 = "12 + 90 + (23 -9) + sin(0.3) + pi";
var tk2 = new CALC.Tokenizer(test2);



var parse2 = new CALC.Parser(tk2.tokens, tk2.inbuiltfn);
if(parse2.calc() === 119.43711286025113) {
    console.log("test1 passed");
} else {
    console.log("test1 failed");
}
