// hairline-showcase.js — Interactive isometric figures powered by @lucasmarkes/hairline

(async function () {
  'use strict';

  // Obtain Hairline library (from global script or ESM)
  let HL = window.Hairline;
  if (!HL) {
    try {
      HL = await import('./hairline-lib.js');
    } catch (e) {
      try {
        HL = await import('https://esm.sh/@lucasmarkes/hairline');
      } catch (e2) {
        console.warn('Hairline could not be loaded:', e2);
        return;
      }
    }
  }

  /* ── 1. Mount figures on the Loop cards ──────────────── */
  const cardFigures = [
    { id: 'hl-observe',  fn: HL.terminal,  intensity: 0.65, label: 'Observability Terminal' },
    { id: 'hl-evaluate', fn: HL.sieve,     intensity: 0.60, label: 'Evaluation Sieve' },
    { id: 'hl-improve',  fn: HL.branches,  intensity: 0.70, label: 'Prompt Branch Graph' },
    { id: 'hl-repeat',   fn: HL.turntable, intensity: 0.55, label: 'Repeat Cycle Turntable' }
  ];

  const cardInstances = [];

  cardFigures.forEach(({ id, fn, intensity, label }) => {
    const el = document.getElementById(id);
    if (el && typeof fn === 'function') {
      try {
        const inst = fn(el, {
          intensity,
          theme: 'auto',
          label
        });
        cardInstances.push(inst);
      } catch (err) {
        console.error(`Error mounting hairline figure on ${id}:`, err);
      }
    }
  });

  /* ── 2. Interactive Showcase Playground ──────────────── */
  const mainStage = document.getElementById('hairlineMainStage');
  const captionEl = document.getElementById('hairlineCaptionText');
  const intensityInput = document.getElementById('hlIntensityRange');
  const intensityVal = document.getElementById('hlIntensityVal');
  const tabs = document.querySelectorAll('.hl-tab');
  const codeSnippet = document.getElementById('hlCodeSnippet');
  const codeTabs = document.querySelectorAll('.hl-code-tab');

  if (!mainStage) return;

  const FIGURE_DEFS = {
    terminal: {
      fn: HL.terminal,
      name: 'Terminal',
      desc: 'Ventana de terminal interactiva con historial en filas. El puntero viaja por el historial elevando y destacando las líneas de trazas.',
      intensity: 0.75
    },
    branches: {
      fn: HL.branches,
      name: 'Branches',
      desc: 'Grafo de branching y commits estilo Git: el nodo bajo el puntero se alza con su historial de cambios y se resalta.',
      intensity: 0.70
    },
    exploded: {
      fn: HL.exploded,
      name: 'Exploded',
      desc: 'Arquitectura de aplicación separada en 4 capas isométricas. Moverse horizontalmente expande la separación; verticalmente elige la capa activa.',
      intensity: 0.80
    },
    dish: {
      fn: HL.dish,
      name: 'Dish',
      desc: 'Antena de telemetría parabólica en cardán (gimbal) de dos ejes. Apunta y sigue la posición del puntero con amortiguación elástica.',
      intensity: 0.70
    },
    terrain: {
      fn: HL.terrain,
      name: 'Terrain',
      desc: 'Superficie de 81 pilares en relieve. Reaccionan elevándose en radio circular alrededor del cursor con física spring continua.',
      intensity: 0.65
    },
    patch: {
      fn: HL.patch,
      name: 'Patch',
      desc: 'Patch panel de 24 puertos con cables de conexión. El cable bajo el cursor se eleva y los vecinos se inclinan armónicamente.',
      intensity: 0.70
    },
    router: {
      fn: HL.router,
      name: 'Router',
      desc: 'Enrutador con antenas erguidas que se inclinan proporcionalmente en dirección al cursor.',
      intensity: 0.75
    },
    sieve: {
      fn: HL.sieve,
      name: 'Sieve',
      desc: 'Tres tamices apilados. La altura del puntero selecciona un tamiz, que asciende despejando su rejilla.',
      intensity: 0.60
    }
  };

  let currentFigureKey = 'terminal';
  let currentInstance = null;
  let currentIntensity = 0.75;
  let activeCodeLang = 'react';

  function updateCodeSnippet() {
    if (!codeSnippet) return;
    const def = FIGURE_DEFS[currentFigureKey];
    if (!def) return;

    if (activeCodeLang === 'react') {
      codeSnippet.textContent = `import { ${def.name} } from "@lucasmarkes/hairline/react";

export function AgentVisual() {
  return (
    <${def.name}
      intensity={${currentIntensity.toFixed(2)}}
      theme="auto"
      onRead={(caption) => console.log(caption)}
      style={{ width: "100%", maxWidth: 440 }}
    />
  );
}`;
    } else {
      codeSnippet.textContent = `import { ${def.name.toLowerCase()} } from "@lucasmarkes/hairline";

const container = document.getElementById("figure-slot");
const fig = ${def.name.toLowerCase()}(container, {
  intensity: ${currentIntensity.toFixed(2)},
  theme: "auto",
  onRead: (caption) => console.log(caption)
});

// Para actualizar o desmontar:
// fig.update({ intensity: 0.9 });
// fig.destroy();`;
    }
  }

  function mountPlaygroundFigure(key) {
    const def = FIGURE_DEFS[key];
    if (!def || typeof def.fn !== 'function') return;

    currentFigureKey = key;

    if (currentInstance) {
      currentInstance.destroy();
      currentInstance = null;
    }
    mainStage.innerHTML = '';

    currentInstance = def.fn(mainStage, {
      intensity: currentIntensity,
      theme: 'auto',
      onRead: (text) => {
        if (captionEl) {
          captionEl.textContent = text || def.desc;
        }
      }
    });

    updateCodeSnippet();
  }

  // Mount default figure
  mountPlaygroundFigure('terminal');

  // Tab switching
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const figKey = tab.dataset.fig;
      if (figKey) mountPlaygroundFigure(figKey);
    });
  });

  // Intensity slider
  if (intensityInput) {
    intensityInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      currentIntensity = val;
      if (intensityVal) intensityVal.textContent = val.toFixed(2);
      if (currentInstance) {
        currentInstance.update({ intensity: val });
      }
      // Also update cards
      cardInstances.forEach((inst) => inst.update({ intensity: val }));
      updateCodeSnippet();
    });
  }

  // Code lang switching
  codeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      codeTabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      activeCodeLang = tab.dataset.lang || 'react';
      updateCodeSnippet();
    });
  });

  // Theme buttons in playground
  const themeButtons = document.querySelectorAll('[data-theme-val]');
  themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      themeButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const themeVal = btn.dataset.themeVal;
      if (currentInstance) {
        currentInstance.update({ theme: themeVal });
      }
    });
  });

  // Sync with global theme changes automatically
  const themeObserver = new MutationObserver(() => {
    if (currentInstance) currentInstance.update({ theme: 'auto' });
    cardInstances.forEach((inst) => inst.update({ theme: 'auto' }));
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'data-mode']
  });
})();
