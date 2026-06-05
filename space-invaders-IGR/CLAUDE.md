# CLAUDE.md — Space Invaders

Guía de contexto para el desarrollo del videojuego **Space Invaders**. Resume el producto,
el stack tecnológico, las buenas prácticas y los patrones de diseño a aplicar.

---

## 1. El juego (visión de producto)

**Space Invaders** es un arcade 2D de disparos: el jugador controla una nave en la parte
inferior de la pantalla y debe destruir oleadas de invasores que descienden progresivamente.

### Mecánicas principales
- **Jugador**: nave que se mueve en horizontal y dispara proyectiles hacia arriba.
- **Invasores**: formación en rejilla que se desplaza lateralmente; al tocar un borde baja
  una fila e invierte la dirección. Aceleran a medida que quedan menos.
- **Proyectiles**: del jugador (hacia arriba) y de los invasores (hacia abajo).
- **Escudos/barreras** (opcional): protecciones destructibles entre jugador e invasores.
- **OVNI bonus** (opcional): nave que cruza la parte superior y otorga puntos extra.

### Reglas y condiciones
- **Puntuación**: cada invasor destruido suma puntos (más cuanto más arriba).
- **Vidas**: el jugador pierde una vida al ser impactado.
- **Game Over**: cuando los invasores alcanzan al jugador o se agotan las vidas.
- **Victoria / Oleada**: al eliminar todos los invasores aparece una nueva oleada más rápida.

### Requisitos no funcionales
- Ejecución fluida (objetivo **60 FPS**) en **Chrome** y **Microsoft Edge**.
- Controles responsivos (teclado: flechas + barra espaciadora).
- Sin dependencias externas ni proceso de build: abrir `index.html` y jugar.

---

## 2. Tecnologías

### HTML5
- Estructura de la página y el elemento **`<canvas>`** donde se renderiza el juego.
- Etiquetas semánticas para la UI no-canvas (marcador, menús, instrucciones).

### CSS3
- Maquetación y centrado del canvas, fondo, tipografía y estados de UI (menú, pausa, game over).
- Diseño responsive básico para adaptar el tamaño del lienzo.

### JavaScript (ES6+) + Canvas API 2D nativo
- **Elección principal**: render con el **Canvas API 2D** sin librerías externas.
- Justificación: el juego es 2D simple (sprites pequeños, colisiones AABB), por lo que un
  motor pesado sería innecesario. Cero dependencias, control total y excelente rendimiento.
- Núcleo técnico: `requestAnimationFrame` para el **game loop**, `CanvasRenderingContext2D`
  para dibujar, y `KeyboardEvent` para el input.
- Uso de **módulos ES6** (`import`/`export`) para separar responsabilidades.

---

## 3. Buenas prácticas

- **Game loop con delta time**: actualizar la lógica en función del tiempo transcurrido
  (`dt`), no del número de frames, para un comportamiento independiente del hardware.
- **Separar `update()` y `render()`**: la lógica de juego nunca debe mezclarse con el dibujo.
- **Código modular**: un archivo/módulo por responsabilidad (entidades, input, render, etc.).
- **Sin "números mágicos"**: centralizar velocidades, dimensiones y puntuaciones en un módulo
  de **configuración/constantes**.
- **Gestión de estados explícita**: `MENU`, `PLAYING`, `PAUSED`, `GAME_OVER`.
- **Nomenclatura clara y consistente** (inglés o español, pero uniforme).
- **Limpieza de recursos**: eliminar entidades muertas y listeners cuando ya no se usan.
- **Rendimiento**: minimizar trabajo por frame, reutilizar objetos y evitar asignaciones
  innecesarias dentro del loop.
- **Accesibilidad y UX**: feedback claro de puntuación, vidas y estado del juego.

---

## 4. Patrones de diseño (mantenible, extensible y testeable)

| Patrón | Para qué | Aplicación en el juego |
|--------|----------|------------------------|
| **Game Loop** | Bucle central que actualiza y dibuja | `update(dt)` + `render()` con `requestAnimationFrame` |
| **State (Estado)** | Cambiar comportamiento según el estado | Estados `MENU`, `PLAYING`, `PAUSED`, `GAME_OVER` |
| **Entity / Component** | Modelar objetos del juego de forma uniforme | Clase base `Entity` → `Player`, `Invader`, `Bullet`, `Shield` |
| **Object Pool** | Reutilizar objetos costosos en vez de crear/destruir | Pool de **proyectiles** para evitar pausas del recolector de basura |
| **Observer / Event Bus** | Desacoplar emisores y receptores de eventos | Eventos como `enemyKilled`, `playerHit` → puntuación, sonidos, UI |
| **Factory** | Centralizar la creación de entidades | `createInvader(type)`, `createBullet(owner)` |
| **Command** | Encapsular acciones de entrada | Mapear teclas a comandos (`MoveLeft`, `Fire`) — facilita rebind y tests |
| **Singleton (con cuidado)** | Acceso único a servicios globales | Gestor de input o de assets |

### Por qué estos patrones
- **Mantenible**: responsabilidades separadas y bajo acoplamiento.
- **Extensible**: añadir nuevos tipos de enemigos, armas o estados sin tocar el núcleo.
- **Testeable**: la lógica (`update`, colisiones, puntuación) queda aislada del render y del
  DOM, por lo que puede probarse con tests unitarios sin necesidad de un navegador.

---

## 5. Estructura de proyecto propuesta

```text
space-invaders-IGR/
├── index.html          ← canvas + carga del módulo principal
├── style.css           ← maquetación y UI
└── src/
    ├── main.js         ← arranque y game loop
    ├── config.js       ← constantes y configuración
    ├── states/         ← MENU, PLAYING, PAUSED, GAME_OVER
    ├── entities/       ← Entity, Player, Invader, Bullet, Shield
    ├── systems/        ← input, colisiones, render, puntuación
    └── utils/          ← helpers (AABB, pools, eventos)
```

---

## 6. Definición de Hecho (Definition of Done)

- El juego carga y se ejecuta en Chrome y Edge sin errores en consola.
- Mecánicas básicas funcionando: mover, disparar, destruir invasores, perder vidas.
- Condiciones de Game Over y reinicio operativas.
- Puntuación y vidas visibles en pantalla.
- Código modular, con constantes centralizadas y lógica separada del render.
