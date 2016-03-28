### Simple Calculator
It's a _JavaScript-based_ but using language design principles like tokenizing and parsing. We chose recursive descent parser becuase of it simplicity and it affords us the opportunity to calculae on-fly.
#
Only two functions are exposed via `CALC` object-- `Tokenizer` and `Parser`.

```javascript
var test2 = "12 + 90 + (23 -9) + sin(0.3) + pi";

var tk2 = new CALC.Tokenizer(test2);

var parse2 = new CALC.Parser(tk2.tokens, tk2.inbuiltfn);

parse2.calc();
```
