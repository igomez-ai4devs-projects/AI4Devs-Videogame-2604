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
    invulnTime: 1.6, // s de invulnerabilidad tras ser impactado (SI-10)
  },

  bullet: {
    playerSpeed: 620, // px/s (hacia arriba)
    enemySpeed: 300, // px/s (hacia abajo) (SI-13)
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
    fireBaseInterval: 1.1, // s medio entre disparos enemigos (SI-13)
    fireMinInterval: 0.35, // límite inferior del intervalo de disparo
  },

  // Progresión de oleadas (SI-17)
  waves: {
    speedup: 0.84, // factor multiplicador del intervalo por nivel (más rápido)
    fireSpeedup: 0.9, // los enemigos disparan más a menudo por nivel
  },

  // OVNI / Mystery bonus (SI-14)
  ufo: {
    y: 60,
    speed: 170, // px/s
    minDelay: 9, // s mínimo entre apariciones
    maxDelay: 18, // s máximo entre apariciones
    points: [50, 100, 150, 300], // puntuación aleatoria al destruirlo
  },

  // Escudos / búnkeres destructibles (SI-16)
  shields: {
    count: 4,
    cell: 4, // tamaño de cada bloque destructible (px)
    cols: 22,
    rows: 16,
    y: 430, // posición vertical de los búnkeres
    blastRadius: 2, // radio de destrucción por impacto (en celdas)
  },

  // Feedback visual de explosión (SI-21)
  explosion: { duration: 0.22 },

  // Puntuación por tipo de invasor (ver GAME-DESIGN.md §2.1)
  points: { A: 30, B: 20, C: 10 },

  ground: { offset: 60 }, // altura de la línea de suelo desde abajo
};

// Línea de suelo (y) calculada a partir del canvas
export const GROUND_Y = CONFIG.canvas.height - CONFIG.ground.offset;
