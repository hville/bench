import bench from './bench.js'

const results = bench({
	a() { let s=1; for(let i=0; i<1e6; ++i) s += Math.round(i * Math.random()); return s },
	b() { let s=1; for(let i=0; i<1e6; ++i) s += Math.floor(i * Math.random()); return s },
	c() { let s=1n;for(let i=0; i<1e6; ++i) s += BigInt(Math.floor(i * Math.random())); return s },
})
console.log(results)
console.log(results.a.V)

function round() {
	let s=1; for(let i=0; i<1e6; ++i) s += Math.round(i * Math.random())
	return s
}
console.log(bench({
	a: round,
	b: round,
	c: round
}))
