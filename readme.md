# @hugov/bench

* `@param {Object<function>}` tests with names
* `@param {number} [sec=1]` target testing time
* `@returns {SampleDistribution}` with IQR of the testing times

## Ideas

* show the type returned by function and enforce that they stay the same
* use the more stable interquartiles (25%, 75%) range instead of average, errors, significance and all
* pooled tests to get a minimum of 40 ms per run to compensate for the 1ms timer rounding in browsers
* 13 samples per tests
* tests are interleaved (a,b,c, b,c,a, ...) 13 times
* works in node and in browsers
* results in ms are collected with the module `sample-distribution` for additional statistical info
* tests returning a `thenable` are treated as async

```javascript
import bench from '@hugov/bench.js'

console.log( bench({
  round() { let s=1; for(let i=0; i<n; ++i) s += Math.round(i * Math.random()); return s },
  floor() { let s=1; for(let i=0; i<n; ++i) s += Math.floor(i * Math.random()); return s },
  BgInt() { let s=1n;for(let i=0; i<n; ++i) s += BigInt(Math.floor(i * Math.random())); return s },
  async() { let s=1; for(let i=0; i<n; ++i) s += i * Math.random(); return Promise.resolve(s) },
}) )
/*
{
  round: D { Q1: 1.30807211550955, Q3: 1.39486153824971 },
  floor: D { Q1: 0.64940769225358, Q3: 0.69745576911820 },
  BgInt: D { Q1: 4.29924519202457, Q3: 4.40980865390828 },
  async: D { Q1: 0.66251730761275, Q3: 0.69817403804224 }
}
*/
```
