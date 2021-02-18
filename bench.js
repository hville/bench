import D from 'sample-distribution'
const P = typeof performance !== 'undefined' ? performance : {now() {
	const hr = process.hrtime()
	return hr[0]*1e6 + hr[1]/1000
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
				msEACH = sec * 1e6 / keys.length,
				time = {}
	for (const key of keys) time[key] = run(tests[key], msEACH, before, after)
	return time
}

function run(test, msEACH, before, after) {
	const sums = {},
				stat = new D(21) // empirical distribution with 20 intervals, arbitrary size/precision compromise
	let	i = 0,
			msSUM = 0,
			val
	while (msEACH > 0 && i<9) { //9 runs give nice IQR at i=2,4,6
		msEACH += P.now()
		before?.(i)

		let ms = -P.now()
		val = test()
		ms += P.now()
		stat.push( ms/1000 )

		after?.(i++, val)
		const kin = Object.prototype.toString.call(val).slice(8,-1)
		sums[kin] = ( sums[kin] ?? 0 ) + 1
		msEACH -= P.now()
	}
	return Object.assign(stat, {
		msIQR: [.25, .5, .75].map( v => Math.round(stat.Q(v)) ),
		msSUM: Math.round(stat.E*stat.N),
		...sums
	})
}
