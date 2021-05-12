import D from 'sample-distribution'

/* const P = typeof performance !== 'undefined' ? performance : {now() {
	const hr = process.hrtime()
	return hr[0]*1000 + hr[1]/1_000_000
}}
 */
const MIN_MS = 10,
			MIN_SAMPLES = 10
/**
 * @param {Object<function>} tests with names
 * @param {number} [sec=1] target testing time
 * @returns {SampleDistribution} with IQR of the testing times, total time and count by return types
 */
export default function(tests, sec=1) {
	const keys = Object.keys(tests),
				kins = Object.fromEntries(keys.map( k => [k, typeof tests[k]()] )),
				reps = keys.map( k=> minRuns(tests[k], MIN_MS, kins[k]) ),
				size = Math.round( reps.reduce( (r,o) => r + o.n, 0 ) / reps.length ),
				time = size * reps.reduce( (f,o) => f+o.t/o.n, 0 ),
				freq = {}
	let take = Math.ceil( Math.max(MIN_SAMPLES, sec * 1e3 / time) )
	for (const k of keys) {
		freq[k] = new D(take)
		freq[k].IQR = null
		freq[k].type = kins[k]
	}
	while(take--) {
		for (const k of keys) {
			const ms = timeRuns(tests[k], size, kins[k])
			if (ms === Infinity) freq[k].error = true
			else freq[k].push( 1000*ms/size ) //all results in nanoseconds
		}
		keys.push(keys.shift()) //rotate in case it makes a difference
	}
	for (const k of keys) freq[k].IQR = [.25, .75].map( p => freq[k].Q(p) )
	return freq
}
function timeRuns(fcn, n, k) {
	const t0 = performance.now()
	while(n--) if (typeof fcn() !== k) return Infinity //minor check and use of the result
	return performance.now() - t0
}
function minRuns(fcn, ms, k) {
	let n = 1,
			t = 0
	while ( ms > (t=timeRuns(fcn, n, k)) ) n *= 2
	return {n, t}
}
