// audio.js — Efectos de sonido sintetizados con Web Audio API (SI-21).
// Sin ficheros externos: todo se genera con osciladores/ruido (offline-friendly).

export class AudioManager {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.enabled = true;
  }

  /** Crea el AudioContext de forma perezosa (tras un gesto del usuario). */
  init() {
    if (this.ctx || !this.enabled) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) {
      this.enabled = false;
      return;
    }
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.18; // volumen general
    this.master.connect(this.ctx.destination);
  }

  /** Reanuda el contexto (las políticas de autoplay lo suspenden hasta un gesto). */
  resume() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
  }

  // --- Primitivas ---------------------------------------------------------

  _tone({ type = "square", freq = 440, dur = 0.1, vol = 1, slideTo = null }) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.linearRampToValueAtTime(slideTo, t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(t);
    osc.stop(t + dur);
  }

  _noise({ dur = 0.2, vol = 1 }) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const buffer = this.ctx.createBuffer(
      1,
      Math.floor(this.ctx.sampleRate * dur),
      this.ctx.sampleRate
    );
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(gain);
    gain.connect(this.master);
    src.start(t);
    src.stop(t + dur);
  }

  // --- SFX del juego ------------------------------------------------------

  /** Disparo del jugador. */
  shoot() {
    this._tone({ type: "square", freq: 900, slideTo: 480, dur: 0.12, vol: 0.5 });
  }

  /** Invasor destruido. */
  invaderExplode() {
    this._noise({ dur: 0.18, vol: 0.6 });
    this._tone({ type: "square", freq: 320, slideTo: 90, dur: 0.18, vol: 0.3 });
  }

  /** Jugador alcanzado. */
  playerDeath() {
    this._noise({ dur: 0.5, vol: 0.7 });
    this._tone({ type: "sawtooth", freq: 400, slideTo: 60, dur: 0.5, vol: 0.4 });
  }

  /** OVNI destruido (bonus). */
  ufoHit() {
    this._tone({ type: "square", freq: 1200, slideTo: 200, dur: 0.35, vol: 0.5 });
  }

  /** Paso de la formación (marcha): dos tonos alternos. */
  step(high) {
    this._tone({ type: "square", freq: high ? 160 : 120, dur: 0.06, vol: 0.35 });
  }
}
