// invader.js — Invasor individual (SI-11, RF-15)

import { CONFIG } from "../config.js";
import { SPRITES, spriteCols, spriteRows, drawSprite } from "../utils/sprites.js";

export class Invader {
  /**
   * @param {"A"|"B"|"C"} type  tipo (define sprite y puntos)
   * @param {number} x  esquina superior izquierda
   * @param {number} y
   */
  constructor(type, x, y) {
    this.type = type;
    this.scale = CONFIG.scale;
    const sprite = SPRITES[type][0];
    this.w = spriteCols(sprite) * this.scale;
    this.h = spriteRows(sprite) * this.scale;
    this.x = x;
    this.y = y;
    this.alive = true;
    this.points = CONFIG.points[type];
  }

  /** Caja de colisión (AABB). */
  get box() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }

  render(ctx, frame) {
    const sprite = SPRITES[this.type][frame];
    drawSprite(ctx, sprite, this.x, this.y, this.scale, CONFIG.colors.white);
  }
}
