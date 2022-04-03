/**
 * @param {Object<function>} tests object with test names as keys
 * @param {number} [POOL_MS] nominal duration of each pooled sample to compensate for the 1ms rounding in browsers
 * @param {number} [Q1_PAD] dropped min & max sample at each tail
 * @returns {Array} Hz IQR of the testing times with .means property containing all results
 */
export default async function(tests, POOL_MS=50, Q1_PAD=3) {
	const testNames = Object.keys(tests),
				POOLQTY = 3*Q1_PAD + 1,
				testdata = {}

	// initiation
	for (const k of testNames) {
		const sample_ = tests[k]()
		testdata[k] = {
			test: tests[k],
			type: typeof await sample_,
			pool: 1,
			means: [],
			get_ms: sample_.then ? get_ms_ : get_ms
		}
		await run(testdata[k], POOL_MS) // first pool size
		testdata[k].means.length = 0 //flush first sample
	}

	// benchmark by batch with rotations
	for (let i=0; i<POOLQTY; ++i) {
		for (const k of testNames) await run(testdata[k], POOL_MS)
		//rotate order of tests
		testNames.push(testNames.shift())
	}

	const results = {}
	for (const k in testdata) {
		if (testdata[k].error) results[k] = testdata[k].error
		else {
			const means = testdata[k].means.sort( (a,b) => a-b )
			results[k] = [means[Q1_PAD], means[2*Q1_PAD], means[3*Q1_PAD]]
		}
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
async function run(data, POOL_MS) {
	if (!data.error) {
		const ms = await data.get_ms(data.test, data.pool, data.type)
		if (ms === Infinity) data.error = 'inconsistent return type'
		else if (ms > 0) {
			data.means.push(1000 * data.pool/ms)
			data.pool = Math.ceil( data.pool*POOL_MS/ms )
		}
		else {
			data.pool *= 2
			run(data, POOL_MS)
		}
	}
}
