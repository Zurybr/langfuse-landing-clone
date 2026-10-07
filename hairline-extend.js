/**
 * hairline-extend.js — Extension helper to register custom figures into Hairline
 * Allows adding user-defined isometric figures to window.Hairline and the figures catalog.
 */

(function () {
  'use strict';

  if (typeof window === 'undefined') return;

  window.Hairline = window.Hairline || {};

  /**
   * Register a new custom figure into Hairline
   * @param {string} id - unique identifier (e.g. 'trace', 'neural', 'pipeline')
   * @param {Function} figureFn - function(element, options): { update(opts), destroy() }
   * @param {Object} meta - metadata for the figure (name, category, desc, intensityEffect)
   */
  window.Hairline.register = function (id, figureFn, meta = {}) {
    if (!id || typeof figureFn !== 'function') {
      throw new Error('Hairline.register(id, figureFn, meta) requires an id and a function');
    }

    // Register on the global Hairline object
    window.Hairline[id] = figureFn;

    // Register metadata in the catalog if available
    if (window.HAIRLINE_FIGURES) {
      const existingIdx = window.HAIRLINE_FIGURES.findIndex((f) => f.id === id);
      const figureMeta = {
        id,
        name: meta.name || id.charAt(0).toUpperCase() + id.slice(1),
        category: meta.category || 'Custom',
        desc: meta.desc || 'Custom interactive figure.',
        intensityEffect: meta.intensityEffect || 'Scales response intensity.',
        defaultIntensity: typeof meta.defaultIntensity === 'number' ? meta.defaultIntensity : 0.70
      };

      if (existingIdx >= 0) {
        window.HAIRLINE_FIGURES[existingIdx] = figureMeta;
      } else {
        window.HAIRLINE_FIGURES.push(figureMeta);
      }
    }

    return figureFn;
  };
})();
