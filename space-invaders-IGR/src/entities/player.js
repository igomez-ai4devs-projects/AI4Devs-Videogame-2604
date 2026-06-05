// player.js — Nave del jugador (SI-08 movimiento, SI-09 disparo)

import { CONFIG, GROUND_Y } from "../config.js";
import { clamp } from "../utils/helpers.js";
import { SPRITES, spriteCols, spriteRows, drawSprite } from "../utils/sprites.js";
import { Bullet } from "./bullet.js";

export class Player {
  constructor() {
    this.scale = CONFIG.scale;
    this.w = spriteCols(SPRITES.PLAYER) * this.scale;
    this.h = spriteRows(SPRITES.PLAYER) * this.scale;
    this.startX = (CONFIG.canvas.width - this.w) / 2;
    this.x = this.startX;
    this.y = GROUND_Y - this.h - 6;
    this.speed = CONFIG.player.speed;
    this.cooldownTimer = 0;
    this.invulnTimer = 0; // > 0 → invulnerable y parpadeando (SI-10)
  }

  get box() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }

  get invulnerable() {
    return this.invulnTimer > 0;
  }

  /** Reacciona a un impacto: activa invulnerabilidad y recoloca la nave. */
  hit() {
    this.invulnTimer = CONFIG.player.invulnTime;
    this.x = this.startX;
  }

  /**
   * @param {number} dt
   * @param {import("../systems/input.js").Input} input
   * @param {Bullet[]} bullets lista compartida donde añadir disparos
   */
  update(dt, input, bullets) {
    if (this.invulnTimer > 0) this.invulnTimer -= dt;

    // Movimiento horizontal (RF-06)
    let dir = 0;
    if (input.isHeld("ArrowLeft") || input.isHeld("a") || input.isHeld("A")) dir -= 1;
    if (input.isHeld("ArrowRight") || input.isHeld("d") || input.isHeld("D")) dir += 1;
    this.x += dir * this.speed * dt;

    // Limitar a los bordes (RF-07)
    this.x = clamp(this.x, 0, CONFIG.canvas.width - this.w);

    // Disparo con cadencia (RF-08, RF-09)
    this.cooldownTimer -= dt;
    const wantsFire = input.isHeld(" ") || input.wasPressed(" ");
    if (wantsFire && this.cooldownTimer <= 0) {
      bullets.push(
        new Bullet(
          this.x + this.w / 2,
          this.y - CONFIG.bullet.height,
          -CONFIG.bullet.playerSpeed,
          CONFIG.colors.white
        )
      );
      this.cooldownTimer = CONFIG.player.cooldown;
      return true; // disparó (para reproducir el SFX)
    }
    return false;
  }

  render(ctx) {
    // Parpadeo durante la invulnerabilidad (oculta en frames alternos)
    if (this.invulnerable && Math.floor(this.invulnTimer * 10) % 2 === 0) return;
    drawSprite(ctx, SPRITES.PLAYER, this.x, this.y, this.scale, CONFIG.colors.green);
  }
}
