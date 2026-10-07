/**
 * Trace: an execution hierarchy of five agent spans on an isometric tray.
 * The span under the pointer lifts up on a spring; its children follow on a
 * distance-staggered delay, and the active span takes the bright highlight.
 * The slider controls the lift height, in viewBox units.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, mk, open, poly, proj, rad,
  ringAt, rings, rrect, run, seg, solid, put, prism,
  spring, stepS, disposer, pointer, register, flatDot, place
} = HL;

const SPANS = [
  { id: "root", label: "span · root", w: 100, d: 24, off: 0 },
  { id: "gen1", label: "gen · gpt-4", w: 86, d: 22, off: 12 },
  { id: "tool", label: "tool · retrieve", w: 72, d: 22, off: 24 },
  { id: "db",   label: "db · vector-search", w: 58, d: 20, off: 36 },
  { id: "eval", label: "eval · judge", w: 46, d: 20, off: 48 },
];

const N = SPANS.length;
const Y_STEP = 26;
const BASE_H = 6;
const PB = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.6);

  // Fit camera box
  fit(C, [
    [-10, -10, -PB],
    [120, N * Y_STEP + 16, -PB],
    [120, -10, -PB],
    [-10, N * Y_STEP + 16, -PB],
    [0, 0, 50]
  ], 200, 166);

  const P = proj(C), front = facing(C);
  let LIFT_MAX = value;
  let activeIdx = -1;

  const g = mk("g", {}, svg);

  // Plinth / base tray
  const [pr, pi] = rings(-8, -8, 114, N * Y_STEP + 10, 8, 2.0);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));

  // Guide rails
  const rails = mk("path", { class: "dash" }, g);
  let railSegs = "";
  for (let i = 0; i < N; i++) {
    const sp = SPANS[i];
    const y = i * Y_STEP + 2;
    railSegs += seg(P(sp.off, y, 0), P(sp.off + sp.w, y, 0));
  }
  rails.setAttribute("d", railSegs);

  // Each span as a solid block with spring
  const items = [];
  for (let i = 0; i < N; i++) {
    const sp = SPANS[i];
    const y0 = i * Y_STEP + 2;
    const y1 = y0 + sp.d;
    const x0 = sp.off;
    const x1 = x0 + sp.w;
    const [ring, inner] = rings(x0, y0, x1, y1, 3.2, 1.0);
    const el = solid(g);
    const sprg = spring(0, { k: 120, c: 18, m: 1, eps: 0.05 });
    items.push({
      i,
      info: sp,
      x0, x1, y0, y1,
      ring, inner,
      el,
      sprg,
      drawn: NaN,
      restY: (y0 + y1) / 2
    });
  }

  // Active dot indicator
  const dotG = mk("g", {}, g);
  const dotEl = flatDot(dotG, C, 0.7, "dot");

  function drawItem(item) {
    const lift = Math.max(0, item.sprg.x);
    if (Math.abs(lift - item.drawn) < 0.04) return;
    item.drawn = lift;
    const z0 = 1 + lift;
    const z1 = z0 + BASE_H;
    put(item.el, prism(P, front, item.ring, item.inner, z0, z1));
    item.el.sil.classList.toggle("hi", item.i === activeIdx || (activeIdx === -1 && item.i === 0));
  }

  function updateDot() {
    const targetIdx = activeIdx >= 0 ? activeIdx : 0;
    const it = items[targetIdx];
    const z = 1 + Math.max(0, it.sprg.x) + BASE_H;
    const pt = P(it.x0 + 8, it.y0 + 7, z);
    place(dotEl, pt);
    it.el.g.after(dotG);
  }

  const loop = register(stage, (dt) => {
    let moving = false;
    for (const item of items) {
      if (stepS(item.sprg, dt)) moving = true;
      drawItem(item);
    }
    updateDot();
    return moving;
  });
  bag.add(loop.unregister);

  function retarget() {
    for (let i = 0; i < N; i++) {
      const it = items[i];
      if (activeIdx < 0) {
        it.sprg.t = 0;
      } else {
        const dist = Math.abs(i - activeIdx);
        const fall = dist === 0 ? 1 : dist === 1 ? 0.42 : dist === 2 ? 0.15 : 0;
        it.sprg.t = LIFT_MAX * fall;
      }
    }
    if (activeIdx >= 0) {
      read.textContent = items[activeIdx].info.label;
    } else {
      read.textContent = "rest";
    }
    loop.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      // Find item under pointer by testing screen distance to item rest positions
      let best = -1, bestDist = 45;
      for (let i = 0; i < N; i++) {
        const it = items[i];
        const center = P((it.x0 + it.x1) / 2, it.restY, 0);
        const d = Math.hypot(p[0] - center[0], p[1] - center[1]);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      if (best !== activeIdx) {
        activeIdx = best;
        retarget();
      }
    },
    leave: () => {
      activeIdx = -1;
      retarget();
    }
  }));

  bag.add(() => svg.replaceChildren());

  // Initial draw
  items.forEach(drawItem);
  updateDot();

  return {
    set: (v) => {
      LIFT_MAX = v;
      retarget();
    },
    destroy: bag.dispose
  };
}

hairline({
  name: "trace",
  means: "An execution hierarchy of agent spans: hovering lifts the active span and its children follow on springs.",
  rules: [1, 2, 4, 8],
  range: [12, 24, 38],
  mount,
});
