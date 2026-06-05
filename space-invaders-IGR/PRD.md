# PRD — Space Invaders

**Documento de Requisitos de Producto (Product Requirements Document)**

| Campo | Valor |
|-------|-------|
| Producto | Space Invaders (clon web) |
| Versión | 1.0 |
| Autor | Product Owner / Analista de Software |
| Fecha | 2026-06-05 |
| Estado | Borrador para desarrollo |
| Plataforma | Navegador web (Chrome, Microsoft Edge) |
| Stack | HTML5 + CSS3 + JavaScript (ES6+) con Canvas API 2D nativo |

---

## 1. Introducción

### 1.1 Propósito
Definir los requisitos funcionales y no funcionales para el desarrollo de un clon del
videojuego arcade **Space Invaders**, ejecutable en navegador sin dependencias externas.

### 1.2 Alcance
El producto es un juego 2D de una sola pantalla y un solo jugador. El jugador controla una
nave que debe destruir oleadas de invasores antes de que estos lleguen a la base o agoten
sus vidas. Incluye puntuación, vidas, oleadas progresivas y estados de juego (menú, partida,
pausa, game over).

### 1.3 Fuera de alcance (v1.0)
- Multijugador (local u online).
- Persistencia en servidor / ranking online.
- Versión móvil con controles táctiles (se valora para v2.0).
- Editor de niveles.

### 1.4 Definiciones
- **Invasor**: enemigo que forma parte de la rejilla descendente.
- **Oleada**: conjunto completo de invasores; al eliminarla aparece la siguiente.
- **Escudo/Búnker**: barrera destructible que protege al jugador.
- **OVNI**: nave bonus que cruza la parte superior.

---

## 2. Objetivos y métricas de éxito

| Objetivo | Métrica de éxito |
|----------|------------------|
| Jugabilidad fluida | Mantener ~60 FPS en Chrome y Edge |
| Experiencia completa | Ciclo jugable: inicio → partida → game over → reinicio |
| Accesibilidad técnica | Cargar y jugar abriendo `index.html`, sin instalación |
| Fidelidad al clásico | Mecánicas reconocibles del Space Invaders original |

---

## 3. Roles de usuario

- **Jugador**: única persona que interactúa con el sistema mediante teclado. No requiere
  registro ni autenticación.

---

## 4. Requisitos funcionales

> Prioridad: **Alta** (imprescindible v1.0), **Media** (deseable v1.0), **Baja** (opcional).

### 4.1 Gestión de la partida y estados

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-01 | El sistema mostrará una **pantalla de inicio/menú** con instrucciones y opción de comenzar. | Alta |
| RF-02 | El sistema permitirá **iniciar una nueva partida** desde el menú. | Alta |
| RF-03 | El sistema permitirá **pausar y reanudar** la partida (p. ej. tecla `P` o `Esc`). | Media |
| RF-04 | El sistema mostrará una **pantalla de Game Over** con la puntuación final. | Alta |
| RF-05 | El sistema permitirá **reiniciar la partida** tras un Game Over. | Alta |

### 4.2 Control del jugador

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-06 | El jugador moverá la nave **horizontalmente** con las flechas izquierda/derecha (o A/D). | Alta |
| RF-07 | La nave **no podrá salir** de los límites de la pantalla. | Alta |
| RF-08 | El jugador **disparará** un proyectil hacia arriba con la barra espaciadora. | Alta |
| RF-09 | El sistema limitará la **cadencia de disparo** (p. ej. un proyectil en pantalla o cooldown). | Media |

### 4.3 Invasores

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-10 | El sistema mostrará una **formación en rejilla** de invasores (varias filas y columnas). | Alta |
| RF-11 | La formación se **desplazará lateralmente** de forma sincronizada. | Alta |
| RF-12 | Al alcanzar un **borde**, la formación bajará una fila e **invertirá la dirección**. | Alta |
| RF-13 | Los invasores **acelerarán** a medida que su número disminuye. | Media |
| RF-14 | Los invasores **dispararán** proyectiles hacia el jugador de forma aleatoria. | Media |
| RF-15 | Existirán **tipos de invasor** con distinto valor de puntuación. | Media |
| RF-16 | Aparecerá ocasionalmente un **OVNI bonus** en la parte superior. | Baja |

### 4.4 Proyectiles y colisiones

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-17 | Los proyectiles del jugador se moverán hacia arriba y los enemigos hacia abajo. | Alta |
| RF-18 | El sistema detectará la **colisión proyectil-invasor** y destruirá al invasor. | Alta |
| RF-19 | El sistema detectará la **colisión proyectil enemigo-jugador** y restará una vida. | Alta |
| RF-20 | Los proyectiles que salen de pantalla **se eliminarán**. | Alta |
| RF-21 | Los **escudos/búnkeres** serán destructibles por proyectos de ambos bandos. | Baja |

### 4.5 Puntuación, vidas y progresión

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-22 | El sistema **sumará puntos** al destruir un invasor (según su tipo). | Alta |
| RF-23 | El sistema mostrará la **puntuación actual** en pantalla (HUD). | Alta |
| RF-24 | El jugador comenzará con un número definido de **vidas** (p. ej. 3). | Alta |
| RF-25 | El sistema mostrará las **vidas restantes** en pantalla. | Alta |
| RF-26 | Al eliminar toda una oleada, comenzará una **nueva oleada** más rápida. | Media |
| RF-27 | El sistema mantendrá una **puntuación máxima** durante la sesión (high score). | Baja |

### 4.6 Condiciones de fin de partida

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-28 | La partida terminará (Game Over) si el jugador **pierde todas las vidas**. | Alta |
| RF-29 | La partida terminará si los **invasores alcanzan la línea del jugador**. | Alta |

### 4.7 Audio y feedback (opcional)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-30 | El sistema reproducirá **efectos de sonido** (disparo, explosión). | Baja |
| RF-31 | El sistema ofrecerá **feedback visual** en impactos (explosión/parpadeo). | Media |

---

## 5. Requisitos no funcionales

| ID | Categoría | Requisito |
|----|-----------|-----------|
| RNF-01 | Rendimiento | El juego mantendrá un objetivo de **60 FPS** mediante `requestAnimationFrame`. |
| RNF-02 | Compatibilidad | Funcionará en **Chrome** y **Microsoft Edge** (motor Chromium) actualizados. |
| RNF-03 | Portabilidad | Se ejecutará **sin build ni dependencias externas**, abriendo `index.html`. |
| RNF-04 | Mantenibilidad | Código **modular** (ES6), con lógica separada del render y constantes centralizadas. |
| RNF-05 | Testeabilidad | La lógica de juego será **testeable** de forma aislada del DOM/canvas. |
| RNF-06 | Usabilidad | Controles responsivos e instrucciones claras en pantalla. |
| RNF-07 | Independencia de hardware | Movimiento basado en **delta time**, no en frames. |

---

## 6. Flujo principal de usuario

```text
[Menú de inicio]
      │  (Iniciar)
      ▼
[Jugando] ──(Pausa)──► [Pausa] ──(Reanudar)──► [Jugando]
      │
      ├─ Destruye toda la oleada ──► [Nueva oleada, más rápida] ──► [Jugando]
      │
      └─ Pierde todas las vidas / invasores llegan a la base
              ▼
        [Game Over] ──(Reiniciar)──► [Menú / Jugando]
```

---

## 7. Suposiciones y restricciones

- El usuario dispone de un navegador moderno con teclado.
- No se requiere conexión a internet tras cargar la página.
- La resolución del canvas es fija o adaptable, pero el área jugable es de pantalla única.
- No se almacenan datos personales; el high score es solo de sesión (v1.0).

---

## 8. Criterios de aceptación (resumen)

- ✅ Se puede iniciar una partida desde el menú.
- ✅ La nave se mueve, dispara y no sale de los límites.
- ✅ Los invasores se mueven en rejilla, bajan al tocar el borde y aceleran.
- ✅ Las colisiones destruyen invasores y restan vidas correctamente.
- ✅ La puntuación y las vidas se muestran y actualizan en tiempo real.
- ✅ El juego termina por vidas agotadas o invasión, y permite reiniciar.
- ✅ Funciona de forma fluida en Chrome y Edge sin errores en consola.
