// input.js — Gestor de entrada por teclado y ratón (SI-04)
// Expone estado de teclas mantenidas (held), pulsaciones puntuales (pressed)
// y clics. Las pulsaciones/clics se consumen una vez por frame.

export class Input {
  constructor(canvas) {
    this.held = new Set();
    this.pressed = new Set();
    this.clicked = false;

    // Teclado
    window.addEventListener("keydown", (e) => {
      // Evita el scroll de la página con flechas/espacio
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)) {
        e.preventDefault();
      }
      if (!this.held.has(e.key)) this.pressed.add(e.key);
      this.held.add(e.key);
    });

    window.addEventListener("keyup", (e) => {
      this.held.delete(e.key);
    });

    // Ratón (para "CLICK HERE TO PLAY!" y menús)
    canvas.addEventListener("mousedown", () => {
      this.clicked = true;
    });
  }

  /** ¿La tecla está mantenida pulsada? */
  isHeld(key) {
    return this.held.has(key);
  }

  /** ¿Se pulsó la tecla en este frame? (se consume al limpiar) */
  wasPressed(key) {
    return this.pressed.has(key);
  }

  /** Consume el clic del frame (true una sola vez por clic). */
  consumeClick() {
    if (this.clicked) {
      this.clicked = false;
      return true;
    }
    return false;
  }

  /** Limpia las pulsaciones puntuales al final de cada frame. */
  clearFrame() {
    this.pressed.clear();
  }
}
