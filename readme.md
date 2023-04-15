# @hugov/bench

* `@param {Object<function>}` tests with names
* `@param {number} [POOL_MS=50*minMS]` nominal duration of each pooled sample to compensate for system precision rounding
* `@param {number} [Q1_PAD=3]` dropped min & max sample at each tail
* `@returns {Array}` IQR of the test ops/sec (Hz)

## Ideas

* pooled tests to get a minimum ms per run to compensate for the 1ms timer rounding in browsers
* use the more stable quartiles (25%, 50%, 75%) instead of averages, errors, significance, tests and all (median of means)
* tests are interleaved (a,b,c, b,c,a, ...) `4*Q1_PAD+1` times *(default 13 times)*
* use the type returned by function and enforce that they stay the same
* 1 initiation + `4*Q1_PAD+1` samples per tests
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
round: [ 687.4248132388417, 711.5974570795415, 735.2896122182034 ],
floor: [ 1387.5900040353163, 1494.2277338460472, 1521.2109724349912 ],
BgInt: [ 216.59789689855094, 229.64529369942758, 238.51599686383554 ],
async: [ 1456.8066804053635, 1486.2027712494223, 1560.606028547393 ]
*/
```
