# Space Invaders 🛸

Clon del arcade clásico **Space Invaders** en **HTML5 + CSS + JavaScript** con **Canvas API
2D nativo** (sin dependencias ni build). Ejecutable en **Chrome** y **Microsoft Edge**.

> Documentación de producto y diseño: [PRD.md](PRD.md) · [GAME-DESIGN.md](GAME-DESIGN.md) ·
> [CASOS-DE-USO.md](CASOS-DE-USO.md) · [TICKETS.md](TICKETS.md) · [CLAUDE.md](CLAUDE.md)

---

## 🎮 Cómo jugar

Al usar **módulos ES6**, debe servirse por HTTP (no abrir con `file://`):

```powershell
# Opción A — npm
npm start            # sirve en http://localhost:8000

# Opción B — Python
python -m http.server 8000

# Opción C — Node
npx serve -l 8000 .
```

Luego abre **http://localhost:8000** en Chrome o Edge.

### Controles
| Acción | Tecla |
|--------|-------|
| Mover | ← → (o A / D) |
| Disparar | Espacio |
| Pausa / Reanudar | P |
| Empezar / Reiniciar | Enter o Click |
| Navegar Game Over | ↑ ↓ + Enter |

---

## ✨ Características

- **Jugador**: movimiento horizontal con límites y disparo con cadencia.
- **Invasores**: formación 5×11 con 3 tipos (30/20/10 pts), que baja, invierte y **acelera**.
- **Disparo enemigo** y **vidas** con invulnerabilidad temporal tras impacto.
- **Escudos/búnkeres** destructibles por celdas.
- **OVNI / Mystery** bonus con puntuación aleatoria (50/100/150/300).
- **Oleadas** infinitas progresivamente más rápidas.
- **HUD** con puntuación, nivel, high-score y vidas; **high-score persistente** (localStorage).
- **Sonidos** sintetizados con Web Audio API (disparo, explosión, marcha, OVNI, muerte) y
  **feedback visual** de explosión.
- Pantallas **MENU**, **PLAYING/PAUSE** y **GAME OVER**.

---

## 🏗️ Arquitectura

```
src/
├── main.js                 # Game loop (delta time) + orquestación
├── config.js               # Constantes centralizadas
├── utils/   helpers, sprites (pixel art), text
├── systems/ input, audio, collisions, hud
├── entities/ player, bullet, invader, grid, shield, ufo, explosion
└── states/  stateMachine, menuState, playState, gameOverState
```

Patrones aplicados: **Game Loop**, **State**, **Entity**, **Factory** (grid/escudos),
**Command** (input). Lógica separada del render para ser **testeable**.

---

## ✅ Tests

```powershell
npm test        # node tests/run.mjs
```

Cubren lógica pura sin navegador (29 aserciones): AABB, formación 5×11, tipos/puntos,
aceleración por nivel, colisiones jugador/enemigo, vidas/invulnerabilidad, escudos y OVNI.

---

## 🔎 Verificación cross-browser (SI-23)

| Comprobación | Estado |
|--------------|--------|
| Sintaxis de los 19 módulos (`node --check`) | ✅ automatizado |
| 29 tests de lógica (`npm test`) | ✅ automatizado |
| Carga sin errores en consola (Chrome) | ⬜ manual |
| Carga sin errores en consola (Edge) | ⬜ manual |
| ~60 FPS y jugabilidad fluida | ⬜ manual |
| Audio activo tras el primer gesto | ⬜ manual |

> Checklist manual recomendado: iniciar partida, destruir invasores (puntos + sonido),
> recibir impacto (pierde vida + parpadeo), erosionar un escudo, destruir el OVNI, limpiar
> una oleada (sube nivel y velocidad) y provocar Game Over (modal + PLAY AGAIN).

---

## 🗺️ Estado del backlog

- **Fase 1 (MVP):** SI-01 … SI-06, SI-08, SI-09, SI-11, SI-12, SI-15, SI-18, SI-19 ✅
- **Fase 2 (mejoras):** SI-07, SI-10, SI-13, SI-17, SI-20 ✅
- **Fase 3 (pulido):** SI-14, SI-16, SI-21, SI-22 ✅ · SI-23 (verificación manual pendiente)
