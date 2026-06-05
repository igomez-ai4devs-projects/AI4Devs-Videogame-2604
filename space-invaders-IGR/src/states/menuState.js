// menuState.js — Pantalla de inicio (SI-05, RF-01/RF-02, GDD §2.1)

import { CONFIG } from "../config.js";
import { SPRITES, spriteCols, drawSprite } from "../utils/sprites.js";
import { drawText, drawCenteredText } from "../utils/text.js";

export class MenuState {
  constructor(game) {
    this.game = game;
    this.blink = 0; // acumulador para el parpadeo
  }

  enter() {
    this.blink = 0;
  }

  update(dt) {
    this.blink += dt;
    const input = this.game.input;
    // Iniciar con clic o Enter (RF-02)
    if (input.consumeClick() || input.wasPressed("Enter")) {
      this.game.startNewGame();
    }
  }

  render(ctx) {
    const cx = CONFIG.canvas.width / 2;

    // Título
    drawCenteredText(ctx, "SPACE INVADERS", 130, { size: 48 });

    // Llamada a la acción con parpadeo
    if (Math.floor(this.blink * 2) % 2 === 0) {
      drawCenteredText(ctx, "CLICK HERE TO PLAY!", 185, {
        size: 30,
        color: CONFIG.colors.white,
      });
    }

    // Tabla de puntuación
    drawCenteredText(ctx, "*SCORE ADVANCE TABLE*", 320, { size: 26 });

    const rows = [
      { sprite: SPRITES.UFO, color: CONFIG.colors.red, label: "= ? MYSTERY" },
      { sprite: SPRITES.A[0], color: CONFIG.colors.white, label: "= 30 POINTS" },
      { sprite: SPRITES.B[0], color: CONFIG.colors.white, label: "= 20 POINTS" },
      { sprite: SPRITES.C[0], color: CONFIG.colors.white, label: "= 10 POINTS" },
    ];

    const scale = 3;
    const spriteRight = cx - 30; // los sprites se alinean terminando aquí
    const labelLeft = cx - 10; // las etiquetas empiezan aquí
    let y = 370;
    for (const row of rows) {
      const spriteW = spriteCols(row.sprite) * scale;
      drawSprite(ctx, row.sprite, spriteRight - spriteW, y, scale, row.color);
      drawText(ctx, row.label, labelLeft, y + 4, { size: 24, align: "left" });
      y += 52;
    }
  }
}
