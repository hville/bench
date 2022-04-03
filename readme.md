# @hugov/bench

* `@param {Object<function>}` tests with names
* `@returns {Array}` IQR of the test ops/sec (Hz)

## Ideas

* show the type returned by function and enforce that they stay the same
* pooled tests to get a minimum of 100 ms per run to compensate for the 1ms timer rounding in browsers
* use the more stable interquartiles (25%, 75%) range instead of average, errors, significance and all (IQR of means)
* 2 initiation + 13 samples per tests
* tests are interleaved (a,b,c, b,c,a, ...) 13 times
* works in node and in browsers
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
  round [ 698.2115811027405, 728.5266761717111 ]
  floor [ 1359.9237112740352, 1451.3105333209317 ]
  BgInt [ 208.47643228500698, 229.22407644875574 ]
  async [ 1404.675757736992, 1512.2598554846109 ]
}
*/
```
