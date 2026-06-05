// ufo.js — OVNI / Mystery bonus (SI-14, RF-16)

import { CONFIG } from "../config.js";
import { SPRITES, spriteCols, spriteRows, drawSprite } from "../utils/sprites.js";
import { randomInt } from "../utils/helpers.js";

export class UFO {
  /** @param {number} [dir] dirección forzada (1 / -1); aleatoria si se omite. */
  constructor(dir) {
    this.scale = CONFIG.scale;
    this.w = spriteCols(SPRITES.UFO) * this.scale;
    this.h = spriteRows(SPRITES.UFO) * this.scale;
    this.dir = dir ?? (Math.random() < 0.5 ? 1 : -1);
    this.x = this.dir > 0 ? -this.w : CONFIG.canvas.width;
    this.y = CONFIG.ufo.y;
    this.speed = CONFIG.ufo.speed;
    this.alive = true;
    const pts = CONFIG.ufo.points;
    this.points = pts[randomInt(0, pts.length - 1)];
  }

  get box() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }

  update(dt) {
    this.x += this.dir * this.speed * dt;
    // Sale de pantalla sin ser impactado (RF-16, flujo alternativo)
    if (this.dir > 0 && this.x > CONFIG.canvas.width) this.alive = false;
    if (this.dir < 0 && this.x + this.w < 0) this.alive = false;
  }

  render(ctx) {
    drawSprite(ctx, SPRITES.UFO, this.x, this.y, this.scale, CONFIG.colors.red);
  }
}
