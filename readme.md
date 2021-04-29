# @hugov/bench

* `@param {Object<function>}` tests with names
* `@param {number} [sec=1]` target testing time
* `@returns {SampleDistribution}` with IQR of the testing times

## Ideas

* show the type returned by function and enforce that they stay the same
* use the more stable interquartiles (25%, 50%) range instead of average, errors, significance and all
* tests are looped to get a minimum of 10 ms per run
* tests are time-based with a minimum of 10 runs
* tests are interleaved (a,b,c, b,c,a, ...)
* works in node and in browsers
* minimal API
* results are collected with the module `sample-distribution` - distribution of results also available

```javascript
import bench from './bench.js'

console.log( bench({
  a() { let s=1; for(let i=0; i<1e6; ++i) s += Math.round(i * Math.random()); return s },
  b() { let s=1; for(let i=0; i<1e6; ++i) s += Math.floor(i * Math.random()); return s },
  c() { let s=1n;for(let i=0; i<1e6; ++i) s += BigInt(Math.floor(i * Math.random())); return s },
}) )

/*
{
  a: D { IQR: [ 1.3379999995231628, 1.396824998781085 ], type: 'number' },
  b: D { IQR: [ 0.7609437499195337, 0.7933312505483627 ], type: 'number' },
  c: D { IQR: [ 4.723337499424815, 5.021324999630451 ], type: 'bigint' }
}
*/
```
