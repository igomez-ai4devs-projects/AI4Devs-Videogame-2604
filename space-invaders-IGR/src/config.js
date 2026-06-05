// config.js — Constantes centralizadas (SI-04, CLAUDE.md §3 "sin números mágicos")

export const CONFIG = {
  canvas: { width: 960, height: 640 },

  colors: {
    bg: "#000000",
    white: "#ffffff",
    green: "#21ff21",
    red: "#ff2121",
    dim: "#888888",
  },

  // Escala global de los sprites de pixel art
  scale: 3,

  player: {
    speed: 340, // px/s
    cooldown: 0.4, // s entre disparos
    lives: 3,
    marginBottom: 84, // distancia del jugador al borde inferior
  },

  bullet: {
    playerSpeed: 620, // px/s (hacia arriba)
    width: 3,
    height: 14,
  },

  invaders: {
    rows: 5,
    cols: 11,
    cellW: 48,
    cellH: 38,
    startY: 96,
    marginX: 36, // margen lateral mínimo para rebotar
    stepX: 12, // desplazamiento horizontal por paso
    stepDown: 22, // descenso al tocar borde
    baseInterval: 0.62, // s entre pasos con la formación completa
    minInterval: 0.06, // s entre pasos cuando quedan pocos
  },

  // Puntuación por tipo de invasor (ver GAME-DESIGN.md §2.1)
  points: { A: 30, B: 20, C: 10 },

  ground: { offset: 60 }, // altura de la línea de suelo desde abajo
};

// Línea de suelo (y) calculada a partir del canvas
export const GROUND_Y = CONFIG.canvas.height - CONFIG.ground.offset;
