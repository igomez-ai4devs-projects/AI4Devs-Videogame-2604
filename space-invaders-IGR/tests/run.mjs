// run.mjs — Tests de la lógica de juego (SI-22, RNF-05).
// Ejecuta sin navegador: `node tests/run.mjs` o `npm test`.
// Cubre lógica pura (sin DOM): colisiones, formación, escudos, OVNI, vidas.

import { aabb, clamp, padScore, randomInt } from "../src/utils/helpers.js";
import { InvaderGrid } from "../src/entities/grid.js";
import { Player } from "../src/entities/player.js";
import { UFO } from "../src/entities/ufo.js";
import { Shield, createShields } from "../src/entities/shield.js";
import {
  resolvePlayerBullets,
  resolveEnemyBullets,
  resolveShieldCollisions,
} from "../src/systems/collisions.js";

let pass = 0;
let fail = 0;
const results = [];

function ok(cond, msg) {
  if (cond) {
    pass++;
    results.push("  ✓ " + msg);
  } else {
    fail++;
    results.push("  ✗ " + msg);
  }
}

function group(name) {
  results.push("\n" + name);
}

// --- Utilidades -----------------------------------------------------------
group("helpers");
ok(aabb({ x: 0, y: 0, w: 10, h: 10 }, { x: 5, y: 5, w: 10, h: 10 }), "AABB solapadas");
ok(!aabb({ x: 0, y: 0, w: 10, h: 10 }, { x: 99, y: 0, w: 10, h: 10 }), "AABB separadas");
ok(clamp(15, 0, 10) === 10, "clamp por arriba");
ok(clamp(-5, 0, 10) === 0, "clamp por abajo");
ok(padScore(20) === "00020", "padScore 5 dígitos");
ok((() => { const n = randomInt(2, 2); return n === 2; })(), "randomInt rango unitario");

// --- Formación de invasores (SI-11/12/17) ---------------------------------
group("InvaderGrid");
const grid = new InvaderGrid(1);
ok(grid.aliveCount === 55, "55 invasores (5x11)");
ok(grid.invaders[0].points === 30, "fila superior = 30 pts (tipo A)");
ok(grid.invaders.some((i) => i.points === 20), "existe tipo B = 20 pts");
ok(grid.invaders.some((i) => i.points === 10), "existe tipo C = 10 pts");
ok(grid.getShooters().length === 11, "11 disparadores (1 por columna)");
ok(new InvaderGrid(3).stepInterval < new InvaderGrid(1).stepInterval, "nivel 3 más rápido que nivel 1");

// --- Colisiones bala-invasor (SI-15) --------------------------------------
group("colisiones jugador → invasor");
const target = grid.invaders[0];
const pb = { x: target.x + 2, y: target.y + 2, w: 3, h: 6, alive: true };
const destroyed = resolvePlayerBullets([pb], grid);
ok(destroyed.length === 1 && destroyed[0].points === 30, "destruye 1 invasor y reporta 30 pts");
ok(!target.alive, "invasor marcado muerto");
ok(!pb.alive, "bala consumida");
ok(grid.aliveCount === 54, "quedan 54 vivos");
ok(resolvePlayerBullets([{ x: -50, y: -50, w: 3, h: 6, alive: true }], grid).length === 0, "bala sin impacto no destruye");

// --- Vidas y disparo enemigo (SI-10/13) -----------------------------------
group("colisiones enemigo → jugador");
const player = new Player();
const eb = { x: player.x + 5, y: player.y + 5, w: 3, h: 6, alive: true };
ok(resolveEnemyBullets([eb], player) === true, "impacto al jugador detectado");
ok(!eb.alive, "proyectil enemigo consumido");
player.hit();
ok(player.invulnerable, "jugador invulnerable tras hit()");
ok(resolveEnemyBullets([{ x: player.x + 5, y: player.y + 5, w: 3, h: 6, alive: true }], player) === false, "invulnerable ignora impacto");

// --- Escudos destructibles (SI-16) ----------------------------------------
group("escudos");
const shields = createShields();
ok(shields.length === 4, "4 búnkeres creados");
const shield = new Shield(100, 100);
const solidBefore = shield.cells.flat().filter(Boolean).length;
ok(solidBefore > 0, "el búnker nace con bloques sólidos");
// Impacto en el centro superior (zona sólida)
const sb = { x: shield.x + shield.w / 2, y: shield.y, w: 3, h: 6, alive: true };
resolveShieldCollisions([sb], [shield]);
ok(!sb.alive, "proyectil consumido por el escudo");
const solidAfter = shield.cells.flat().filter(Boolean).length;
ok(solidAfter < solidBefore, "el impacto erosiona bloques");
ok(!shield.isEmpty, "el búnker no queda vacío con un impacto");

// --- OVNI / Mystery (SI-14) -----------------------------------------------
group("OVNI bonus");
const ufoR = new UFO(1);
ok(ufoR.x < 0, "OVNI dir+ entra desde la izquierda");
ok(CONFIG_points_includes(ufoR.points), "OVNI con puntuación válida");
const ufoL = new UFO(-1);
ok(ufoL.x >= 0, "OVNI dir- entra desde la derecha");

function CONFIG_points_includes(p) {
  return [50, 100, 150, 300].includes(p);
}

// --- Resumen --------------------------------------------------------------
console.log(results.join("\n"));
console.log(`\n${pass} OK, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
