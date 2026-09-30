/**
 * Game Engine — Core game loop, canvas management, and scene orchestration.
 */

import { resizeCanvas } from '../utils/responsive.js';

export class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.currentScene = null;
    this.lastTime = 0;
    this.running = false;
    this.paused = false;
    this.time = 0;
    this.fps = 0;
    this.frameCount = 0;
    this.fpsTimer = 0;
    this.viewWidth = 0;
    this.viewHeight = 0;

    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    const { width, height } = resizeCanvas(this.canvas);
    this.viewWidth = width;
    this.viewHeight = height;
    if (this.currentScene && this.currentScene.onResize) {
      this.currentScene.onResize(width, height);
    }
  }

  setScene(scene, skipInit = false) {
    if (this.currentScene && this.currentScene !== scene && this.currentScene.cleanup) {
      this.currentScene.cleanup();
    }
    this.currentScene = scene;
    if (scene.init && !skipInit && !scene._initialized) {
      scene.init(this);
      scene._initialized = true;
    } else if (scene.onResize) {
      // Re-apply resize in case viewport changed
      scene.onResize(this.viewWidth, this.viewHeight);
    }
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this._loop(t));
  }

  stop() {
    this.running = false;
  }

  togglePause() {
    this.paused = !this.paused;
    return this.paused;
  }

  _loop(timestamp) {
    if (!this.running) return;

    let dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    // Cap delta time to prevent physics explosions
    if (dt > 0.1) dt = 0.016;

    // FPS counter
    this.frameCount++;
    this.fpsTimer += dt;
    if (this.fpsTimer >= 1) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.fpsTimer = 0;
    }

    if (!this.paused) {
      this.time += dt;
    }

    // Clear
    this.ctx.clearRect(0, 0, this.viewWidth, this.viewHeight);

    // Fill with space black
    this.ctx.fillStyle = '#06060F';
    this.ctx.fillRect(0, 0, this.viewWidth, this.viewHeight);

    if (this.currentScene) {
      this.currentScene.update(dt, this.time);
      this.currentScene.render(this.ctx, this.time);
    }

    requestAnimationFrame((t) => this._loop(t));
  }
}
