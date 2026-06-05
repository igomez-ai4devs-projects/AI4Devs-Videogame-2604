// shield.js — Búnker destructible por celdas (SI-16, RF-21)

import { CONFIG } from "../config.js";
import { aabb } from "../utils/helpers.js";

/** Genera la forma clásica del búnker (rectángulo con esquinas y arco inferior). */
function buildShape(cols, rows) {
  const cells = [];
  const center = cols / 2;
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      let solid = true;
      // Esquinas superiores redondeadas
      const slope = Math.max(0, 3 - r);
      if (c < slope || c > cols - 1 - slope) solid = false;
      // Arco inferior central (hueco en forma de ∩)
      const archTop = rows - 6;
      if (r >= archTop) {
        const half = r === archTop ? 2 : 3;
        if (c >= center - half && c < center + half) solid = false;
      }
      row.push(solid);
    }
    cells.push(row);
  }
  return cells;
}

export class Shield {
  constructor(x, y) {
    const { cols, rows, cell } = CONFIG.shields;
    this.x = x;
    this.y = y;
    this.cell = cell;
    this.cols = cols;
    this.rows = rows;
    this.w = cols * cell;
    this.h = rows * cell;
    this.cells = buildShape(cols, rows);
  }

  get box() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }

  /** ¿Quedan bloques? (para descartar búnkeres vacíos). */
  get isEmpty() {
    return this.cells.every((row) => row.every((c) => !c));
  }

  /**
   * Comprueba e impacta el búnker con un proyectil. Si toca un bloque sólido,
   * lo erosiona en un radio y devuelve true (para consumir el proyectil).
   * @param {{x:number,y:number,w:number,h:number}} b
   * @returns {boolean}
   */
  hit(b) {
    if (!aabb(b, this.box)) return false;
    const cs = this.cell;
    const c0 = Math.floor((b.x - this.x) / cs);
    const c1 = Math.floor((b.x + b.w - this.x) / cs);
    const r0 = Math.floor((b.y - this.y) / cs);
    const r1 = Math.floor((b.y + b.h - this.y) / cs);

    // Primer bloque sólido dentro del solape
    let hitR = -1;
    let hitC = -1;
    for (let r = Math.max(0, r0); r <= Math.min(this.rows - 1, r1); r++) {
      for (let c = Math.max(0, c0); c <= Math.min(this.cols - 1, c1); c++) {
        if (this.cells[r][c]) {
          hitR = r;
          hitC = c;
          break;
        }
      }
      if (hitR >= 0) break;
    }
    if (hitR < 0) return false;

    // Erosión en radio circular
    const R = CONFIG.shields.blastRadius;
    for (let r = hitR - R; r <= hitR + R; r++) {
      for (let c = hitC - R; c <= hitC + R; c++) {
        if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) continue;
        if ((r - hitR) ** 2 + (c - hitC) ** 2 <= R * R + 1) this.cells[r][c] = false;
      }
    }
    return true;
  }

  render(ctx) {
    ctx.fillStyle = CONFIG.colors.green;
    const cs = this.cell;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.cells[r][c]) {
          ctx.fillRect(this.x + c * cs, this.y + r * cs, cs, cs);
        }
      }
    }
  }
}

/** Crea los búnkeres repartidos horizontalmente (SI-16). */
export function createShields() {
  const { count, cols, cell, y } = CONFIG.shields;
  const shieldW = cols * cell;
  const shields = [];
  // Reparto uniforme con márgenes a los lados
  const gap = (CONFIG.canvas.width - count * shieldW) / (count + 1);
  for (let i = 0; i < count; i++) {
    const x = gap + i * (shieldW + gap);
    shields.push(new Shield(x, y));
  }
  return shields;
}
