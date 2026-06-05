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
    this.x = (CONFIG.canvas.width - this.w) / 2;
    this.y = GROUND_Y - this.h - 6;
    this.speed = CONFIG.player.speed;
    this.cooldownTimer = 0;
  }

  /**
   * @param {number} dt
   * @param {import("../systems/input.js").Input} input
   * @param {Bullet[]} bullets lista compartida donde añadir disparos
   */
  update(dt, input, bullets) {
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
    }
  }

  render(ctx) {
    drawSprite(ctx, SPRITES.PLAYER, this.x, this.y, this.scale, CONFIG.colors.green);
  }
}
