import bench from './main.js'

async function test(testrunner, label, tests) {
	let t = performance.now()
	const r = await testrunner(tests)
	t = performance.now() - t
	console.log('TEST', label.padEnd(20), 'durationMS', t.toFixed(2))
	for (const k in r) console.log(k.padEnd(15), r[k].map(v => v.toPrecision(4)))
}

const n = 1e6
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
	ob1() { const o={a:0,b:1}; o.a.delete; return o},
	ob2() { const o={}; o.a=0; o.b=1; o.a.delete; return o},
	nul() { const o=Object.create(null); o.a=0; o.b=1; o.a.delete; return o},
	map() { const m=new Map; m.set('a',0); m.set('b',1); m.delete('a'); return m},
	ob_() { const o={a:0,b:1}; o.a.delete; return Promise.resolve(o)},
})
test(bench,  'constants',{
	constUndefined() { return },
	constNull() { return null },
	constNumber() { return 1 },
	constObject() { return {} }
})
