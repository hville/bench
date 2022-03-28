import bench from './main.js'

const n = 1e5
async function test(testrunner, tests) {
	let t = performance.now()
	const r = await testrunner(tests)
	t = performance.now() - t
	console.log(t, r)
}

test(bench, {
	round() { let s=1; for(let i=0; i<n; ++i) s += Math.round(i * Math.random()); return s },
	floor() { let s=1; for(let i=0; i<n; ++i) s += Math.floor(i * Math.random()); return s },
	BgInt() { let s=1n;for(let i=0; i<n; ++i) s += BigInt(Math.floor(i * Math.random())); return s },
	async() { let s=1; for(let i=0; i<n; ++i) s += i * Math.random(); return Promise.resolve(s) },
})
test(bench, {
	ob1() { const o={a:0,b:1}; o.a.delete; return o},
	nul() { const o=Object.create(null); o.a=0; o.b=1; o.a.delete; return o},
	map() { const m=new Map; m.set('a',0); m.set('b',1); m.delete('a'); return m},
	ob_() { const o={a:0,b:1}; o.a.delete; return Promise.resolve(o)},
})

