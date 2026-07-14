/* ELEMENTARY — generated-stills manifest. Paget-style engraving sheets,
   sliced locally, would live in assets/scenes/<key>.jpg. Until they are
   generated, this reports none present, and the procedural SVG in art.js
   (same engraving idiom) is used for every scene. Flip a key into `has`
   once its still exists. */
const IMAGES = (() => {
  const present = []; /* e.g. 'title','bakerst','crimescene','manor',... once generated */
  return { has:k=>present.includes(k), url:k=>`assets/scenes/${k}.jpg` };
})();
