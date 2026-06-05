// explosion.js — Efecto visual breve al destruir una entidad (SI-21)

import { CONFIG } from "../config.js";
import { SPRITES, spriteCols, spriteRows, drawSprite } from "../utils/sprites.js";

export class Explosion {
  /** Centra el efecto en la entidad destruida (cx, cy = su centro). */
  constructor(cx, cy, color = CONFIG.colors.white) {
    this.timer = CONFIG.explosion.duration;
    this.color = color;
    // Escala para cubrir aproximadamente el ancho de un invasor
    this.scale = 4;
    this.w = spriteCols(SPRITES.EXPLOSION) * this.scale;
    this.h = spriteRows(SPRITES.EXPLOSION) * this.scale;
    this.x = cx - this.w / 2;
    this.y = cy - this.h / 2;
    this.alive = true;
  }

  update(dt) {
    this.timer -= dt;
    if (this.timer <= 0) this.alive = false;
  }

  render(ctx) {
    drawSprite(ctx, SPRITES.EXPLOSION, this.x, this.y, this.scale, this.color);
  }
}
