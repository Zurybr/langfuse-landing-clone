# Guía: Cómo crear y extender animaciones en Hairline

Esta guía explica cómo crear tus propias figuras vectoriales isométricas interactivas y cómo extender la librería `@lucasmarkes/hairline` en tu proyecto.

---

## 1. Arquitectura y Principios de Hairline

Hairline no usa librerías pesadas (ni Three.js, ni Framer Motion, ni GSAP). Se basa en:
1. **SVG Puro**: Trazos limpios con esquinas redondeadas (`rrect`, `prism`, `rings`, `fillet`) en un `viewBox` de `400 × 320`.
2. **Cámara Isométrica**: Ángulo 2:1 (`Cam(45, 0.5, escala)`) donde $+x$ baja a la derecha y $+y$ a la izquierda.
3. **Física a 60fps**: Resortes continuos (`spring`, `stepS`) con amortiguación real e inercia.
4. **Modo Dormido (Zero CPU cost)**: Cuando los objetos llegan al reposo, el bucle de render se detiene automáticamente.

---

## 2. Las 10 Reglas de Diseño Hairline

| # | Regla | Qué significa |
|---|---|---|
| **01** | **Hit** | Las colisiones con el puntero se calculan sobre la pose de reposo, nunca sobre la pose distorsionada. |
| **02** | **Order** | La propagación entre piezas es escalonada por distancia (*staggers* físicos). |
| **03** | **Reach** | Los movimientos tienen límites físicos estrictos (`clamp`). |
| **04** | **Accent** | El resaltado (`.hi`) solo cambia el trazo de gris a color principal, sin rellenos estridentes. |
| **05** | **Rest** | La pose de reposo debe tener interés visual; no dejar la figura plana ni vacía. |
| **06** | **Honesty** | Las bases son opacas y se pintan de atrás hacia adelante (orden de profundidad isométrica). |
| **07** | **Cost** | El bucle `requestAnimationFrame` se suspende cuando todo está en reposo o fuera de vista. |
| **08** | **Clock** | Resortes (`spring`) para seguimiento continuo; transiciones (`tween`) para saltos discretos. |
| **09** | **Radius** | Sólidos con esquinas biseladas (`prism` o `rings`), nunca cubos de líneas rectas secas. |
| **10** | **Quiet** | Sin texto dentro del dibujo 3D; las lecturas van en la etiqueta externa (`read.textContent` / `onRead`). |

---

## 3. Flujo para crear una animación desde cero

### Paso 1: Copiar la plantilla base
En la raíz de tu proyecto tienes `figures-custom-template.js`:
```bash
cp figures-custom-template.js mi-animacion.js
```

### Paso 2: Definir tu figura
Estructura mínima de tu archivo:

```javascript
const {
  Cam, fit, proj, facing, rings, prism,
  spring, stepS, mk, solid, put, pointer, register, disposer
} = HL;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.6);

  fit(C, [[-40, -40, -4], [40, 40, 30]], 200, 166);

  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  let LIFT_MAX = value;
  let active = false;

  // 1. Plinto base
  const [baseRing, baseInner] = rings(-30, -30, 30, 30, 6, 1.5);
  const baseEl = solid(g);
  put(baseEl, prism(P, front, baseRing, baseInner, -4, 0));

  // 2. Pieza móvil con resorte físico
  const [coreRing, coreInner] = rings(-16, -16, 16, 16, 4, 1.0);
  const coreEl = solid(g);
  const coreSpring = spring(0, { k: 140, c: 16, m: 1 });

  function draw() {
    const z = coreSpring.x;
    put(coreEl, prism(P, front, coreRing, coreInner, z, z + 10));
    coreEl.sil.setAttribute("class", active ? "hi" : "sil");
  }

  // 3. Bucle 60fps con parada automática
  const loop = register(stage, (dt) => {
    const moving = stepS(coreSpring, dt);
    draw();
    return moving;
  });
  bag.add(loop.unregister);

  function retarget() {
    coreSpring.t = active ? LIFT_MAX : 0;
    read.textContent = active ? `lift · ${coreSpring.x.toFixed(1)}` : "rest";
    loop.wake();
  }

  // 4. Interacción con el cursor
  bag.add(pointer(stage, {
    move: (p) => {
      const center = P(0, 0, 0);
      const isNear = Math.hypot(p[0] - center[0], p[1] - center[1]) < 60;
      if (isNear !== active) {
        active = isNear;
        retarget();
      }
    },
    leave: () => {
      if (active) {
        active = false;
        retarget();
      }
    }
  }));

  bag.add(() => svg.replaceChildren());
  draw();

  return {
    set: (v) => { LIFT_MAX = v; retarget(); },
    destroy: bag.dispose
  };
}

hairline({
  name: "mi-animacion",
  means: "Descripción en una frase de la figura y cómo reacciona.",
  rules: [1, 4, 5, 8],
  range: [10, 25, 45], // [min, defecto, max] conducido por intensity
  mount
});
```

---

## 4. Compilar y Validar con la Skill Oficial

Tu proyecto ya tiene la skill `hairline-create` configurada. Para compilar tu figura a una página HTML autónoma:

```bash
# Compilar a HTML independiente
node .agents/skills/hairline-create/build.mjs mi-animacion.js

# Comprobar que cumple las 10 reglas estáticas
node .agents/skills/hairline-create/validate.mjs hairline-mi-animacion.html
```

El resultado es `hairline-mi-animacion.html`: un archivo HTML que funciona sin servidor, con slider de intensidad y soporte para temas claro/oscuro.

---

## 5. Extender la Librería en Caliente (`Hairline.register`)

Para registrar tu figura directamente en la web sin compilar:

```javascript
Hairline.register('miAnimacion', function(container, options = {}) {
  const intensity = options.intensity ?? 0.7;
  // Montar SVG, puntero y resortes...

  return {
    update(newOptions) {
      // actualizar intensidad o tema
    },
    destroy() {
      // limpiar eventos
    }
  };
}, {
  name: 'Mi Animación',
  category: 'Custom',
  desc: 'Descripción de mi animación propia.',
  intensityEffect: 'Mayor recorrido de elevación.'
});
```

Una vez registrada, puedes usarla en React:
```jsx
<MiAnimacion intensity={0.8} theme="auto" />
```
O en Vanilla JS:
```javascript
const fig = Hairline.miAnimacion(document.getElementById('slot'), {
  intensity: 0.85
});
```
