// collisions.js — Resolución de colisiones (SI-15, RF-18/RF-20)

import { aabb } from "../utils/helpers.js";

/**
 * Resuelve impactos de los proyectiles del jugador contra los invasores.
 * Marca como muertos los invasores y proyectiles impactados.
 * @param {import("../entities/bullet.js").Bullet[]} bullets
 * @param {import("../entities/grid.js").InvaderGrid} grid
 * @returns {number} puntos ganados en esta resolución
 */
export function resolvePlayerBullets(bullets, grid) {
  let gained = 0;
  for (const bullet of bullets) {
    if (!bullet.alive) continue;
    for (const inv of grid.invaders) {
      if (!inv.alive) continue;
      if (aabb(bullet, inv.box)) {
        inv.alive = false;
        bullet.alive = false;
        gained += inv.points;
        break; // un proyectil destruye un solo invasor
      }
    }
  }
  return gained;
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
