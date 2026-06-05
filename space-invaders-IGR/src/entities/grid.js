// grid.js — Formación de invasores (SI-11 rejilla, SI-12 movimiento)

import { CONFIG } from "../config.js";
import { spriteCols, SPRITES } from "../utils/sprites.js";
import { Invader } from "./invader.js";

// Mapeo fila → tipo (superior 30 pts, medio 20, inferior 10) — GAME-DESIGN.md §2.2
function typeForRow(row) {
  if (row === 0) return "A"; // 30
  if (row <= 2) return "B"; // 20
  return "C"; // 10
}

export class InvaderGrid {
  /** @param {number} [level=1] nivel/oleada actual (acelera la formación). */
  constructor(level = 1) {
    const { rows, cols, cellW, cellH, startY } = CONFIG.invaders;
    this.level = level;
    this.invaders = [];
    this.dir = 1; // 1 = derecha, -1 = izquierda
    this.frame = 0;
    this.stepTimer = 0;
    this.total = rows * cols;

    const gridWidth = cols * cellW;
    const startX = (CONFIG.canvas.width - gridWidth) / 2;

    for (let row = 0; row < rows; row++) {
      const type = typeForRow(row);
      const spriteW = spriteCols(SPRITES[type][0]) * CONFIG.scale;
      for (let col = 0; col < cols; col++) {
        const cellLeft = startX + col * cellW;
        // Centrar el sprite dentro de su celda
        const x = cellLeft + (cellW - spriteW) / 2;
        const y = startY + row * cellH;
        this.invaders.push(new Invader(type, x, y));
      }
    }
  }

  get aliveInvaders() {
    return this.invaders.filter((i) => i.alive);
  }

  get aliveCount() {
    return this.aliveInvaders.length;
  }

  /** Intervalo entre pasos: acelera al reducirse la población (RF-13)
   *  y con el nivel/oleada (SI-17). */
  get stepInterval() {
    const { baseInterval, minInterval } = CONFIG.invaders;
    const fraction = this.aliveCount / this.total;
    const levelFactor = Math.pow(CONFIG.waves.speedup, this.level - 1);
    return Math.max(minInterval, baseInterval * fraction * levelFactor);
  }

  /**
   * Invasores que pueden disparar: el más bajo de cada columna (SI-13).
   * @returns {Invader[]}
   */
  getShooters() {
    const lowestByColumn = new Map();
    for (const inv of this.aliveInvaders) {
      // Agrupa por columna usando el centro horizontal redondeado
      const colKey = Math.round((inv.x + inv.w / 2) / 4);
      const current = lowestByColumn.get(colKey);
      if (!current || inv.y > current.y) lowestByColumn.set(colKey, inv);
    }
    return [...lowestByColumn.values()];
  }

  update(dt) {
    this.stepTimer += dt;
    if (this.stepTimer >= this.stepInterval) {
      this.stepTimer = 0;
      this.step();
    }
  }

  /** Un "paso" de la formación: lateral o (al tocar borde) descenso + giro. */
  step() {
    const { stepX, stepDown, marginX } = CONFIG.invaders;
    const alive = this.aliveInvaders;
    if (alive.length === 0) return;

    const move = this.dir * stepX;
    let hitEdge = false;
    for (const inv of alive) {
      const nx = inv.x + move;
      if (nx < marginX || nx + inv.w > CONFIG.canvas.width - marginX) {
        hitEdge = true;
        break;
      }
    }

    if (hitEdge) {
      // Bajar una fila e invertir dirección (RF-12)
      this.dir *= -1;
      for (const inv of alive) inv.y += stepDown;
    } else {
      for (const inv of alive) inv.x += move;
    }

    // Alternar frame de animación (RF-15 / GDD §3.1)
    this.frame ^= 1;
  }

  /** y más bajo alcanzado por algún invasor vivo (para detectar invasión). */
  lowestY() {
    let max = 0;
    for (const inv of this.aliveInvaders) {
      max = Math.max(max, inv.y + inv.h);
    }
    return max;
  }

  render(ctx) {
    for (const inv of this.invaders) {
      if (inv.alive) inv.render(ctx, this.frame);
    }
  }
}
