// playState.js — Estado de juego (SI-08/09 jugador, SI-11/12 invasores,
// SI-13 disparo enemigo, SI-10 vidas, SI-15 colisiones, SI-17 oleadas,
// SI-18 fin de partida, SI-19 HUD)

import { CONFIG } from "../config.js";
import { Player } from "../entities/player.js";
import { Bullet } from "../entities/bullet.js";
import { InvaderGrid } from "../entities/grid.js";
import {
  resolvePlayerBullets,
  resolveEnemyBullets,
} from "../systems/collisions.js";
import { drawHud } from "../systems/hud.js";
import { drawCenteredText } from "../utils/text.js";
import { randomInt } from "../utils/helpers.js";

export class PlayState {
  constructor(game) {
    this.game = game;
    this.player = null;
    this.grid = null;
    this.bullets = []; // proyectiles del jugador
    this.enemyBullets = []; // proyectiles enemigos (SI-13)
    this.paused = false;
    this.fireTimer = 0;
  }

  /** Inicializa una partida nueva (entidades frescas). */
  enter() {
    this.player = new Player();
    this.startWave(this.game.session.level);
    this.paused = false;
  }

  /** Construye/regenera la formación para un nivel dado (SI-17). */
  startWave(level) {
    this.grid = new InvaderGrid(level);
    this.bullets = [];
    this.enemyBullets = [];
    this.fireTimer = this.nextFireDelay();
  }

  /** Intervalo aleatorio hasta el próximo disparo enemigo (acelera por nivel). */
  nextFireDelay() {
    const { fireBaseInterval, fireMinInterval } = CONFIG.invaders;
    const levelFactor = Math.pow(CONFIG.waves.fireSpeedup, this.grid.level - 1);
    const base = Math.max(fireMinInterval, fireBaseInterval * levelFactor);
    // Variación aleatoria alrededor del intervalo base
    return base * (0.5 + Math.random());
  }

  update(dt) {
    const input = this.game.input;

    // Pausa / Reanudar (SI-07)
    if (input.wasPressed("p") || input.wasPressed("P")) {
      this.paused = !this.paused;
    }
    if (this.paused) return;

    // Entidades
    this.player.update(dt, input, this.bullets);
    this.grid.update(dt);
    for (const b of this.bullets) b.update(dt);
    for (const b of this.enemyBullets) b.update(dt);

    // Disparo enemigo por temporizador (SI-13)
    this.updateEnemyFire(dt);

    // Colisiones del jugador → puntuación (SI-15, RF-22)
    const gained = resolvePlayerBullets(this.bullets, this.grid);
    if (gained > 0) this.addScore(gained);

    // Colisiones enemigas → pérdida de vida (SI-10, RF-19)
    if (resolveEnemyBullets(this.enemyBullets, this.player)) {
      this.onPlayerHit();
    }

    // Limpieza de proyectiles muertos (RF-20)
    this.bullets = this.bullets.filter((b) => b.alive);
    this.enemyBullets = this.enemyBullets.filter((b) => b.alive);

    // Avance de oleada (SI-17): formación eliminada → siguiente nivel
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
    this.game.session.lives -= 1;
    if (this.game.session.lives <= 0) {
      this.game.session.lives = 0;
      this.game.endGame(false);
    } else {
      this.player.hit(); // invulnerabilidad temporal + reposición
    }
  }

  /** Dibuja la escena de juego (reutilizable como fondo en GAME OVER). */
  renderScene(ctx) {
    drawHud(ctx, this.game.session);
    this.grid.render(ctx);
    this.player.render(ctx);
    for (const b of this.bullets) b.render(ctx);
    for (const b of this.enemyBullets) b.render(ctx);
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
