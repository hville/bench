# @hugov/bench

* `@param {Object<function>}` tests with names
* `@param {number} [sec=1]` target testing time
* `@param {before} before` each run
* `@param {after} after` each run
* `@returns {SampleDistribution}` with IQR of the testing times, total time and count by return types

## Ideas

* show the count by result types to easily spot `null`, `undefined`, `NaN` or other expected and unexpected result types
* use the more stable median (50%) and interquartiles (25%, 50%) instead of average, errors, significance and all
* tests are time-based with a minimum of 9 runs
* tests are interleaved (a,b,c,a,b,c)
* works in node and in browsers
* minimal API
* results are collected with the module `sample-distribution`
  * allows to generate all other stats without keeping millions of samples

```javascript
import bench from './bench.js'

console.log( bench({
  a() { let s=1; for(let i=0; i<1e6; ++i) s += Math.round(i * Math.random()); return s },
  b() { let s=1; for(let i=0; i<1e6; ++i) s += Math.floor(i * Math.random()); return s },
  c() { let s=1n;for(let i=0; i<1e6; ++i) s += BigInt(Math.floor(i * Math.random())); return s },
}) )

/*
{
  a: D { IQR: [ 13, 13, 14 ], number: 17 },
  b: D { IQR: [ 6, 6, 7 ], number: 17 },
  c: D { IQR: [ 41, 42, 43 ], bigint: 17 }
}
*/
```
