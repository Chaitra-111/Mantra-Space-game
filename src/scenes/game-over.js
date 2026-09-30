/**
 * Game Over Scene — Displayed when all 5 lives are lost.
 */

import { Starfield } from '../utils/starfield.js';

export class GameOverScene {
  constructor(score, onRestart) {
    this.score = score;
    this.onRestart = onRestart;
    this.engine = null;
    this.starfield = new Starfield(2, 80);
    this.fadeIn = 0;
    this.textScale = 0;

    this._clickHandler = (e) => {
      if (this.fadeIn < 0.8) return;
      const w = this.engine.viewWidth;
      const h = this.engine.viewHeight;
      const btnX = w / 2;
      const btnY = h / 2 + 80;
      if (Math.abs(e.clientX - btnX) < 100 && Math.abs(e.clientY - btnY) < 25) {
        this.onRestart();
      }
    };
    window.addEventListener('click', this._clickHandler);

    this._keyHandler = (e) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        if (this.fadeIn > 0.8) this.onRestart();
      }
    };
    window.addEventListener('keydown', this._keyHandler);
  }

  init(engine) {
    this.engine = engine;
  }

  onResize() {}

  update(dt, time) {
    this.fadeIn = Math.min(1, this.fadeIn + dt * 0.8);
    this.textScale = Math.min(1, this.textScale + dt * 2);
  }

  render(ctx, time) {
    const w = this.engine.viewWidth;
    const h = this.engine.viewHeight;

    // Dark background with stars
    ctx.fillStyle = '#06060F';
    ctx.fillRect(0, 0, w, h);
    this.starfield.renderStatic(ctx, w, h, time);

    // Red vignette
    ctx.save();
    ctx.globalAlpha = this.fadeIn * 0.4;
    const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.8);
    vignette.addColorStop(0, 'transparent');
    vignette.addColorStop(1, '#FF000066');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = this.fadeIn;

    // "GAME OVER" text with scale animation
    ctx.save();
    ctx.translate(w / 2, h / 2 - 40);
    const scale = 0.5 + this.textScale * 0.5;
    ctx.scale(scale, scale);

    // Text glow
    ctx.shadowColor = '#FF4444';
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#FF4444';
    ctx.font = 'bold 48px "Orbitron", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GAME OVER', 0, 0);

    ctx.shadowBlur = 0;
    ctx.restore();

    // Score
    ctx.fillStyle = '#FFD700';
    ctx.font = '20px "Orbitron", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Final Score: ${this.score}`, w / 2, h / 2 + 20);

    // Subtitle
    ctx.fillStyle = '#FFFFFF88';
    ctx.font = '14px "Inter", sans-serif';
    ctx.fillText('All planets were lost to meteoroid strikes...', w / 2, h / 2 + 50);

    // Restart button
    if (this.fadeIn > 0.8) {
      const pulse = Math.sin(time * 3) * 0.1 + 0.9;
      const btnW = 200;
      const btnH = 48;
      const btnX = w / 2 - btnW / 2;
      const btnY = h / 2 + 65;

      // Button background
      const btnGrad = ctx.createLinearGradient(btnX, btnY, btnX + btnW, btnY + btnH);
      btnGrad.addColorStop(0, '#00D4FF');
      btnGrad.addColorStop(1, '#7B2FF7');
      ctx.fillStyle = btnGrad;
      ctx.globalAlpha = this.fadeIn * pulse;
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, 12);
      ctx.fill();

      // Button text
      ctx.globalAlpha = this.fadeIn;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px "Orbitron", sans-serif';
      ctx.fillText('🔄 START OVER', w / 2, btnY + btnH / 2 + 1);

      // Hint
      ctx.fillStyle = '#FFFFFF44';
      ctx.font = '11px "Inter", sans-serif';
      ctx.fillText('Press Enter or click to restart', w / 2, btnY + btnH + 24);
    }

    ctx.restore();
  }

  cleanup() {
    window.removeEventListener('click', this._clickHandler);
    window.removeEventListener('keydown', this._keyHandler);
  }
}
