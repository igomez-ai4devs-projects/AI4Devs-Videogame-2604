// bullet.js — Proyectil (SI-09, RF-17, RF-20)

import { CONFIG } from "../config.js";

export class Bullet {
  /**
   * @param {number} x  centro horizontal del origen
   * @param {number} y
   * @param {number} vy velocidad vertical (negativa = hacia arriba)
   * @param {string} color
   */
  constructor(x, y, vy, color) {
    this.w = CONFIG.bullet.width;
    this.h = CONFIG.bullet.height;
    this.x = x - this.w / 2;
    this.y = y;
    this.vy = vy;
    this.color = color;
    this.alive = true;
  }

  update(dt) {
    this.y += this.vy * dt;
    // Fuera de pantalla → eliminar (RF-20)
    if (this.y + this.h < 0 || this.y > CONFIG.canvas.height) {
      this.alive = false;
    }
  }

  render(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}
