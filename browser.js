import D from 'sample-distribution'

//TODO constant pool size means that a very slow function will run too long and a fast one not long enough

const SAMPLES = 13 // min for IQR
/**
 * @param {Object<function>} tests object with test names as keys
 * @param {number} [sec=2] target total testing time
 * @returns {SampleDistribution} with IQR of the testing times, total time and count by return types
 */
export default async function(tests, msPerBatch=40) { // 40ms to compensate for the 1ms rounding in browsers
	const testNames = Object.keys(tests),
				testTypes = {},
				testTimes = {},
				testSyncs = {}

	// initiation
	let poolSize = 0
	for (const k of testNames) {
		testTimes[k] = new D(SAMPLES)
		const result = tests[k]()
		testSyncs[k] = !result?.then
		testTypes[k] = typeof await result
		poolSize += testSyncs[k] ? getPool(tests[k], testTypes[k], msPerBatch) : await getPool_(tests[k], testTypes[k], msPerBatch)
	}
	poolSize = Math.round( poolSize / testNames.length )

	// benchmark by batch with rotations
	let sampleSize = SAMPLES
	while(sampleSize--) {
		for (const k of testNames) {
			const ms = testSyncs[k] ? timeRuns(tests[k], poolSize, testTypes[k]) : await timeRuns_(tests[k], poolSize, testTypes[k])
			if (ms === Infinity) testTimes[k].error = 'wrong return type'
			else testTimes[k].push( ms/poolSize )
		}
		//rotate order of tests
		testNames.push(testNames.shift())
	}

	for (const k of testNames) {
		testTimes[k].Q1 = testTimes[k].Q(.25)
		testTimes[k].Q3 = testTimes[k].Q(.75)
	}
	return testTimes
}

function timeRuns(fcn, n, k) {
	const t0 = performance.now()
	while(n--) if (typeof fcn() !== k) return Infinity //minor check and use of the result
	return performance.now() - t0
}
async function timeRuns_(fcn, n, k) {
	const t0 = performance.now()
	while(n--) if (typeof await fcn() !== k) return Infinity //minor check and use of the result
	return performance.now() - t0
}
function getPool(testFunction, testType, msPerBatch) {
	let n = 1,
			t = timeRuns(testFunction, n, testType)
	while ( msPerBatch > t ) t += timeRuns(testFunction, n *= 2, testType)
	return 2*n - 1 //sum of n + n/2 + n/4 + ... + 1
}
async function getPool_(testFunction, testType, msPerBatch) {
	let n = 1,
			t = await timeRuns_(testFunction, n, testType)
	while ( msPerBatch > t ) t += await timeRuns_(testFunction, n *= 2, testType)
	return 2*n - 1 //sum of n + n/2 + n/4 + ... + 1
}
