// helpers.js — Utilidades puras y testeables (SI-15, RNF-05)

/**
 * Detección de colisión por caja envolvente (AABB).
 * @param {{x:number,y:number,w:number,h:number}} a
 * @param {{x:number,y:number,w:number,h:number}} b
 * @returns {boolean}
 */
export function aabb(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

/** Restringe un valor al rango [min, max]. */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/** Entero aleatorio en [min, max] (ambos inclusive). */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Formatea un número a un marcador de N dígitos con ceros a la izquierda. */
export function padScore(value, digits = 5) {
  return String(Math.max(0, Math.floor(value))).padStart(digits, "0");
}
