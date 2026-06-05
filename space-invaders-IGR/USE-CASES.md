# Casos de Uso — Space Invaders

Documento de **casos de uso** derivado del [PRD.md](PRD.md) y del
[GAME-DESIGN.md](GAME-DESIGN.md). Describe las interacciones entre el actor y el sistema,
con trazabilidad a los requisitos funcionales (RF-xx).

---

## 1. Actor

- **Jugador**: única persona que interactúa con el sistema mediante teclado y/o ratón.
  No requiere registro ni autenticación.

## 2. Diagrama de casos de uso (visión general)

```text
                ┌──────────────────────────────────────────┐
                │              SPACE INVADERS               │
                │                                            │
   ┌────────┐   │  (CU-01) Iniciar partida                  │
   │        │───┼─►(CU-02) Mover nave                        │
   │        │───┼─►(CU-03) Disparar                          │
   │Jugador │───┼─►(CU-04) Pausar / Reanudar                 │
   │        │───┼─►(CU-09) Reiniciar partida                 │
   │        │───┼─►(CU-10) Ver puntuación y vidas (HUD)      │
   └────────┘   │                                            │
                │  «system»  (CU-05) Mover formación invasora│
                │  «system»  (CU-06) Disparo enemigo         │
                │  «system»  (CU-07) Resolver colisiones     │
                │  «system»  (CU-08) Avanzar de oleada        │
                │  «system»  (CU-11) Finalizar partida        │
                │  «system»  (CU-12) Gestionar OVNI bonus     │
                └──────────────────────────────────────────┘
```

> «system» = casos de uso disparados por el propio sistema durante el bucle de juego.

---

## 3. Casos de uso detallados

### CU-01 — Iniciar partida
| Campo | Descripción |
|-------|-------------|
| **Actor** | Jugador |
| **Descripción** | El jugador comienza una nueva partida desde el menú de inicio. |
| **Precondición** | El sistema muestra la pantalla `MENU`. |
| **Disparador** | El jugador hace clic o pulsa una tecla en la pantalla de inicio. |
| **Flujo principal** | 1. El sistema muestra título y "CLICK HERE TO PLAY!". 2. El jugador hace clic/pulsa tecla. 3. El sistema inicializa nivel, puntuación a 0 y vidas iniciales. 4. El sistema genera la formación de invasores y los escudos. 5. El sistema transita al estado `PLAYING`. |
| **Flujo alternativo** | — |
| **Postcondición** | La partida está activa con la primera oleada lista. |
| **RF asociados** | RF-01, RF-02 |

### CU-02 — Mover nave
| Campo | Descripción |
|-------|-------------|
| **Actor** | Jugador |
| **Descripción** | El jugador desplaza el cañón horizontalmente. |
| **Precondición** | Estado `PLAYING`. |
| **Disparador** | El jugador mantiene/pulsa flecha izquierda o derecha (o A/D). |
| **Flujo principal** | 1. El jugador pulsa una tecla de dirección. 2. El sistema actualiza la posición de la nave según `delta time`. 3. El sistema redibuja la nave. |
| **Flujo alternativo** | 2a. La nave alcanza un borde de la pantalla → el sistema impide salir de los límites. |
| **Postcondición** | La nave queda en la nueva posición, dentro de los límites. |
| **RF asociados** | RF-06, RF-07 |

### CU-03 — Disparar
| Campo | Descripción |
|-------|-------------|
| **Actor** | Jugador |
| **Descripción** | El jugador dispara un proyectil hacia los invasores. |
| **Precondición** | Estado `PLAYING`. |
| **Disparador** | El jugador pulsa la barra espaciadora. |
| **Flujo principal** | 1. El jugador pulsa disparo. 2. El sistema verifica la cadencia/límite de proyectiles. 3. El sistema crea un proyectil sobre la nave que asciende. |
| **Flujo alternativo** | 2a. Ya hay un proyectil activo / cooldown no cumplido → el sistema ignora el disparo. |
| **Postcondición** | Un proyectil del jugador avanza hacia arriba. |
| **RF asociados** | RF-08, RF-09, RF-17 |

### CU-04 — Pausar / Reanudar
| Campo | Descripción |
|-------|-------------|
| **Actor** | Jugador |
| **Descripción** | El jugador detiene temporalmente la partida y la retoma. |
| **Precondición** | Estado `PLAYING` (para pausar) o `PAUSED` (para reanudar). |
| **Disparador** | El jugador pulsa la tecla de pausa (`P`/`Esc`). |
| **Flujo principal** | 1. En `PLAYING`, el jugador pulsa pausa → estado `PAUSED`, se congela la lógica. 2. En `PAUSED`, el jugador pulsa reanudar → vuelve a `PLAYING`. |
| **Flujo alternativo** | — |
| **Postcondición** | La partida queda pausada o reanudada según corresponda. |
| **RF asociados** | RF-03 |

### CU-05 — Mover formación invasora *(system)*
| Campo | Descripción |
|-------|-------------|
| **Actor** | Sistema |
| **Descripción** | La formación de invasores se desplaza por la pantalla. |
| **Precondición** | Estado `PLAYING` con invasores vivos. |
| **Disparador** | Tick del game loop. |
| **Flujo principal** | 1. El sistema mueve el bloque lateralmente. 2. Al tocar un borde, baja una fila e invierte la dirección. 3. El sistema ajusta la velocidad según el número de invasores restantes. 4. Alterna el frame de animación. |
| **Flujo alternativo** | 2a. La formación alcanza la línea del jugador → dispara CU-11 (Finalizar partida). |
| **Postcondición** | La formación avanza; su velocidad aumenta al reducirse. |
| **RF asociados** | RF-10, RF-11, RF-12, RF-13, RF-29 |

### CU-06 — Disparo enemigo *(system)*
| Campo | Descripción |
|-------|-------------|
| **Actor** | Sistema |
| **Descripción** | Los invasores disparan proyectiles hacia el jugador. |
| **Precondición** | Estado `PLAYING` con invasores vivos. |
| **Disparador** | Temporizador/probabilidad de disparo en el game loop. |
| **Flujo principal** | 1. El sistema selecciona un invasor (p. ej. el más bajo de una columna). 2. Crea un proyectil que desciende. |
| **Flujo alternativo** | — |
| **Postcondición** | Uno o más proyectiles enemigos avanzan hacia abajo. |
| **RF asociados** | RF-14, RF-17 |

### CU-07 — Resolver colisiones *(system)*
| Campo | Descripción |
|-------|-------------|
| **Actor** | Sistema |
| **Descripción** | El sistema detecta y resuelve impactos entre entidades. |
| **Precondición** | Estado `PLAYING` con proyectiles en juego. |
| **Disparador** | Tick del game loop. |
| **Flujo principal** | 1. Proyectil del jugador impacta un invasor → invasor destruido, suma puntos, elimina proyectil (CU-10). 2. Proyectil enemigo impacta al jugador → resta una vida. 3. Cualquier proyectil impacta un escudo → erosiona el escudo y se elimina el proyectil. 4. Proyectiles fuera de pantalla se eliminan. |
| **Flujo alternativo** | 2a. El jugador se queda sin vidas → dispara CU-11 (Finalizar partida). |
| **Postcondición** | Las entidades impactadas se actualizan/eliminan y la puntuación/vidas se ajustan. |
| **RF asociados** | RF-18, RF-19, RF-20, RF-21, RF-22 |

### CU-08 — Avanzar de oleada *(system)*
| Campo | Descripción |
|-------|-------------|
| **Actor** | Sistema |
| **Descripción** | Al eliminar todos los invasores, comienza una nueva oleada. |
| **Precondición** | Estado `PLAYING` sin invasores vivos. |
| **Disparador** | El contador de invasores llega a 0. |
| **Flujo principal** | 1. El sistema detecta la oleada limpia. 2. Incrementa el nivel/oleada. 3. Regenera la formación con mayor velocidad inicial. 4. Continúa en `PLAYING`. |
| **Flujo alternativo** | — |
| **Postcondición** | Nueva oleada activa, más rápida que la anterior. |
| **RF asociados** | RF-26 |

### CU-09 — Reiniciar partida
| Campo | Descripción |
|-------|-------------|
| **Actor** | Jugador |
| **Descripción** | El jugador vuelve a jugar tras un Game Over. |
| **Precondición** | Estado `GAME_OVER`. |
| **Disparador** | El jugador selecciona "PLAY AGAIN". |
| **Flujo principal** | 1. El sistema muestra el modal de Game Over con la puntuación final. 2. El jugador elige "PLAY AGAIN". 3. El sistema reinicia puntuación, vidas y oleada (como CU-01). |
| **Flujo alternativo** | 2a. El jugador elige "MORE GAMES" → el sistema vuelve al menú/salida. |
| **Postcondición** | Nueva partida en curso o regreso al menú. |
| **RF asociados** | RF-04, RF-05 |

### CU-10 — Ver puntuación y vidas (HUD)
| Campo | Descripción |
|-------|-------------|
| **Actor** | Jugador |
| **Descripción** | El jugador consulta su puntuación, nivel y vidas en pantalla. |
| **Precondición** | Estado `PLAYING`. |
| **Disparador** | Continuo durante la partida. |
| **Flujo principal** | 1. El sistema muestra `SCORE <nivel>` y el marcador (5 dígitos, ceros a la izquierda). 2. Muestra las vidas restantes. 3. Actualiza ambos valores en tiempo real ante cada evento relevante. |
| **Flujo alternativo** | 1a. Existe high score de sesión → se muestra también. |
| **Postcondición** | El HUD refleja el estado actual de la partida. |
| **RF asociados** | RF-22, RF-23, RF-24, RF-25, RF-27 |

### CU-11 — Finalizar partida *(system)*
| Campo | Descripción |
|-------|-------------|
| **Actor** | Sistema |
| **Descripción** | El sistema termina la partida al cumplirse una condición de derrota. |
| **Precondición** | Estado `PLAYING`. |
| **Disparador** | El jugador pierde todas las vidas **o** los invasores alcanzan su línea. |
| **Flujo principal** | 1. El sistema detecta la condición de fin. 2. Detiene la lógica de juego. 3. Transita a `GAME_OVER` y muestra el modal con la puntuación final. |
| **Flujo alternativo** | — |
| **Postcondición** | Estado `GAME_OVER`; a la espera de CU-09. |
| **RF asociados** | RF-04, RF-28, RF-29 |

### CU-12 — Gestionar OVNI bonus *(system)*
| Campo | Descripción |
|-------|-------------|
| **Actor** | Sistema |
| **Descripción** | Aparece un OVNI que cruza la parte superior y otorga puntos extra si se destruye. |
| **Precondición** | Estado `PLAYING`. |
| **Disparador** | Temporizador aleatorio del game loop. |
| **Flujo principal** | 1. El sistema genera el OVNI (rojo) en un borde superior. 2. El OVNI cruza horizontalmente. 3. Si un proyectil del jugador lo impacta → suma puntos misteriosos (CU-07/CU-10) y desaparece. |
| **Flujo alternativo** | 2a. El OVNI sale de pantalla sin ser impactado → se elimina sin puntos. |
| **Postcondición** | El OVNI desaparece (destruido o fuera de pantalla). |
| **RF asociados** | RF-16 |

---

## 4. Matriz de trazabilidad (CU ↔ RF)

| Caso de uso | Requisitos funcionales |
|-------------|------------------------|
| CU-01 Iniciar partida | RF-01, RF-02 |
| CU-02 Mover nave | RF-06, RF-07 |
| CU-03 Disparar | RF-08, RF-09, RF-17 |
| CU-04 Pausar / Reanudar | RF-03 |
| CU-05 Mover formación invasora | RF-10, RF-11, RF-12, RF-13, RF-29 |
| CU-06 Disparo enemigo | RF-14, RF-17 |
| CU-07 Resolver colisiones | RF-18, RF-19, RF-20, RF-21, RF-22 |
| CU-08 Avanzar de oleada | RF-26 |
| CU-09 Reiniciar partida | RF-04, RF-05 |
| CU-10 Ver puntuación y vidas | RF-22, RF-23, RF-24, RF-25, RF-27 |
| CU-11 Finalizar partida | RF-04, RF-28, RF-29 |
| CU-12 Gestionar OVNI bonus | RF-16 |

> Nota: los tipos de invasor y su valor (30/20/10) y el feedback de sonido/explosión
> (RF-15, RF-30, RF-31) se aplican transversalmente en CU-05, CU-07 y CU-10.
