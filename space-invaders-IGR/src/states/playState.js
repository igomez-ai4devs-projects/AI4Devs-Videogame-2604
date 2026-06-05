// playState.js — Estado de juego (SI-08/09 jugador, SI-11/12 invasores,
// SI-15 colisiones, SI-18 fin de partida, SI-19 HUD)

import { CONFIG } from "../config.js";
import { Player } from "../entities/player.js";
import { InvaderGrid } from "../entities/grid.js";
import { resolvePlayerBullets } from "../systems/collisions.js";
import { drawHud } from "../systems/hud.js";
import { drawCenteredText } from "../utils/text.js";

export class PlayState {
  constructor(game) {
    this.game = game;
    this.player = null;
    this.grid = null;
    this.bullets = [];
    this.paused = false;
  }

  /** Inicializa una partida nueva (entidades frescas). */
  enter() {
    this.player = new Player();
    this.grid = new InvaderGrid();
    this.bullets = [];
    this.paused = false;
  }

  update(dt) {
    const input = this.game.input;

    // Pausa / Reanudar (SI-03 estado PAUSED simplificado)
    if (input.wasPressed("p") || input.wasPressed("P")) {
      this.paused = !this.paused;
    }
    if (this.paused) return;

    // Entidades
    this.player.update(dt, input, this.bullets);
    this.grid.update(dt);
    for (const b of this.bullets) b.update(dt);

    // Colisiones (SI-15) → puntuación (RF-22)
    const gained = resolvePlayerBullets(this.bullets, this.grid);
    if (gained > 0) {
      const session = this.game.session;
      session.score += gained;
      if (session.score > session.highScore) session.highScore = session.score;
    }

    // Limpieza de proyectiles muertos (RF-20)
    this.bullets = this.bullets.filter((b) => b.alive);

    // Condiciones de fin de partida (SI-18)
    if (this.grid.aliveCount === 0) {
      this.game.endGame(true); // oleada eliminada → victoria (MVP)
      return;
    }
    if (this.grid.lowestY() >= this.player.y) {
      this.game.endGame(false); // invasión (RF-29)
      return;
    }
  }

  /** Dibuja la escena de juego (reutilizable como fondo en GAME OVER). */
  renderScene(ctx) {
    drawHud(ctx, this.game.session);
    this.grid.render(ctx);
    this.player.render(ctx);
    for (const b of this.bullets) b.render(ctx);
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
