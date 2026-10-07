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

  const FIGURES = window.HAIRLINE_FIGURES || [];

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
  const tabsContainer = document.getElementById('hlTabs');
  const mainStage = document.getElementById('hairlineMainStage');
  const captionEl = document.getElementById('hairlineCaptionText');
  const effectEl = document.getElementById('hlIntensityEffect');
  const figureTitleEl = document.getElementById('hlFigureTitle');
  const figureDescEl = document.getElementById('hlFigureDesc');
  const intensityInput = document.getElementById('hlIntensityRange');
  const intensityVal = document.getElementById('hlIntensityVal');
  const codeSnippet = document.getElementById('hlCodeSnippet');
  const codeTabs = document.querySelectorAll('.hl-code-tab');
  const categoryFilters = document.querySelectorAll('.hl-cat-btn');

  if (!mainStage || FIGURES.length === 0) return;

  // Render all 27 tabs dynamically if container is present
  function renderTabs(filterCat = 'all') {
    if (!tabsContainer) return;
    tabsContainer.innerHTML = '';
    FIGURES.forEach((fig) => {
      if (filterCat !== 'all' && fig.category !== filterCat) return;
      const btn = document.createElement('button');
      btn.className = 'hl-tab' + (fig.id === currentFigureKey ? ' is-active' : '');
      btn.dataset.fig = fig.id;
      btn.textContent = fig.name;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.hl-tab').forEach((t) => t.classList.remove('is-active'));
        btn.classList.add('is-active');
        mountPlaygroundFigure(fig.id);
      });
      tabsContainer.appendChild(btn);
    });
  }

  let currentFigureKey = 'riffle';
  let currentInstance = null;
  let currentIntensity = 0.70;
  let activeCodeLang = 'react';

  function updateCodeSnippet() {
    if (!codeSnippet) return;
    const fig = FIGURES.find((f) => f.id === currentFigureKey);
    if (!fig) return;

    if (activeCodeLang === 'react') {
      codeSnippet.textContent = `import { ${fig.name} } from "@lucasmarkes/hairline/react";

export function Visual() {
  return (
    <${fig.name}
      intensity={${currentIntensity.toFixed(2)}}
      theme="auto"
      onRead={(caption) => console.log(caption)}
      style={{ width: "100%", maxWidth: 440 }}
    />
  );
}`;
    } else {
      codeSnippet.textContent = `import { ${fig.id} } from "@lucasmarkes/hairline";

const container = document.getElementById("figure-slot");
const fig = ${fig.id}(container, {
  intensity: ${currentIntensity.toFixed(2)},
  theme: "auto",
  onRead: (caption) => console.log(caption)
});

// Update or destroy:
// fig.update({ intensity: 0.9 });
// fig.destroy();`;
    }
  }

  function mountPlaygroundFigure(id) {
    const fig = FIGURES.find((f) => f.id === id);
    if (!fig || typeof HL[fig.id] !== 'function') return;

    currentFigureKey = fig.id;

    if (figureTitleEl) figureTitleEl.textContent = fig.name;
    if (figureDescEl) figureDescEl.textContent = fig.desc;
    if (effectEl) effectEl.textContent = fig.intensityEffect;

    // Use figure's default intensity if input wasn't touched or use current
    if (intensityInput) {
      currentIntensity = fig.defaultIntensity || currentIntensity;
      intensityInput.value = currentIntensity;
      if (intensityVal) intensityVal.textContent = currentIntensity.toFixed(2);
    }

    if (currentInstance) {
      currentInstance.destroy();
      currentInstance = null;
    }
    mainStage.innerHTML = '';

    currentInstance = HL[fig.id](mainStage, {
      intensity: currentIntensity,
      theme: 'auto',
      onRead: (text) => {
        if (captionEl) {
          captionEl.textContent = text || 'rest';
        }
      }
    });

    updateCodeSnippet();
  }

  // Initial render of tabs
  renderTabs('all');
  mountPlaygroundFigure('riffle');

  // Category filters
  categoryFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      categoryFilters.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const cat = btn.dataset.cat || 'all';
      renderTabs(cat);
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
