/* =====================================================================
   ELEMENTARY — engine.js
   The loop: OBSERVE → INFER → INDEX → CONCLUDE. You notice tells, you draw
   threads between them on the Index board, and the accusations you can make
   are a function of what your Index actually supports. Being wrong is a
   branch, never a retry.

   Instruments: CERTAINTY (shown), TRUTH (hidden until the verdict), the
   HEAD↔HEART axis, THE SEVEN PER CENT (ennui), WATSON (humanity + nudge),
   and THE IRREGULARS (a spendable reach).
   ===================================================================== */
(() => {
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const K_P='sherlock_persist', K_R='sherlock_run';
const CASES=SL.cases, ORDER=SL.order;
/* case order: load order, unless a case declares an explicit `seq` */
ORDER.forEach((id,i)=>{ CASES[id]._seq=(CASES[id].seq!=null)?CASES[id].seq:i; });
ORDER.sort((a,b)=>CASES[a]._seq-CASES[b]._seq);

/* ---------------- persistence (meta) ---------------- */
function defP(){ return {
  runs:0, solved:{}, outcomes:{}, endings:{}, metaEndings:{},
  head:0, heart:0, watson:6, norburys:0, moriarty:0,
  monographs:{}, commonplace:{}, lastCase:null, lastVerdict:null,
  finalDone:false, beeSeen:false }; }
function loadP(){ try{ const p=JSON.parse(localStorage.getItem(K_P));
  if(p) return Object.assign(defP(),p); }catch(e){}
  return defP(); }
function saveP(){ localStorage.setItem(K_P, JSON.stringify(P)); }
let P=loadP();

/* ---------------- run (one case) ---------------- */
function newRun(caseId){ const c=CASES[caseId];
  return { caseId, scene:c.start, index:{obs:{},inf:{}}, seen:{},
    head:0, heart:0, ennui:0, ennuiOffered:false, needle:false,
    watsonUsed:false, watsonAsks:0, irregulars:c.irregulars||2,
    norburys:0, flags:{}, stirred:false }; }
let S=null;
function saveRun(){ if(S) localStorage.setItem(K_R, JSON.stringify(S)); }
function clearRun(){ localStorage.removeItem(K_R); }
function loadRun(){ try{ return JSON.parse(localStorage.getItem(K_R)); }catch(e){ return null; } }
const CUR=()=>CASES[S.caseId];

const fmt=t=>String(typeof t==='function'?t(S,P):t);
function show(id){ ['title-screen','game-screen','verdict-screen','gallery']
  .forEach(s=>$(s).classList.toggle('hidden', s!==id)); }

/* every observation the case can hold — free pool plus yielded-by-inference */
function obsDef(id){ const c=CUR(); return (c.observations&&c.observations[id]) || (c.yielded&&c.yielded[id]); }
function allObsIds(c){ return Object.keys(c.observations||{}).concat(Object.keys(c.yielded||{})); }

/* ---------------- scene painter: image first, SVG fallback ------------ */
function paintScene(el, key, seed){
  if (typeof IMAGES!=='undefined' && IMAGES.has(key)){
    const cur=el.querySelector('img.scene-img');
    if(cur && cur.dataset.key===key) return;
    const img=document.createElement('img');
    img.className='scene-img'; img.dataset.key=key; img.alt=''; img.style.opacity='0';
    img.onerror=()=>ART.paint(el,key,seed);
    const reveal=()=>{ setTimeout(()=>{img.style.opacity='1';},30);
      setTimeout(()=>{[...el.children].forEach(c=>{if(c!==img)c.remove();});},1000); };
    img.onload=reveal; img.src=IMAGES.url(key); el.appendChild(img);
    if(img.complete&&img.naturalWidth>0) reveal();
  } else ART.paint(el, key, seed);
}

/* ==================================================================== *
 *  TITLE                                                                *
 * ==================================================================== */
function titleScreen(){
  show('title-screen');
  paintScene($('title-art'),'title','r'+P.runs);
  AUDIO.setScene('title');
  $('btn-continue').classList.toggle('hidden', !loadRun());
  const el=$('title-song');
  const solvedN=Object.keys(P.solved).length;
  if(!P.runs){
    el.innerHTML='<span class="muse">London, and a fog off the river. A client is climbing the seventeen steps with a problem the police have already spoilt. You observe; you infer; you name the guilty — and you live with it when you are wrong. Being wrong, here, is not a retry. It is a life.</span>';
  } else {
    const bits=[];
    const monos=MONOGRAPHS.filter(m=>P.monographs[m.id]).slice(-2);
    bits.push(`<span class="muse">The commonplace book thickens. ${solvedN} case${solvedN===1?'':'s'} closed; ${P.norburys} Norbur${P.norburys===1?'y':'ies'} whispered.</span>`);
    Object.keys(P.commonplace).slice(-3).forEach(k=>{ if(COMMONPLACE[k]) bits.push(`<span class="verse">${COMMONPLACE[k]}</span>`); });
    monos.forEach(m=>bits.push(`<span class="verse mono">✦ <i>${m.title}</i></span>`));
    el.innerHTML=bits.join('');
  }
  renderCaseList();
}
function renderCaseList(){
  const box=$('case-list'); if(!box) return;
  let h='';
  ORDER.forEach(id=>{ const c=CASES[id];
    if(c.meta && !finalUnlocked()) return; /* The Final Problem hides until earned */
    const done=P.solved[id];
    const ov=P.outcomes[id];
    const badge = done ? `<span class="cl-done k-${ov?ov.kind:'solved-true'}">${ov?verdictLabel(ov.kind):'closed'}</span>` : '';
    h+=`<button class="case-card${c.meta?' meta':''}${done?' done':''}" data-case="${id}">
        <span class="cl-year">${c.year}${c.meta?' · the capstone':''}</span>
        <span class="cl-title">${c.title}</span>
        <span class="cl-brief">${c.epigraph}</span>${badge}</button>`;
  });
  box.innerHTML=h;
  [...box.querySelectorAll('.case-card')].forEach(b=>b.onclick=()=>{
    const id=b.dataset.case;
    if(loadRun() && loadRun().caseId!==id){ clearRun(); }
    startCase(id);
  });
}
function finalUnlocked(){ return P.moriarty>=META.moriartyThreshold || P.finalDone; }

$('btn-begin').onclick=()=>{ const r=loadRun(); if(r){ S=r; enterGame(); } else startCase(ORDER[0]); };
$('btn-continue').onclick=()=>{ const r=loadRun(); if(!r) return titleScreen(); S=r; enterGame(); };

/* ==================================================================== *
 *  START A CASE                                                          *
 * ==================================================================== */
function startCase(id){
  S=newRun(id);
  const c=CUR();
  enterGame(true);
}
function enterGame(fresh){
  show('game-screen');
  renderScene(fresh);
}

/* ==================================================================== *
 *  THE HUD — the instruments                                            *
 * ==================================================================== */
function certainty(){ /* coverage of the case's VALID reasoning, 0..1 */
  const c=CUR(); const infs=Object.entries(c.inferences);
  const valid=infs.filter(([k,v])=>v.valid);
  const drawnValid=valid.filter(([k])=>S.index.inf[k]).length;
  const keyChain=(c.solution&&c.solution.keyChain)||[];
  const keyDrawn=keyChain.filter(k=>S.index.inf[k]).length;
  /* weight the key chain heavily; a coherent board is one that reaches the spine */
  const base = valid.length? drawnValid/valid.length : 0;
  const key = keyChain.length? keyDrawn/keyChain.length : 0;
  let cer = .45*base + .55*key;
  if(S.needle) cer*=.7; /* the drug clouds the glass */
  return clamp(cer,0,1);
}
function paintHUD(){
  const c=CUR();
  const cer=certainty(), pct=Math.round(cer*100);
  const R=15, C=2*Math.PI*R, off=C*(1-cer);
  /* head/heart marker: -6..+6 -> 0..100% */
  const hh=clamp(S.head+P.head - (S.heart+P.heart), -6,6);
  const hhPos=((hh+6)/12)*100;
  const enn=clamp(S.ennui,0,META.ennuiMax);
  let h=`<div class="hud-panel">
    <div class="hud-case"><span class="hc-title">${c.title}</span><span class="hc-year">${c.year}</span></div>
    <div class="hud-sep"></div>
    <div class="ring-wrap" title="CERTAINTY — how complete and coherent your Index is. Whether it is TRUE, you learn only when you conclude.">
      <svg viewBox="0 0 40 40" class="cer-ring"><circle cx="20" cy="20" r="${R}" class="cr-bg"/>
      <circle cx="20" cy="20" r="${R}" class="cr-fg" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/></svg>
      <div class="ring-num">${pct}<span>%</span></div><div class="ring-lab">certainty</div>
    </div>
    <div class="hud-sep"></div>
    <div class="hh-row" title="HEAD ↔ HEART. Solving for the puzzle pulls one way; solving for the people, the other. Neither is virtue. Watson is watching which.">
      <span class="hh-end head">HEAD</span>
      <div class="hh-track"><div class="hh-mark" style="left:${hhPos}%"></div></div>
      <span class="hh-end heart">HEART</span>
    </div>
    <div class="hud-sep"></div>
    <div class="hud-foot">
      <div class="seven" title="THE SEVEN PER CENT — boredom is the mind's true enemy. Idleness fills it. At the full it offers a ruinous relief.">
        <span class="sv-lab">ennui</span>${Array.from({length:META.ennuiMax},(_,i)=>`<i class="${i<enn?'on':''}${enn>=META.ennuiMax?' full':''}"></i>`).join('')}</div>
      <div class="irr" title="THE IRREGULARS — Wiggins and the street-boys. Dispatch them to fetch what you cannot reach yourself. Limited.">
        <span class="sv-lab">irregulars</span>${Array.from({length:Math.max(S.irregulars,0)},()=>`<b>‡</b>`).join('')||'<em>spent</em>'}</div>
    </div>`;
  if(S.norburys||P.norburys) h+=`<div class="hud-sep"></div><div class="norbury-tally" title="Every confident-but-wrong accusation. Watson whispers the word; the count is the humility.">Norbury — <b>${S.norburys}</b> this case · ${P.norburys} in all</div>`;
  h+=`</div>`;
  $('hud').innerHTML=h;
}

/* ==================================================================== *
 *  RENDER SCENE                                                         *
 * ==================================================================== */
function renderScene(fresh){
  const c=CUR(), sc=c.scenes[S.scene];
  if(!sc){ console.error('missing scene',S.scene); return; }
  const firstVisit=!S.seen[S.scene];
  S.seen[S.scene]=1;
  paintScene($('scene-art'), sc.backdrop, S.caseId+S.scene);
  const aud = sc.backdrop==='reichenbach'?'reichenbach'
            : /^(bakerst|briony|cottage)$/.test(sc.backdrop)?'bakerst':'street';
  AUDIO.setScene(aud, P.moriarty);
  paintHUD();
  $('region-name').textContent=fmt(sc.title);
  $('node-title').textContent=c.brief && firstVisit && S.scene===c.start ? c.title : fmt(sc.title);
  /* the brief only leads the very first scene */
  let bodyHtml='';
  if(S.scene===c.start && fresh){
    bodyHtml=`<div class="case-brief"><span class="cb-eyebrow">the client’s problem</span>${c.brief}</div>`;
  }
  bodyHtml+=`<div class="scene-prose">${fmt(sc.text)}</div>`;
  $('node-text').innerHTML=bodyHtml;

  /* --- observations noticeable here --- */
  const box=$('choices'); box.innerHTML='';
  const avail=(sc.reveals||[]).filter(id=>{ const o=obsDef(id); if(!o) return false;
    if(S.index.obs[id]) return false;
    if(o.req && !o.req.every(r=>S.index.obs[r])) return false;
    return true; });
  if(avail.length){
    const grp=document.createElement('div'); grp.className='observe-group';
    grp.innerHTML=`<div class="grp-lab">◦ what you notice here</div>`;
    avail.forEach(id=>{ const o=obsDef(id);
      const b=document.createElement('button'); b.className='observe';
      b.innerHTML=`<span class="ob-l">${o.label}</span>`;
      b.onclick=()=>notice(id);
      grp.appendChild(b); });
    box.appendChild(grp);
  } else if(!firstVisit && sc.reveals && sc.reveals.length){
    const done=document.createElement('div'); done.className='grp-done';
    done.textContent='— you have seen all this scene will show you (for now) —';
    box.appendChild(done);
  }

  /* --- irregular actions --- */
  (sc.actions||[]).forEach(a=>{
    if(a.req && !a.req(S,P)) return;
    if(a.irregular){
      const already=S.index.obs[a.irregular] || S.flags['irr_'+a.irregular];
      if(already) return;
      const b=document.createElement('button'); b.className='choice irregular';
      b.disabled=S.irregulars<=0;
      b.innerHTML=`<span class="c-pre">‡ dispatch an Irregular${S.irregulars<=0?' — none left':''}</span>${a.t}`+
        (a.hint?`<span class="c-hint">${a.hint}</span>`:'');
      b.onclick=()=>{ if(S.irregulars<=0) return; S.irregulars--; S.flags['irr_'+a.irregular]=1;
        notice(a.irregular, true); };
      box.appendChild(b);
    }
  });
  /* --- movement actions --- */
  (sc.actions||[]).forEach(a=>{
    if(a.irregular) return;
    if(a.req && !a.req(S,P)) return;
    const b=document.createElement('button'); b.className='choice go';
    b.innerHTML=(a.pre?`<span class="c-pre">${a.pre}</span>`:'')+fmt(a.t)+
      (a.hint?`<span class="c-hint">${a.hint}</span>`:'');
    b.onclick=()=>{ travel(a.go); };
    box.appendChild(b);
  });

  $('text-panel').scrollTop=0;
  updateBottomBar();
  maybeEnnui(firstVisit, avail.length);
  if(fresh && c.newspaper && S.scene===c.start && !S.newsIntro){ S.newsIntro=1; setTimeout(openNews,600); }
  saveRun();
}

function travel(go){
  const before=noticedCount();
  S.scene=go;
  renderScene(false);
}
function noticedCount(){ return Object.keys(S.index.obs).length; }

/* ---- notice an observation: pin it to the Index ---- */
function notice(id, fromIrregular){
  if(S.index.obs[id]) return;
  S.index.obs[id]=1;
  S.ennui=Math.max(0,S.ennui-1);
  AUDIO.tick();
  /* commonplace book: first time a tell is caught, a monograph line accretes */
  const o=obsDef(id);
  if(o && o.mono && COMMONPLACE[o.mono] && !P.commonplace[o.mono]){ P.commonplace[o.mono]=1; saveP(); }
  if(id && COMMONPLACE[id] && !P.commonplace[id]){ P.commonplace[id]=1; saveP(); }
  /* show the tell as a revelation card, then re-render */
  flashObservation(o, fromIrregular, ()=>{
    if(newInferencesAvailable() && !S.stirred){ S.stirred=true; }
    renderScene(false);
  });
  saveRun();
}
function flashObservation(o,fromIrregular,done){
  const ov=$('flash'); if(!ov){ done&&done(); return; }
  ov.className='flash-ov'; ov.innerHTML=
    `<div class="flash-card tag-${o.tag}">
      <div class="fc-tag">${fromIrregular?'the Irregulars bring —':o.tag}</div>
      <div class="fc-label">${o.label}</div>
      <div class="fc-detail">${o.detail}</div>
      <div class="fc-pin">pinned to the Index ↴</div>
    </div>`;
  ov.onclick=()=>{ ov.className='flash-ov hidden'; ov.innerHTML=''; done&&done(); };
  /* auto-advance if they don't click */
}

/* which inferences are offerable now (all inputs indexed, not yet drawn) */
function offerable(){ const c=CUR(); const out=[];
  for(const [id,inf] of Object.entries(c.inferences)){
    if(S.index.inf[id]) continue;
    if(inf.from.every(f=>S.index.obs[f])) out.push(id);
  }
  return out;
}
function newInferencesAvailable(){ return offerable().length>0; }

/* ==================================================================== *
 *  BOTTOM BAR — the Index, Conclude, Watson                             *
 * ==================================================================== */
function updateBottomBar(){
  const bar=$('bottom-bar');
  const nobs=noticedCount(), off=offerable().length;
  const ready=off>0;
  const c=CUR();
  const np=c.newspaper;
  let newsBtn='';
  if(np){ const broken=np.predictions.filter(p=>S.index.inf[p.disruptedBy]).length, total=np.predictions.length;
    newsBtn=`<button id="bb-news" class="bb-btn news${broken===total?' allbroke':''}">
      <span class="bb-ic">📰</span> Tomorrow <span class="bb-n">${broken}/${total}</span></button>`; }
  bar.innerHTML=`
    <button id="bb-index" class="bb-btn${ready?' stir':''}">
      <span class="bb-ic">🧵</span> The Index <span class="bb-n">${nobs}</span>
      ${ready?`<span class="bb-badge">${off} to connect</span>`:''}</button>
    ${newsBtn}
    <button id="bb-watson" class="bb-btn ghost"${S.watsonAsks>=2?' disabled':''}>
      <span class="bb-ic">✎</span> Ask Watson${S.watsonAsks>=2?' — enough':''}</button>
    <button id="bb-conclude" class="bb-btn conclude"><span class="bb-ic">⚖</span> Conclude</button>`;
  $('bb-index').onclick=openIndex;
  $('bb-conclude').onclick=openConclude;
  $('bb-watson').onclick=askWatson;
  if($('bb-news')) $('bb-news').onclick=openNews;
}

/* ==================================================================== *
 *  THE TOMORROW EDITION — a newspaper that reprints itself as you       *
 *  disrupt its predictions. Each prediction is struck and rewritten     *
 *  the moment its `disruptedBy` inference lands on the Index.           *
 * ==================================================================== */
function openNews(){ $('news-ov').classList.remove('hidden'); renderNews(); AUDIO.thread(); }
function closeNews(){ $('news-ov').classList.add('hidden'); }
function renderNews(){
  const c=CUR(), np=c.newspaper; if(!np) return;
  const broken=np.predictions.filter(p=>S.index.inf[p.disruptedBy]).length;
  const all=broken===np.predictions.length;
  let h=`<div class="news-plate">
    <div class="news-masthead">${np.masthead}</div>
    <div class="news-sub">${np.edition} &middot; ${np.date}</div>
    <div class="news-rule"></div>`;
  h+=all
    ? `<div class="news-banner allbroke">${np.allBroken}</div>`
    : `<div class="news-banner">${broken} of ${np.predictions.length} headlines prevented — the rest are still being set in type</div>`;
  h+=`<div class="news-cols">`;
  np.predictions.forEach(p=>{ const done=!!S.index.inf[p.disruptedBy];
    h+=`<div class="news-col${done?' broken':''}">
      <div class="news-time">${p.time}</div>
      <div class="news-head${done?' struck':''}">${p.headline}</div>
      ${done ? `<div class="news-rewrite">${p.disruptedHeadline}</div>`
             : `<div class="news-standing">— not yet prevented —</div>`}
    </div>`; });
  h+=`</div><div class="news-margin">${np.margin}</div></div>`;
  $('news-body').innerHTML=h;
}

/* ==================================================================== *
 *  THE INDEX BOARD — the signature. Pinned cards, red thread.           *
 * ==================================================================== */
function openIndex(){
  const ov=$('index-ov'); ov.classList.remove('hidden');
  renderBoard();
  AUDIO.thread();
}
function closeIndex(){ $('index-ov').classList.add('hidden'); }

let BOARD_NUM={}; /* inf id -> legend number, stable within a render */
function renderBoard(){
  const c=CUR();
  const board=$('board-cards');
  /* observation cards, in the order noticed (stable) */
  const ids=allObsIds(c).filter(id=>S.index.obs[id]);
  board.innerHTML=ids.map((id,i)=>{ const o=obsDef(id);
    return `<div class="pin-card tag-${o.tag}" data-obs="${id}">
      <span class="pc-tack"></span>
      <div class="pc-tag">${o.tag}</div>
      <div class="pc-label">${o.label}</div>
      <div class="pc-detail">${o.detail}</div>
    </div>`; }).join('') || `<div class="board-empty">The board is bare. Go and look — noticing is the whole of the art.</div>`;

  /* accepted inference knots — numbered crimson discs, placed by JS */
  const drawn=Object.keys(c.inferences).filter(k=>S.index.inf[k]);
  BOARD_NUM={}; drawn.forEach((k,i)=>BOARD_NUM[k]=i+1);
  const knotLayer=$('board-knots');
  knotLayer.innerHTML=drawn.map(k=>`<div class="knot-disc" data-inf="${k}">${BOARD_NUM[k]}</div>`).join('');

  /* the tray: conclusions drawn (legend) + threads you can draw */
  const tray=$('board-tray');
  let th='';
  if(drawn.length){
    th+=`<div class="tray-lab">Conclusions on the board — the threads you have drawn:</div>`;
    th+=`<div class="legend">`+drawn.map(k=>{ const v=c.inferences[k];
      return `<div class="leg-row"><span class="leg-n">${BOARD_NUM[k]}</span><span class="leg-t">${v.label}</span></div>`; }).join('')+`</div>`;
  }
  const off=offerable();
  if(off.length){
    th+=`<div class="tray-lab" style="margin-top:12px">Threads you can draw — connect what your board already holds:</div>`+
      off.map(k=>{ const v=c.inferences[k];
        const froms=v.from.map(f=>`<span class="tr-from">${obsDef(f).label}</span>`).join('<span class="tr-plus">+</span>');
        return `<button class="tray-thread" data-inf="${k}">
          <div class="tr-inputs">${froms}</div>
          <div class="tr-arrow">↓ draw the thread</div>
          <div class="tr-claim">${v.label}</div></button>`; }).join('');
  } else if(!drawn.length){
    th+=`<div class="tray-lab dim">No thread yet. Every connection needs its pieces already pinned — go and notice more.</div>`;
  } else {
    th+=`<div class="tray-lab dim" style="margin-top:12px">No new thread offers itself. Notice more, or take your board to the accusation.</div>`;
  }
  tray.innerHTML=th;
  [...tray.querySelectorAll('.tray-thread')].forEach(b=>b.onclick=()=>acceptInference(b.dataset.inf));
  /* certainty read-out on the board too */
  $('board-cer').innerHTML=`<b>${Math.round(certainty()*100)}%</b> certain — <i>whether it is <u>true</u>, only concluding will tell.</i>`;
  requestAnimationFrame(()=>drawThreads());
}

function acceptInference(id){
  const c=CUR(), inf=c.inferences[id];
  if(!inf || S.index.inf[id]) return;
  S.index.inf[id]=1;
  S.ennui=Math.max(0,S.ennui-2);
  /* yields: pin the chained conclusion as a new record card */
  if(inf.yields && !S.index.obs[inf.yields]){ S.index.obs[inf.yields]=1; }
  AUDIO.thread(inf.valid);
  saveRun(); paintHUD();
  renderBoard();
  setTimeout(()=>{ const k=$('board-knots').querySelector(`[data-inf="${id}"]`);
    if(k) k.classList.add('knot-new'); drawThreads(); },60);
  maybeEditionChanged(id);
}
/* drawing a key thread can break one of the Tomorrow Edition's predictions */
function maybeEditionChanged(infId){
  const np=CUR().newspaper; if(!np) return;
  const p=np.predictions.find(x=>x.disruptedBy===infId); if(!p) return;
  const ov=$('flash'); ov.className='flash-ov';
  ov.innerHTML=`<div class="flash-card news-flash">
    <div class="fc-tag">stop the presses — a new edition</div>
    <div class="news-flash-old">${p.headline}</div>
    <div class="news-flash-arrow">↓ you have made this false ↓</div>
    <div class="news-flash-new">${p.disruptedHeadline}</div>
    <div class="fc-pin">one prediction prevented</div></div>`;
  ov.onclick=()=>{ ov.className='flash-ov hidden'; ov.innerHTML='';
    if(!$('news-ov').classList.contains('hidden')) renderNews(); };
  AUDIO.tick();
}

/* place numbered knots at the centroid of their sources, then draw red
   threads from each source card to the knot. Coordinates are measured
   relative to board-inner (which never scrolls internally). */
function drawThreads(){
  const wrap=$('board-inner'), svg=$('board-threads');
  if(!wrap||!svg) return;
  const c=CUR();
  const rect=wrap.getBoundingClientRect();
  if(!rect.width) return;
  svg.setAttribute('viewBox',`0 0 ${rect.width} ${rect.height}`);
  const center=el=>{ const r=el.getBoundingClientRect();
    return { x:r.left-rect.left+r.width/2, y:r.top-rect.top+r.height/2 }; };
  const cardEl=id=>$('board-cards').querySelector(`[data-obs="${id}"]`);
  const drawn=Object.keys(c.inferences).filter(k=>S.index.inf[k]);
  /* position knots first (centroid of sources, nudged toward board bottom) */
  const knotPos={};
  drawn.forEach(k=>{ const v=c.inferences[k];
    const pts=v.from.map(cardEl).filter(Boolean).map(center);
    if(!pts.length) return;
    let x=pts.reduce((a,p)=>a+p.x,0)/pts.length;
    let y=pts.reduce((a,p)=>a+p.y,0)/pts.length + 46;
    x=clamp(x,26,rect.width-26); y=clamp(y,26,rect.height-14);
    knotPos[k]={x,y};
    const ke=$('board-knots').querySelector(`[data-inf="${k}"]`);
    if(ke){ ke.style.left=x+'px'; ke.style.top=y+'px'; }
  });
  let paths='', dots='';
  drawn.forEach(k=>{ const v=c.inferences[k]; const kp=knotPos[k]; if(!kp) return;
    v.from.forEach(f=>{ const ce=cardEl(f); if(!ce) return; const cp=center(ce);
      const mx=(cp.x+kp.x)/2 + (cp.x<kp.x?-18:18), my=(cp.y+kp.y)/2;
      paths+=`<path d="M${cp.x.toFixed(1)},${cp.y.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${kp.x.toFixed(1)},${kp.y.toFixed(1)}" class="thread" vector-effect="non-scaling-stroke"/>`;
      dots+=`<circle cx="${cp.x.toFixed(1)}" cy="${cp.y.toFixed(1)}" r="3.2" class="thread-dot"/>`;
    });
  });
  svg.innerHTML=paths+dots;
}
$('index-close').onclick=closeIndex;
$('news-close').onclick=closeNews;
window.addEventListener('resize',()=>{ if(!$('index-ov').classList.contains('hidden')) drawThreads(); });

/* ==================================================================== *
 *  WATSON — the nudge (costs a little pride)                             *
 * ==================================================================== */
function askWatson(){
  if(S.watsonAsks>=2) return;
  S.watsonAsks++; S.watsonUsed=true;
  S.head=Math.max(0,S.head); /* asking is humbling, not cold — small Heart lean */
  S.heart+=0;
  const nudge=watsonNudge();
  const ov=$('flash'); ov.className='flash-ov';
  ov.innerHTML=`<div class="flash-card watson">
    <div class="fc-tag">Watson</div>
    <div class="fc-detail">“${nudge}”</div>
    <div class="fc-pin">— he will not do the thinking for you.</div></div>`;
  ov.onclick=()=>{ ov.className='flash-ov hidden'; ov.innerHTML=''; renderScene(false); };
  AUDIO.tick(); saveRun();
}
function watsonNudge(){
  const c=CUR();
  /* 1) an offerable but undrawn thread → point at the pieces */
  const off=offerable();
  if(off.length){ const v=c.inferences[off[0]];
    const names=v.from.map(f=>obsDef(f).label);
    return `You already hold the pieces of something, Holmes. Set “${names[0]}” beside “${names[names.length-1]}” and tell me what falls out. Open the Index.`; }
  /* 2) a key observation not yet noticed → point at where to look */
  const key=(c.solution&&c.solution.keyChain)||[];
  const needObs=new Set();
  key.forEach(ik=>{ const inf=c.inferences[ik]; if(inf) inf.from.forEach(f=>{ if(!S.index.obs[f]&&(c.observations[f])) needObs.add(f); }); });
  for(const [sid,sc] of Object.entries(c.scenes)){
    for(const oid of (sc.reveals||[])){ if(needObs.has(oid)){ const o=obsDef(oid);
      if(o.req && !o.req.every(r=>S.index.obs[r])) continue;
      return `I keep coming back to ${fmt(sc.title)}. I don’t think we truly finished there. Something small — look again.`; } }
  }
  /* 3) an irregular-only fact still unfetched */
  for(const [sid,sc] of Object.entries(c.scenes)){
    for(const a of (sc.actions||[])){ if(a.irregular && !S.index.obs[a.irregular] && S.irregulars>0)
      return `There is a thing on the ground we cannot reach ourselves. Send one of Wiggins’s boys — that is what they are for.`; }
  }
  return `You have more than you think. Read your own board again, slowly, as though a stranger had written it.`;
}

/* ==================================================================== *
 *  THE SEVEN PER CENT — ennui rises with idleness                       *
 * ==================================================================== */
function maybeEnnui(firstVisit, availCount){
  /* a scene that shows nothing new, and no thread to draw, is idleness */
  if(!firstVisit && availCount===0 && offerable().length===0){ S.ennui=clamp(S.ennui+1,0,META.ennuiMax); paintHUD(); }
  if(S.ennui>=META.ennuiMax && !S.ennuiOffered){ S.ennuiOffered=true; offerNeedle(); }
}
function offerNeedle(){
  const ov=$('flash'); ov.className='flash-ov';
  ov.innerHTML=`<div class="flash-card needle">
    <div class="fc-tag">the seven per cent</div>
    <div class="fc-detail">The case has gone cold and the mind, unoccupied, turns on itself. On the mantel: the neat morocco case, the little bottle, the long fine needle. A seven-per-cent solution. It would still the restlessness at once. It would also, you know precisely, cloud the very glass you reason through.</div>
    <div class="needle-choices">
      <button id="nd-take">Take the relief — and dull the board</button>
      <button id="nd-leave">Set it down. Get up. Go back to the work</button>
    </div></div>`;
  $('nd-take').onclick=()=>{ S.needle=true; S.head+=1; S.ennui=1;
    P.watson=clamp(P.watson-1,0,10); saveP();
    ov.className='flash-ov hidden'; ov.innerHTML=''; paintHUD(); renderScene(false); };
  $('nd-leave').onclick=()=>{ S.heart+=1; S.ennui=Math.floor(META.ennuiMax/2);
    ov.className='flash-ov hidden'; ov.innerHTML=''; paintHUD(); renderScene(false); };
}

/* ==================================================================== *
 *  CONCLUDE — accusations gated by the Index                            *
 * ==================================================================== */
function openConclude(){
  const c=CUR(); const ov=$('conclude-ov'); ov.classList.remove('hidden');
  const avail=c.accusations.filter(a=>a.requires.every(r=>S.index.inf[r]));
  /* always include the decline option even if listed */
  let h=`<div class="cc-head"><h2>Name it — or don’t</h2>
    <p class="cc-sub">You may only accuse what your Index will carry. A conclusion here is not a guess you can take back: the consequences play out <em>before</em> you learn if you were right.</p>
    <div class="cc-cer">Certainty <b>${Math.round(certainty()*100)}%</b> · Truth <b class="hidden-truth">— hidden —</b></div></div>`;
  h+=`<div class="cc-list">`;
  avail.forEach(a=>{
    const cls=a.decline?'decline':'';
    h+=`<div class="accuse-card ${cls}" data-acc="${a.id}">
      <div class="ac-who">${a.decline?'Decline to accuse':'Accuse: '+a.who}</div>
      <div class="ac-theory">${a.theory}</div>`;
    if(a.fork){ h+=`<div class="ac-fork">`+a.fork.map((f,i)=>`<button class="fork-btn tone-${f.tone}" data-acc="${a.id}" data-fork="${i}">${f.t}</button>`).join('')+`</div>`; }
    else { h+=`<button class="ac-commit" data-acc="${a.id}">Commit to this</button>`; }
    h+=`</div>`;
  });
  h+=`</div>`;
  $('conclude-body').innerHTML=h;
  [...ov.querySelectorAll('.ac-commit')].forEach(b=>b.onclick=()=>commit(b.dataset.acc,null));
  [...ov.querySelectorAll('.fork-btn')].forEach(b=>b.onclick=()=>commit(b.dataset.acc,+b.dataset.fork));
}
$('conclude-close').onclick=()=>$('conclude-ov').classList.add('hidden');

function commit(accId, forkIdx){
  const c=CUR(); const acc=c.accusations.find(a=>a.id===accId);
  let outId, tone=null;
  if(acc.fork){ const f=acc.fork[forkIdx]; outId=f.outcome; tone=f.tone; }
  else outId=acc.outcome;
  $('conclude-ov').classList.add('hidden');
  verdict(outId, acc, tone);
}

/* ==================================================================== *
 *  THE VERDICT — authored outcome, never a retry                        *
 * ==================================================================== */
function verdictLabel(kind){ return {
  'solved-true':'solved', 'solved-cruel':'solved · cold', 'wrong-arrest':'a Norbury',
  'let-go':'let go', 'unsolved-honest':'unsolved' }[kind]||kind; }

function verdict(outId, acc, tone){
  const c=CUR(); const o=c.outcomes[outId];
  if(!o){ console.error('missing outcome',outId); return; }
  /* apply the per-case head/heart deltas + any fork tone */
  const dh=(o.head||0)+(tone==='head'?1:0)+(S.needle?1:0);
  const dhe=(o.heart||0)+(tone==='heart'?1:0);
  P.head+=dh; P.heart+=dhe;
  /* watson bond */
  if(o.kind==='solved-cruel'||(tone==='head'&&o.truth)) P.watson=clamp(P.watson-1,0,10);
  if(o.kind==='let-go'||tone==='heart'||o.kind==='unsolved-honest') P.watson=clamp(P.watson+1,0,10);

  const firstNorbury = o.norbury && P.norburys===0;
  if(o.norbury){ S.norburys++; P.norburys++; }

  /* moriarty's counter-index: notoriety climbs with loud outcomes, most of
     all with confident-and-wrong; quiet honesty leaves fewer traces */
  if(o.norbury) P.moriarty+=2;
  else if(o.truth) P.moriarty+=1;
  else if(o.kind==='unsolved-honest') P.moriarty+=0;
  if(o.kind==='solved-cruel') P.moriarty+=1;

  /* record the case */
  P.runs++;
  const eid=S.caseId+':'+outId;
  P.endings[eid]=(P.endings[eid]||0)+1;
  P.solved[S.caseId]=P.solved[S.caseId]||{};
  P.outcomes[S.caseId]={ kind:o.kind, outId, tone:tone||null };
  P.lastCase=S.caseId; P.lastVerdict={ title:o.title, kind:o.kind, verse:o.verse };

  /* monographs */
  const ctx={ caseId:S.caseId, truth:!!o.truth, kind:o.kind, tone,
    firstNorbury,
    watsonUnused:!S.watsonUsed,
    fullPhysical: allPhysicalNoticed(c),
    fullChains: allValidDrawn(c),
    irregularKey: usedIrregularForKey(c) };
  const newMonos=[];
  MONOGRAPHS.forEach(m=>{ if(!P.monographs[m.id]){ let ok=false; try{ ok=m.check(ctx); }catch(e){}
    if(ok){ P.monographs[m.id]=1; newMonos.push(m); } } });

  saveP(); clearRun();

  /* paint the verdict */
  paintScene($('verdict-art'), o.art||'bakerst', outId+P.runs);
  AUDIO.verdict(o.kind, o.truth);
  $('verdict-kind').textContent=verdictLabel(o.kind);
  $('verdict-kind').className='k-'+o.kind;
  $('verdict-title').textContent=o.title;
  $('verdict-truth').innerHTML = o.truth
    ? `<span class="tr-true">✓ You were right.</span> Certainty ${Math.round(certaintyAt())}% — and true.`
    : (o.kind==='unsolved-honest'
        ? `<span class="tr-honest">Left open, and honest.</span> No name you could not prove.`
        : `<span class="tr-wrong">✗ You were wrong — and certain.</span> That is the worst way to be wrong.`);
  $('verdict-text').innerHTML=fmt(o.text);
  $('verdict-verse').textContent=o.verse||'';
  const md=$('verdict-monos');
  md.innerHTML=newMonos.map(m=>`<span class="mono-chip" title="${m.note.replace(/"/g,'&quot;')}">✦ ${m.title}</span>`).join('');
  const wm=$('verdict-watson');
  wm.textContent=watsonAside(o);
  if(newMonos.length) setTimeout(()=>AUDIO.verdict('mono'),800);

  /* the Final Problem unlock nudge */
  const fp=$('btn-final');
  if(fp) fp.remove();
  if(finalUnlocked() && !P.finalDone && S.caseId!=='final'){
    const b=document.createElement('button'); b.id='btn-final'; b.className='menu-btn final-cta';
    b.textContent='A telegram has come. The Professor knows your name — The Final Problem';
    b.onclick=()=>startCase('final');
    $('btn-verdict-again').parentNode.insertBefore(b,$('btn-verdict-again'));
  }
  /* the Beekeeper: earned by surviving the Final Problem well */
  let metaId=null;
  if(S.caseId==='final'){ metaId=resolveMeta(o, tone);
    if(metaId==='beekeeper') showBeekeeper(); }

  show('verdict-screen');
}
function showBeekeeper(){
  const e=META_ENDINGS.beekeeper;
  paintScene($('verdict-art'),'sussex','bee'+P.runs);
  $('verdict-kind').textContent='★ the secret ending';
  $('verdict-kind').className='k-solved-true';
  $('verdict-kind').style.color='var(--amber-lt)';
  $('verdict-title').textContent=e.title;
  $('verdict-truth').innerHTML=`<span class="tr-true">✓ At peace.</span> Watson whole, Head and Heart in balance, and your Norburys owned.`;
  $('verdict-text').innerHTML=e.line+"\n\nThe violin, put away so long, comes out one evening on the Downs and finds — at last — its resolving chord. Below the garden the hives hum. There is nothing left to deduce, and for the first time that is not a torment. It is the quiet you never believed you were owed.";
  $('verdict-verse').textContent='the observer, who studied the gallows, studies the hive instead — and rests';
  setTimeout(()=>AUDIO.verdict('solved-true',true),300);
}
function certaintyAt(){ return Math.round(certainty()*100); }
function allPhysicalNoticed(c){ return Object.entries(c.observations||{})
  .filter(([k,o])=>o.tag==='physical'&&!o.irregular).every(([k])=>S.index.obs[k]); }
function allValidDrawn(c){ return Object.entries(c.inferences)
  .filter(([k,v])=>v.valid).every(([k])=>S.index.inf[k]); }
function usedIrregularForKey(c){ return Object.entries(c.observations||{})
  .some(([k,o])=>o.irregular&&S.index.obs[k]); }

function watsonAside(o){
  let mood='neutral';
  const bal=P.head-P.heart;
  if(o.kind==='let-go'||o.kind==='unsolved-honest'||bal<-2) mood='warm';
  else if(o.kind==='solved-cruel'||bal>3||P.watson<=2) mood='cool';
  const arr=WATSON_ASIDES[mood];
  return arr[Math.floor(Math.random()*arr.length)];
}

/* ---- meta resolution at the Final Problem ---- */
function resolveMeta(o, tone){
  P.finalDone=true;
  const balanced=Math.abs(P.head-P.heart)<=2;
  const watsonWhole=P.watson>=5;
  const learned=P.norburys>0; /* whispered your own Norburys and came back */
  let metaId=o.metaEnd||null;
  if(balanced && watsonWhole && learned && (o.truth||o.kind==='let-go')){
    metaId='beekeeper'; P.beeSeen=true;
  }
  if(metaId){ P.metaEndings[metaId]=(P.metaEndings[metaId]||0)+1; P.lastMeta=metaId; saveP(); }
  return metaId;
}

$('btn-verdict-again').onclick=()=>{ titleScreen(); };
$('btn-verdict-index')&&($('btn-verdict-index').onclick=()=>{ /* review board post-mortem */ });

/* ==================================================================== *
 *  GALLERIES — endings, monographs, the commonplace book, Moriarty      *
 * ==================================================================== */
$('gallery-close').onclick=titleScreen;
$('btn-casebook').onclick=()=>{
  let h=`<div class="gallery-sub">The casebook — how each problem was closed, in the hand you closed it with. A case can be reopened; a Norbury cannot be unsaid.</div>`;
  h+=`<div class="grid-cells">`+ORDER.filter(id=>!CASES[id].meta||finalUnlocked()).map(id=>{ const c=CASES[id];
    const ov=P.outcomes[id];
    if(!ov) return `<div class="cell locked">— ${c.title} —<span class="ek">unopened</span></div>`;
    return `<div class="cell k-${ov.kind}"><span class="ek">${verdictLabel(ov.kind)}</span>${c.title}</div>`;
  }).join('')+`</div>`;
  /* meta endings */
  const me=Object.keys(META_ENDINGS);
  const got=me.filter(k=>P.metaEndings[k]).length;
  h+=`<div class="gallery-sub" style="margin-top:1.6em">The shape of a whole detective — ${got} of ${me.length} witnessed.</div>`;
  h+=`<div class="grid-cells">`+me.map(k=>{ const e=META_ENDINGS[k];
    return P.metaEndings[k]
      ? `<div class="cell k-${e.kind==='secret'?'true':e.kind}"><span class="ek">${e.kind}</span>${e.title}<span class="deed-note">${e.line}</span></div>`
      : `<div class="cell locked">— ${e.kind==='secret'?'a peace not yet earned':'unwitnessed'} —</div>`; }).join('')+`</div>`;
  $('gallery-title').textContent='The Casebook';
  $('gallery-body').innerHTML=h; show('gallery');
};
$('btn-monographs').onclick=()=>{
  const got=MONOGRAPHS.filter(m=>P.monographs[m.id]).length;
  let h=`<div class="gallery-sub">The monographs — Holmes wrote them on tobacco-ash and tattoos and typewriters. You earn them by the manner of your seeing. ${got} of ${MONOGRAPHS.length} written.</div>`;
  h+=MONOGRAPHS.map(m=>P.monographs[m.id]
    ? `<div class="mono-entry"><div class="me-title">✦ ${m.title}</div><div class="me-note">${m.note}</div></div>`
    : `<div class="mono-entry locked"><div class="me-title">— unwritten —</div><div class="me-note">${m.note}</div></div>`).join('');
  $('gallery-title').textContent='Monographs';
  $('gallery-body').innerHTML=h; show('gallery');
};
$('btn-commonplace').onclick=()=>{
  const keys=Object.keys(COMMONPLACE);
  const got=keys.filter(k=>P.commonplace[k]).length;
  let h=`<div class="gallery-sub">The commonplace book — the developing eye. Each line is a tell you have caught at least once, and will never fail to see again. ${got} of ${keys.length} indexed.</div>`;
  h+=keys.map(k=>P.commonplace[k]
    ? `<div class="cp-entry">${COMMONPLACE[k]}</div>`
    : `<div class="cp-entry locked">— a way of seeing not yet learned —</div>`).join('');
  /* moriarty's counter-index */
  h+=`<div class="gallery-sub" style="margin-top:1.6em">Somewhere across the city, a patient hand keeps a book of its own — a counter-index, and you are its subject.</div>`;
  const m=clamp(P.moriarty,0,META.moriartyThreshold);
  h+=`<div class="moriarty-meter"><div class="mm-track"><div class="mm-fill" style="width:${(m/META.moriartyThreshold)*100}%"></div></div>
     <div class="mm-lab">${finalUnlocked()?'The web is complete. The Professor is ready for you.':'the Professor is still gathering'}</div></div>`;
  $('gallery-title').textContent='The Commonplace Book';
  $('gallery-body').innerHTML=h; show('gallery');
};

/* ==================================================================== *
 *  DEBUG (~) + MUTE (m) + keys                                           *
 * ==================================================================== */
document.addEventListener('keydown',e=>{
  const inField=e.target&&e.target.matches&&e.target.matches('input,select,textarea');
  if(e.key==='Escape'){
    if(!$('index-ov').classList.contains('hidden')) return closeIndex();
    if(!$('news-ov').classList.contains('hidden')) return closeNews();
    if(!$('conclude-ov').classList.contains('hidden')) return $('conclude-ov').classList.add('hidden');
  }
  if(e.key==='m'&&!inField) return void AUDIO.toggleMute();
  if(e.key==='`'||e.key==='~'){
    const d=$('debug-panel'); d.classList.toggle('hidden');
    if(d.classList.contains('hidden')) return;
    d.innerHTML=`<b>~ the pilot’s lamp</b>
      <div class="dbg-row">case <select id="dbg-case">${ORDER.map(k=>`<option ${S&&S.caseId===k?'selected':''}>${k}</option>`).join('')}</select>
      <button id="dbg-start">start</button></div>
      <div class="dbg-row"><button id="dbg-omni">notice all + draw all</button> <button id="dbg-open">open Index</button></div>
      <div class="dbg-row">head <input id="dbg-head" size="2" value="${P.head}"> heart <input id="dbg-heart" size="2" value="${P.heart}">
        watson <input id="dbg-wat" size="2" value="${P.watson}"> moriarty <input id="dbg-mor" size="2" value="${P.moriarty}">
        <button id="dbg-apply">apply</button></div>
      <div class="dbg-row"><button id="dbg-final">unlock Final</button> <button id="dbg-wipe">wipe all</button></div>`;
    $('dbg-start').onclick=()=>startCase($('dbg-case').value);
    $('dbg-omni').onclick=()=>{ if(!S)return; const c=CUR();
      allObsIds(c).forEach(id=>{ if(c.observations&&c.observations[id]&&!(c.observations[id].req&&!c.observations[id].req.every(r=>S.index.obs[r]))) S.index.obs[id]=1; });
      /* iterate to resolve chains */
      for(let i=0;i<6;i++){ offerable().forEach(k=>acceptInference(k)); Object.keys(c.observations||{}).forEach(id=>{ if(!(c.observations[id].irregular)) S.index.obs[id]=1; }); }
      paintHUD(); renderScene(false); };
    $('dbg-open').onclick=openIndex;
    $('dbg-apply').onclick=()=>{ P.head=+$('dbg-head').value||0; P.heart=+$('dbg-heart').value||0;
      P.watson=clamp(+$('dbg-wat').value||0,0,10); P.moriarty=+$('dbg-mor').value||0; saveP(); if(S)paintHUD(); };
    $('dbg-final').onclick=()=>{ P.moriarty=META.moriartyThreshold; saveP(); titleScreen(); };
    $('dbg-wipe').onclick=()=>{ localStorage.removeItem(K_P); localStorage.removeItem(K_R); P=loadP(); S=null; titleScreen(); };
  }
});

/* boot */
titleScreen();
window.__slSolve=solveTest; /* headless solvability proof, see below */

/* ==================================================================== *
 *  __slSolve(caseId) — the key test (bible §12). Confirm the solution's *
 *  keyChain is reachable: every needed observation is noticeable (its   *
 *  req gates chain back to free tells) and the inference chain is        *
 *  offerable in some order.                                              *
 * ==================================================================== */
function solveTest(caseId){
  const c=CASES[caseId]; if(!c) return {error:'no case '+caseId};
  const obs={}, inf={};
  /* reveal all free (non-gated, non-irregular... but allow irregular as reachable) */
  let changed=true, guard=0;
  const canObs=id=>{ const o=obsDef2(c,id); if(!o) return false;
    if(o.req && !o.req.every(r=>obs[r])) return false; return true; };
  /* seed: every observation listed in scenes' reveals + irregular actions + free pool */
  const sceneObs=new Set(); Object.values(c.scenes).forEach(s=>{ (s.reveals||[]).forEach(o=>sceneObs.add(o));
    (s.actions||[]).forEach(a=>{ if(a.irregular) sceneObs.add(a.irregular); }); });
  while(changed && guard++<50){ changed=false;
    sceneObs.forEach(id=>{ if(!obs[id] && canObs(id)){ obs[id]=1; changed=true; } });
    for(const [k,v] of Object.entries(c.inferences)){
      if(!inf[k] && v.from.every(f=>obs[f])){ inf[k]=1; changed=true; if(v.yields){ obs[v.yields]=1; } }
    }
  }
  const key=(c.solution&&c.solution.keyChain)||[];
  const reachable=key.every(k=>inf[k]);
  const danglingInf=Object.keys(c.inferences).filter(k=>!inf[k]);
  const deadObs=allObsIds(c).filter(id=>{ const o=obsDef2(c,id); return o && !o.irregular && !obs[id] && !c.yielded?.[id]; });
  /* red-herring integrity: every valid:false inference must have an accusation with an authored outcome */
  const herrings=Object.entries(c.inferences).filter(([k,v])=>v.valid===false).map(([k])=>k);
  const herringOK=herrings.every(hk=>{ const acc=c.accusations.find(a=>a.requires.includes(hk));
    if(!acc) return false; const oid=acc.outcome; return !!(oid && c.outcomes[oid]); });
  /* accusation outcome integrity */
  const accOK=c.accusations.every(a=>{ if(a.fork) return a.fork.every(f=>c.outcomes[f.outcome]);
    return !!c.outcomes[a.outcome]; });
  return { caseId, reachable, danglingInf, deadObs, herringOK, accOK,
    keyChain:key, ok: reachable && herringOK && accOK && deadObs.length===0 };
}
function obsDef2(c,id){ return (c.observations&&c.observations[id])||(c.yielded&&c.yielded[id]); }
})();
