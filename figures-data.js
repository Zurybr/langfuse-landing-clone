// figures-data.js — Catalog of all 27 Hairline figures with intensity behaviors

const HAIRLINE_FIGURES = [
  {
    id: "riffle",
    name: "Riffle",
    intensityEffect: "The ripple spreads further from the pulled card.",
    desc: "A tray of eight cards. The card under the pointer stands up and its neighbours lean after it. The arrow keys walk the cards.",
    category: "Mechanics",
    defaultIntensity: 0.70
  },
  {
    id: "terrain",
    name: "Terrain",
    intensityEffect: "A wider area rises.",
    desc: "Eighty-one pillars on a plinth. They rise around the pointer and settle back into a dune with two rises.",
    category: "Physical",
    defaultIntensity: 0.65
  },
  {
    id: "exploded",
    name: "Exploded",
    intensityEffect: "The layers open further.",
    desc: "An app window taken apart into four layers. Moving across opens the gap; moving down picks a layer.",
    category: "Hardware & UI",
    defaultIntensity: 0.80
  },
  {
    id: "phosphor",
    name: "Phosphor",
    intensityEffect: "The trail lingers longer.",
    desc: "A seven by seven dot matrix playing a loop. Where the pointer paints, the dots fade like phosphor.",
    category: "Physical",
    defaultIntensity: 0.75
  },
  {
    id: "slow",
    name: "Slow",
    intensityEffect: "Time slows down more.",
    desc: "Crates riding a belt through a gate. Hovering slows the clock without stopping it.",
    category: "Mechanics",
    defaultIntensity: 0.70
  },
  {
    id: "turntable",
    name: "Turntable",
    intensityEffect: "The spin coasts longer.",
    desc: "Blocks on a turntable. A flick across it spins it, and it settles on the nearest quarter turn.",
    category: "Mechanics",
    defaultIntensity: 0.60
  },
  {
    id: "keyboard",
    name: "Keyboard",
    intensityEffect: "A wider patch of keys sinks.",
    desc: "Sixty keys in a block. The key under the pointer sinks and its neighbours follow it down, less the further away.",
    category: "Hardware & UI",
    defaultIntensity: 0.70
  },
  {
    id: "elevator",
    name: "Elevator",
    intensityEffect: "The car travels faster between floors.",
    desc: "Four floors with the shaft open and the car inside. The pointer's height picks the floor; the car travels there.",
    category: "Mechanics",
    defaultIntensity: 0.65
  },
  {
    id: "phone",
    name: "Phone",
    intensityEffect: "The layers open further.",
    desc: "A phone in layers: glass, board, battery, shell. Moving across opens the gap; moving down picks a layer.",
    category: "Hardware & UI",
    defaultIntensity: 0.75
  },
  {
    id: "laptop",
    name: "Laptop",
    intensityEffect: "The lid opens wider.",
    desc: "A thin laptop, open on its hinge. The pointer's height sets the lid; it follows on a spring.",
    category: "Hardware & UI",
    defaultIntensity: 0.70
  },
  {
    id: "terminal",
    name: "Terminal",
    intensityEffect: "The lift spreads further.",
    desc: "A terminal window with its history in rows. The pointer's height scrolls back; the line under it lifts and its neighbours follow.",
    category: "Hardware & UI",
    defaultIntensity: 0.75
  },
  {
    id: "cabinet",
    name: "Cabinet",
    intensityEffect: "More blades come out.",
    desc: "A rack of twelve blades, a few half out. The pointer's height pulls the nearest ones out, the farther the less.",
    category: "Hardware & UI",
    defaultIntensity: 0.70
  },
  {
    id: "branches",
    name: "Branches",
    intensityEffect: "More of the history rises.",
    desc: "A commit graph with a branch forking off main and merging back. The commit under the pointer rises, and its history rises after it.",
    category: "System & Logic",
    defaultIntensity: 0.70
  },
  {
    id: "vault",
    name: "Vault",
    intensityEffect: "The dial coasts longer.",
    desc: "A vault door with a dial and three bolts. The pointer turns the dial; detents catch every ten, and on the combination the bolts draw back.",
    category: "Mechanics",
    defaultIntensity: 0.65
  },
  {
    id: "lockers",
    name: "Lockers",
    intensityEffect: "The door opens wider.",
    desc: "A bank of twelve lockers, one ajar at rest. The locker under the pointer opens; the one at rest closes.",
    category: "Mechanics",
    defaultIntensity: 0.70
  },
  {
    id: "padlock",
    name: "Padlock",
    intensityEffect: "The shackle swings further.",
    desc: "A padlock with its shackle in. As the pointer comes near the shackle lifts out and swings open.",
    category: "Mechanics",
    defaultIntensity: 0.75
  },
  {
    id: "patch",
    name: "Patch",
    intensityEffect: "The lean spreads further.",
    desc: "A patch panel of twenty-four ports with cables. The cable under the pointer lifts and its neighbours lean away.",
    category: "Hardware & UI",
    defaultIntensity: 0.70
  },
  {
    id: "dish",
    name: "Dish",
    intensityEffect: "The dish swings further.",
    desc: "A parabolic dish on a two-axis gimbal. The pointer aims the dish; it follows on a spring.",
    category: "Hardware & UI",
    defaultIntensity: 0.70
  },
  {
    id: "router",
    name: "Router",
    intensityEffect: "The lean spreads further.",
    desc: "A router with its antennas up. Each antenna leans toward the pointer, the nearest most.",
    category: "Hardware & UI",
    defaultIntensity: 0.75
  },
  {
    id: "loupe",
    name: "Loupe",
    intensityEffect: "The glass magnifies more.",
    desc: "A stand loupe on a blank ruled sheet. The pointer drags it across; the rules pass enlarged under the glass, with nothing between them.",
    category: "Physical",
    defaultIntensity: 0.70
  },
  {
    id: "sieve",
    name: "Sieve",
    intensityEffect: "The gap opens further.",
    desc: "Three test sieves stacked over a pan. The pointer's height picks one; it rises clear of the stack, and every mesh is bare.",
    category: "Physical",
    defaultIntensity: 0.60
  },
  {
    id: "rail",
    name: "Rail",
    intensityEffect: "The brush reaches more hangers.",
    desc: "A garment rail with seven bare hangers. The pointer brushes them; each rocks away, the nearest most, and settles.",
    category: "Mechanics",
    defaultIntensity: 0.70
  },
  {
    id: "plug",
    name: "Plug",
    intensityEffect: "The plug comes closer to the socket.",
    desc: "A wall socket, and a plug lying on the floor at the end of its cord. The pointer draws the plug up toward the socket; it stops short, and falls back.",
    category: "Hardware & UI",
    defaultIntensity: 0.75
  },
  {
    id: "query",
    name: "Query",
    intensityEffect: "The hook turns further.",
    desc: "A question mark built as a bent bar over a loose ball. The hook turns toward the pointer, and the ball rolls after it.",
    category: "System & Logic",
    defaultIntensity: 0.70
  },
  {
    id: "drawer",
    name: "Drawer",
    intensityEffect: "The drawer opens further.",
    desc: "A cabinet of three drawers. The pointer's height picks one; it slides out and shows two dividers with nothing between them.",
    category: "Mechanics",
    defaultIntensity: 0.65
  },
  {
    id: "basket",
    name: "Basket",
    intensityEffect: "The basket tilts further.",
    desc: "A wire basket under a bail handle. It tilts toward the pointer and shows its bare floor; the handle swings after it.",
    category: "Mechanics",
    defaultIntensity: 0.70
  },
  {
    id: "plot",
    name: "Plot",
    intensityEffect: "The tabs lift higher.",
    desc: "A bar chart with seven flat tabs where the bars would stand. The pointer brushes them; each lifts a little and drops back to zero.",
    category: "System & Logic",
    defaultIntensity: 0.65
  },
  {
    id: "notebook",
    name: "Notebook",
    intensityEffect: "The cover opens wider and the pen writes with longer ink flourishes.",
    desc: "A hardback notebook opening its cover under the pointer as a fountain pen writes cursive across the ruled page.",
    category: "Custom",
    defaultIntensity: 0.75
  }
];

if (typeof window !== "undefined") {
  window.HAIRLINE_FIGURES = HAIRLINE_FIGURES;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = HAIRLINE_FIGURES;
}
