# ELEMENTARY — *the science of deduction*

*A branching playable book of Sherlock Holmes, for [THE SHELF](https://kylefriesmarketing.github.io/games/).*

**Live:** https://kylefriesmarketing.github.io/sherlock/

You are Sherlock Holmes. London, gaslight, fog, 1881–1891. A client climbs the seventeen
steps to 221B with a problem the police have already botched. You **observe**, you **infer**,
you **name the guilty** — and you live with it when you are wrong.

---

## What makes it different

Every other game on the shelf is a **journey with a meter that drains**. ELEMENTARY is the
opposite shape on purpose — a web you **build**, not a bar that empties:

- **THE INDEX** — the signature. Every tell you notice becomes a pinned card on a corkboard;
  every deduction you draw connects them with red thread. It grows as you reason.
- **A new verb: NOTICE / CONNECT.** No one else makes *you* do the reasoning. The game never
  greys out the false clues — believe a plausible-but-wrong inference and you build a wrong theory.
- **WRONG IS A BRANCH, NOT A WALL.** Name the wrong culprit and an innocent is arrested, the case
  "closes," and then the real culprit acts again and the story goes on, darker. You carry it. Watson
  whispers a word: **Norbury.** A wrong conclusion is *authored content*, never a retry screen.
- **CERTAINTY vs. TRUTH.** The game shows how complete your Index is; whether it is *true* stays
  hidden until you conclude. The gap between the two is the whole drama.

## How it plays — OBSERVE → INFER → INDEX → CONCLUDE

1. **Observe.** Walk the scenes in any order — the sitting room, the crime scene, the records
   office. Notice atomic tells. Some are gated behind others (you only check the bolted bed once
   the dummy bell-pull is suspicious).
2. **Infer.** Open the Index and draw threads. Some links are valid; some are authored red
   herrings. The game will offer you both, identically.
3. **Conclude.** Your available accusations are a function of what your Index actually supports.
   A sloppy investigator literally cannot *see* the true accusation — you simply never built the
   chain that makes it thinkable.

Three tonally distinct outcomes for every case: **solved-true**, **confident-and-wrong** (a
Norbury), and **honest-unsolved** (declining to accuse is sometimes the correct, merciful choice).

## The instruments

- **The Index** — the case-board of cards and crimson thread.
- **Certainty vs. Truth** — one shown, one hidden.
- **Head ↔ Heart** — solve for the puzzle or for the people. Neither pole is virtue.
- **The Seven Per Cent** — boredom is Holmes's true enemy; idleness fills the meter, and at its
  worst it offers the needle.
- **Watson** — your humanity, and a nudge you can ask for at the cost of a little pride.
- **The Irregulars** — Wiggins's street-boys, a spendable reach for facts you can't fetch yourself.

## The anthology

Eleven cases — ten adapted from canon, one wholly original — escalating:

1. **A Study in Scarlet** — the tutorial. *You have been in Afghanistan, I perceive.*
2. **The Speckled Band** — the locked-room showpiece.
3. **The Musgrave Ritual** — the riddle case. An ancient family catechism — rendered as an
   illuminated question-and-answer — turns out to be a treasure-map three centuries deep. The
   deduction is spatial: reckon a felled elm's shadow, pace the ritual's steps, and the trail ends
   beneath a cellar flagstone, over a butler's body and a lost king's crown.
4. **The Red-Headed League** — the obvious is the trap.
4. **The Blue Carbuncle** — the Head/Heart showcase: the correct solve and the just outcome diverge.
5. **Silver Blaze** — *the dog that did nothing in the night-time.* Introduces **negative evidence**:
   the clue is the bark that never came, the gallop-track never torn. The murderer, it turns out, is
   no man at all.
6. **A Scandal in Bohemia** — The Woman. The case you are meant to lose, and to admire the losing.
7. **The Yellow Face** — the proof-of-thesis. Holmes is wrong; the truth is tender. *Norbury.*
8. **The Ink Before Midnight** — *an original case.* A newspaper dated tomorrow prints three deaths
   as a schedule — Carradine at nine, Holmes disgraced at half past ten, Watson dead at midnight.
   Every deduction you draw **disrupts a prediction and rewrites its headline.** Five suspects are
   each guilty of *something*; only one is the Editor. And the true solve is not Head vs. Heart but
   the **Watson Chronicle** — what he prints: the whole truth, a merciful omission, or the life over
   the proof. What you write becomes the final front page.
9. **The Dancing Men** — the cipher case. Rows of little capering stick-figures — rendered as an
   actual substitution cipher — appear about a manor and terrify an American wife. **Reading them is
   the deduction**: the cheap trap is to call them a child's scrawl; the truth is a hunter from
   Chicago writing in a code only he and she can read. Answer him in his own hand.
10. **The Final Problem** — the capstone, gated by Moriarty's counter-index. The detective becomes
   the quarry. Survive Reichenbach with Watson whole and Head/Heart in balance, your own Norburys
   owned, and earn the secret ending: **★ The Beekeeper of Sussex.**

Two signature systems live in *The Ink Before Midnight*:

- **The Tomorrow Edition** — a Victorian broadsheet that reacts to being investigated. Its three
  predicted headlines are struck through and reprinted the instant the deduction that prevents each
  one lands on your Index. The mystery *fights back*.
- **The Watson Chronicle** — you don't just solve; Watson decides what the world reads. The final
  accusation forks on the manuscript, not on morality, and the ending is the headline he sets.

Across runs, a **commonplace book** and Holmes's **monographs** accrete on the title screen, and
Moriarty's counter-index fills until The Final Problem unlocks.

## The craft

- **Copyright:** the entire Conan Doyle canon is public domain (US since 2023; UK/EU since 2001).
  The structure and clues are adapted from canon; **100% of the prose is original.** No canon text
  is reproduced.
- **Art:** Sidney Paget's *Strand Magazine* steel-engraving idiom — cross-hatched ink, gaslight and
  fog, one blood-crimson accent. Ships with **17 generated Paget-style engraving stills**
  (`assets/scenes/`, made with Higgsfield `nano_banana_pro`), listed in `images.js`; the procedural
  SVG in `art.js` (same idiom) is the automatic fallback for any scene without a still.
- **Audio:** generative WebAudio, no files. A solo-violin motif hangs **unresolved** while a case is
  open and resolves — truly — only on a true solve (and *falsely*, a wrong cadence, on a
  confident-wrong close). Moriarty is a descending, mathematical minor figure under a metronome.

## Stack

Vanilla JS, zero dependencies, all content data-driven. `index.html` + `css/` + `js/` (`data*.js`
cases, `engine.js` loop + Index board + persistence, `art.js`, `audio.js`, `images.js`).

- `~` opens the pilot's-lamp debug panel; `m` mutes.
- Headless solvability proof: `window.__slSolve(caseId)` returns `{reachable, deadObs, danglingInf,
  herringOK, accOK, ok}` — confirms every case's true `keyChain` is reachable and every red herring
  leads to an authored branch.

*The room is quiet, the fog is up, and the game is afoot.*
