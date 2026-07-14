/* =====================================================================
   ELEMENTARY — audio.js. Generative WebAudio, no files.
   The VIOLIN motif hangs unresolved while a case is open; it resolves —
   truly — only on a true solve, and resolves FALSELY (a wrong cadence)
   on a confident-wrong close: a tiny audible tell for the attentive ear.
   Baker Street has a hearth and a mantel clock; the street has the
   hansom's clatter and a far bell; MORIARTY is a descending, mathematical
   minor figure under a metronome, creeping in as his counter-index fills.
   ===================================================================== */
const AUDIO = (() => {
let ctx=null, master=null, lp=null, current=null;
let muted=false; try{ muted=localStorage.getItem('sherlock_muted')==='1'; }catch(e){}
let motifTimer=null, ambTimers=[], moriTimer=null, moriLvl=0;
const midiHz=m=>440*Math.pow(2,(m-69)/12);

const CFG={
  title:  { root:50, drone:[0,7], bed:'fog',    clock:0, hansom:0, motif:1 },
  bakerst:{ root:52, drone:[0,7,12], bed:'hearth', clock:1, hansom:0, motif:1, warm:1 },
  street: { root:48, drone:[0,5], bed:'fog',    clock:0, hansom:1, motif:1 },
  reichenbach:{ root:40, drone:[0,1,7], bed:'falls', clock:0, hansom:0, motif:0, deep:1 },
};

function ensure(){ if(ctx) return true;
  try{ ctx=new (window.AudioContext||window.webkitAudioContext)();
    master=ctx.createGain(); master.gain.value=muted?0:.5;
    lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2400;
    lp.connect(master); master.connect(ctx.destination); return true;
  }catch(e){ return false; } }
function noiseBuf(){ const b=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),d=b.getChannelData(0);
  let last=0; for(let i=0;i<d.length;i++){ const w=Math.random()*2-1; d[i]=(last+.02*w)/1.02; last=d[i]; d[i]*=3.2; }
  return b; }
function clearTimers(){ [motifTimer,moriTimer].forEach(t=>t&&clearTimeout(t)); motifTimer=moriTimer=null;
  ambTimers.forEach(t=>clearTimeout(t)); ambTimers=[]; }
function stopCurrent(){ clearTimers();
  if(!current) return; const t=ctx.currentTime;
  current.gains.forEach(g=>{try{g.gain.setTargetAtTime(0,t,.5);}catch(e){}});
  const dead=current; setTimeout(()=>dead.nodes.forEach(n=>{try{n.stop?n.stop():n.disconnect();}catch(e){}}),1800);
  current=null; }
function osc(type,f,g0,dest){ const o=ctx.createOscillator(),g=ctx.createGain();
  o.type=type;o.frequency.value=f;g.gain.value=0;g.gain.setTargetAtTime(g0,ctx.currentTime,1.4);
  o.connect(g);g.connect(dest);o.start(); return {o,g}; }
function bell(f,v=.12,d=2.2,t='sine',dest){ if(!ctx||muted) return;
  const o=ctx.createOscillator(),g=ctx.createGain(),now=ctx.currentTime;
  o.type=t;o.frequency.value=f; g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(v,now+.02);
  g.gain.exponentialRampToValueAtTime(.0001,now+d);
  o.connect(g);g.connect(dest||lp);o.start(now);o.stop(now+d+.1); }
function pluck(f,v=.06){ bell(f,v,.7,'triangle'); }

/* a bowed violin note: triangle+saw with vibrato through a resonant bandpass */
function bow(f,dur=1.1,v=.09,dest){ if(!ctx||muted) return;
  const now=ctx.currentTime;
  const o1=ctx.createOscillator(),o2=ctx.createOscillator(),g=ctx.createGain();
  const bp=ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=f*2.4; bp.Q.value=4;
  o1.type='sawtooth'; o2.type='triangle'; o1.frequency.value=f; o2.frequency.value=f;
  const vib=ctx.createOscillator(),vg=ctx.createGain(); vib.frequency.value=5.4; vg.gain.value=f*.011;
  vib.connect(vg); vg.connect(o1.detune); vg.connect(o2.detune); vib.start(now);
  g.gain.setValueAtTime(0,now); g.gain.linearRampToValueAtTime(v,now+.12);
  g.gain.setValueAtTime(v,now+dur*.7); g.gain.exponentialRampToValueAtTime(.0001,now+dur);
  o1.connect(bp); o2.connect(bp); bp.connect(g); g.connect(dest||lp);
  o1.start(now); o2.start(now); o1.stop(now+dur+.05); o2.stop(now+dur+.05); vib.stop(now+dur+.05); }

/* the motif: a rising violin phrase that HANGS on the leading tone (does
   not resolve). Ambient, while a case is open. */
const OPEN=[0,3,7,10,11]; /* minor climb ending on the 7th — unresolved */
function scheduleMotif(cfg){
  if(motifTimer) clearTimeout(motifTimer);
  const go=()=>{ if(!current) return;
    if(cfg.motif){ const r=cfg.root+12;
      OPEN.forEach((n,i)=>ambTimers.push(setTimeout(()=>bow(midiHz(r+n),1.0,cfg.warm?.075:.06),i*430))); }
    motifTimer=setTimeout(go, 11000+Math.random()*7000);
  };
  motifTimer=setTimeout(go,2200);
}

/* ambient beds */
function startBed(cfg){
  const nodes=[],gains=[];
  cfg.drone.forEach((iv,ix)=>{ const a=osc(cfg.warm?'triangle':'sawtooth',midiHz(cfg.root+iv),(ix?.016:.03),lp);
    a.o.detune.value=ix%2?6:-6; nodes.push(a.o); gains.push(a.g); });
  /* noise bed */
  if(cfg.bed!=='none'){
    const src=ctx.createBufferSource(); src.buffer=noiseBuf(); src.loop=true;
    const f=ctx.createBiquadFilter(),g=ctx.createGain(); g.gain.value=0;
    if(cfg.bed==='hearth'){ f.type='lowpass'; f.frequency.value=420; g.gain.setTargetAtTime(.05,ctx.currentTime,2); }
    else if(cfg.bed==='falls'){ f.type='lowpass'; f.frequency.value=700; g.gain.setTargetAtTime(.16,ctx.currentTime,2); }
    else { f.type='lowpass'; f.frequency.value=300; g.gain.setTargetAtTime(.05,ctx.currentTime,2); } /* fog */
    src.connect(f); f.connect(g); g.connect(lp); src.start(); nodes.push(src); gains.push(g);
  }
  current={nodes,gains};
  /* hearth: occasional crackle. clock: mantel tick. hansom: cab clatter + far bell */
  if(cfg.clock){ const tick=()=>{ if(!current)return; bell(midiHz(84),.02,.08,'square'); ambTimers.push(setTimeout(tick,1000)); }; ambTimers.push(setTimeout(tick,600)); }
  if(cfg.bed==='hearth'){ const crk=()=>{ if(!current)return;
    for(let i=0;i<3;i++) ambTimers.push(setTimeout(()=>bell(120+Math.random()*160,.02,.05,'triangle'),i*40+Math.random()*30));
    ambTimers.push(setTimeout(crk,1800+Math.random()*2600)); }; ambTimers.push(setTimeout(crk,1200)); }
  if(cfg.hansom){ const clop=()=>{ if(!current)return;
    bell(90,.035,.09,'square'); ambTimers.push(setTimeout(()=>bell(76,.03,.09,'square'),150));
    ambTimers.push(setTimeout(clop,900+Math.random()*500)); }; ambTimers.push(setTimeout(clop,700));
    const farBell=()=>{ if(!current)return; bell(midiHz(57),.03,3,'sine'); ambTimers.push(setTimeout(farBell,18000+Math.random()*12000)); };
    ambTimers.push(setTimeout(farBell,9000)); }
}

/* Moriarty: a descending, even, mathematical minor line under a metronome.
   Louder as his counter-index fills (0..5+). */
const MORI=[0,-1,-3,-5,-7]; /* stepwise descent */
function scheduleMoriarty(){
  if(moriLvl<1) return;
  const go=()=>{ if(!current) return;
    const r=CFG_root-12; const lvl=Math.min(moriLvl,6);
    MORI.slice(0,2+lvl).forEach((n,i)=>ambTimers.push(setTimeout(()=>bow(midiHz(38+n),1.2,.03+lvl*.008),i*520)));
    /* metronome */
    for(let i=0;i<4;i++) ambTimers.push(setTimeout(()=>bell(midiHz(72),.02+lvl*.004,.05,'square'),i*520));
    moriTimer=setTimeout(go, Math.max(6000,14000-lvl*1200));
  };
  moriTimer=setTimeout(go, 4000);
}
let CFG_root=48;

function setScene(key,moriarty){
  moriLvl=moriarty||0;
  if(!ensure()) return; if(ctx.state==='suspended') ctx.resume();
  const cfg=CFG[key]||CFG.title; CFG_root=cfg.root;
  stopCurrent();
  lp.frequency.setTargetAtTime(cfg.warm?2800:cfg.deep?900:1900,ctx.currentTime,1);
  startBed(cfg); scheduleMotif(cfg); scheduleMoriarty();
}

/* small tells */
function tick(){ if(!ctx||muted) return; pluck(midiHz(CFG_root+19+((Math.random()*5)|0))); }
/* drawing a thread — a neutral, pleasing pizzicato. Honest: it does NOT
   betray whether the inference is valid. That reckoning waits for the verdict. */
function thread(){ if(!ctx||muted) return;
  [0,7].forEach((n,i)=>setTimeout(()=>pluck(midiHz(CFG_root+12+n),.07),i*90)); }

/* the verdict cadence — the violin's answer */
function verdict(kind, truth){
  if(!ctx||muted) return;
  clearTimers();
  const r=CFG_root+12;
  if(kind==='mono'){ [12,16,19].forEach((n,i)=>setTimeout(()=>bow(midiHz(r+n),.7,.06),i*150)); return; }
  if(kind==='solved-true'){ /* rise, then RESOLVE, warm major, to the tonic octave */
    [0,4,7,12].forEach((n,i)=>setTimeout(()=>bow(midiHz(r+n),1.1,.09),i*260));
    setTimeout(()=>bow(midiHz(r+12),2.4,.11),1200);
  } else if(kind==='let-go'){ /* a warm descending sigh */
    [12,7,4,0].forEach((n,i)=>setTimeout(()=>bow(midiHz(r+n),1.2,.08),i*300));
  } else if(kind==='unsolved-honest'){ /* an open, hanging, honest suspension */
    [0,5,7].forEach((n)=>bow(midiHz(r+n),3.2,.06));
  } else if(kind==='solved-cruel'){ /* correct, but cold — stark bare octaves, minor */
    [0,12].forEach((n)=>bow(midiHz(r+n),2.6,.09));
    setTimeout(()=>bow(midiHz(r+3),2,.06),500);
  } else if(kind==='wrong-arrest'){ /* THE FALSE CADENCE — resolves to the wrong note */
    [0,4,7].forEach((n,i)=>setTimeout(()=>bow(midiHz(r+n),1,.08),i*250)); /* sets up a major close... */
    setTimeout(()=>{ bow(midiHz(r+8),2.8,.11); /* ...then lands a semitone wrong: unsettling */
      bell(midiHz(CFG_root-24),.3,3.4,'sine'); },820);
  } else { bell(midiHz(CFG_root),.06,.8); }
}
function toggleMute(){ muted=!muted; try{ localStorage.setItem('sherlock_muted',muted?'1':'0'); }catch(e){}
  if(master) master.gain.setTargetAtTime(muted?0:.5,ctx.currentTime,.2); return muted; }
return { setScene, tick, thread, verdict, toggleMute };
})();
