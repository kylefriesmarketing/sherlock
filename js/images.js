/* ELEMENTARY — generated-stills manifest. Paget-style Strand engravings,
   generated via Higgsfield nano_banana_pro and stored at
   assets/scenes/<key>.jpg. The procedural SVG in art.js (same engraving
   idiom) remains the fallback for any key not listed here. */
const IMAGES = (() => {
  const present = [
    'title','bakerst','crimescene','manor','records','nightvigil','alley',
    'station','court','cottage','cellar','reichenbach','sussex','briony',
    'press','telegraph','bridge'
  ];
  return { has:k=>present.includes(k), url:k=>`assets/scenes/${k}.jpg` };
})();
