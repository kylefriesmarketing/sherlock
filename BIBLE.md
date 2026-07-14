# ELEMENTARY — The Keeper's Bible

*A branching playable book of Sherlock Holmes, for THE SHELF. Written to be handed to a
fresh session so it can build, not re-decide. Trust this file; verify only where the code
visibly disagrees.*

Working title **ELEMENTARY** (chosen for recognition — Kyle asked to optimize for fame). Strong
alternates, same game: **THE SCIENCE OF DEDUCTION** (Holmes's own monograph title) or **NORBURY**
(the shelf's cryptic-evocative style — the word Watson whispers to humble him; thematically the
truest, but obscure to newcomers). Repo/folder: `sherlock`. Live target:
`https://kylefriesmarketing.github.io/sherlock/` · sixth book on THE ROOM hub.

---

## 1. The pitch, and why it is UNIQUE on this shelf

You are Sherlock Holmes. London, gaslight, fog, 1881–1891. A client climbs the seventeen steps to
221B with a problem the police have already botched. You **observe**, you **infer**, you **name the
guilty** — and you live with it when you are wrong.

Every other game on the shelf is a **journey with a meter that drains** (SOUTH's men, STILL
BREATHING's vitals, NINE CIRCLES' descent, NOBODY's twenty years). ELEMENTARY is the opposite
shape on purpose:

- **A web you BUILD, not a bar that empties.** The core object is a growing board of clues and
  inferences — the Index. You add to it; it does not tick down.
- **An anthology, not a single arc.** Discrete cases, in flexible order, threaded by one meta-villain
  and one friendship. Closer to a short-story collection than an epic.
- **A new core verb: NOTICE / CONNECT.** No one else on the shelf makes the player do the
  reasoning. This is the differentiator — and the reason it reads instantly as "a Holmes game" and
  not "another SHELF survival book."
- **Being WRONG is a branch, not a fail-state.** The single most important design law in this
  bible (§5). It is what makes a deduction game *branch* instead of *gate*, and it is what every
  other Holmes game gets wrong.

Genre no other SHELF title occupies: **the detective / deduction game.** That is the whole reason
to build it.

---

## 2. Copyright — the trust section (nail this so the build session never panics)

**The entire Sherlock Holmes canon is public domain. Build freely.**

- **United States:** As of **January 1, 2023**, the last Conan Doyle stories (the 1927 *Case-Book*)
  entered the public domain. Every earlier story already was. The Doyle estate's attempt to keep
  Holmes's "warmth and emotional growth" under copyright **failed** in court (*Klinger v. Conan
  Doyle Estate*, 7th Cir. 2014) — you cannot copyright a character's traits drawn from
  public-domain works. Holmes, Watson, Moriarty, Adler, Lestrade, Mycroft, Mrs. Hudson, the
  Irregulars, 221B, Reichenbach — **all free.**
- **UK/EU:** Conan Doyle died **7 July 1930** → life + 70 → public domain since **1 January 2001**.
- **The deerstalker & the pipe:** not in Doyle's text — the deerstalker came from **Sidney Paget's**
  *Strand Magazine* illustrations (1891+), the curved calabash from stage actor William Gillette.
  Paget's illustrations are **themselves public domain now**, so the deerstalker silhouette is safe
  to use as visual shorthand (and it is our art north star — see §9).

**The only things to avoid** (separate, live copyrights — do not reference or reskin):
BBC *Sherlock*, the RDJ films, CBS *Elementary*, *Enola Holmes*, and any specific **modern
translation or annotated edition's notes**. As with every SHELF game: **adapt the works, write
100% original prose.** Never paste canon text.

---

## 3. The core loop — OBSERVE → INFER → INDEX → CONCLUDE

This is the heart. Get this right and the game works; everything else is dressing.

1. **OBSERVE.** A case is a set of **scenes** you visit in flexible order (the sitting room, the
   crime scene, an interview, the records office). Each scene holds **observations** — atomic tells:
   *"red clay on the boot-heel — the kind only found by the railway cutting,"* *"a bell-pull that
   rings no bell,"* *"a tan that stops sharply at the wrist."* Some are free; some are **gated**
   (you only notice the scratch around the keyhole once you've registered that the window was
   latched from inside). Noticing is the verb. You are Holmes's eyes.

2. **INFER.** Observations combine into **inferences**. The game offers inference-links whose input
   observations are already on your board: *"[red clay] + [the 8:15 timetable] → the visitor came
   up from the country this morning."* **Crucial:** some offered links are **valid** (they lead
   toward the truth) and some are **plausible-but-false** — authored red herrings. The game does
   **not** grey out the false ones. Believing them builds a wrong theory. That is the point.

3. **THE INDEX** (the signature HUD, §4). Every observation and accepted inference is a node on a
   board, joined by red thread. Chains grow. This replaces the vitals panel of the other games —
   it is the thing the player watches fill.

4. **CONCLUDE.** When you commit, your **available accusations are a function of what your Index
   actually supports.** A sloppy investigator literally cannot see the true accusation — it is not
   hidden behind a check, you simply never built the chain that makes it thinkable. Then you name
   your culprit, method, and motive — and **the consequences play out before you learn if you were
   right** (§5).

**Iron law of the loop:** *the solution is hidden data. It is NEVER rendered into any clue's visible
text.* Watson's prose describes the tell; it never names the conclusion. The player draws the line.

---

## 4. The instruments (the HUD)

Where NOBODY has the Name/Wrath/Favor/Loom and SOUTH has Hope/Unity/Strength/Stores, ELEMENTARY has:

- **THE INDEX** — the case-board: observations (nodes) and inferences (threads). Primary display.
  Grows as you notice and connect. A tangle of red thread on a bone-white card, pinned.
- **CERTAINTY vs. TRUTH** — the game's quiet engine. *Certainty* = how complete and internally
  coherent your Index is (shown). *Truth* = whether it matches the hidden solution (**hidden until
  the reveal**). The gap between them is the whole drama: high certainty + low truth = a confident
  wrong man sent to the gallows.
- **HEAD ↔ HEART** — a two-ended axis (like a tuning slider, not a bar). Solving for the *puzzle*
  (cold, brilliant, correct, and willing to let the sympathetic guilty hang) pulls toward the
  **Head**; solving for the *people* (mercy, the just outcome over the legal one, the client's
  dignity) pulls toward the **Heart**. Neither is "good." Pure Head wins cases and loses Watson and
  bends Holmes toward the needle; pure Heart lets the clever villain walk. Colors endings, the
  Watson bond, and gates the secret ending.
- **THE SEVEN PER CENT** — boredom is Holmes's true enemy. Between cases, or when a case stalls with
  the Index cold, *ennui* rises; at its worst it offers the cocaine solution (a real, documented,
  ruinous relief). A meter that fills with **idleness**, not danger. Managing it is managing the
  mind.
- **WATSON** — the narrator and the meter of your humanity (hidden-ish, surfaced in his asides). He
  narrates every case; how you treat him and the clients moves him. He is also the escape valve
  (§5): he can offer a nudge. Lose him entirely and the prose itself goes cold and first-person and
  clinical — the game *sounds* like the Head ending before it arrives.
- **THE IRREGULARS** — the street-kid network as a **spendable resource**: dispatch them to fetch a
  missing record, tail a suspect, or surface one gated observation you can't reach yourself. Limited
  per case. The one "action economy" element.

Mrs. Hudson (the hearth, continuity), **Lestrade** (the foil — takes the credit, and in a wrong-
branch makes the wrong arrest on your say-so), **Mycroft** (the smarter brother, dispensed rarely),
**Moriarty** and **Irene Adler** (§6) round the cast.

---

## 5. WRONG IS A BRANCH, NOT A WALL — the thesis (read twice)

Every mediocre detective game dies here: it treats the wrong answer as *retry*. That turns deduction
into a coin-flip with save-scumming. **ELEMENTARY never does this.** A wrong conclusion is *authored
content*:

- Name the wrong culprit → an **innocent is arrested** (Lestrade is delighted), the case "closes,"
  Watson writes it up as a triumph — and then, a beat later, the **real culprit acts again**, or the
  wrongness surfaces, and the story continues down a darker, guiltier branch. You carry it.
- The canon *proves* this is true to Holmes. He is **beaten by Irene Adler** ("A Scandal in
  Bohemia"). He is **flatly wrong** in "The Yellow Face" — assumes blackmail; it is a mother hiding
  her mixed-race child out of love — and says the line that is this game's entire mission statement:
  *"If it should ever strike you that I am getting a little over-confident... kindly whisper
  'Norbury' in my ear."* **The Yellow Face must be in the anthology**; it is the proof-of-thesis case.
- **The NORBURY mechanic:** every confident-but-wrong accusation adds a "Norbury" to a permanent,
  cross-run record. Watson whispers the word. It is the humility counter — and, inverted, the sign
  of a player learning the method. (Compare NOBODY's Deeds: a cross-run ledger, but of *failures
  understood*.)

**Escape valves so wrong is meaningful, not merely punishing:** Watson can offer a gentle nudge (free,
costs a little pride / Head-points); the Irregulars can fetch one missing fact; and "unsolved" is
always an honorable option — Holmes can decline to accuse when the Index won't support it, and *that
restraint is sometimes the correct, Heart-ward choice.* The horror is reserved for **confident and
wrong**, never for **honest and uncertain**.

---

## 6. The meta-arc — Moriarty's counter-index (cross-run stakes)

The anthology needs a spine, the way NOBODY has the homecoming and CHOOSE WISELY has the haunt.

- **Moriarty is deducing YOU.** Every case you solve leaves traces; a "Napoleon of Crime" is
  assembling a **counter-index** against Holmes across cases and across runs (persisted). Cross a
  threshold of notoriety and **The Final Problem** unlocks / sharpens — Reichenbach, the one case
  where the detective is the quarry. His motif is mathematical and descending (§10); he is a
  *professor*, the mirror of your own method turned to predation.
- **Irene Adler — "The Woman."** The one who beat Holmes, on merit, and earned his permanent respect.
  Introduced in her own case ("A Scandal in Bohemia") where **losing is the good outcome** (she
  outwits you and you *admire* it — a Heart beat disguised as a Head case). She threads the true
  ending.
- **The commonplace book grows.** Like NOBODY's accreting song: observations you've caught, methods
  you've learned, become permanent entries in Holmes's index across runs — a title-screen artifact
  of your developing eye. Cross-run **"monographs"** (Holmes's real habit — he wrote monographs on
  tobacco ash, on tattoos, on typewriters) are the achievement layer: earn *"Upon the Distinction
  Between the Ashes of the Various Tobaccos"* by noticing every ash-tell, etc. (Compare NOBODY's
  Deeds — same slot, Holmesian skin.)

---

## 7. Content — the case anthology (all public domain, all famous, escalating)

Six to seven self-contained cases. Adapt structure and clues from canon; write original prose. Order
is roughly an escalation of stakes and of the wrong-is-a-branch theme.

1. **A STUDY IN SCARLET** — *the tutorial.* Meet Watson (the "you have been in Afghanistan, I
   perceive" cold-open teaches OBSERVE in one stroke). RACHE on the wall. Teaches the loop with
   guardrails and Watson narrating the method aloud.
2. **THE RED-HEADED LEAGUE** — the absurd distraction (a club that pays a man to copy the
   encyclopedia) hiding a bank tunnel. Teaches *the obvious is the trap; follow the incongruity.*
3. **THE SPECKLED BAND** — the locked-room showpiece. Fully worked as the schema template in §7a.
   Ventilator, bolted bed, a bell-pull that rings nothing, a saucer of milk, a night-whistle, a safe,
   a swamp adder. Rich physical clues, a genuinely evil villain, a clean Head/Heart and wrong-branch.
4. **THE BLUE CARBUNCLE** — a Christmas goose, a stolen gem, and Holmes **letting the culprit go**
   because the man is broken and won't offend again. The Head/Heart showcase: the *correct* solve and
   the *just* outcome diverge.
5. **A SCANDAL IN BOHEMIA** — **Irene Adler.** The case you are meant to lose. Introduces The Woman
   and the meta-arc's human counterweight to Moriarty.
6. **THE YELLOW FACE** — **the proof-of-thesis case.** Holmes is wrong; the truth is tender, not
   criminal; "Norbury." The player who has been steamrolling confident accusations gets the mirror
   held up. Design it so a *cold* player fails it instructively and a *warm* player finds the truth.
7. **THE FINAL PROBLEM** — the capstone, gated by the Moriarty counter-index. Reichenbach. The
   detective as quarry. Survive it with Watson intact and Head/Heart in balance → the secret ending.

Onboarding note: **A Study in Scarlet** is the front door; **The Speckled Band** is where the
mechanics fully bloom. Ship 3–4 cases for a strong v1 (Study, Red-Headed League, Speckled Band, Blue
Carbuncle); add Scandal / Yellow Face / Final Problem as the meta-arc lands.

### 7a. Fully-worked template: THE SPECKLED BAND (the data schema, proven)

This exists to prove the model is implementable. The build session copies this shape.

**Hidden solution (never rendered to the player):** culprit = Dr. Grimesby Roylott (the stepfather);
method = a trained swamp adder sent through the ventilator, down the fake bell-pull, to the bed he
had bolted to the floor beneath it, recalled by a whistle and rewarded with milk; motive = to kill
his stepdaughters before marriage releases their inheritance from his control (the first twin
already dead the same way).

**Scenes:** `sitting_room` (Helen Stoner's terrified brief) → `stoke_moran` (the manor: the
sisters' rooms, the doctor's room, the grounds) → `village_records` (the will, the inheritance
terms) → `the_vigil` (the night watch in the dead sister's room) → accusation.

**Observations (atomic tells; some gated):**
- `bell_pull_fake` — the bell-pull by the bed rings no bell; it is a dummy, fixed to a hook.
- `bed_bolted` — the bed is clamped to the floor; it cannot be moved out from under the bell-pull.
  *(gated on `bell_pull_fake` — you only check the bed once the pull is suspicious.)*
- `ventilator_odd` — a ventilator between the two bedrooms that vents to no outside air, cut recently.
- `saucer_milk` — a saucer of milk in the doctor's room. *(He keeps a cheetah and a baboon — but no
  cat drinks from a saucer that size; a decoy tell that points HEART-ward if over-read.)*
- `safe_in_room` — a small iron safe in the doctor's room.
- `whistle_night` — Helen's testimony: a low whistle in the dark, then a clang of metal, the night
  her sister died.
- `dying_words` — the first twin's last words: *"the speckled band."* (Ambiguous — points falsely to
  the band of gypsies camped on the grounds: the authored **red herring**.)
- `will_terms` — the records: each daughter's marriage releases a third of the estate from Roylott's
  control; he is near ruin. (Motive tell.)
- `gypsies` — a band of Romani camped on the grounds. (The herring made flesh.)

**Inferences (offered when inputs are indexed; `valid:false` are the traps):**
- `speckled=gypsies` — `dying_words` + `gypsies` → *"the speckled band is the gypsy troupe."*
  **valid:false.** The seductive obvious reading. Accusing here → the innocent Romani are harassed/
  arrested, Helen dies on schedule, dark branch.
- `air_route` — `ventilator_odd` + `bell_pull_fake` + `bed_bolted` → *"something is meant to travel
  from the doctor's room, down the dummy pull, onto a person who cannot move the bed away."*
  **valid.** The spine of the truth.
- `the_lure` — `saucer_milk` + `whistle_night` → *"the thing is trained: summoned by whistle,
  rewarded with milk."* **valid.** (Chains from/with `air_route`.)
- `the_creature` — `air_route` + `the_lure` + `safe_in_room` → *"a small venomous animal, kept in the
  safe, sent through the vent."* **valid → unlocks accusation `roylott_snake`.**
- `motive_money` — `will_terms` → *"he kills before the daughters marry and drain the estate."*
  **valid** (supplies motive; strengthens the true accusation, not required to see it).

**Accusations (visible only if the Index supports them):**
- `roylott_snake` (requires `the_creature`) → **the true solve.** Head vs. Heart split at the vigil:
  *strike the creature back through the vent* (Head — Roylott dies of his own adder; correct, cold,
  legally murky) vs. *raise the household and expose him alive to the law* (Heart — riskier, Helen's
  word against a violent man, but no death on your hands).
- `accuse_gypsies` (requires `speckled=gypsies`) → **the wrong branch.** Confident + wrong →
  a Norbury; Helen Stoner dies as her sister did; Watson's write-up curdles when the truth surfaces.
- `decline` (always available) → unsolved-but-honest; Helen sent to safety elsewhere; the estate
  wins; a quiet, un-triumphant, Heart-ward close. No Norbury.

That is the entire model in one case: non-linear scenes, gated observation, valid vs. authored-false
inference chains, accusations gated by what you actually built, and three tonally distinct outcomes
(true / confident-wrong / honest-unsolved) — none of them a retry screen.

---

## 8. Endings

Per-case outcomes (each case authored to hit these notes where it can):
`solved-true` · `solved-cruel` (right culprit, Head-ward brutal means) · `wrong-arrest` (confident +
wrong; a Norbury) · `let-go` (right, and mercy chosen — Heart) · `unsolved-honest` (declined for lack
of chain).

Meta / run endings (tracked across the anthology):
- **The Reasoning Machine** — pure Head: every case solved, coldly, correctly; Watson gone; the prose
  first-person and clinical; Holmes alone with the needle between cases. A win the game refuses to
  celebrate.
- **The Good Doctor's Friend** — Heart-forward and Watson intact; some cases unsolved or forgiven; the
  humane detective. Warm, lesser at the puzzle, greater at the life.
- **The Woman** — the Irene Adler thread carried to its end: the one person who beat you, and what you
  do with having been beaten.
- **Reichenbach** (the Final Problem capstone): `the_fall` (both over the falls — the sacrifice) ·
  `the_hiatus` (the faked death, the three lost years, Watson's grief) · `outdeduced` (Moriarty's
  counter-index beats you — the quarry caught).
- **★ THE BEEKEEPER OF SUSSEX** (the secret ending — the "gentle death off the sea" of this game):
  survive Reichenbach with **Watson intact** and **Head/Heart in balance**, having whispered your own
  Norburys and learned from them. Holmes retires — canonically true — to the Sussex Downs to **keep
  bees**: the mind that could never rest, at rest; the observer who studies the hive instead of the
  gallows. The only ending where the great detective is at peace. Earn it across runs, like NOBODY's
  Inland Road.

---

## 9. Art direction — Sidney Paget's engravings

Each SHELF game has one signature look. ELEMENTARY's is **the Victorian steel-engraving / pen-and-ink
of the *Strand Magazine*** — Paget's own idiom, now public domain. Cross-hatched line, gaslight and
fog, soot and sepia, a single crimson accent for blood and for the red thread of the Index.

- **Palette:** ink black, fog grey-green, gaslight amber, bone paper, one blood-crimson. (Compare
  NOBODY's terracotta, SOUTH's lantern-amber-on-navy.)
- **Pipeline (identical to NOBODY / STILL BREATHING):** Higgsfield `nano_banana_pro`, prompt as *"pen
  and ink Victorian steel engraving, Strand Magazine illustration, cross-hatched, gaslit London
  fog…"*, generate 3×3 scene **sheets**, `upscale_image` to 4k, **slice locally** with System.Drawing
  (the `.work/slice4k.ps1` pattern in the nobody/ folder — 3.5%/5% inset drops gutters). Procedural
  **SVG fallbacks** in `art.js` in the same engraving language (hatching via line-hatch fills).
- **Scene keys** ≈ one per scene-backdrop: `bakerst` (221B by the fire), `crimescene`, `manor`,
  `records`, `nightvigil`, `alley`, `court`, `station`, `reichenbach`, `sussex` (the beehives — the
  secret ending), plus a `title` (a deerstalker silhouette in fog under a gas-lamp) and `og.jpg`.
- **Signature UI art:** the **Index board** — a cork/leather board, pinned cards, red thread between
  them, drawn in CSS/SVG so it animates as threads are added. This is the screenshot that sells the
  game.

---

## 10. Audio direction — the violin, and Moriarty's descending figure

Generative WebAudio, no files (identical philosophy to NOBODY's `audio.js` — a `setScene(key,…)` that
layers a drone + noise-bed + a motif scheduler).

- **The violin motif** — Holmes plays. A solo-violin figure that is **unresolved while a case is
  open** and **resolves only on a true solve** (compare NOBODY's *nostos* motif resolving only at
  Ithaca). On a wrong-but-confident close it resolves *falsely* — a wrong cadence — a tiny audible
  tell that something is off, which the attentive player learns to hear.
- **Baker Street** — hearth crackle, a mantel clock, rain on the pane, the warm room.
- **The street** — hansom-cab clatter, fog-muffled distance, a far bell (Big Ben), gas-jet hiss.
- **Moriarty** — a **descending, mathematical, minor** figure; a metronome pulse under it (the
  professor, the machine). It creeps in as the counter-index fills. At Reichenbach it is the water.
- **Sussex (secret ending)** — the violin, finally, fully resolved and warm; and bees.

---

## 11. Stack & architecture — mirror THE SHELF exactly

Copy NOBODY's lean stack so the build session has zero friction. All vanilla JS, zero deps, all
content data-driven.

```
sherlock/
  index.html            all DOM + one <style> link; screens: title / case-select / game / verdict / gallery
  css/style.css         the engraving theme; the Index-board component
  js/data.js            CASES (the anthology as data) — may split data2.js per case as it grows
  js/engine.js          the loop: scene render, observe, offer inferences, the Index, accusation, verdict, persistence
  js/art.js             Paget-style procedural SVG fallbacks + ART.paint(scene) + ART.board(index) + ART.chart-equivalent
  js/audio.js           generative WebAudio (violin motif, Moriarty figure)
  js/images.js          generated-stills manifest (sliced sheet scenes); SVG fallback when absent
  serve.ps1             copy from repo root (PowerShell HttpListener static server; see nobody/serve.ps1)
  .nojekyll             CRITICAL for GitHub Pages
  README.md  BIBLE.md
```

**Data schema (implementable as-is):**
```js
CASE = { id, title, epigraph, year, brief,
  scenes: { sceneId: SCENE }, start: sceneId,
  observations: { obsId: OBS },        // case-global pool
  inferences:   { infId: INFERENCE },  // case-global; offered when inputs indexed
  accusations:  [ ACCUSATION ],
  solution: { culprit, method, motive, keyChain:[infId…] }  // HIDDEN — never rendered
}
SCENE = { backdrop, title, text(str|fn(S)), reveals:[obsId…],  // observations noticeable here
          actions:[ { t, go|interview|test, cost?, req?(S) } ] }  // non-linear movement
OBS  = { id, label, detail, tag:'physical'|'testimony'|'record', req?:[obsId…] }  // req = gated
INFERENCE = { id, from:[obsId…], label, valid:bool, yields?:obsId|infId }  // valid:false = red herring
ACCUSATION = { id, requires:[infId…], theory, outcome:nodeId }  // visible only if requires ⊆ Index
```

**Engine contract:**
- `S` (run state) = `{ caseId, scene, index:{obs:{},inf:{}}, certainty, head, ennui, watson,
  irregulars, norburys, flags }`; persist to `localStorage` (`sherlock_run`), meta to
  `sherlock_persist` (endings, monographs, norburys, Moriarty counter-index, commonplace entries).
  Mirror NOBODY's `engine.js` persistence exactly (defP/loadP/saveP, the deeds/monograph loop at
  verdict time).
- The engine offers an inference iff **all** its `from` observations are in `index.obs`. Accepting it
  adds it to `index.inf` and (if `yields`) unlocks the next node — this is the chaining.
- An accusation is offered iff its `requires` ⊆ `index.inf`. **The true accusation is unreachable
  without its chain** — that is the design, not a bug.
- `certainty` = coherence/coverage of the Index (show it). `truth` = does the chosen accusation match
  `solution` (reveal only at verdict). Verdict routes to the outcome node, which is authored content,
  **never a retry.**
- Cross-run: Moriarty counter-index increments on notoriety; at threshold, unlock/alter The Final
  Problem. Commonplace book + monographs accrete on the title screen like NOBODY's song.

**Deploy** (identical to NOBODY): own git repo `sherlock` under `kylefriesmarketing` via portable gh
(`~/tools/gh/bin/gh.exe`, authed); `.nojekyll`; `git push origin main`; enable Pages
(`gh api -X POST repos/kylefriesmarketing/sherlock/pages -f source[branch]=main -f source[path]=/`).
**Add to THE ROOM hub** (repo is named **`games`**, served at /games/, local folder `games-hub/`) as
the sixth story: a `PLAY[]` entry + a slot in the `order` arrays in `js/room.js`, a list-view
`<a class="game">` in `index.html`, and a notebook row (`sherlock_persist` → `countOf(m.endings)`).
⚠️ A parallel session actively edits the hub — edit fast, commit fast, don't co-edit.

---

## 12. Testing recipes (a deduction graph soaks differently than a voyage)

- **Solvability proof (the key test):** for every case, a graph search must confirm the `solution`'s
  `keyChain` is **reachable** — that the required observations are all noticeable (their `req` gates
  chain back to free tells) and the inference chain is offerable in some order. If the true
  accusation is unreachable, the case is broken. Write this as a headless `window.__slSolve(caseId)`
  that returns `{reachable, deadObs, danglingInf}`.
- **No soft-locks:** from `start`, every scene and every accusation node must be reachable; no scene
  strands the player with zero actions. BFS the scene graph.
- **Red-herring integrity:** every `valid:false` inference must lead to an **authored** wrong-branch
  outcome (never a dead end or a retry). Assert each false accusation has an `outcome` node with
  real content.
- **Prose sweep** (reuse NOBODY's): render every scene/obs/inference/outcome under representative
  `S` states; flag unbalanced `<em>`, `undefined`/`NaN`/`${` leaks. (NOBODY's sweep found real bugs
  this way.)
- **Verify in-browser via DOM, not screenshots** — the animated title/board pages **time out** on
  the screenshot tool here (grain + SVG loops never idle). Use `get_page_text` / `javascript_tool` /
  the read_page tree. To eyeball generated SVG (the Index board), rasterize in-page to a canvas and
  POST the dataURL to `serve.ps1`'s `/__shot` endpoint → it writes `.tt-shot.jpg` at the server root →
  Read that. (This trick is how NOBODY's voyage-chart was vetted.)
- Preview server: add a `sherlock` config to `.claude/launch.json` (PowerShell serve.ps1, a free
  port — NOBODY used 8361; pick 8371). Serve from the project root, open `/sherlock/index.html`.

---

## 13. Build order for the next session (suggested milestones)

1. **Skeleton + one case, end to end.** Scaffold the stack from NOBODY; implement the loop
   (observe → offer inference → Index board → accusation → one of three outcomes) with **The Speckled
   Band** (§7a) hard-coded. Prove wrong/true/unsolved all branch. Verify DOM + solvability test.
2. **The Index board UI.** The pinned-cards-and-red-thread component (CSS/SVG), the screenshot that
   sells it. Animate a thread on each accepted inference.
3. **Two more cases + the tutorial** (Study in Scarlet onboarding, Red-Headed League, Blue Carbuncle)
   → a shippable v1 anthology. Head/Heart + Norbury persisting. Deploy to Pages, add to the hub.
4. **The meta-arc.** Moriarty counter-index, Irene (Scandal), the commonplace book / monographs on the
   title screen, cross-run persistence.
5. **The Yellow Face** (proof-of-thesis) **+ The Final Problem + the Beekeeper secret ending.**
6. **Art & audio passes.** Generate the Paget sheets (watch Higgsfield credits — `image_to_3d`/video
   are the expensive calls; plain images are cheap; check `balance` first). Violin + Moriarty motifs.

Ship after each milestone; verify live each time. A strong v1 is milestone 3.

---

## 14. Decisions deferred to the build session / Kyle

- **Final title** — recommend **ELEMENTARY** (fame); alternates **THE SCIENCE OF DEDUCTION** /
  **NORBURY**. Repo stays `sherlock` regardless.
- **Case count for v1** — 3–4 is a real game; 7 is the full arc. Ship incrementally.
- **How visible to make Certainty** — a number, a ring, or just the density of the board. Lean
  minimal; the *gap* to Truth is the point and Truth is hidden.
- **Whether Head/Heart is shown** or inferred by the player from Watson's tone. (NOBODY hides Trust;
  consider hiding Head/Heart similarly and letting Watson's prose carry it.)

— The room is quiet, the fog is up, and the game is afoot. Hand this to a fresh session and it can
start at milestone 1 without asking a single question the canon or this file doesn't already answer.
