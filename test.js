import bench from './main.js'

async function test(testrunner, label, tests) {
	let t = performance.now()
	const r = await testrunner(tests)
	t = performance.now() - t
	console.log('TEST', label.padEnd(20), 'durationMS', t.toFixed(2))
	for (const k in r) console.log(k.padEnd(15), r[k].map(v => v.toPrecision(4)))
}

const n = 1e6
test(bench,  `readme example`,{
	round: i => Math.round(i+0.5),
	floor: i => Math.floor(i+0.5),
	BgInt: i => BigInt(i),
	async: i => Promise.resolve(i),
})
test(bench,  `slow ${n.toExponential(0)}`,{
	round() { let s=1; for(let i=0; i<n; ++i) s += Math.round(i * Math.random()); return s },
	floor() { let s=1; for(let i=0; i<n; ++i) s += Math.floor(i * Math.random()); return s },
	BgInt() { let s=1n;for(let i=0; i<n; ++i) s += BigInt(Math.floor(i * Math.random())); return s },
	async() { let s=1; for(let i=0; i<n; ++i) s += i * Math.random(); return Promise.resolve(s) },
})
test(bench,  'async',{
	constUndefined() { return Promise.resolve() },
	constNull() { return Promise.resolve(null) },
	const1() { return Promise.resolve(1) },
	constObject() { return Promise.resolve({}) },
	constArray() { return Promise.resolve({}) },
	constRandom() { return Promise.resolve(Math.random()) }
})
test(bench,  'cast',{
	ob1(k) { const o={a:0,b:k}; o.a.delete; return o},
	ob2(k) { const o={}; o.a=0; o.b=k; o.a.delete; return o},
	nul(k) { const o=Object.create(null); o.a=0; o.b=k; o.a.delete; return o},
	map(k) { const m=new Map; m.set('a',0); m.set('b',k); m.delete('a'); return m},
	ob_(k) { const o={a:0,b:k}; o.a.delete; return Promise.resolve(o)},
})
test(bench,  'constants',{
	constUndefined() { return },
	constNull() { return null },
	constNumber() { return 1 },
	constObject() { return {} }
})
test(bench,  'constants',{
	constUndefined() { return },
	constNull() { return null },
	constNumber() { return 1 },
	constObject() { return {} }
})
