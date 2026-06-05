# Tickets / Backlog — Space Invaders

Backlog de trabajo derivado de los [CASOS-DE-USO.md](CASOS-DE-USO.md), el
[PRD.md](PRD.md) y el [GAME-DESIGN.md](GAME-DESIGN.md). Los tickets están agrupados por
**épicas** y enlazados con sus casos de uso (CU-xx) y requisitos (RF-xx).

**Leyenda de prioridad:** 🔴 Alta · 🟡 Media · 🟢 Baja
**Estimación:** *Story Points* (Fibonacci: 1, 2, 3, 5, 8)

---

## Épica E0 — Fundamentos técnicos (arquitectura base)

### SI-01 · Scaffolding del proyecto y canvas
- **Como** desarrollador, **quiero** la estructura base del proyecto y el lienzo, **para**
  poder renderizar y arrancar el juego en el navegador.
- **Prioridad:** 🔴 · **Estimación:** 3
- **Tareas:**
  - [ ] Crear `index.html` con `<canvas>` y carga del módulo principal.
  - [ ] Crear `style.css` (fondo negro, centrado, `image-rendering: pixelated`).
  - [ ] Estructura `src/` (`main.js`, `config.js`, `entities/`, `systems/`, `states/`, `utils/`).
  - [ ] Cargar tipografía pixel y paleta de colores definida en el GDD.
- **Criterios de aceptación:**
  - El proyecto carga en Chrome y Edge sin errores en consola.
  - El canvas se muestra centrado con fondo negro.
- **Trazabilidad:** RNF-02, RNF-03, RNF-04 · GDD §1

### SI-02 · Game loop con delta time
- **Como** desarrollador, **quiero** un bucle de juego con `requestAnimationFrame` y `dt`,
  **para** que la lógica sea fluida e independiente del hardware.
- **Prioridad:** 🔴 · **Estimación:** 3
- **Tareas:**
  - [ ] Implementar loop con separación `update(dt)` / `render()`.
  - [ ] Calcular delta time entre frames.
  - [ ] Objetivo de ~60 FPS.
- **Criterios de aceptación:**
  - El movimiento es consistente independientemente de los FPS.
  - `update` y `render` están claramente separados.
- **Trazabilidad:** RNF-01, RNF-07 · CLAUDE.md §3

### SI-03 · Máquina de estados de pantalla
- **Como** desarrollador, **quiero** una máquina de estados (`MENU`, `PLAYING`, `PAUSED`,
  `GAME_OVER`), **para** gestionar el flujo entre pantallas.
- **Prioridad:** 🔴 · **Estimación:** 3
- **Tareas:**
  - [ ] Implementar patrón State con transiciones.
  - [ ] Cada estado gestiona su propio `update`/`render`/input.
- **Criterios de aceptación:**
  - Las transiciones del mapa de estados del GDD funcionan correctamente.
- **Trazabilidad:** CU-01, CU-04, CU-09, CU-11 · GDD §5

### SI-04 · Sistema de entrada (input) y configuración
- **Como** desarrollador, **quiero** un gestor de input y un módulo de constantes, **para**
  centralizar controles y parámetros del juego.
- **Prioridad:** 🔴 · **Estimación:** 2
- **Tareas:**
  - [ ] Capturar teclado (flechas/A-D, espacio, P/Esc) con patrón Command.
  - [ ] Centralizar velocidades, dimensiones y puntuaciones en `config.js`.
- **Criterios de aceptación:**
  - No hay "números mágicos" dispersos; el input es remapeable.
- **Trazabilidad:** RNF-04 · CLAUDE.md §4

---

## Épica E1 — Pantallas y navegación

### SI-05 · Pantalla de inicio (MENU)
- **Como** jugador, **quiero** una pantalla de inicio, **para** comenzar a jugar.
- **Prioridad:** 🔴 · **Estimación:** 3
- **Tareas:**
  - [ ] Título "SPACE INVADERS" y "CLICK HERE TO PLAY!" con parpadeo.
  - [ ] Tabla "SCORE ADVANCE TABLE" con sprites y valores (OVNI=?, 30, 20, 10).
  - [ ] Iniciar partida con clic o tecla.
- **Criterios de aceptación:**
  - Reproduce la Imagen 1; al hacer clic/tecla pasa a `PLAYING`.
- **Trazabilidad:** CU-01 · RF-01, RF-02 · GDD §2.1

### SI-06 · Pantalla de Game Over
- **Como** jugador, **quiero** una pantalla de fin de partida, **para** ver mi puntuación y
  volver a jugar.
- **Prioridad:** 🔴 · **Estimación:** 3
- **Tareas:**
  - [ ] Modal con borde verde sobre la escena de fondo.
  - [ ] "GAME OVER", "PLAY AGAIN" (resaltado) y "MORE GAMES".
  - [ ] "PLAY AGAIN" reinicia; "MORE GAMES" vuelve al menú.
- **Criterios de aceptación:**
  - Reproduce la Imagen 3; las opciones funcionan.
- **Trazabilidad:** CU-09, CU-11 · RF-04, RF-05 · GDD §2.3

### SI-07 · Pausa / Reanudar
- **Como** jugador, **quiero** pausar y reanudar, **para** interrumpir la partida sin perder.
- **Prioridad:** 🟡 · **Estimación:** 2
- **Tareas:**
  - [ ] Tecla de pausa congela la lógica y muestra indicador.
  - [ ] Reanudar continúa desde el mismo estado.
- **Criterios de aceptación:**
  - En `PAUSED` no se actualiza la lógica; al reanudar continúa sin saltos.
- **Trazabilidad:** CU-04 · RF-03

---

## Épica E2 — Jugador

### SI-08 · Movimiento de la nave
- **Como** jugador, **quiero** mover la nave en horizontal, **para** esquivar y apuntar.
- **Prioridad:** 🔴 · **Estimación:** 2
- **Tareas:**
  - [ ] Movimiento izquierda/derecha basado en `dt`.
  - [ ] Limitar a los bordes de la pantalla.
- **Criterios de aceptación:**
  - La nave se mueve con fluidez y no sale de los límites.
- **Trazabilidad:** CU-02 · RF-06, RF-07

### SI-09 · Disparo del jugador
- **Como** jugador, **quiero** disparar hacia arriba, **para** destruir invasores.
- **Prioridad:** 🔴 · **Estimación:** 3
- **Tareas:**
  - [ ] Crear proyectil ascendente al pulsar espacio.
  - [ ] Limitar cadencia (1 proyectil activo / cooldown).
  - [ ] Pool de proyectiles (Object Pool).
- **Criterios de aceptación:**
  - El disparo respeta el límite de cadencia; el proyectil sube y se elimina al salir.
- **Trazabilidad:** CU-03 · RF-08, RF-09, RF-17, RF-20

### SI-10 · Vidas del jugador
- **Como** jugador, **quiero** tener varias vidas, **para** seguir jugando tras un impacto.
- **Prioridad:** 🔴 · **Estimación:** 2
- **Tareas:**
  - [ ] Inicializar vidas (p. ej. 3).
  - [ ] Restar vida al ser impactado y reaparecer.
- **Criterios de aceptación:**
  - Al recibir impacto pierde una vida; con 0 vidas dispara Game Over.
- **Trazabilidad:** CU-07, CU-11 · RF-19, RF-24, RF-28

---

## Épica E3 — Invasores

### SI-11 · Formación de invasores (rejilla)
- **Como** jugador, **quiero** enfrentarme a una formación de invasores, **para** tener un reto.
- **Prioridad:** 🔴 · **Estimación:** 5
- **Tareas:**
  - [ ] Generar rejilla 5×11 con 3 tipos (30/20/10 pts).
  - [ ] Patrón Entity y Factory para crear invasores.
  - [ ] Sprites con 2 frames de animación.
- **Criterios de aceptación:**
  - Reproduce la formación de la Imagen 2 con los tipos correctos.
- **Trazabilidad:** CU-05 · RF-10, RF-15 · GDD §2.2, §3

### SI-12 · Movimiento de la formación
- **Como** jugador, **quiero** que los invasores avancen, **para** sentir la amenaza.
- **Prioridad:** 🔴 · **Estimación:** 5
- **Tareas:**
  - [ ] Desplazamiento lateral en bloque.
  - [ ] Bajar fila e invertir dirección al tocar borde.
  - [ ] Acelerar al reducirse el número de invasores.
- **Criterios de aceptación:**
  - Al tocar borde baja y cambia de sentido; la velocidad aumenta al quedar menos.
- **Trazabilidad:** CU-05 · RF-11, RF-12, RF-13

### SI-13 · Disparo enemigo
- **Como** jugador, **quiero** que los invasores disparen, **para** tener que esquivar.
- **Prioridad:** 🟡 · **Estimación:** 3
- **Tareas:**
  - [ ] Selección de invasor disparador (p. ej. el más bajo de una columna).
  - [ ] Proyectiles descendentes con probabilidad/temporizador.
- **Criterios de aceptación:**
  - Los invasores generan proyectiles que descienden hacia el jugador.
- **Trazabilidad:** CU-06 · RF-14, RF-17

### SI-14 · OVNI / Mystery bonus
- **Como** jugador, **quiero** un OVNI bonus, **para** conseguir puntos extra.
- **Prioridad:** 🟢 · **Estimación:** 3
- **Tareas:**
  - [ ] Generar OVNI rojo que cruza la parte superior por temporizador.
  - [ ] Otorgar puntos aleatorios al ser impactado; eliminar al salir.
- **Criterios de aceptación:**
  - Aparece ocasionalmente y otorga puntos misteriosos si se destruye.
- **Trazabilidad:** CU-12 · RF-16

---

## Épica E4 — Colisiones, escudos y reglas

### SI-15 · Sistema de colisiones (AABB)
- **Como** desarrollador, **quiero** detección de colisiones, **para** resolver impactos.
- **Prioridad:** 🔴 · **Estimación:** 5
- **Tareas:**
  - [ ] Función AABB reutilizable en `utils/`.
  - [ ] Proyectil jugador → invasor (destruye + puntos).
  - [ ] Proyectil enemigo → jugador (resta vida).
  - [ ] Eliminar proyectiles fuera de pantalla.
- **Criterios de aceptación:**
  - Cada tipo de colisión produce el efecto esperado y limpia entidades.
- **Trazabilidad:** CU-07 · RF-18, RF-19, RF-20

### SI-16 · Escudos / búnkeres destructibles
- **Como** jugador, **quiero** escudos protectores, **para** resguardarme.
- **Prioridad:** 🟢 · **Estimación:** 5
- **Tareas:**
  - [ ] 4 escudos verdes sobre el jugador.
  - [ ] Erosión por impactos de ambos bandos.
- **Criterios de aceptación:**
  - Los escudos se degradan progresivamente con los impactos.
- **Trazabilidad:** CU-07 · RF-21 · GDD §3

### SI-17 · Avance de oleada
- **Como** jugador, **quiero** nuevas oleadas, **para** que el juego progrese en dificultad.
- **Prioridad:** 🟡 · **Estimación:** 2
- **Tareas:**
  - [ ] Detectar oleada eliminada.
  - [ ] Regenerar formación con mayor velocidad y subir nivel.
- **Criterios de aceptación:**
  - Al limpiar la oleada aparece otra más rápida y sube el contador de nivel.
- **Trazabilidad:** CU-08 · RF-26

### SI-18 · Condiciones de fin de partida
- **Como** jugador, **quiero** un final claro, **para** saber cuándo termino.
- **Prioridad:** 🔴 · **Estimación:** 2
- **Tareas:**
  - [ ] Game Over por vidas a 0.
  - [ ] Game Over si los invasores alcanzan la línea del jugador.
- **Criterios de aceptación:**
  - Cualquiera de las dos condiciones transita a `GAME_OVER`.
- **Trazabilidad:** CU-11 · RF-28, RF-29

---

## Épica E5 — HUD, puntuación y feedback

### SI-19 · HUD (puntuación, nivel y vidas)
- **Como** jugador, **quiero** ver puntuación, nivel y vidas, **para** seguir mi progreso.
- **Prioridad:** 🔴 · **Estimación:** 3
- **Tareas:**
  - [ ] `SCORE <nivel>` y marcador de 5 dígitos (ceros a la izquierda).
  - [ ] Contador de vidas.
  - [ ] Actualización en tiempo real vía Observer/Event Bus.
- **Criterios de aceptación:**
  - El HUD reproduce la Imagen 2 y se actualiza ante cada evento relevante.
- **Trazabilidad:** CU-10 · RF-22, RF-23, RF-24, RF-25 · GDD §4

### SI-20 · Sistema de puntuación y high score de sesión
- **Como** jugador, **quiero** sumar puntos y ver el récord, **para** competir conmigo mismo.
- **Prioridad:** 🟡 · **Estimación:** 2
- **Tareas:**
  - [ ] Sumar puntos según el tipo de invasor (30/20/10) y OVNI.
  - [ ] Mantener high score durante la sesión.
- **Criterios de aceptación:**
  - La puntuación sube correctamente y el récord persiste durante la sesión.
- **Trazabilidad:** CU-10 · RF-22, RF-27

### SI-21 · Efectos de sonido y feedback visual
- **Como** jugador, **quiero** sonidos y efectos de impacto, **para** una experiencia inmersiva.
- **Prioridad:** 🟢 · **Estimación:** 3
- **Tareas:**
  - [ ] SFX de disparo y explosión.
  - [ ] Animación/parpadeo de explosión al destruir entidades.
- **Criterios de aceptación:**
  - Las acciones clave tienen feedback audiovisual.
- **Trazabilidad:** RF-30, RF-31 · GDD §3.2

---

## Épica E6 — Calidad y verificación

### SI-22 · Tests unitarios de la lógica de juego
- **Como** desarrollador, **quiero** tests de la lógica aislada del DOM, **para** asegurar
  comportamiento correcto y refactors seguros.
- **Prioridad:** 🟡 · **Estimación:** 5
- **Tareas:**
  - [ ] Tests de colisiones (AABB), puntuación, vidas y avance de oleada.
  - [ ] Lógica desacoplada del render/canvas.
- **Criterios de aceptación:**
  - La lógica clave está cubierta por tests que pasan sin navegador.
- **Trazabilidad:** RNF-05 · CLAUDE.md §4

### SI-23 · Verificación cross-browser y rendimiento
- **Como** Product Owner, **quiero** validar el juego en Chrome y Edge, **para** cumplir los
  criterios de aceptación del PRD.
- **Prioridad:** 🔴 · **Estimación:** 2
- **Tareas:**
  - [ ] Probar carga y jugabilidad en Chrome y Edge.
  - [ ] Verificar ~60 FPS y ausencia de errores en consola.
- **Criterios de aceptación:**
  - Cumple la Definition of Done del PRD.
- **Trazabilidad:** RNF-01, RNF-02 · PRD §8

---

## Resumen del backlog

| Épica | Tickets | Foco |
|-------|---------|------|
| E0 Fundamentos técnicos | SI-01 … SI-04 | Canvas, game loop, estados, input |
| E1 Pantallas | SI-05 … SI-07 | Menú, Game Over, Pausa |
| E2 Jugador | SI-08 … SI-10 | Movimiento, disparo, vidas |
| E3 Invasores | SI-11 … SI-14 | Formación, movimiento, disparo, OVNI |
| E4 Colisiones y reglas | SI-15 … SI-18 | AABB, escudos, oleadas, fin de partida |
| E5 HUD y feedback | SI-19 … SI-21 | HUD, puntuación, SFX |
| E6 Calidad | SI-22 … SI-23 | Tests y verificación |

### Orden sugerido de implementación (MVP primero)
1. **MVP jugable:** SI-01 → SI-02 → SI-03 → SI-04 → SI-05 → SI-08 → SI-09 → SI-11 → SI-12 → SI-15 → SI-18 → SI-19 → SI-06.
2. **Mejoras de juego:** SI-10 → SI-13 → SI-17 → SI-20 → SI-07.
3. **Pulido y extras:** SI-14 → SI-16 → SI-21 → SI-22 → SI-23.
