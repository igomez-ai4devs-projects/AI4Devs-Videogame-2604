// gameOverState.js — Pantalla de fin de partida (SI-06, RF-04/RF-05, GDD §2.3)

import { CONFIG } from "../config.js";
import { drawCenteredText } from "../utils/text.js";

const OPTIONS = ["PLAY AGAIN", "MORE GAMES"];

export class GameOverState {
  constructor(game) {
    this.game = game;
    this.selected = 0;
    this.won = false;
  }

  enter(params = {}) {
    this.won = !!params.won;
    this.selected = 0;
  }

  update() {
    const input = this.game.input;

    if (input.wasPressed("ArrowUp") || input.wasPressed("ArrowDown")) {
      this.selected = (this.selected + 1) % OPTIONS.length;
    }

    const confirm = input.wasPressed("Enter") || input.consumeClick();
    if (confirm) {
      if (this.selected === 0) {
        this.game.startNewGame(); // PLAY AGAIN (RF-05)
      } else {
        this.game.toMenu(); // MORE GAMES → menú
      }
    }
  }

  render(ctx) {
    // Fondo: última escena de juego (GDD §2.3)
    this.game.states.play.renderScene(ctx);

    // Modal centrado con borde verde
    const w = 460;
    const h = 280;
    const x = (CONFIG.canvas.width - w) / 2;
    const y = (CONFIG.canvas.height - h) / 2;

    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = CONFIG.colors.green;
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, w, h);

    const title = this.won ? "YOU WIN!" : "GAME OVER";
    drawCenteredText(ctx, title, y + 70, { size: 44 });

    OPTIONS.forEach((opt, i) => {
      const isSel = i === this.selected;
      drawCenteredText(ctx, opt, y + 160 + i * 50, {
        size: 28,
        color: isSel ? CONFIG.colors.green : CONFIG.colors.white,
      });
    });
  }
}
