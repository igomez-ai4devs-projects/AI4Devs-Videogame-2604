// sprites.js — Pixel art 1-bit del Space Invaders clásico (GAME-DESIGN.md §3)
// Cada sprite es un array de strings; "1" = píxel encendido, "0"/espacio = vacío.

// Invasor tipo A — "squid" (superior, 30 pts) · 8x8 · 2 frames
const A1 = [
  "00011000",
  "00111100",
  "01111110",
  "11011011",
  "11111111",
  "00100100",
  "01011010",
  "10100101",
];
const A2 = [
  "00011000",
  "00111100",
  "01111110",
  "11011011",
  "11111111",
  "01011010",
  "10000001",
  "01000010",
];

// Invasor tipo B — "crab" (medio, 20 pts) · 11x8 · 2 frames
const B1 = [
  "00100000100",
  "00010001000",
  "00111111100",
  "01101110110",
  "11111111111",
  "10111111101",
  "10100000101",
  "00011011000",
];
const B2 = [
  "00100000100",
  "10010001001",
  "10111111101",
  "11101110111",
  "11111111111",
  "01111111110",
  "00100000100",
  "01000000010",
];

// Invasor tipo C — "octopus" (inferior, 10 pts) · 12x8 · 2 frames
const C1 = [
  "000011110000",
  "011111111110",
  "111111111111",
  "111001100111",
  "111111111111",
  "000110011000",
  "001101101100",
  "110000000011",
];
const C2 = [
  "000011110000",
  "011111111110",
  "111111111111",
  "111001100111",
  "111111111111",
  "001101101100",
  "011001100110",
  "001100001100",
];

// Nave del jugador (cañón) · 13x8
const PLAYER = [
  "0000001000000",
  "0000011100000",
  "0000011100000",
  "0111111111110",
  "1111111111111",
  "1111111111111",
  "1111111111111",
  "1111111111111",
];

// OVNI / Mystery (bonus) · 16x7 — incluido para fases posteriores
const UFO = [
  "0000111111000000",
  "0011111111110000",
  "0111111111111000",
  "1101101101101100",
  "1111111111111100",
  "0011000110001100",
  "0110000011000000",
];

// Explosión / impacto · 8x8 (SI-21)
const EXPLOSION = [
  "00100100",
  "10100101",
  "01011010",
  "00111100",
  "00111100",
  "01011010",
  "10100101",
  "00100100",
];

export const SPRITES = {
  A: [A1, A2],
  B: [B1, B2],
  C: [C1, C2],
  PLAYER,
  UFO,
  EXPLOSION,
};

/** Ancho en píxeles lógicos (columnas) de un sprite. */
export function spriteCols(sprite) {
  return sprite[0].length;
}

/** Alto en píxeles lógicos (filas) de un sprite. */
export function spriteRows(sprite) {
  return sprite.length;
}

/**
 * Dibuja un sprite escalado en el canvas.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string[]} sprite matriz de "1"/"0"
 * @param {number} x  esquina superior izquierda
 * @param {number} y
 * @param {number} scale  factor de escala
 * @param {string} color
 */
export function drawSprite(ctx, sprite, x, y, scale, color) {
  ctx.fillStyle = color;
  for (let row = 0; row < sprite.length; row++) {
    const line = sprite[row];
    for (let col = 0; col < line.length; col++) {
      if (line[col] === "1") {
        ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
      }
    }
  }
}
