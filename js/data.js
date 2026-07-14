/* =====================================================================
   ELEMENTARY — data.js
   The anthology, as data. A case is a graph: SCENES you walk in any order,
   OBSERVATIONS you notice (some gated behind others), INFERENCES that
   combine them (some valid, some authored-false red herrings), and
   ACCUSATIONS that only become thinkable once your Index supports them.

   THE IRON LAW: the solution is hidden data. It is NEVER written into any
   clue's visible text. Watson's prose describes the tell; the player draws
   the line.

   This file: the meta-config, the shared registers, and the first two
   cases — A STUDY IN SCARLET (the tutorial) and THE SPECKLED BAND (the
   fully-worked showpiece from the bible). data2/data3 hold the rest.
   ===================================================================== */

const SL = { cases:{}, order:[] };
function defineCase(c){ SL.cases[c.id]=c; if(!SL.order.includes(c.id)) SL.order.push(c.id); }

/* ------------------------------------------------------------------ *
 * META — the things that live above any single case.                 *
 * ------------------------------------------------------------------ */
const META = {
  /* Head/Heart is a two-ended axis. Neither pole is "good." */
  headWord:'the Reasoning', heartWord:'the Human',
  /* the Seven Per Cent: ennui rises with idleness, not danger */
  ennuiMax:6,
  /* Moriarty's counter-index: notoriety accrues across runs; at threshold
     The Final Problem sharpens. Confident-and-wrong is loud; quiet solves
     leave fewer traces. */
  moriartyThreshold:5,
};

/* Watson's asides — the humanity meter, surfaced as narration. Keyed by a
   coarse mood the engine derives from head/heart and the last verdict. */
const WATSON_ASIDES = {
  warm:[
    "Watson watched you a moment, then wrote something kind in the margin.",
    "“There is a heart in you after all, Holmes,” said Watson, and did not look up from his notebook.",
    "Watson refilled your cup without being asked. The small mercies of a shared fire." ],
  cool:[
    "Watson said nothing. His pen had stopped moving some minutes ago.",
    "“You are a calculating machine tonight,” Watson murmured — not entirely in admiration.",
    "Watson closed his notebook. Some things, he had decided, were not worth writing down." ],
  neutral:[
    "Watson leaned forward, following the thread of it despite himself.",
    "“Go on,” said Watson, which was his way of saying he could not see it yet.",
    "Watson made a note. He had learned to trust the pauses." ],
};

/* The Commonplace Book — Holmes's real habit: he indexed everything.
   Entries accrete across runs as you notice certain tells for the first
   time; they decorate the title screen like NOBODY's growing song. Keyed
   by observation-id; earning is handled in engine at index time. */
const COMMONPLACE = {
  boot_clay:      "On the soils of the Home Counties — a smear of clay tells a station as surely as a ticket.",
  cuff_ink:      "On the calluses and stains of the trades — every man carries his living on his hands.",
  bell_pull_fake:"On the architecture of murder — a room may be built, patiently, into a weapon.",
  tan_line:      "On sunburn and latitude — the skin keeps a diary of where a body has lately been.",
  pawn_knees:    "On the wear of cloth — the knee of a trouser confesses the labour of the man inside it.",
  goose_crop:    "On the concealment of small valuables — a fool hides a jewel where it must be found.",
  photo_hidden:  "On the instinct of the hunted — in a fire-alarm, all of us reach first for our one dear thing.",
  yellow_face:   "On the danger of the obvious — that a face at a window is a threat only to the fearful mind.",
};

/* Monographs — the achievement layer, in Holmes's own titles. Earned by
   fully "reading" a case's physical evidence, or by a way of solving.
   check(P, meta-context) at verdict time. */
const MONOGRAPHS = [
  { id:'m_ash',    title:'Upon the Distinction Between the Ashes of the Various Tobaccos',
    note:'Notice every physical tell in a single case — miss nothing the eye could hold.',
    check:(ctx)=> ctx.fullPhysical },
  { id:'m_footsteps', title:'Upon the Tracing of Footsteps',
    note:'Solve a case truly without ever asking Watson for a nudge.',
    check:(ctx)=> ctx.truth && ctx.watsonUnused },
  { id:'m_norbury', title:'Upon the Uses of Being Wrong',
    note:'Whisper your first Norbury — and come back to the work anyway.',
    check:(ctx)=> ctx.firstNorbury },
  { id:'m_mercy',  title:'Upon the Limits of the Law',
    note:'Solve a case correctly and choose mercy over the gallows.',
    check:(ctx)=> ctx.truth && ctx.tone==='heart' },
  { id:'m_machine',title:'Upon the Science of Deduction',
    note:'Solve a case truly with the Index complete — every valid thread drawn.',
    check:(ctx)=> ctx.truth && ctx.fullChains },
  { id:'m_restraint', title:'Upon the Wisdom of the Unanswered',
    note:'Decline to accuse when your Index would not honestly support it.',
    check:(ctx)=> ctx.kind==='unsolved-honest' },
  { id:'m_irregular', title:'Upon the Employment of Street Arabs',
    note:'Turn a case with a fact only the Irregulars could fetch.',
    check:(ctx)=> ctx.truth && ctx.irregularKey },
  { id:'m_woman',  title:'Upon a Singular Adversary',
    note:'Meet The Woman, and lose to her well.',
    check:(ctx)=> ctx.caseId==='bohemia' && ctx.kind!=='wrong-arrest' },
];

/* Meta / run endings — the shape of a whole detective, tracked across the
   anthology. The Beekeeper is the secret, earned across runs. */
const META_ENDINGS = {
  machine:{ kind:'cold', title:'The Reasoning Machine',
    line:'Every case correct, and coldly. Watson is gone; the prose has gone first-person and clinical. A mind that could not rest, and would not be loved.' },
  friend:{ kind:'warm', title:'The Good Doctor’s Friend',
    line:'The humane detective — some cases forgiven, some unsolved, Watson always by the fire. Lesser at the puzzle, greater at the life.' },
  woman:{ kind:'woman', title:'The Woman',
    line:'One person beat you on merit, and you kept her photograph, and it changed the shape of your regard forever.' },
  fall:{ kind:'fall', title:'Reichenbach — The Fall',
    line:'Both of you over the water. The Napoleon of Crime goes down locked in your arms, and the world is lighter by the exact weight of two men.' },
  hiatus:{ kind:'fall', title:'Reichenbach — The Hiatus',
    line:'The faked death. Three lost years. Watson’s grief, which you read about later, in his own hand, and could not forgive yourself for.' },
  outdeduced:{ kind:'fall', title:'Reichenbach — Outdeduced',
    line:'The Professor’s counter-index was the better of the two. The quarry was caught. It was, you had to admit at the very end, elegant work.' },
  beekeeper:{ kind:'secret', title:'★ The Beekeeper of Sussex',
    line:'You survived the Fall with Watson whole and your Head and Heart in balance, having whispered your own Norburys and learned from each. So the great detective laid down the work and went to the Downs to keep bees — the restless mind, at last, at rest. The only ending where Sherlock Holmes is at peace.' },
};

/* ================================================================== *
 *  CASE 1 — A STUDY IN SCARLET  (the tutorial / the front door)      *
 *  Teaches OBSERVE in one stroke (the Afghanistan cold-open), then    *
 *  the full loop with Watson narrating the method aloud and gentle    *
 *  guard-rails. Red herring: the word RACHE as a woman's name.        *
 * ================================================================== */
defineCase({
  id:'study', title:'A Study in Scarlet', year:'1881',
  epigraph:'“There’s the scarlet thread of murder running through the colourless skein of life, and our duty is to unravel it.”',
  brief:'A man is found dead in an empty house off the Brixton Road — no wound, no robbery, and a single German word scrawled in blood on the plaster. Gregson and Lestrade are each certain the other is a fool. Watson, newly your lodger, has come along to watch you work.',
  tutorial:true, irregulars:2,
  start:'lauriston',
  scenes:{
    lauriston:{ backdrop:'crimescene', title:'3, Lauriston Gardens',
      text:"An empty house with a sodden garden and a For-Let board hanging askew. Inside, in a bare front room, a well-dressed man lies dead upon the floorboards — no mark of violence on him, and yet his face is fixed in a horror that stopped his heart. Watson keeps to the doorway. Lestrade hovers, proprietary.\n\nBegin as you always begin. Look — do not merely see.",
      reveals:['no_wound','face_horror','rache','wedding_ring','cab_tracks','boot_clay'],
      actions:[
        { t:'Cross to the far wall', go:'the_word' },
        { t:'Step out to the road and the garden', go:'the_road' },
      ] },
    the_word:{ backdrop:'crimescene', title:'The Wall',
      text:"In the corner, low on the plaster where the gaslight scarcely reaches, a single word is scrawled in dark, dried blood: RACHE. Lestrade clears his throat. “Some woman named Rachel, cut off before she could finish. Depend upon it.”",
      reveals:['rache_height','blood_source'],
      actions:[ { t:'Return to the body', go:'lauriston' } ] },
    the_road:{ backdrop:'alley', title:'The Road & Garden',
      text:"Rain has been falling since before dawn — a gift, if one reads mud. The clay path from the gate to the door has been trodden this morning, and the roadway beyond keeps the record of what stood at the kerb in the small hours.",
      reveals:['cab_wheel','stride','ash_cigar'],
      actions:[
        { t:'Send an Irregular to the cab-ranks', irregular:'cab_driver',
          hint:'Wiggins can canvas every night-cabman in an hour — you cannot.' },
        { t:'Back inside', go:'lauriston' } ] },
  },
  observations:{
    no_wound:{ label:'No wound on the body', tag:'physical',
      detail:'Not a scratch, not a bruise of struggle — yet the man is dead, and lately. The face did the dying; the body only fell.' },
    face_horror:{ label:'A face fixed in horror', tag:'physical',
      detail:'The features are contorted with a terror — or a loathing — held past the moment of death. Fear, or something swallowed.' },
    rache:{ label:'RACHE, in blood', tag:'physical',
      detail:'Block capitals, dark and dried, in a corner. Not the victim’s hand — his hands are clean. Written by someone who stayed a while in the dark.' },
    wedding_ring:{ label:'A woman’s wedding ring', tag:'physical',
      detail:'A plain gold band, a woman’s, lying beside the body — belonging neither to this man nor to this house. It was brought here.' },
    cab_tracks:{ label:'Fresh cab-tracks at the kerb', tag:'physical',
      detail:'A four-wheeler stood at the gate in the night; the wheel-ruts and a horse’s restless stamping are printed in the clay.' },
    boot_clay:{ label:'Reddish clay on the floor', tag:'physical', mono:'boot_clay',
      detail:'Boot-prints in a heavy, reddish clay tracked across bare boards — two men’s, one pair square-toed and patent, the other rough and large.' },
    rache_height:{ label:'The word is written low', tag:'physical', req:['rache'],
      detail:'The letters sit barely a foot above the skirting, and the strokes rise slightly to the right — a tall man, writing by reaching down, not a woman at eye height.' },
    blood_source:{ label:'The writer’s own blood', tag:'physical', req:['rache'],
      detail:'The victim did not bleed. Yet the word is blood. The one who wrote it opened his own skin to do it — a nose bled by passion, perhaps, or by drink.' },
    cab_wheel:{ label:'A worn near-side wheel', tag:'physical', req:['cab_tracks'],
      detail:'One wheel-rut cuts sharper than its fellows — a tyre worn on a much-used cab, not a private carriage. A working four-wheeler.' },
    stride:{ label:'A very long stride', tag:'physical',
      detail:'The rough boot-prints step far apart along the path — a man well over six foot, and walking easily, not in haste. Long boots, square toes.' },
    ash_cigar:{ label:'A trodden cigar-ash', tag:'physical', mono:'m_ash',
      detail:'Ash ground into the clay by the gate — the pale, flaky ash of a Trichinopoly cigar, not a cigarette. The man waited here, and smoked, and was calm.' },
    cab_driver:{ label:'The cabman’s testimony', tag:'testimony', irregular:true,
      detail:'Wiggins returns grinning: a big man, florid, took a fare to Lauriston Gardens and back in the small hours — and drove the cab himself, easy as breathing, as though the reins were an old habit.' },
  },
  inferences:{
    rache_rachel:{ from:['rache'], valid:false,
      label:'RACHE is “Rachel” — a woman’s name, interrupted before the last letters.',
      note:'Lestrade’s reading. It is the obvious one, which is precisely why it should be suspected.' },
    rache_german:{ from:['rache','rache_height','blood_source'], valid:true,
      label:'RACHE is German for revenge — written whole, deliberately, low on the wall by a tall man to mislead the police.',
      yields:'obs_revenge' },
    poison:{ from:['no_wound','face_horror'], valid:true,
      label:'No wound, a face of horror, a swift death — the man was made to take poison, or took it believing a lie.',
      yields:'obs_poison' },
    a_woman:{ from:['wedding_ring'], valid:true,
      label:'A woman’s ring, brought to the scene — a woman is at the root of this, though not the killer here present.',
      yields:'obs_motive' },
    the_cabman:{ from:['cab_wheel','stride','cab_driver'], valid:true,
      label:'A very tall man who handled the cab himself and waited, calm and smoking — the murderer drove his own victim here in a hired four-wheeler.',
      yields:'obs_who' },
  },
  /* yielded observations — the chained conclusions the engine pins as new
     cards; they are what accusations require. */
  yielded:{
    obs_revenge:{ label:'A killing of revenge', tag:'record',
      detail:'Not robbery, not madness — a long-carried vengeance, staged to be read as anything but what it is.' },
    obs_poison:{ label:'Death by poison', tag:'record',
      detail:'The method: a pill, a choice, a swift stopping of the heart. No blade needed where an old hatred can be made to look like fate.' },
    obs_motive:{ label:'A woman at the root', tag:'record',
      detail:'The ring is the whole motive in a single object — a love, a wrong, a debt carried across an ocean and years.' },
    obs_who:{ label:'The murderer is the cabman', tag:'record',
      detail:'Tall, strong, patient, invisible: the one man a victim will climb into a locked box with, in the dead of night, and never think to fear.' },
  },
  accusations:[
    { id:'accuse_rachel', requires:['rache_rachel'], who:'a woman named Rachel',
      theory:'Follow Lestrade: hunt for the woman “Rachel” the dying word half-named.',
      outcome:'o_rachel' },
    { id:'accuse_cabman', requires:['the_cabman','poison'], who:'the night-cabman',
      theory:'The tall cabman who drove the dead man here and watched him die of poison — a killing of old revenge.',
      fork:[
        { t:'Take him in the open street, quietly, and let the law have the whole tragic story', tone:'heart', outcome:'o_cabman_law' },
        { t:'Trap and break him at once with the ring, to force the confession before witnesses', tone:'head', outcome:'o_cabman_trap' },
      ] },
    { id:'decline', requires:[], who:'no one — the evidence will not carry it',
      theory:'Tell Gregson and Lestrade the case is not yet made, and hold your tongue.',
      outcome:'o_study_decline', decline:true },
  ],
  solution:{ culprit:'the cabman', method:'forced poison', motive:'revenge over a woman',
    keyChain:['the_cabman','poison'] },
  outcomes:{
    o_rachel:{ kind:'wrong-arrest', truth:false, norbury:true, head:1,
      title:'A Hunt for Rachel', art:'station',
      text:"Lestrade puts every constable in the division onto the search for a woman named Rachel. There is no woman named Rachel. While London is turned over for a ghost, the tall cabman collects a second fare on a second night — and a second man dies with the same horror on his face. Watson does not write this one up.\n\n“Holmes,” he says quietly, later, by the fire. You already know. You say the word yourself before he can: <em>Norbury.</em>",
      verse:'the obvious, believed, is the murderer’s best alibi' },
    o_cabman_law:{ kind:'solved-true', truth:true, heart:1,
      title:'The Cabman Taken', art:'station',
      text:"You have Wiggins whistle up the very four-wheeler, and when the big man stoops through the doorway you close the bracelet on his wrist before he has straightened. He does not fight. He tells it all — the ring, the woman, the two men who wronged her, the ocean of years he crossed to answer it. There is more grief in him than guilt.\n\n“You would have hanged for the wrong reading, in another man’s hands,” you tell him. Watson writes it up in scarlet, and calls it a study.",
      verse:'the thread pulled gently comes out whole' },
    o_cabman_trap:{ kind:'solved-cruel', truth:true, head:1,
      title:'The Ring as a Snare', art:'station',
      text:"You advertise the found ring, and the killer — or his creature — comes for it, and you spring the room shut like a box. It is faultless work. The confession comes out under pressure, hard and fast, and Gregson takes the credit in the morning papers. The man had a bad heart; the shock of the trap nearly does the hangman’s work early.\n\nCorrect. Airless. Watson watches you enjoy it, and says nothing at all.",
      verse:'brilliance is not the same thing as justice' },
    o_study_decline:{ kind:'unsolved-honest', truth:false,
      title:'Not Yet Made', art:'bakerst',
      text:"“I will not name a man I cannot prove,” you tell Gregson, and go home to Baker Street to think. It is not a triumph. But no innocent is hunted for a name that was never a name, and the ring is still in your pocket, and the work is not finished — only honest.\n\nWatson pours two glasses. “There are worse ways to end a day,” he says.",
      verse:'the unanswered question keeps its dignity' },
  },
});

/* ================================================================== *
 *  CASE 2 — THE SPECKLED BAND  (the fully-worked showpiece, §7a)      *
 *  Locked-room; rich physical clues; a genuinely evil villain; a      *
 *  clean Head/Heart split and an authored wrong-branch. This is the   *
 *  schema template the whole game is proven against.                  *
 * ================================================================== */
defineCase({
  id:'speckled', title:'The Speckled Band', year:'1883',
  epigraph:'“The idea of a serpent instantly occurred to me… the doctor had the means of procuring creatures from India.”',
  brief:'Helen Stoner comes to Baker Street grey with fear at dawn. Two years past, her twin sister died in her locked bedroom crying of “the speckled band.” Now Helen has been moved into that same room, and last night she heard the low whistle her sister spoke of. She is to be married soon. Her stepfather, Dr. Grimesby Roylott, is a violent man with strange tastes and a keen interest in her money.',
  irregulars:2,
  start:'sitting_room',
  scenes:{
    sitting_room:{ backdrop:'bakerst', title:'221B — Helen Stoner’s Fear',
      text:"She sits shivering by the fire though the morning is not cold, and tells it in a rush: the crash of her sister’s door, the dying words, the whistle in the night that woke her three hours ago and sent her running for the first train. On the wrist she holds out to warm at the fire are five livid marks — the print of a man’s thumb and fingers.\n\nListen. The frightened tell you more than they know.",
      reveals:['thumb_marks','dying_words','whistle_night','marriage_soon'],
      actions:[ { t:'To Stoke Moran — the manor', go:'stoke_moran',
          hint:'Roylott is in town raging at a solicitor; the house is yours for an hour.' } ] },
    stoke_moran:{ backdrop:'manor', title:'Stoke Moran',
      text:"A grey Palladian ruin, one wing propped with scaffolding, the family it once housed reduced to this violent old man and a terrified girl. Building work has forced Helen from her own room into her dead sister’s. You may examine the sisters’ rooms, and — if you dare — the doctor’s.",
      reveals:[],
      actions:[
        { t:'Helen’s room — the death-chamber', go:'the_rooms' },
        { t:'Dr. Roylott’s room', go:'doctor_room' },
        { t:'The grounds & outbuildings', go:'grounds' },
        { t:'To the village records office', go:'village_records' },
      ] },
    the_rooms:{ backdrop:'manor', title:'The Death-Chamber',
      text:"The room is plain and old. A bed, a dressing-table, a chair; a bell-pull hanging by the pillow; a ventilator high in the wall above the bed. Small things, ordinary things — until you begin to ask what each is <em>for</em>.",
      reveals:['bell_pull_fake','ventilator_odd','bed_bolted'],
      actions:[ { t:'Back to the landing', go:'stoke_moran' } ] },
    doctor_room:{ backdrop:'manor', title:'Dr. Roylott’s Room',
      text:"A plain room, comfortless, more a cell than a study. A camp-bed, a wooden chair, a round table — and against the wall, a small iron safe. There is a saucer set upon the top of it, and a dog-lash hung on one corner, curled and knotted into a loop.",
      reveals:['safe_in_room','saucer_milk','dog_lash'],
      actions:[ { t:'Back to the landing', go:'stoke_moran' } ] },
    grounds:{ backdrop:'manor', title:'The Grounds',
      text:"Neglected lawns, a straggle of trees, and against the boundary wall a band of travelling folk camped with their fire and their piebald ponies. A wooden building leans by the wall — a kennel, once, or something kept there still. The doctor is known to keep a cheetah and a baboon loose upon the place; the villagers give the wall a wide berth.",
      reveals:['gypsies','wild_beasts'],
      actions:[
        { t:'Send an Irregular after the doctor’s Indian post', irregular:'india_order',
          hint:'A street-boy at the receiving office can read a label no one thinks to hide.' },
        { t:'Back to the landing', go:'stoke_moran' } ] },
    village_records:{ backdrop:'records', title:'The Village Records',
      text:"The parish and the solicitor between them keep the shape of the family’s money — and money, in a house like this, is very often the whole of the matter under the fear.",
      reveals:['will_terms'],
      actions:[ { t:'Back to Stoke Moran', go:'stoke_moran' } ] },
  },
  observations:{
    thumb_marks:{ label:'Five bruises on her wrist', tag:'physical',
      detail:'The livid print of a heavy hand — four fingers and a thumb. Someone has held this frightened woman still, hard, and lately. He is a violent man to live beside.' },
    dying_words:{ label:'“The speckled band!”', tag:'testimony',
      detail:'Her twin’s last cry, through the locked door, two years gone: “the speckled band.” The words have haunted Helen since. But a dying mouth names what it sees, not what it means.' },
    whistle_night:{ label:'A low whistle in the dark', tag:'testimony',
      detail:'Three hours ago, in the black of night, a low clear whistle — and then, she thinks, a soft metallic clang. The same whistle her sister spoke of before she died.' },
    marriage_soon:{ label:'She is soon to marry', tag:'testimony',
      detail:'Helen is engaged; the wedding is set for the spring. Her sister, too, died within a fortnight of her own wedding-day. The pattern is not lost on Helen, and should not be lost on you.' },
    bell_pull_fake:{ label:'A bell-pull that rings nothing', tag:'physical', mono:'bell_pull_fake',
      detail:'The bell-rope by the pillow is a dummy — fixed to a hook, connected to no wire, no bell anywhere in the house answers it. Someone built the look of a bell-pull and none of its function.' },
    ventilator_odd:{ label:'A ventilator to the next room', tag:'physical',
      detail:'A small ventilator, cut recently, high in the wall above the bed — and it opens not to the outside air, as a ventilator should, but into Dr. Roylott’s room beyond the partition.' },
    bed_bolted:{ label:'The bed is clamped to the floor', tag:'physical', req:['bell_pull_fake'],
      detail:'The bed cannot be moved. It is bolted to the boards, held exactly where it stands — directly beneath the dummy bell-pull, directly below the ventilator. Its place was chosen and fixed.' },
    safe_in_room:{ label:'A small iron safe', tag:'physical',
      detail:'A safe, in a bedroom, in a house with nothing left to lock away — small, and large enough to hold a living thing, if a living thing could be made to lie coiled and quiet.' },
    saucer_milk:{ label:'A saucer of milk', tag:'physical',
      detail:'A saucer with a little milk in it, on the top of the safe. Roylott keeps a cheetah on the grounds — but no cat, and certainly no cheetah, could be fed from a saucer that size.' },
    dog_lash:{ label:'A looped dog-lash', tag:'physical', req:['saucer_milk'],
      detail:'A dog-lash hung on the bedstead, its end tied back into a running loop — the kind of small noose a man makes to catch and hold a creature by the neck, and let it go again.' },
    gypsies:{ label:'A band of travellers camped', tag:'testimony',
      detail:'Romani folk about their fire by the wall, with a spotted handkerchief or two knotted at their throats. The village mutters about them. They are the easiest suspects on the ground — which is worth remembering.' },
    wild_beasts:{ label:'A cheetah and a baboon loose', tag:'testimony',
      detail:'The doctor’s Indian menagerie wanders the grounds at night. Frightening — theatrically so. But neither cheetah nor baboon passes through a ventilator the width of a hand.' },
    will_terms:{ label:'The terms of the will', tag:'record',
      detail:'The late mother’s money is held by Roylott — but on each daughter’s marriage a third falls away to her, and the doctor, near ruin, cannot spare a penny of it. Two weddings would leave him nothing. One sister is already dead. The other is engaged.' },
    india_order:{ label:'An order to a Calcutta dealer', tag:'testimony', irregular:true,
      detail:'The Irregular brings back a docket from the receiving office: the doctor lately took delivery, carriage paid from Calcutta, of a live consignment — a small snake, a swamp adder, the deadliest in India, whose bite the European tests cannot even find.' },
  },
  inferences:{
    speckled_gypsies:{ from:['dying_words','gypsies'], valid:false,
      label:'“The speckled band” means the gypsy troupe — their spotted scarves, camped at the wall.',
      note:'The seductive obvious reading, and the one the dying words seem to hand you. Follow it and innocents suffer.' },
    speckled_beast:{ from:['dying_words','wild_beasts'], valid:false,
      label:'“The speckled band” is the doctor’s cheetah or baboon, loose in the night.',
      note:'Frightening, and false — no beast that size comes through a hand’s-breadth vent.' },
    air_route:{ from:['ventilator_odd','bell_pull_fake','bed_bolted'], valid:true,
      label:'The vent, the dummy pull, and the bolted bed are one machine: something is meant to travel down from the doctor’s room onto a sleeper who cannot move away.',
      yields:'obs_route' },
    the_lure:{ from:['saucer_milk','whistle_night','dog_lash'], valid:true,
      label:'The milk, the whistle, the looped lash — the thing is trained: summoned by the whistle, rewarded with milk, handled by the noose.',
      yields:'obs_trained' },
    the_creature:{ from:['obs_route','obs_trained','safe_in_room'], valid:true,
      label:'A small venomous creature, kept coiled in the safe, sent down the pull and recalled — a snake. THE speckled band.',
      yields:'obs_snake' },
    motive_money:{ from:['will_terms','marriage_soon'], valid:true,
      label:'He kills his stepdaughters before their weddings can drain the estate from his hands. The first is dead; the second is engaged.',
      yields:'obs_motive' },
  },
  yielded:{
    obs_route:{ label:'A path built for a killer', tag:'record',
      detail:'The room was made into a weapon by patient carpentry: a way in above the bed, a false rope to guide the descent, a bed pinned where the victim must lie.' },
    obs_trained:{ label:'A trained, summoned thing', tag:'record',
      detail:'Whatever comes down the rope is no accident of nature — it is called, fed, and taken back by a hand that has done this before.' },
    obs_snake:{ label:'A swamp adder — the speckled band', tag:'record', mono:'m_ash',
      detail:'The dying girl named exactly what she saw in the dark and could not understand: a speckled band about a striking head. A snake, and the deadliest kind.' },
    obs_motive:{ label:'Money before the marriage', tag:'record',
      detail:'The whole cold arithmetic: a daughter married is a third of his living gone. He has done his sums, and answered them with an adder.' },
  },
  accusations:[
    { id:'accuse_gypsies', requires:['speckled_gypsies'], who:'the gypsy band',
      theory:'The “speckled band” is the travelling folk at the wall; have them taken up for the sister’s death.',
      outcome:'o_gypsies' },
    { id:'accuse_beast', requires:['speckled_beast'], who:'the doctor’s beasts',
      theory:'A loose cheetah or baboon killed the sister; warn Helen to bar her door against the menagerie.',
      outcome:'o_beast' },
    { id:'accuse_roylott', requires:['the_creature'], who:'Dr. Grimesby Roylott',
      theory:'Roylott sends a swamp adder down the dummy bell-pull to kill his stepdaughters before their weddings free their money. Keep the vigil in Helen’s room tonight and answer it.',
      fork:[
        { t:'When the thing comes down the rope, strike it back through the vent with the cane — let it find its master', tone:'head', outcome:'o_roylott_strike' },
        { t:'Rouse the whole house and take Roylott alive, the adder in its safe as proof for the law', tone:'heart', outcome:'o_roylott_law' },
      ] },
    { id:'decline', requires:[], who:'no one tonight',
      theory:'The chain is not yet closed. Get Helen away to her aunt at Harrow and refuse to name what you cannot prove.',
      outcome:'o_speckled_decline', decline:true },
  ],
  solution:{ culprit:'Dr. Roylott', method:'a trained swamp adder through the ventilator',
    motive:'to keep the daughters’ inheritance', keyChain:['the_creature','motive_money'] },
  outcomes:{
    o_gypsies:{ kind:'wrong-arrest', truth:false, norbury:true, head:1,
      title:'The Band at the Wall', art:'manor',
      text:"The travelling folk are dragged before the magistrate on your word, and scatter, and their name is blackened in three parishes. It changes nothing at Stoke Moran. Within the fortnight Helen Stoner dies in the locked room as her sister did, with the same cry on her lips, and you understand — too late, and forever — that the band was never at the wall.\n\n<em>Norbury,</em> you tell Watson, before he can be kind about it.",
      verse:'the easiest suspect is the oldest lie' },
    o_beast:{ kind:'wrong-arrest', truth:false, norbury:true, head:1,
      title:'A Fear of the Menagerie', art:'manor',
      text:"You have Helen bar her door against cheetah and baboon, and feel you have done well. But nothing that walks on four legs was ever the danger. The ventilator does its work on schedule; the whistle sounds; the house keeps its secret and takes its second daughter. You mistook the theatre for the trick.\n\n<em>Norbury.</em>",
      verse:'a loud danger is often the cover for a quiet one' },
    o_roylott_strike:{ kind:'solved-true', truth:true, head:1,
      title:'Turned Back on Its Master', art:'nightvigil',
      text:"You wait in the dark of the death-chamber with the cane across your knee. The whistle comes; the rope stirs; the speckled thing pours down onto the pillow where Helen was meant to sleep — and you lash at it until it flees back up the vent in a fury. From beyond the partition comes a dreadful cry, cut short. In the morning Dr. Grimesby Roylott sits dead in his chair, the adder coiled like a ghastly turban about his brow.\n\nIt is justice of a kind. “I am no doubt indirectly responsible,” you tell Watson, and find the weight sits lightly. Perhaps too lightly.",
      verse:'the machine, set for another, will take the hand that built it' },
    o_roylott_law:{ kind:'solved-true', truth:true, heart:1,
      title:'Taken With the Proof', art:'nightvigil',
      text:"You will not have a death on your conscience if a living man in the dock will do. When the whistle sounds you rouse the whole house at once, bar the doctor’s door from without, and hold him roaring while the constable finds the swamp adder coiled in its safe — the whole cold machine laid open for the law to read. He hangs, in the end, for what he built, and Helen is married in the spring after all.\n\nWatson thinks it the finer ending. On balance, you agree.",
      verse:'a living man in the dock is worth two over the falls' },
    o_speckled_decline:{ kind:'unsolved-honest', truth:false,
      title:'Away to Harrow', art:'bakerst',
      text:"You cannot yet prove the how, and you will not send anyone to the gallows on a shudder. So you do the one thing that saves the living girl: you get Helen Stoner out of that house tonight, to her aunt at Harrow, and let the estate keep its ugly secret a while longer. Roylott is not answered. But Helen is alive, and no innocent is blamed, and the case sits open and honest on the shelf.\n\n“Sometimes the win is only that no one else is hurt,” says Watson. You let it stand.",
      verse:'to save the living is not always to solve the dead' },
  },
});
