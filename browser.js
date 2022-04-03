const Q1_PAD = 3, //droped samples before Q1
			POOLQTY = 4*Q1_PAD + 1,
			POOL_MS = 100 // to compensate for the 1ms rounding in browsers

/**
 * @param {Object<function>} tests object with test names as keys
 * @param {number} [sec=2] target total testing time
 * @returns {SampleDistribution} with IQR of the testing times, total time and count by return types
 */
export default async function(tests) {
	const testNames = Object.keys(tests),
				results = {}

	// initiation
	for (const k of testNames) {
		const sample_ = tests[k]()
		results[k] = Object.defineProperties([], {
			type: {value: typeof await sample_}, //TODO src
			pool: {value: 1, writable:true},     //TODO src
			means: {value: []},                  //TODO tgt
			get_ms: {value: sample_.then ? get_ms_ : get_ms} //TODO src
		})
		await run(tests[k], results[k]) // first pool size
	}

	// benchmark by batch with rotations
	for (let i=0; i<POOLQTY; ++i) {
		for (const k of testNames) await run(tests[k], results[k])
		//rotate order of tests
		testNames.push(testNames.shift())
	}

	for (const res of Object.values(results)) if (!res.error) {
		res.means.sort( (a,b) => a-b )
		res[0] = res.means[Q1_PAD]
		res[1] = res.means[3*Q1_PAD]
	}
	return results
}

function get_ms(fcn, n, type) {
	const t0 = performance.now()
	while(n--) if (typeof fcn() !== type) return Infinity //minor check and use of the result
	return performance.now() - t0
}
async function get_ms_(fcn, n, type) {
	const t0 = performance.now()
	while(n--) if (typeof await fcn() !== type) return Infinity //minor check and use of the result
	return performance.now() - t0
}
async function run(test, result) {
	if (!result.error) {
		const ms = await result.get_ms(test, result.pool, result.type)
		if (ms === Infinity) result.error = 'inconsistent return type'
		else if (ms === 0) {
			result.pool *= 2
			run(test, result)
		}
		else {
			result.means.push(1000 * result.pool/ms)
			result.pool = Math.ceil( result.pool*(POOL_MS/ms + 1)/2 )
		}
	}
}
