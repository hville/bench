import bench from './main.js'

async function test(testrunner, label, tests) {
	let t = performance.now()
	const r = await testrunner(tests)
	t = performance.now() - t
	console.log(label, t)
	for (const k in r) console.log(k, r[k])
}

const n = 1e5
test(bench,  'bench 1e5',{
	round() { let s=1; for(let i=0; i<n; ++i) s += Math.round(i * Math.random()); return s },
	floor() { let s=1; for(let i=0; i<n; ++i) s += Math.floor(i * Math.random()); return s },
	BgInt() { let s=1n;for(let i=0; i<n; ++i) s += BigInt(Math.floor(i * Math.random())); return s },
	async() { let s=1; for(let i=0; i<n; ++i) s += i * Math.random(); return Promise.resolve(s) },
})
test(bench,  'bench',{
	ob1() { const o={a:0,b:1}; o.a.delete; return o},
	ob2() { const o={}; o.a=0; o.b=1; o.a.delete; return o},
	nul() { const o=Object.create(null); o.a=0; o.b=1; o.a.delete; return o},
	map() { const m=new Map; m.set('a',0); m.set('b',1); m.delete('a'); return m},
	ob_() { const o={a:0,b:1}; o.a.delete; return Promise.resolve(o)},
})

