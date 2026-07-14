/* =====================================================================
   ELEMENTARY — art.js. Procedural SVG in the Strand Magazine idiom:
   Sidney Paget's pen-and-ink steel engraving. Cross-hatched shadow,
   gaslight and fog, ink silhouette on a smoke-dark ground, and one
   blood-crimson accent kept for blood and danger. Generated stills, when
   they exist, are preferred; this is the ever-present fallback.
   ===================================================================== */
const ART = (() => {
const W=900, H=520;
function rng(s){ let h=1779033703^String(s).length;
  for(let i=0;i<String(s).length;i++){h=Math.imul(h^String(s).charCodeAt(i),3432918353);h=h<<13|h>>>19;}
  return function(){h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);
    return ((h^=h>>>16)>>>0)/4294967296;};}
const G=(id,st)=>`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">`+st.map(s=>`<stop offset="${s[0]}" stop-color="${s[1]}"/>`).join('')+`</linearGradient>`;
const RG=(id,st)=>`<radialGradient id="${id}">`+st.map(s=>`<stop offset="${s[0]}" stop-color="${s[1]}" stop-opacity="${s[2]!==undefined?s[2]:1}"/>`).join('')+`</radialGradient>`;
const rect=(x,y,w,h,f,o)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"${o!==undefined?` opacity="${o}"`:''}/>`;
const circ=(x,y,r,f,o)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"${o!==undefined?` opacity="${o}"`:''}/>`;
const path=(d,f,o,x)=>`<path d="${d}" fill="${f}"${o!==undefined?` opacity="${o}"`:''}${x||''}/>`;
const line=(x1,y1,x2,y2,c,w,o)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w||1}"${o!==undefined?` opacity="${o}"`:''}/>`;

const INK='#0b0d0c', INK2='#171b19', LINE='#39423b', FOG='#2b332e', PAPER='#c9c2ad',
      AMBER='#d9a441', AMBER2='#8a5a1e', CRIM='#c0392b', BONE='#e9e3d2', MID='#4c554d';

/* cross-hatch shading over a rect, engraving-style */
function hatch(x,y,w,h,ang,sp,c=LINE,o=.35){ let s=`<g opacity="${o}">`;
  const rad=ang*Math.PI/180, len=Math.hypot(w,h);
  for(let d=-len;d<len;d+=sp){ const x1=x+d, y1=y, x2=x+d+Math.cos(rad)*h, y2=y+h;
    s+=`<line x1="${x1.toFixed(1)}" y1="${y1}" x2="${x2.toFixed(1)}" y2="${y2}" stroke="${c}" stroke-width=".8"/>`; }
  return s+`</g>`; }
/* fog bands: soft horizontal strokes */
function fog(r,y,h,c=FOG,o=.5){ let s=''; const rows=Math.max(3,Math.floor(h/26));
  for(let i=0;i<rows;i++){ const yy=y+i*(h/rows)+r()*6; let d='';
    for(let x=-40;x<W+40;x+=90) d+=`M${x},${yy} q45,${-8-r()*8} 90,0 `;
    s+=`<g opacity="${(o-i*.04).toFixed(2)}"><path d="${d}" stroke="${c}" stroke-width="${10-i}" fill="none" stroke-linecap="round"><animateTransform attributeName="transform" type="translate" values="0,0;${30+i*8},0;0,0" dur="${16+i*4}s" repeatCount="indefinite"/></path></g>`; }
  return s; }
/* a gas-lamp / hearth glow */
function glow(x,y,r0,c=AMBER,o=.8){ return RG('gl'+Math.round(x)+Math.round(y),[[0,c,o],[.6,c,o*.4],[1,'#000',0]])
  +circ(x,y,r0*2.4,`url(#gl${Math.round(x)}${Math.round(y)})`); }
/* the Strand plate frame: a thin double rule with corner ticks */
function frame(){ let s=`<rect x="16" y="16" width="${W-32}" height="${H-32}" fill="none" stroke="${INK}" stroke-width="6" opacity=".55"/>`;
  s+=`<rect x="24" y="24" width="${W-48}" height="${H-48}" fill="none" stroke="${MID}" stroke-width="1" opacity=".5"/>`;
  return s; }
/* a caped, deer-stalkered silhouette — the north star */
function holmes(x,y,s=1,c=INK){ return `<g transform="translate(${x},${y}) scale(${s})">`+
  path(`M0,0 q-16,-6 -18,-40 q-2,-30 6,-54 q-8,-10 -2,-22 q4,-9 14,-9 q10,0 14,9 q6,12 -2,22 q8,24 6,54 q-2,34 -18,40 z`,c)
  /* deerstalker */
  +path(`M-16,-118 q16,-14 32,0 q4,4 0,8 l-32,0 q-4,-4 0,-8 z`,c)
  +path(`M-20,-114 l-6,-4 M20,-114 l6,-4`,'none',1,` stroke="${c}" stroke-width="3"`)
  +`</g>`; }
/* a plainer figure (Watson, a client, a constable) */
function figure(x,y,s=1,c=INK2){ return `<g transform="translate(${x},${y}) scale(${s})">`+
  path(`M0,0 q-13,-4 -15,-34 q-2,-24 5,-44 q-7,-8 -2,-18 q4,-7 12,-7 q8,0 12,7 q5,10 -2,18 q7,20 5,44 q-2,30 -15,34 z`,c)
  +circ(0,-108,11,c)+`</g>`; }

const P={
title(r){ return G('t',[[0,'#0a0c0d'],[.5,'#14181a'],[1,'#0c0f10']])+rect(0,0,W,H,'url(#t)')
  +fog(r,300,220,'#20282a',.5)
  /* a gas-lamp post in fog */
  +line(700,120,700,430,INK,10)+path(`M676,120 q24,-26 48,0 l-6,26 l-36,0 z`,INK2)
  +glow(700,132,44,AMBER,.85)+circ(700,132,15,'#f0d99a',.9)
  +hatch(0,330,W,190,24,16,INK,.25)
  /* holmes, mid-stride, cape and stalker */
  +holmes(300,410,1.5,INK)
  +circ(300,300,0,'')/* spacer */
  /* the crimson magnifier ring accent */
  +circ(516,300,30,'none',1).replace('/>',` stroke="${CRIM}" stroke-width="4"/>`)
  +line(536,320,566,350,CRIM,5)
  +frame(); },
bakerst(r){ return G('bk',[[0,'#171310'],[.5,'#241a12'],[1,'#1a120c']])+rect(0,0,W,H,'url(#bk)')
  /* the fireplace glow, the warm room */
  +rect(120,300,220,180,INK)+rect(150,340,160,140,'#2a1a10')
  +glow(230,420,80,AMBER,.9)+path(`M210,470 q10,-40 20,-52 q4,-10 12,0 q10,14 8,52 z`,'#e8a94a',.9)
  +path(`M226,470 q4,-24 12,-32 q6,10 4,32 z`,'#f2d488',.9)
  +hatch(340,60,540,420,-22,18,INK,.22)
  /* window with sash panes, fog beyond */
  +rect(560,90,220,190,INK2)+rect(572,102,196,166,'#20282a')
  +line(670,102,670,268,INK,4)+line(572,185,768,185,INK,4)
  +fog(r,120,120,'#39433f',.4)
  /* Holmes in the armchair by the fire */
  +path(`M360,360 q-6,-40 40,-44 q60,-4 64,40 l4,88 l-112,0 z`,'#0e100f')/* chair */
  +holmes(414,352,1.05,INK)
  +frame(); },
crimescene(r){ return G('cs',[[0,'#101314'],[.5,'#181d1e'],[1,'#0e1112']])+rect(0,0,W,H,'url(#cs)')
  +hatch(0,0,W,H,20,20,INK,.25)
  /* a bare room, floorboards, a fallen figure */
  +path(`M0,340 L${W},300 L${W},${H} L0,${H} Z`,'#161a1b')
  +Array.from({length:10},(_,i)=>line(i*100,340-i*4,i*100+40,H,LINE,1,.4)).join('')
  +path(`M300,430 q40,-24 120,-16 q80,6 150,20 q-60,26 -150,24 q-90,-2 -120,-28 z`,INK)/* body sprawl */
  +figure(360,432,.7,INK).replace('scale(0.7)','scale(0.7) rotate(74)')
  /* the word RACHE in crimson on the wall */
  +rect(90,150,200,120,'#12100e',.5)
  +`<text x="120" y="240" font-family="Georgia,serif" font-size="46" font-weight="700" fill="${CRIM}" opacity=".92" letter-spacing="4">RACHE</text>`
  +hatch(90,150,200,120,-30,10,CRIM,.12)
  +glow(150,110,40,AMBER,.5)
  +frame(); },
manor(r){ return G('mn',[[0,'#0e1112'],[.5,'#171b1a'],[1,'#10120f']])+rect(0,0,W,H,'url(#mn)')
  +fog(r,120,160,'#333d38',.45)
  /* a grey Palladian pile with a scaffolded wing */
  +path(`M120,300 L120,150 L460,80 L800,150 L800,300 Z`,'#181c1b')
  +rect(120,300,680,220,INK)
  +Array.from({length:7},(_,i)=>rect(170+i*88,200,40,100,'#0a0c0b')).join('')/* dark windows */
  +Array.from({length:7},(_,i)=>rect(170+i*88,200,40,100,'none',1)).map(s=>s.replace('/>',` stroke="${MID}" stroke-width="1.5"/>`)).join('')
  +path(`M420,300 l0,-60 l40,-26 l40,26 l0,60 z`,'#060807')/* doorway */
  /* scaffolding poles on the left wing */
  +Array.from({length:4},(_,i)=>line(130+i*26,120,130+i*26,300,MID,2,.7)).join('')
  +Array.from({length:4},(_,i)=>line(126,150+i*44,236,150+i*44,MID,2,.6)).join('')
  +hatch(0,300,W,220,26,22,INK,.3)
  +glow(440,250,26,AMBER,.5)
  +frame(); },
records(r){ return G('rc',[[0,'#14120d'],[.5,'#1e1a12'],[1,'#14110b']])+rect(0,0,W,H,'url(#rc)')
  +hatch(0,0,W,H,18,20,INK,.2)
  /* shelves of ledgers, a desk, a green-shaded lamp */
  +Array.from({length:4},(_,row)=>rect(80,90+row*74,560,54,'#0e0c08')+
     Array.from({length:16},(_,i)=>rect(90+i*34,94+row*74,26,46,i%3?'#3a2c1a':'#4a2018')).join('')).join('')
  +rect(60,80,600,320,'none',1).replace('/>',` stroke="${INK}" stroke-width="8"/>`)
  +rect(560,360,300,120,'#12100b')/* desk */
  +path(`M700,360 l0,-40 q0,-10 10,-10 q-6,8 0,16 l14,34 z`,AMBER2)/* lamp arm */
  +glow(714,318,40,'#8fae74',.7)+path(`M694,318 q20,-14 40,0 l-6,16 l-28,0 z`,'#2c3a24')
  +frame(); },
nightvigil(r){ return G('nv',[[0,'#080a0c'],[.6,'#0e1216'],[1,'#0a0d10']])+rect(0,0,W,H,'url(#nv)')
  +hatch(0,0,W,H,30,26,INK,.3)
  /* a dark bedroom; a thin candle; a bell-pull; the ventilator */
  +rect(120,120,220,300,'#0c0f11')/* bed head area */
  +path(`M300,140 l0,240`,'none',1,` stroke="${MID}" stroke-width="4"`)/* the bell-pull */
  +rect(280,110,44,24,'#0a0c0e').replace('/>',` stroke="${MID}" stroke-width="1.5"/>`)/* ventilator */
  +rect(140,360,360,60,INK)/* the bolted bed */
  +path(`M150,360 l0,-14 M486,360 l0,-14`,'none',1,` stroke="${LINE}" stroke-width="4"`)
  +glow(620,300,34,AMBER,.7)+line(620,300,620,360,'#f0d488',3)+circ(620,296,5,'#f2e0a0',.9)
  +holmes(700,420,1,INK)
  /* a crimson thread of danger from the vent */
  +path(`M302,122 q-6,120 -60,230`,'none',1,` stroke="${CRIM}" stroke-width="2.4" stroke-dasharray="5 6" opacity=".7"`)
  +frame(); },
alley(r){ return G('al',[[0,'#0e1113'],[.5,'#161a1c'],[1,'#0c0f10']])+rect(0,0,W,H,'url(#al)')
  +fog(r,240,220,'#333d40',.5)
  /* narrow shopfronts, a hanging sign, a hansom in the murk */
  +path(`M0,120 L360,120 L360,${H} L0,${H} Z`,'#12161a')
  +path(`M540,120 L${W},120 L${W},${H} L540,${H} Z`,'#12161a')
  +rect(150,180,80,60,'none',1).replace('/>',` stroke="${MID}" stroke-width="2"/>`)/* shop sign */
  +Array.from({length:3},(_,i)=>rect(600+i*90,220,60,120,'#0a0c0e')).join('')
  +glow(430,150,40,AMBER,.7)+line(430,120,430,170,INK,6)+circ(430,150,10,'#f0d99a',.85)
  /* a hansom cab silhouette */
  +`<g transform="translate(430,380)">`+path(`M-70,0 q0,-40 40,-44 l70,0 q30,4 30,44 z`,INK)+circ(-46,10,26,INK)+circ(60,10,26,INK)
  +circ(-46,10,10,'#0a0c0e')+circ(60,10,10,'#0a0c0e')+path(`M64,-30 l40,-14`,'none',1,` stroke="${INK}" stroke-width="4"`)+`</g>`
  +hatch(0,380,W,140,24,20,INK,.25)
  +frame(); },
station(r){ return G('sn',[[0,'#101314'],[.5,'#191d1f'],[1,'#0e1112']])+rect(0,0,W,H,'url(#sn)')
  +fog(r,120,180,'#39433f',.5)
  /* an iron-and-glass trainshed, a waiting figure, steam */
  +Array.from({length:6},(_,i)=>path(`M${80+i*130},420 L${80+i*130},140 Q${145+i*130},90 ${210+i*130},140 L${210+i*130},420`,'none',.6,` stroke="${MID}" stroke-width="3"`)).join('')
  +line(40,140,860,120,INK,6)
  +rect(0,410,W,110,INK)
  +path(`M300,360 q-60,-10 -80,60 l180,0 q-8,-56 -100,-60 z`,'#0c0e0d')/* engine hulk */
  +fog(r,300,120,'#4a544e',.4)
  +figure(560,420,.9,INK)
  +glow(150,180,30,AMBER,.5)
  +frame(); },
court(r){ return G('ct',[[0,'#12100c'],[.5,'#1c1811'],[1,'#12100b']])+rect(0,0,W,H,'url(#ct)')
  +hatch(0,0,W,H,-18,22,INK,.22)
  +Array.from({length:4},(_,i)=>rect(120+i*180,120,70,300,'#0e0c08')).join('')/* pillars */
  +Array.from({length:4},(_,i)=>rect(110+i*180,110,90,20,INK)).join('')
  +path(`M0,420 L${W},420 L${W},${H} L0,${H} Z`,INK)
  +rect(360,300,180,120,'#0a0806')/* the dock */
  +glow(450,240,30,AMBER,.5)
  +frame(); },
cottage(r){ return G('cg',[[0,'#101512'],[.5,'#182018'],[1,'#0e1310']])+rect(0,0,W,H,'url(#cg)')
  +fog(r,300,180,'#39473c',.4)
  /* a small cottage, one lit upper window, a face-pale square of light */
  +path(`M300,320 L300,200 L450,120 L600,200 L600,320 Z`,'#161c17')
  +path(`M300,200 L450,120 L600,200`,'none',1,` stroke="${INK}" stroke-width="8"`)
  +rect(300,320,300,120,INK)
  +rect(360,360,50,80,'#060807')/* door */
  +rect(420,220,60,50,'#f0d99a',.9)/* the yellow-lit window — the pale face */
  +hatch(420,220,60,50,0,7,AMBER2,.25)
  +glow(450,245,34,AMBER,.6)
  +frame(); },
cellar(r){ return G('cl',[[0,'#0a0c0c'],[.6,'#101414'],[1,'#0a0d0d']])+rect(0,0,W,H,'url(#cl)')
  +hatch(0,0,W,H,34,20,INK,.34)
  /* a brick vault, a hole in the floor, a lantern */
  +path(`M100,${H} L100,220 Q450,90 800,220 L800,${H} Z`,'#12100c')
  +Array.from({length:8},(_,row)=>Array.from({length:12},(_,i)=>rect(120+i*56+((row%2)*28),240+row*30,50,26,'none',1).replace('/>',` stroke="${LINE}" stroke-width="1" opacity=".4"/>`)).join('')).join('')
  +path(`M360,470 q90,-30 180,0 q-90,26 -180,0 z`,'#040606')/* the tunnel mouth */
  +glow(300,360,40,AMBER,.8)+path(`M286,360 q14,-20 28,0 l-4,22 l-20,0 z`,'#2a2012')+circ(300,352,7,'#f2d488',.9)
  +frame(); },
reichenbach(r){ return G('rb',[[0,'#0e1416'],[.5,'#16201f'],[1,'#0c1211']])+rect(0,0,W,H,'url(#rb)')
  /* the great falls: dark cliffs, a white torrent, spray */
  +path(`M0,0 L300,0 L340,${H} L0,${H} Z`,'#0a100f')
  +path(`M${W},0 L560,0 L520,${H} L${W},${H} Z`,'#0a100f')
  +hatch(0,0,340,H,80,14,INK,.4)+hatch(560,0,340,H,-80,14,INK,.4)
  +path(`M360,0 Q450,120 420,300 Q400,420 440,${H} L520,${H} Q470,400 500,240 Q520,120 500,0 Z`,'#dfe6e2',.85)
  +Array.from({length:14},(_,i)=>line(370+r()*130,i*38,360+r()*130,i*38+40,'#f4f7f4',1,.5)).join('')
  +fog(r,380,140,'#8fa0a0',.5)
  +holmes(210,300,1,INK)
  +frame(); },
sussex(r){ return G('sx',[[0,'#1a1c10'],[.45,'#2c3018'],[1,'#242812']])+rect(0,0,W,H,'url(#sx)')
  +glow(700,140,60,'#e8c96a',.85)+circ(700,140,34,'#f0d888',.5)
  /* the Downs, a warm evening; white hives in a row; bees */
  +path(`M0,340 Q220,300 460,330 Q680,356 900,320 L900,${H} L0,${H} Z`,'#3a3e1c')
  +hatch(0,340,W,180,10,24,'#5a5e2a',.3)
  +Array.from({length:4},(_,i)=>{const x=180+i*150,y=330+r()*10;
    return `<g transform="translate(${x},${y})">`+rect(-26,-46,52,46,PAPER)+rect(-30,-52,60,8,PAPER)
      +Array.from({length:3},(_,k)=>line(-26,-34+k*12,26,-34+k*12,MID,1.4,.6)).join('')+`</g>`;}).join('')
  +Array.from({length:16},(_,i)=>{const x=200+r()*520,y=140+r()*180;
    return `<g transform="translate(${x},${y})"><circle cx="0" cy="0" r="2.4" fill="#2a2410"/><path d="M-4,-3 q4,-4 8,0 M-4,3 q4,4 8,0" stroke="#2a2410" stroke-width=".8" fill="none" opacity=".7"/></g>`;}).join('')
  +holmes(150,430,1.1,'#20240f')
  +frame(); },
press(r){ return G('pr',[[0,'#14110c'],[.5,'#1f1910'],[1,'#131009']])+rect(0,0,W,H,'url(#pr)')
  +hatch(0,0,W,H,20,20,INK,.2)
  +rect(160,170,580,270,'#0d0b07')/* the press body */
  +Array.from({length:4},(_,i)=>`<circle cx="${250+i*160}" cy="235" r="36" fill="#171b19" stroke="${MID}" stroke-width="3"/><circle cx="${250+i*160}" cy="235" r="12" fill="${INK}"/>`).join('')/* rollers */
  +rect(220,300,470,18,'#2a2216')/* feed bar */
  +Array.from({length:6},(_,i)=>rect(250+i*72,318,54,96,'#d9d2bf',.82)+rect(250+i*72,318,54,96,'none',1).replace('/>',` stroke="#8a8268" stroke-width="1"/>`)).join('')/* printed sheets */
  +glow(450,140,42,AMBER,.6)
  +figure(770,430,.9,INK)
  +frame(); },
telegraph(r){ return G('tg',[[0,'#101413'],[.5,'#181e1d'],[1,'#0e1211']])+rect(0,0,W,H,'url(#tg)')
  +Array.from({length:8},(_,i)=>line(0,54+i*7,W,86+i*5,MID,1,.45)).join('')/* wires */
  +line(0,120,W,150,INK,4,.7)
  +rect(120,300,660,140,'#0e0c09')/* instrument bench */
  +Array.from({length:5},(_,i)=>{const x=180+i*130;
    return rect(x,300,86,54,'#171b19')+rect(x+30,286,26,16,INK)+`<circle cx="${x+43}" cy="330" r="9" fill="none" stroke="${AMBER2}" stroke-width="2"/>`;}).join('')/* telegraph keys */
  +glow(640,220,30,AMBER,.5)
  +figure(430,430,.9,INK)
  +frame(); },
bridge(r){ return G('bg',[[0,'#0a0e12'],[.5,'#10161c'],[1,'#0a0d10']])+rect(0,0,W,H,'url(#bg)')
  +fog(r,250,180,'#2a3640',.5)
  +rect(0,400,W,120,'#0a1014')/* the black water */
  +path(`M0,404 Q150,326 300,404 Q450,326 600,404 Q750,326 900,404 L900,446 L0,446 Z`,'#0c0f12')/* arches */
  +rect(0,378,W,14,INK)/* parapet */
  +Array.from({length:18},(_,i)=>line(i*52,392,i*52,378,MID,2,.5)).join('')/* balusters */
  +line(700,378,700,296,INK,6)+`<path d="M680,296 q20,-22 40,0 l-6,20 l-28,0 z" fill="${INK2}"/>`
  +glow(700,300,34,AMBER,.75)+circ(700,300,10,'#f0d99a',.9)
  +`<ellipse cx="700" cy="444" rx="7" ry="44" fill="${AMBER}" opacity=".22"/>`/* lamp reflection */
  +figure(360,390,1,INK)
  +holmes(150,440,.95,INK)
  +hatch(0,404,W,120,80,16,INK,.3)
  +frame(); },
briony(r){ return G('br',[[0,'#12140f'],[.5,'#1c2016'],[1,'#12140d']])+rect(0,0,W,H,'url(#br)')
  +fog(r,300,160,'#37432f',.35)
  /* a snug villa, warm lit windows, a bell-pull recess implied by one bright pane */
  +path(`M240,330 L240,180 L460,110 L680,180 L680,330 Z`,'#1a1e15')
  +path(`M240,180 L460,110 L680,180`,'none',1,` stroke="${INK}" stroke-width="8"`)
  +rect(240,330,440,190,INK)
  +rect(300,220,70,70,'#f0d99a',.85)+rect(560,220,70,70,'#e8c98a',.7)
  +rect(430,360,70,120,'#060807')/* door */
  +hatch(300,220,70,70,0,8,AMBER2,.2)
  +glow(335,255,30,AMBER,.6)
  /* a single crimson gleam — the recess by the bell-pull, her dear thing */
  +circ(596,250,6,CRIM,.9)
  +holmes(140,440,1,INK)
  +frame(); },
stables(r){ return G('sb',[[0,'#14110c'],[.5,'#1e1810'],[1,'#140f09']])+rect(0,0,W,H,'url(#sb)')
  +hatch(0,0,W,H,20,22,INK,.2)
  +rect(80,150,740,270,'#0e0c08')/* the stable range */
  +Array.from({length:5},(_,i)=>{const x=120+i*140;
    return rect(x,190,90,190,'#171b19')+rect(x,190,90,92,'#0a0c0b')/* dutch door, top open */
      +line(x,284,x+90,284,MID,2,.7)+rect(x-6,180,102,12,INK);}).join('')
  +glow(700,150,42,AMBER,.7)+line(700,118,700,168,INK,5)+circ(700,150,9,'#f0d99a',.85)
  +path(`M118,402 l64,0 l-7,-28 l-50,0 z`,'#3a2c18',.85)/* hay */
  +`<g transform="translate(610,356)"><path d="M-28,0 l0,-28 l28,-17 l28,17 l0,28 z" fill="#0c0e0d"/><path d="M-15,0 q15,-17 30,0 z" fill="${INK}"/></g>`/* kennel */
  +circ(627,368,5,MID,.75)/* the quiet dog */
  +frame(); },
moor(r){ return G('mr',[[0,'#0e1114'],[.5,'#141a1c'],[1,'#0c1012']])+rect(0,0,W,H,'url(#mr)')
  +fog(r,170,180,'#2b343a',.5)
  +path(`M0,320 Q220,290 460,322 Q680,350 900,300 L900,${H} L0,${H} Z`,'#10140f')
  +path(`M0,362 Q260,342 520,370 Q740,394 900,360 L900,${H} L0,${H} Z`,'#0c0f0a')
  +path(`M700,300 l30,-40 l24,20 l20,-30 l26,50 z`,'#0a0d0a')/* distant tor */
  +hatch(0,360,W,160,70,20,INK,.32)
  +Array.from({length:6},(_,i)=>{const x=130+i*120+r()*28,y=384+r()*36;
    return `<path d="M${x},${y} q-10,-14 0,-24 q10,10 0,24" fill="#182016" opacity=".9"/>`;}).join('')/* gorse */
  +path(`M296,392 q-6,-30 14,-34 q18,-2 16,20 l-4,14 z`,'#241a10',.9)/* coat on the bush */
  +circ(326,388,3,'#e8e0c8',.95)/* the knife glint */
  +holmes(560,432,1,INK)
  +fog(r,300,120,'#3a444a',.4)
  +frame(); },
};
P.wrong=P.crimescene;
function paint(container,key,seed){
  const r=rng(seed||key);
  const fn=P[key]||P.bakerst;
  container.innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${fn.call(P,r)}</svg>`;
}

/* THE DANCING MEN — render a string as Doyle's little capering cipher-figures.
   Each letter is a deterministic stick-man (same letter → same figure); the
   last figure of each word carries a small flag, marking the word-break. */
function dancingMen(text, ink){
  ink=ink||'#12100c';
  const words=String(text).toUpperCase().split(/\s+/).filter(Boolean);
  const chars=[]; words.forEach(w=>{ for(let i=0;i<w.length;i++){ const ch=w[i];
    if(ch>='A'&&ch<='Z') chars.push({n:ch.charCodeAt(0)-65, flag:i===w.length-1}); } });
  const FW=20, PAD=10; let cx=PAD, body='';
  const L=(x,y,len,deg)=>{ const r=deg*Math.PI/180, x2=x+Math.cos(r)*len, y2=y+Math.sin(r)*len;
    return `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${ink}" stroke-width="1.5" stroke-linecap="round"/>`; };
  chars.forEach(c=>{ const n=c.n, x=cx, hy=7, sh=13, hip=25;
    const v=(k)=>(((n*5+k*7)%9)-4)*9;            /* -36..+36 per-limb variation */
    const solid=n%2===0;
    body+= solid ? `<circle cx="${x}" cy="${hy}" r="3.2" fill="${ink}"/>`
                 : `<circle cx="${x}" cy="${hy}" r="3.2" fill="none" stroke="${ink}" stroke-width="1.3"/>`;
    body+=`<line x1="${x}" y1="${hy+3.2}" x2="${x}" y2="${hip}" stroke="${ink}" stroke-width="1.6"/>`;/* spine */
    body+=L(x,sh,9,215+v(1))+L(x,sh,9,325+v(2));   /* arms, up-and-out */
    body+=L(x,hip,11,110+v(3))+L(x,hip,11,70+v(4)); /* legs, spread */
    if(c.flag){ const r=(325+v(2))*Math.PI/180, hx=x+Math.cos(r)*9, hyy=sh+Math.sin(r)*9;
      body+=`<path d="M${hx.toFixed(1)},${hyy.toFixed(1)} l6,-2.5 l-6,-2.5 z" fill="#c0392b"/>`; }
    cx+=FW;
  });
  const w=Math.max(cx-FW+PAD*2,PAD*2+6);
  return `<svg class="dm-svg" viewBox="0 0 ${w} 40" preserveAspectRatio="xMinYMid meet" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;
}
return { paint, dancingMen };
})();
