import bench from './main.js'

const n = 1e5
console.log(bench({
	a() { let s=1; for(let i=0; i<n; ++i) s += Math.round(i * Math.random()); return s },
	b() { let s=1; for(let i=0; i<n; ++i) s += Math.floor(i * Math.random()); return s },
	c() { let s=1n;for(let i=0; i<n; ++i) s += BigInt(Math.floor(i * Math.random())); return s },
}))

console.log(bench({
	obj() { const o={a:0,b:1}; o.a.delete; return o},
	nul() { const o=Object.create(null); o.a=0; o.b=1; o.a.delete; return o},
	map() { const m=new Map; m.set('a',0); m.set('b',1); m.delete('a'); return m},
}))

