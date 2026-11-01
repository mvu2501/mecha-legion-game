// Frequency and payout simulation of the base game (chain wins). Usage: node qa/sim.js
// Copy of the pay table and weights from public/mecha-legion/game/index.html (SYM). Update both if you change symbols.
const SYM={pin:{w:18,pay:[.2,.5,1.2]},banh:{w:18,pay:[.2,.5,1.2]},mu:{w:16,pay:[.25,.6,1.5]},ten:{w:14,pay:[.3,.8,2]},chip:{w:14,pay:[.4,1,2.5]},long:{w:4,pay:[1.5,5,15]},lan:{w:5,pay:[1,3,10]},quy:{w:6,pay:[.8,2.5,8]},phung:{w:7,pay:[.6,2,6]},wild:{w:3,pay:null},scatter:{w:3,pay:null}};
const POOL=[];Object.keys(SYM).forEach(k=>{for(let i=0;i<SYM[k].w;i++)POOL.push(k)});
const rnd=a=>a[Math.floor(Math.random()*a.length)];
function ev(g){const hit=new Set();let total=0;Object.keys(SYM).forEach(k=>{if(k==='wild'||k==='scatter')return;let ways=1,n=0,cells=[];for(let r=0;r<5;r++){let cnt=0;for(let row=0;row<3;row++){const s=g[row*5+r];if(s===k||s==='wild'){cnt++;cells.push(row*5+r)}}if(!cnt)break;ways*=cnt;n++}if(n>=3){total+=SYM[k].pay[n-3]*ways*.4;cells.forEach(i=>hit.add(i))}});return{total,hit}}
const N=300000,dist={};let rtp=0,rtpOld=0;
for(let t=0;t<N;t++){let g=Array.from({length:15},()=>rnd(POOL));let links=0,tot=0;for(;;){const e=ev(g);if(e.total<=0)break;links++;tot+=e.total*links;if(links===1)rtpOld+=e.total;const ng=g.slice();for(let c=0;c<5;c++){const keep=[];let mr=-1;for(let r=0;r<3;r++){const i=r*5+c;if(e.hit.has(i))mr=r;else keep.push(g[i])}if(mr<0)continue;const add=[];for(let n=3-keep.length;n>0;n--)add.push(rnd(POOL));const col=add.concat(keep);for(let r=0;r<=mr;r++)ng[r*5+c]=col[r]}g=ng;if(links>40)break}
dist[links]=(dist[links]||0)+1;rtp+=tot}
console.log('spins',N,'RTP(chain, x bet):',(rtp/N).toFixed(3),' single-win RTP before:',(rtpOld/N).toFixed(3));
let cum=0;Object.keys(dist).map(Number).sort((a,b)=>b-a).forEach(k=>{cum+=dist[k];if(k>=1&&k<=9||k>9)console.log('links>=',k,':',(cum/N*100).toFixed(3)+'%','(1 in',Math.round(N/cum),')')});
