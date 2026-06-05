// playState.js — Estado de juego (SI-08/09 jugador, SI-11/12 invasores,
// SI-13 disparo enemigo, SI-10 vidas, SI-14 OVNI, SI-15 colisiones,
// SI-16 escudos, SI-17 oleadas, SI-18 fin de partida, SI-19 HUD, SI-21 audio/FX)

import { CONFIG } from "../config.js";
import { Player } from "../entities/player.js";
import { Bullet } from "../entities/bullet.js";
import { InvaderGrid } from "../entities/grid.js";
import { UFO } from "../entities/ufo.js";
import { createShields } from "../entities/shield.js";
import { Explosion } from "../entities/explosion.js";
import {
  resolvePlayerBullets,
  resolveEnemyBullets,
  resolveShieldCollisions,
} from "../systems/collisions.js";
import { drawHud } from "../systems/hud.js";
import { drawCenteredText } from "../utils/text.js";
import { randomInt, aabb } from "../utils/helpers.js";

export class PlayState {
  constructor(game) {
    this.game = game;
    this.audio = game.audio;
    this.player = null;
    this.grid = null;
    this.bullets = []; // proyectiles del jugador
    this.enemyBullets = []; // proyectiles enemigos (SI-13)
    this.shields = []; // búnkeres (SI-16)
    this.explosions = []; // FX visuales (SI-21)
    this.ufo = null; // OVNI bonus (SI-14)
    this.paused = false;
    this.fireTimer = 0;
    this.ufoTimer = 0;
    this.prevFrame = 0;
  }

  /** Inicializa una partida nueva (entidades frescas). */
  enter() {
    this.player = new Player();
    this.shields = createShields();
    this.startWave(this.game.session.level);
    this.paused = false;
  }

  /** Construye/regenera la formación para un nivel dado (SI-17). */
  startWave(level) {
    this.grid = new InvaderGrid(level);
    this.bullets = [];
    this.enemyBullets = [];
    this.explosions = [];
    this.ufo = null;
    this.fireTimer = this.nextFireDelay();
    this.ufoTimer = this.nextUfoDelay();
    this.prevFrame = this.grid.frame;
  }

  nextFireDelay() {
    const { fireBaseInterval, fireMinInterval } = CONFIG.invaders;
    const levelFactor = Math.pow(CONFIG.waves.fireSpeedup, this.grid.level - 1);
    const base = Math.max(fireMinInterval, fireBaseInterval * levelFactor);
    return base * (0.5 + Math.random());
  }

  nextUfoDelay() {
    const { minDelay, maxDelay } = CONFIG.ufo;
    return minDelay + Math.random() * (maxDelay - minDelay);
  }

  update(dt) {
    const input = this.game.input;

    // Pausa / Reanudar (SI-07)
    if (input.wasPressed("p") || input.wasPressed("P")) {
      this.paused = !this.paused;
    }
    if (this.paused) return;

    // Entidades
    const fired = this.player.update(dt, input, this.bullets);
    if (fired) this.audio?.shoot();

    this.grid.update(dt);
    // Sonido de marcha al cambiar el frame de la formación (SI-21)
    if (this.grid.frame !== this.prevFrame) {
      this.audio?.step(this.grid.frame === 0);
      this.prevFrame = this.grid.frame;
    }

    for (const b of this.bullets) b.update(dt);
    for (const b of this.enemyBullets) b.update(dt);
    for (const e of this.explosions) e.update(dt);
    this.updateUfo(dt);
    this.updateEnemyFire(dt);

    // Colisiones con escudos (consumen proyectiles) — SI-16
    resolveShieldCollisions(this.bullets, this.shields);
    resolveShieldCollisions(this.enemyBullets, this.shields);

    // Colisiones del jugador → puntuación + FX (SI-15, RF-22)
    const destroyed = resolvePlayerBullets(this.bullets, this.grid);
    for (const inv of destroyed) {
      this.addScore(inv.points);
      this.spawnExplosion(inv.x + inv.w / 2, inv.y + inv.h / 2);
      this.audio?.invaderExplode();
    }

    // Colisiones enemigas → pérdida de vida (SI-10, RF-19)
    if (resolveEnemyBullets(this.enemyBullets, this.player)) {
      this.onPlayerHit();
    }

    // Limpieza (RF-20)
    this.bullets = this.bullets.filter((b) => b.alive);
    this.enemyBullets = this.enemyBullets.filter((b) => b.alive);
    this.explosions = this.explosions.filter((e) => e.alive);
    this.shields = this.shields.filter((s) => !s.isEmpty);

    // Avance de oleada (SI-17)
    if (this.grid.aliveCount === 0) {
      this.game.session.level += 1;
      this.startWave(this.game.session.level);
      return;
    }

    // Fin de partida por invasión (SI-18, RF-29)
    if (this.grid.lowestY() >= this.player.y) {
      this.game.endGame(false);
    }
  }

  /** Aparición, movimiento e impacto del OVNI bonus (SI-14). */
  updateUfo(dt) {
    if (this.ufo) {
      this.ufo.update(dt);

      // Impacto de un proyectil del jugador contra el OVNI
      for (const b of this.bullets) {
        if (b.alive && aabb(b, this.ufo.box)) {
          b.alive = false;
          this.addScore(this.ufo.points);
          this.spawnExplosion(
            this.ufo.x + this.ufo.w / 2,
            this.ufo.y + this.ufo.h / 2,
            CONFIG.colors.red
          );
          this.audio?.ufoHit();
          this.ufo = null;
          return;
        }
      }
      if (this.ufo && !this.ufo.alive) this.ufo = null;
      return;
    }

    // Temporizador de aparición (solo si quedan invasores)
    this.ufoTimer -= dt;
    if (this.ufoTimer <= 0 && this.grid.aliveCount > 0) {
      this.ufo = new UFO();
      this.ufoTimer = this.nextUfoDelay();
    }
  }

  updateEnemyFire(dt) {
    this.fireTimer -= dt;
    if (this.fireTimer > 0) return;
    this.fireTimer = this.nextFireDelay();

    const shooters = this.grid.getShooters();
    if (shooters.length === 0) return;
    const shooter = shooters[randomInt(0, shooters.length - 1)];
    this.enemyBullets.push(
      new Bullet(
        shooter.x + shooter.w / 2,
        shooter.y + shooter.h,
        CONFIG.bullet.enemySpeed,
        CONFIG.colors.white
      )
    );
  }

  spawnExplosion(cx, cy, color) {
    this.explosions.push(new Explosion(cx, cy, color));
  }

  addScore(points) {
    const session = this.game.session;
    session.score += points;
    if (session.score > session.highScore) {
      session.highScore = session.score;
      this.game.saveHighScore();
    }
  }

  /** Gestiona el impacto al jugador: resta vida o termina la partida (SI-10). */
  onPlayerHit() {
    this.audio?.playerDeath();
    this.spawnExplosion(
      this.player.x + this.player.w / 2,
      this.player.y + this.player.h / 2,
      CONFIG.colors.green
    );
    this.game.session.lives -= 1;
    if (this.game.session.lives <= 0) {
      this.game.session.lives = 0;
      this.game.endGame(false);
    } else {
      this.player.hit();
    }
  }

  /** Dibuja la escena de juego (reutilizable como fondo en GAME OVER). */
  renderScene(ctx) {
    drawHud(ctx, this.game.session);
    for (const s of this.shields) s.render(ctx);
    this.grid.render(ctx);
    if (this.ufo) this.ufo.render(ctx);
    this.player.render(ctx);
    for (const b of this.bullets) b.render(ctx);
    for (const b of this.enemyBullets) b.render(ctx);
    for (const e of this.explosions) e.render(ctx);
  }

  render(ctx) {
    this.renderScene(ctx);
    if (this.paused) {
      drawCenteredText(ctx, "PAUSE", CONFIG.canvas.height / 2, {
        size: 44,
        color: CONFIG.colors.green,
      });
    }
  }
}
