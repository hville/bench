# @hugov/bench

* `@param {Object<number=>any>}` tests with names
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
* each test function is run with a counter 0..n as argument

```javascript
import bench from '@hugov/bench.js'

console.log( bench({
  round: i => Math.round(i+0.5),
  floor: i => Math.floor(i+0.5),
  BgInt: i => BigInt(i),
  async: i => Promise.resolve(i),
}) ) /* RESULT EXAMPLE:
round           [ '5.517e+7', '2.029e+8', '2.036e+8' ]
floor           [ '5.745e+7', '2.142e+8', '2.263e+8' ]
BgInt           [ '2.918e+7', '3.844e+7', '5.007e+7' ]
async           [ '132.8', '139.5', '143.0' ]
*/
```
