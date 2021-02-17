import bench from './bench.js'

console.log( bench({
	a() { let s=1; for(let i=0; i<1e6; ++i) s += Math.round(i * Math.random()); return s },
	b() { let s=1; for(let i=0; i<1e6; ++i) s += Math.floor(i * Math.random()); return s },
	c() { let s=1n;for(let i=0; i<1e6; ++i) s += BigInt(Math.floor(i * Math.random())); return s },
}) )
