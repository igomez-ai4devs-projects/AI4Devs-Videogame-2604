// stateMachine.js — Patrón State para el flujo de pantallas (SI-03, GDD §5)

export class StateMachine {
  /** @param {Record<string, object>} states  mapa nombre → instancia de estado */
  constructor(states) {
    this.states = states;
    this.current = null;
    this.currentName = null;
  }

  /**
   * Cambia de estado. Invoca enter() del nuevo estado si existe.
   * @param {string} name
   * @param {object} [params]
   */
  change(name, params = {}) {
    const next = this.states[name];
    if (!next) throw new Error(`Estado desconocido: ${name}`);
    this.current = next;
    this.currentName = name;
    if (typeof next.enter === "function") next.enter(params);
  }

  update(dt) {
    this.current?.update?.(dt);
  }

  render(ctx) {
    this.current?.render?.(ctx);
  }
}
