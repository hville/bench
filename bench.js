import D from 'sample-distribution'
const P = typeof performance !== 'undefined' ? performance : {now() {
	const hr = process.hrtime()
	return hr[0]*1000 + hr[1]/1_000_000
}}

/**
 * @param {Object<function>} tests with names
 * @param {number} [sec=1] target testing time
 * @param {before} before each run
 * @param {after} after each run
 * @returns {SampleDistribution} with IQR of the testing times, total time and count by return types
 */
export default function(tests, sec=1, before, after) {
	const keys = Object.keys(tests),
				time = {},
				m = keys.length
	let msALL = sec * 1e3,
			i=0
	for (const key of keys) {
		time[key] = new D(21) // empirical distribution with 20 intervals, arbitrary size/precision compromise
		time[key].IQR = null
	}
	while (msALL > 0 && i<9) { //min 9 runs give nice IQR at i=2,4,6
		before?.(i)
		for (let j=0; j<m; ++j) {
			const key = keys[ (j+i)%m ], //rotation so that the order changes
						tst = tests[key],
						res = time[key]
			let ms = -P.now()
			let val = tst()
			ms += P.now()
			time[key].push( ms )
			msALL -= ms
			const kin = Object.prototype.toString.call(val).slice(8,-1)
			res[kin] = ( res[kin] ?? 0 ) + 1
		}
		after?.(i++, val)
	}
	for (const key of Object.keys(tests)) {
		const res = time[key]
		res.IQR = [.25, .5, .75].map( p => Math.round(res.Q(p)) )
	}
	return time
}
