# Diseño de Juego (GDD visual) — Space Invaders

Diseño de **pantallas** y **elementos** basado en las referencias del Space Invaders clásico.
Objetivo: replicar el estilo retro arcade (pixel art, fondo negro, tipografía monoespaciada
en mayúsculas).

---

## 1. Estilo visual general (Art Direction)

| Aspecto | Decisión de diseño |
|---------|--------------------|
| **Fondo** | Negro puro (`#000000`) en todas las pantallas |
| **Tipografía** | Pixel/monoespaciada, mayúsculas, blanca (estilo "Press Start 2P") |
| **Paleta** | Blanco (`#FFFFFF`) para texto/invasores · Verde (`#00FF00`/`#21FF21`) para jugador, escudos, suelo y resaltados · Rojo (`#FF0000`) para el OVNI bonus |
| **Resolución base** | Canvas ~ `960 × 640` px (proporción ancha tipo arcade), escalable |
| **Render** | Pixel art nítido: `image-rendering: pixelated`, sin antialiasing |
| **Estética** | Sprites de 1-bit (silueta blanca), animación de 2 frames por invasor |

---

## 2. Pantallas (Game Screens)

### 2.1 Pantalla de inicio (MENU) — *Imagen 1*

```text
┌────────────────────────────────────────────┐
│                                              │
│              SPACE INVADERS                  │   ← Título (blanco, grande)
│            CLICK HERE TO PLAY!               │   ← Llamada a la acción (parpadeo)
│                                              │
│                                              │
│            *SCORE ADVANCE TABLE*             │   ← Cabecera tabla de puntos
│                                              │
│              🛸  =  ? MYSTERY                │   ← OVNI rojo  = puntos misterio
│              👾  =  30 POINTS                │   ← Invasor superior  = 30
│              👾  =  20 POINTS                │   ← Invasor medio     = 20
│              👾  =  10 POINTS                │   ← Invasor inferior  = 10
│                                              │
└────────────────────────────────────────────┘
```

- **Composición**: todo centrado horizontalmente.
- **Título** "SPACE INVADERS" en blanco, tamaño grande.
- **"CLICK HERE TO PLAY!"** justo debajo, con **parpadeo** para invitar a la acción.
- **Tabla de puntuación** ("SCORE ADVANCE TABLE") con los sprites reales y su valor:
  - OVNI (rojo) = **? MYSTERY** (bonus aleatorio).
  - Invasor tipo A (superior) = **30 pts**.
  - Invasor tipo B (medio) = **20 pts**.
  - Invasor tipo C (inferior) = **10 pts**.
- **Interacción**: clic (o tecla) en cualquier parte → pasa a `PLAYING`.

### 2.2 Pantalla de juego (PLAYING) — *Imagen 2*

```text
┌────────────────────────────────────────────┐
│ SCORE <1>                                    │   ← HUD: etiqueta puntuación / nivel
│   0020                                       │   ← Marcador (5 dígitos, ceros a la izq.)
│                                              │
│   👾 👾 👾 👾 👾 👾 👾 👾 👾 👾 👾        │   ← Fila A (30 pts)
│   👾 👾 👾 👾 👾 👾 👾 👾 👾 👾 👾        │   ← Fila B (20 pts)
│   👾 👾 👾 👾 👾 👾 👾 👾 👾 👾 👾        │   ← Fila C (20 pts)
│   👾 👾 👾 👾 👾 👾 👾      👾    👾        │   ← Fila D (10 pts) — con huecos
│                                              │
│                                              │
│   🟩🟩      🟩🟩      🟩🟩      🟩🟩      │   ← 4 escudos/búnkeres (verdes, dañables)
│        ▄▄        ▄▄        ▄▄        ▄▄      │
│                          ▲ (OVNI/bonus)      │
│ ────────────────────────────────────────────│   ← Línea de suelo (verde)
│ 1        ▲ (nave del jugador, verde)         │   ← Vidas + cañón del jugador
└────────────────────────────────────────────┘
```

- **HUD superior izquierda**: `SCORE <n>` (n = nivel/oleada) y el marcador `0020`
  (5 dígitos con ceros a la izquierda).
- **Formación de invasores**: rejilla de 5 filas × 11 columnas (clásico = 55 invasores).
  - Fila superior: tipo A (30 pts).
  - Filas centrales: tipo B (20 pts).
  - Filas inferiores: tipo C (10 pts).
  - Se desplaza en bloque; al tocar borde baja y cambia de dirección; acelera al reducirse.
- **Escudos/búnkeres**: 4 estructuras verdes destructibles, situadas sobre el jugador.
- **Suelo**: línea horizontal verde en la parte inferior.
- **Jugador**: cañón verde que se mueve en horizontal por encima del suelo.
- **Contador de vidas**: número (`1`) en la esquina inferior izquierda (o iconos de nave).
- **OVNI bonus**: nave roja que cruza ocasionalmente por la zona superior.

### 2.3 Pantalla de fin de partida (GAME OVER) — *Imagen 3*

```text
┌────────────────────────────────────────────┐
│ SCORE <1>                                    │   ← HUD sigue visible de fondo
│   0020                                       │
│      ┌──────────────────────────┐           │   ← Modal con borde verde
│ 👾👾 │                          │ 👾👾       │
│ 👾👾 │       GAME OVER          │ 👾👾       │   ← "GAME OVER" en blanco
│ 👾👾 │                          │ 👾👾       │
│      │      PLAY AGAIN          │            │   ← Opción resaltada (verde)
│      │      MORE GAMES          │            │   ← Opción secundaria (blanco)
│      └──────────────────────────┘           │
│   🟩🟩      🟩🟩      🟩🟩      🟩🟩      │
│ ────────────────────────────────────────────│
│ 0                                            │   ← Vidas a 0
└────────────────────────────────────────────┘
```

- **Modal centrado** con **borde verde** sobre la escena de juego difuminada/de fondo.
- **"GAME OVER"** en blanco, grande.
- **"PLAY AGAIN"** resaltado en verde (opción seleccionada) → reinicia la partida.
- **"MORE GAMES"** en blanco (opción secundaria) → volver al menú / salir.
- El **HUD** (score, vidas) y los escudos permanecen visibles de fondo.

---

## 3. Elementos del juego (Entidades y sprites)

| Elemento | Color | Tamaño aprox. (px) | Comportamiento |
|----------|-------|--------------------|----------------|
| **Jugador (cañón)** | Verde | 32 × 16 | Movimiento horizontal; dispara hacia arriba |
| **Proyectil jugador** | Blanco/verde | 2 × 12 | Sube; uno activo a la vez (clásico) |
| **Invasor A** (superior) | Blanco | 24 × 16 | 30 pts; 2 frames de animación |
| **Invasor B** (medio) | Blanco | 22 × 16 | 20 pts; 2 frames de animación |
| **Invasor C** (inferior) | Blanco | 24 × 16 | 10 pts; 2 frames de animación |
| **Proyectil enemigo** | Blanco | 3 × 12 | Baja; disparo aleatorio desde columnas |
| **OVNI / Mystery** | Rojo | 32 × 16 | Cruza arriba; puntos aleatorios (bonus) |
| **Escudo/búnker** | Verde | ~64 × 48 | Destructible por píxeles/bloques |
| **Suelo** | Verde | ancho × 2 | Límite inferior del área de juego |

### 3.1 Animación de invasores
- Cada invasor alterna entre **2 frames** (patas/tentáculos) sincronizado con el "paso" de
  la formación → genera el característico *march* sonoro y visual.
- La **velocidad de animación y de avance aumenta** conforme quedan menos invasores.

### 3.2 Estados de las entidades
- **Vivo / Muerto** (invasores, jugador).
- **Explosión**: frame breve al ser destruido (parpadeo o sprite de impacto).
- **Escudo**: degradación progresiva (erosión por impactos).

---

## 4. HUD (interfaz en partida)

| Elemento | Posición | Formato |
|----------|----------|---------|
| Etiqueta puntuación | Arriba izquierda | `SCORE <nivel>` |
| Marcador | Bajo la etiqueta | `0020` (5 dígitos, ceros a la izquierda) |
| Vidas | Abajo izquierda | Número y/o iconos de nave |
| High score (opcional) | Arriba centro | `HI-SCORE` + valor |

---

## 5. Mapa de estados de pantalla

```text
        ┌─────────┐  clic/tecla   ┌──────────┐
        │  MENU   │ ───────────►  │ PLAYING  │
        └─────────┘               └────┬─────┘
             ▲                         │  vidas = 0  /  invasión
             │ MORE GAMES              ▼
        ┌────┴──────┐   PLAY AGAIN  ┌──────────┐
        │ GAME OVER │ ◄──────────── │ (derrota)│
        └───────────┘               └──────────┘
                │ PLAY AGAIN
                └────────────► PLAYING (reinicio)
```

(Estado adicional `PAUSED` accesible desde `PLAYING`.)

---

## 6. Resumen de fidelidad al clásico

- ✅ Paleta de 1-bit (blanco sobre negro) con verde para jugador/escudos/suelo y rojo para OVNI.
- ✅ Tipografía pixel en mayúsculas y marcador con ceros a la izquierda.
- ✅ Formación 5 × 11, 3 tipos de invasor con 30/20/10 puntos y OVNI misterioso.
- ✅ Escudos destructibles y línea de suelo verdes.
- ✅ Pantallas Menú / Juego / Game Over coherentes con las referencias aportadas.
