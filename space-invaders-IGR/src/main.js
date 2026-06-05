// main.js — Punto de entrada: arranque, game loop y orquestación (SI-02, SI-03)

import { CONFIG } from "./config.js";
import { Input } from "./systems/input.js";
import { AudioManager } from "./systems/audio.js";
import { StateMachine } from "./states/stateMachine.js";
import { MenuState } from "./states/menuState.js";
import { PlayState } from "./states/playState.js";
import { GameOverState } from "./states/gameOverState.js";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.input = new Input(canvas);
    this.audio = new AudioManager(); // SFX (SI-21)

    // High-score persistente entre sesiones (SI-20)
    this.highScore = this.loadHighScore();

    // Datos de sesión compartidos
    this.session = this.freshSession();

    // Estados (instancias persistentes — play se reutiliza como fondo en game over)
    this.states = {
      menu: new MenuState(this),
      play: new PlayState(this),
      gameover: new GameOverState(this),
    };
    this.machine = new StateMachine(this.states);
    this.machine.change("menu");

    this.lastTime = 0;
    this.loop = this.loop.bind(this);
  }

  freshSession() {
    return {
      score: 0,
      level: 1,
      lives: CONFIG.player.lives,
      highScore: this.highScore, // récord persistente (SI-20)
    };
  }

  loadHighScore() {
    try {
      return parseInt(localStorage.getItem("si_highscore"), 10) || 0;
    } catch {
      return 0; // localStorage no disponible (p. ej. file:// restringido)
    }
  }

  saveHighScore() {
    this.highScore = this.session.highScore;
    try {
      localStorage.setItem("si_highscore", String(this.highScore));
    } catch {
      /* almacenamiento no disponible: se mantiene en memoria */
    }
  }

  /** Inicia una partida nueva (desde menú o "PLAY AGAIN"). */
  startNewGame() {
    this.session = this.freshSession();
    this.machine.change("play");
  }

  /** Vuelve al menú principal ("MORE GAMES"). */
  toMenu() {
    this.machine.change("menu");
  }

  /** Termina la partida actual y muestra GAME OVER. */
  endGame(won) {
    this.machine.change("gameover", { won });
  }

  loop(timestamp) {
    // Delta time en segundos, acotado para evitar saltos tras un parón (SI-02)
    const dt = Math.min((timestamp - this.lastTime) / 1000 || 0, 0.05);
    this.lastTime = timestamp;

    // Desbloquea el audio tras el primer gesto del usuario (autoplay policy)
    if (this.input.pressed.size > 0 || this.input.clicked) this.audio.resume();

    this.machine.update(dt);

    // Render
    this.ctx.fillStyle = CONFIG.colors.bg;
    this.ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
    this.machine.render(this.ctx);

    this.input.clearFrame();
    requestAnimationFrame(this.loop);
  }

  start() {
    requestAnimationFrame(this.loop);
  }
}

const canvas = document.getElementById("game");
const game = new Game(canvas);
game.start();
