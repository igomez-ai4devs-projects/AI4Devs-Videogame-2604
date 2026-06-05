// hud.js — Interfaz en partida (SI-19, RF-22..RF-25, GDD §4)

import { CONFIG, GROUND_Y } from "../config.js";
import { padScore } from "../utils/helpers.js";
import { drawText, drawCenteredText } from "../utils/text.js";

/**
 * Dibuja el HUD y la línea de suelo.
 * @param {CanvasRenderingContext2D} ctx
 * @param {{score:number, level:number, lives:number, highScore:number}} session
 */
export function drawHud(ctx, session) {
  // Puntuación y nivel (arriba izquierda)
  drawText(ctx, `SCORE <${session.level}>`, 20, 16, { size: 22 });
  drawText(ctx, padScore(session.score), 44, 44, { size: 22 });

  // High score de sesión (arriba centro)
  drawCenteredText(ctx, "HI-SCORE", 16, { size: 18, color: CONFIG.colors.dim });
  drawCenteredText(ctx, padScore(session.highScore), 38, { size: 18 });

  // Línea de suelo (verde)
  ctx.fillStyle = CONFIG.colors.green;
  ctx.fillRect(0, GROUND_Y, CONFIG.canvas.width, 3);

  // Vidas (abajo izquierda)
  drawText(ctx, String(session.lives), 16, CONFIG.canvas.height - 40, {
    size: 24,
    color: CONFIG.colors.green,
  });
}
