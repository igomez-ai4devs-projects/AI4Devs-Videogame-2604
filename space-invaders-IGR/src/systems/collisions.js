// collisions.js — Resolución de colisiones (SI-15, RF-18/RF-20)

import { aabb } from "../utils/helpers.js";

/**
 * Resuelve impactos de los proyectiles del jugador contra los invasores.
 * Marca como muertos los invasores y proyectiles impactados.
 * @param {import("../entities/bullet.js").Bullet[]} bullets
 * @param {import("../entities/grid.js").InvaderGrid} grid
 * @returns {{points:number,x:number,y:number,w:number,h:number}[]} invasores destruidos
 */
export function resolvePlayerBullets(bullets, grid) {
  const destroyed = [];
  for (const bullet of bullets) {
    if (!bullet.alive) continue;
    for (const inv of grid.invaders) {
      if (!inv.alive) continue;
      if (aabb(bullet, inv.box)) {
        inv.alive = false;
        bullet.alive = false;
        destroyed.push({ points: inv.points, x: inv.x, y: inv.y, w: inv.w, h: inv.h });
        break; // un proyectil destruye un solo invasor
      }
    }
  }
  return destroyed;
}

/**
 * Resuelve impactos de proyectiles contra los escudos (SI-16, RF-21).
 * Erosiona el búnker y consume el proyectil al tocar un bloque sólido.
 * @param {import("../entities/bullet.js").Bullet[]} bullets
 * @param {import("../entities/shield.js").Shield[]} shields
 */
export function resolveShieldCollisions(bullets, shields) {
  for (const bullet of bullets) {
    if (!bullet.alive) continue;
    for (const shield of shields) {
      if (shield.hit(bullet)) {
        bullet.alive = false;
        break;
      }
    }
  }
}

/**
 * Resuelve impactos de proyectiles enemigos contra el jugador (SI-10, RF-19).
 * Si el jugador es vulnerable y recibe impacto, consume el proyectil.
 * @param {import("../entities/bullet.js").Bullet[]} bullets
 * @param {import("../entities/player.js").Player} player
 * @returns {boolean} true si el jugador fue alcanzado
 */
export function resolveEnemyBullets(bullets, player) {
  if (player.invulnerable) return false;
  for (const bullet of bullets) {
    if (!bullet.alive) continue;
    if (aabb(bullet, player.box)) {
      bullet.alive = false;
      return true;
    }
  }
  return false;
}
