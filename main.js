/**
 * @param {Object<function>} tests object with test names as keys
 * @param {number} [POOL_MS] nominal duration of each sample pool to compensate security rounding (0.1ms chrome/edge, 1ms firefox)
 * @param {number} [Q1_PAD] dropped min & max sample at each tail
 * @returns {Array} Hz IQR of the testing times with .means property containing all results
 */
export default async function(tests, POOL_MS = getMinMS() * 50, Q1_PAD=3) {
	const testNames = Object.keys(tests),
				POOLQTY = 4*Q1_PAD + 1,
				testdata = {}

	// initiation
	for (const k of testNames) {
		const sample_ = tests[k]()
		testdata[k] = {
			test: tests[k],
			type: typeof await sample_,
			pool: 1,
			means: [],
			get_ms: sample_?.then ? get_ms_async : get_ms_sync
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

async function run(data, POOL_MS) {
	if (!data.error) {
		const ms = await data.get_ms(data.test, data.pool, data.type)
		if (ms === Infinity) data.error = 'inconsistent return type'
		else if (ms > 0) {
			data.means.push(1000 * data.pool/ms) // hz sample
			data.pool = Math.ceil( data.pool*POOL_MS/ms ) // adjust pool size to the target ms
		}
		else if ((data.pool *= 2) >= Number.MAX_SAFE_INTEGER) data.error = 'test function too fast'
		else run(data, POOL_MS)
	}
}

function getMinMS (r = performance.now(), t=r) {
	while(t <= r) t = performance.now()
	return t-r
}
function get_ms_sync(fcn, n, type) {
	const t0 = performance.now()
	while(n--) if (typeof fcn() !== type) return Infinity //minor check and use of the result
	return Promise.resolve(performance.now() - t0)
}
async function get_ms_async(fcn, n, type) {
	const t0 = performance.now()
	while(n--) if (typeof await fcn() !== type) return Infinity //minor check and use of the result
	return performance.now() - t0
}
