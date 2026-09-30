/**
 * Instructions Scene — Tells the player how to play before starting.
 */

export class InstructionsScene {
  constructor(onStart) {
    this.onStart = onStart;
    this.engine = null;
    this.fadeIn = 0;
    this._clickHandler = null;
    this._keyHandler = null;
  }

  init(engine) {
    this.engine = engine;
    this.fadeIn = 0;

    this._clickHandler = (e) => {
      this.onStart();
    };
    // Add a slight delay before accepting clicks so the user doesn't instantly click through
    setTimeout(() => {
      window.addEventListener('click', this._clickHandler);
    }, 500);

    this._keyHandler = (e) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        this.onStart();
      }
    };
    setTimeout(() => {
      window.addEventListener('keydown', this._keyHandler);
    }, 500);
  }

  onResize() {}

  update(dt, time) {
    this.fadeIn = Math.min(1, this.fadeIn + dt * 1.5);
  }

  render(ctx, time) {
    const w = this.engine.viewWidth;
    const h = this.engine.viewHeight;

    // Background
    ctx.fillStyle = '#06060F';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalAlpha = this.fadeIn;

    // Title
    ctx.fillStyle = '#00D4FF';
    ctx.font = `bold ${Math.min(48, w * 0.06)}px "Orbitron", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('HOW TO PLAY', w / 2, h * 0.15);

    // Instructions Box
    const boxW = Math.min(700, w * 0.9);
    const boxH = 400;
    const boxX = w / 2 - boxW / 2;
    const boxY = h * 0.25;

    ctx.fillStyle = 'rgba(15, 15, 35, 0.8)';
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 15);
    ctx.fill();
    ctx.stroke();

    // Text configuration
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    let textY = boxY + 40;
    const textX = boxX + 40;

    const instructions = [
      { icon: '🛸', title: 'MOVE:', desc: 'Click and hold mouse, OR use WASD / Arrow Keys.' },
      { icon: '🌍', title: 'LAND:', desc: 'Fly close to a planet or star, then press [Ctrl + B] or [Cmd + B].' },
      { icon: '📚', title: 'LEARN:', desc: 'Fly close to a planet and press [Ctrl + E] or [Cmd + E].' },
      { icon: '💥', title: 'DEFEND:', desc: 'Hover mouse over meteoroids and press [ENTER] to shoot them!' },
      { icon: '⏸️', title: 'PAUSE:', desc: 'Press [P] to pause. While paused, click meteoroids to learn about them.' },
      { icon: '👨‍🚀', title: 'WALK:', desc: 'When landed, click ground or use Left/Right keys to walk around.' }
    ];

    for (const inst of instructions) {
      ctx.font = '24px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(inst.icon, textX, textY);

      ctx.font = 'bold 18px "Inter", sans-serif';
      ctx.fillStyle = '#00D4FF';
      ctx.fillText(inst.title, textX + 40, textY + 3);

      ctx.font = '16px "Inter", sans-serif';
      ctx.fillStyle = '#CCCCCC';
      ctx.fillText(inst.desc, textX + 130, textY + 5);

      textY += 55;
    }
    
    // Objective / Task
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 20px "Orbitron", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎯 TASK: Find and land on all 5 hidden stars in deep space!', w / 2, boxY + boxH + 20);

    // Continue text
    const pulse = Math.sin(time * 4) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + pulse * 0.6})`;
    ctx.font = `bold 16px "Orbitron", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('CLICK ANYWHERE OR PRESS ENTER TO START', w / 2, boxY + boxH + 60);

    ctx.restore();
  }

  cleanup() {
    window.removeEventListener('click', this._clickHandler);
    window.removeEventListener('keydown', this._keyHandler);
  }
}
