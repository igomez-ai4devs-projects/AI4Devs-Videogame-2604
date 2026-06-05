// text.js — Texto retro centrado en canvas (tipografía monoespaciada en mayúsculas)

import { CONFIG } from "../config.js";

/**
 * Dibuja texto con estilo arcade.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} x
 * @param {number} y
 * @param {object} [opts]
 * @param {number} [opts.size=24] tamaño de fuente
 * @param {string} [opts.color=white]
 * @param {CanvasTextAlign} [opts.align="left"]
 * @param {CanvasTextBaseline} [opts.baseline="top"]
 */
export function drawText(ctx, text, x, y, opts = {}) {
  const {
    size = 24,
    color = CONFIG.colors.white,
    align = "left",
    baseline = "top",
  } = opts;
  ctx.fillStyle = color;
  ctx.font = `bold ${size}px "Courier New", monospace`;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  // Mayúsculas y espaciado para el look clásico
  ctx.fillText(text.toUpperCase(), x, y);
}

/** Atajo: texto centrado horizontalmente en el canvas. */
export function drawCenteredText(ctx, text, y, opts = {}) {
  drawText(ctx, text, CONFIG.canvas.width / 2, y, { ...opts, align: "center" });
}
