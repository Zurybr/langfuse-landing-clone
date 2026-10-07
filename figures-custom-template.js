/**
 * Plantilla para crear figuras personalizadas en Hairline
 *
 * Compilar con:
 *   node .agents/skills/hairline-create/build.mjs figures-custom-template.js
 * Validar con:
 *   node .agents/skills/hairline-create/validate.mjs hairline-custom-template.html
 */

const {
  Cam, fit, proj, facing,
  rings, prism, rrect, circ, poly, open, seg, fillet, hull,
  spring, stepS, tween, tset,
  mk, solid, put, pointer, register, disposer, clamp, lerp
} = HL;

function mount({ stage, svg, read }, value) {
  const bag = disposer();

  // 1. Cámara isométrica: 45 grados de azimut, 2:1 elevación, escala 1.6
  const C = Cam(45, 0.5, 1.6);

  // 2. Centrado en el viewBox 400x320
  fit(C, [
    [-40, -40, -4],
    [40, 40, -4],
    [-40, 40, 30],
    [40, -40, 30]
  ], 200, 166);

  const P = proj(C);
  const front = facing(C);

  const g = mk("g", {}, svg);

  let LIFT_MAX = value;
  let isActive = false;

  // Plinto / Base sólida
  const [baseRing, baseInner] = rings(-32, -32, 32, 32, 8, 1.8);
  const baseEl = solid(g);
  put(baseEl, prism(P, front, baseRing, baseInner, -4, 0));

  // Pieza móvil sobre resorte
  const [coreRing, coreInner] = rings(-18, -18, 18, 18, 5, 1.2);
  const coreEl = solid(g);
  const coreSpring = spring(0, { k: 140, c: 16, m: 1, eps: 0.05 });

  function draw() {
    const z = coreSpring.x;
    put(coreEl, prism(P, front, coreRing, coreInner, z, z + 12));
    coreEl.sil.setAttribute("class", isActive ? "hi" : "sil");
  }

  // Bucle de animación a 60fps (se duerme cuando la física se detiene)
  const loop = register(stage, (dt) => {
    const moving = stepS(coreSpring, dt);
    draw();
    return moving;
  });
  bag.add(loop.unregister);

  function retarget() {
    coreSpring.t = isActive ? LIFT_MAX : 0;
    read.textContent = isActive ? `lift · ${coreSpring.x.toFixed(1)}` : "rest";
    loop.wake();
  }

  // Interacción con el puntero
  bag.add(pointer(stage, {
    move: (p) => {
      const center = P(0, 0, 0);
      const dist = Math.hypot(p[0] - center[0], p[1] - center[1]);
      const nextActive = dist < 60;
      if (nextActive !== isActive) {
        isActive = nextActive;
        retarget();
      }
    },
    leave: () => {
      if (isActive) {
        isActive = false;
        retarget();
      }
    }
  }));

  bag.add(() => svg.replaceChildren());

  draw();

  return {
    set: (v) => {
      LIFT_MAX = v;
      retarget();
    },
    destroy: bag.dispose
  };
}

hairline({
  name: "custom-template",
  means: "A rounded isometric plinth with a suspended central core that springs upward when hovered.",
  rules: [1, 4, 5, 8],
  range: [10, 24, 40],
  mount
});
