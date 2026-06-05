# Prompts

## Prompt 1:

Agent: Claude Code - Sonnet 4.6

### Request:

Actúa como experto desarrollador de videojuegos en javascript. Necesito desarrollar el videojuego famoso llamado Space Invaders. ¿Cúal es el mejor framework/library para desarrollarlo en HTML5/CSS/Javascript? Quiero que el videojuego pueda ejecutarse en los navegadores como Chrome o Microsoft Edge

### Response:

# Space Invaders — ¿Qué framework/librería usar?

> Recomendación técnica para desarrollar **Space Invaders** en HTML5 / CSS / JavaScript, ejecutable en navegadores como **Chrome** y **Microsoft Edge**.

## Recomendación principal: Canvas API nativo (JavaScript puro)

Para Space Invaders, la mejor opción es el **Canvas API 2D nativo del navegador**, sin librerías externas. Razones:

- **El juego es 2D, simple y de baja complejidad gráfica**: sprites pequeños, movimientos en rejilla y colisiones por rectángulos (AABB). No necesitas un motor pesado.
- **Cero dependencias**: funciona directamente en Chrome y Edge (ambos basados en Chromium) sin instalación, sin build y sin CDN. Abres el `index.html` y juegas.
- **Aprendes los fundamentos**: game loop, `requestAnimationFrame`, detección de colisiones y gestión de estados.
- **Rendimiento de sobra** para este tipo de juego.

## Comparativa de opciones

| Opción | Cuándo usarla | Pros | Contras |
| --- | --- | --- | --- |
| **Canvas API nativo** ⭐ | Space Invaders, juegos 2D simples | Ligero, sin dependencias, control total, didáctico | Tú escribes el game loop y las colisiones |
| **Phaser 3** | Si quieres escalar a algo más grande | Físicas, animaciones, audio y tilemaps ya resueltos | Curva de aprendizaje, ~1 MB, "overkill" aquí |
| **Kaboom.js / Kaplay** | Prototipado muy rápido | API sencilla y divertida | Menos control fino |
| **PixiJS** | Cuando necesitas muchísimos sprites con WebGL | Render muy rápido | Solo render, sin lógica de juego |
| **CSS/DOM puro** | ❌ No recomendado | — | Mal rendimiento con muchas balas/enemigos |

## Sugerencia concreta

1. **Empieza con Canvas API nativo**: es la opción correcta para Space Invaders y para aprender.
2. Si más adelante quieres añadir físicas complejas, partículas, gestión de escenas y audio sin reinventarlo, **migra a Phaser 3**.

## Stack mínimo propuesto

```text
space-invaders-IGR/
├── index.html      ← canvas + carga del script
├── style.css       ← centrado del canvas, fondo negro
└── game.js         ← game loop, entidades, colisiones, input
```

## Compatibilidad

El **Canvas 2D** y `requestAnimationFrame` están soportados al 100 % en Chrome y Edge (desde hace más de una década), así que no tendrás problemas de compatibilidad.

</br>

## Prompt 2:

Agent: Claude Code - Sonnet 4.6

### Request:

Como experto Product Owner me generes un fichero CLAUDE.md donde informes de los aspectos principales (sin ser muy extenso) del juego Space Invaders.

También debes añadir las tecnologías que vamos a utilizar según lo elegido: Recomendación principal (Canvas API nativo) y HTML5/CSS/Javascript. Describelas y añade elementos importantes de buenas prácticas, así como, los principales patrones de diseño en videojuegos para que la aplicación sea mantenibles, extensible y testeable.

### Response:

Se ha generado un fichero **CLAUDE.md** con las recomendaciones principales para el proyecto.

</br>

## Prompt 3:

Agent: Claude Code - Sonnet 4.6

### Request:

Como experto Analista de Software y Product Owner generame un PRD o documento con los requisitos funcionales del sistema

### Response:

Se ha generado un fichero **PRD.md** con todos los requisitos funcionales del sistema.

</br>
