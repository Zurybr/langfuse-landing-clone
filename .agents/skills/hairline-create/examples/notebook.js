/**
 * Notebook: A hardback notebook opening its cover under the pointer as a
 * fountain pen writes cursive ink trails across the ruled page.
 */
const {
  Cam, clamp, facing, fit, hull, mk, open, poly, proj, rad,
  rings, run, seg, solid, put, prism, spring, stepS, disposer, pointer, register, lerp
} = HL;

function mount({ stage, svg, read }, value) {
  const bag = disposer(), C = Cam(45, 0.5, 1.5);
  const PW = 48, PL = 72, HL = PL / 2, TH = 4, REST = 22;
  let MAX_A = value, hovered = false, inkPts = [];

  fit(C, [[-PW - 12, -HL - 10, -6], [PW + 24, HL + 10, -6], [-PW - 12, -HL - 10, 40], [PW + 24, HL + 10, 40]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);

  // Plinth base and pen groove
  const [dR, dI] = rings(-PW - 8, -HL - 8, PW + 16, HL + 8, 8, 2.0);
  put(solid(g), prism(P, front, dR, dI, -6, -2));
  mk("path", { class: "nf lo", d: seg(P(PW + 6, -24, -2), P(PW + 6, 24, -2)) }, g);

  // Notebook back cover and block of pages
  const [bkR, bkI] = rings(-1, -HL, PW + 2, HL, 4, 1.2);
  put(solid(g), prism(P, front, bkR, bkI, -2, 0));
  const [pgR, pgI] = rings(2, -HL + 2, PW, HL - 2, 3, 1.0);
  put(solid(g), prism(P, front, pgR, pgI, 0, TH));

  // Ruled lines on the page
  let ruled = "";
  for (let i = 0; i < 7; i++) {
    const ly = lerp(-HL + 12, HL - 12, i / 6);
    ruled += seg(P(8, ly, TH), P(PW - 6, ly, TH));
  }
  mk("path", { class: "nf lo", d: ruled }, g);

  // Bookmark ribbon
  mk("path", { class: "lo", d: open([P(0, -HL + 4, TH), P(8, 0, TH), P(16, HL - 4, TH), P(20, HL + 12, -2)]) }, g);

  // Dynamic elements: cover, ink, pen
  const cover = solid(mk("g", {}, g)), inkPath = mk("path", { class: "hi" }, g);
  const penG = mk("g", {}, g), penBody = solid(penG);
  const penNib = mk("path", { class: "hi" }, penG), penClip = mk("path", { class: "sil" }, penG);

  // Springs
  const spC = spring(REST, { k: 90, c: 15, eps: 0.1 });
  const spX = spring(PW + 7, { k: 110, c: 17, eps: 0.1 });
  const spY = spring(-8, { k: 110, c: 17, eps: 0.1 });
  const spZ = spring(-1, { k: 130, c: 18, eps: 0.1 });
  const spT = spring(14, { k: 100, c: 16, eps: 0.1 });

  function drawCover(deg) {
    const rA = rad(deg), cosA = Math.cos(rA), sinA = Math.sin(rA);
    const rot = (u, v, w) => [u * cosA, v, TH * (1 - deg / 180) + u * sinA + w];
    const [cr, ci] = rings(0, -HL, PW + 2, HL, 4, 1.2);
    const plane = (r, w) => r.map((pt) => P(...rot(pt.u, pt.v, w)));
    put(cover, { sil: poly(hull(plane(cr, -1.2).concat(plane(cr, 1.2)))), crease: open(plane(run(ci, front), 1.2)) });
    cover.sil.setAttribute("class", hovered ? "sil" : "hi");
  }

  function drawPen(px, py, pz, tilt) {
    const rA = rad(tilt), len = 36, dx = Math.sin(rA) * 0.7, dy = -Math.sin(rA) * 0.7, dz = Math.cos(rA);
    const tip = P(px, py, pz), top = P(px + dx * len, py + dy * len, pz + dz * len);
    const shL = P(px + dx * 6 - 2.5, py + dy * 6, pz + dz * 6), shR = P(px + dx * 6 + 2.5, py + dy * 6, pz + dz * 6);
    const cpL = P(px + dx * len - 3, py + dy * len, pz + dz * len), cpR = P(px + dx * len + 3, py + dy * len, pz + dz * len);

    penNib.setAttribute("d", poly([tip, shL, shR]));
    put(penBody, { sil: poly([shL, cpL, cpR, shR]), crease: seg(shL, shR) });
    penClip.setAttribute("d", seg(cpR, P(px + dx * 18 + 3.5, py + dy * 18, pz + dz * 18)));
  }

  const loop = register(stage, (dt) => {
    const m1 = stepS(spC, dt), m2 = stepS(spX, dt), m3 = stepS(spY, dt), m4 = stepS(spZ, dt), m5 = stepS(spT, dt);
    drawCover(spC.x);
    drawPen(spX.x, spY.x, spZ.x, spT.x);
    inkPath.setAttribute("d", inkPts.length > 1 ? open(inkPts) : "");
    return m1 || m2 || m3 || m4 || m5;
  });
  bag.add(loop.unregister);

  function retarget() {
    if (hovered) {
      spC.t = MAX_A;
      spZ.t = TH + 0.3;
      spT.t = 50;
    } else {
      spC.t = REST;
      spX.t = PW + 7;
      spY.t = -8;
      spZ.t = -1;
      spT.t = 14;
      inkPts.length = 0;
      read.textContent = "rest";
    }
    loop.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const c = P(PW / 2, 0, TH);
      const isNear = Math.hypot(p[0] - c[0], p[1] - c[1]) < 110;
      if (isNear) {
        if (!hovered) { hovered = true; retarget(); }
        const tx = clamp(lerp(8, PW - 8, clamp((p[0] - (c[0] - 60)) / 120, 0, 1)), 8, PW - 8);
        const ty = clamp(lerp(-HL + 12, HL - 12, clamp((p[1] - (c[1] - 50)) / 100, 0, 1)), -HL + 12, HL - 12);
        spX.t = tx;
        spY.t = ty;
        inkPts.push(P(spX.x, spY.x, TH));
        if (inkPts.length > 26) inkPts.shift();
        const ln = Math.floor(clamp((ty + HL - 8) / (PL - 16), 0, 0.99) * 7) + 1;
        read.textContent = `writing · ln ${ln} · ${inkPts.length}w`;
        loop.wake();
      } else if (hovered) {
        hovered = false;
        retarget();
      }
    },
    leave: () => {
      if (hovered) { hovered = false; retarget(); }
    }
  }));

  bag.add(() => svg.replaceChildren());
  drawCover(REST);
  drawPen(PW + 7, -8, -1, 14);

  return {
    set: (v) => { MAX_A = v; retarget(); },
    destroy: bag.dispose
  };
}

hairline({
  name: "notebook",
  means: "A hardback notebook opening its cover under the pointer as a fountain pen writes cursive across the ruled page.",
  rules: [1, 4, 5, 8],
  range: [110, 145, 175],
  mount
});
