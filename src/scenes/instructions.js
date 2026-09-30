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
    this.scrollY = 0;
    this.targetScrollY = 0;
    this.maxScroll = 0;
    
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.lastTouchY = 0;
    this.didDrag = false;

    this._wheelHandler = (e) => {
      e.preventDefault();
      this.targetScrollY += e.deltaY * 0.5;
    };
    window.addEventListener('wheel', this._wheelHandler, { passive: false });

    this._touchStartHandler = (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.lastTouchY = e.touches[0].clientY;
      this.didDrag = false;
    };
    
    this._touchMoveHandler = (e) => {
      const touchY = e.touches[0].clientY;
      const touchX = e.touches[0].clientX;
      
      if (Math.abs(this.touchStartX - touchX) > 10 || Math.abs(this.touchStartY - touchY) > 10) {
        this.didDrag = true;
      }
      
      const deltaY = this.lastTouchY - touchY;
      this.targetScrollY += deltaY;
      this.lastTouchY = touchY;
    };

    window.addEventListener('touchstart', this._touchStartHandler, { passive: true });
    window.addEventListener('touchmove', this._touchMoveHandler, { passive: true });
  }

  init(engine) {
    this.engine = engine;
    this.fadeIn = 0;
    this.scrollY = 0;
    this.targetScrollY = 0;

    this._clickHandler = (e) => {
      if (this.didDrag) {
        this.didDrag = false;
        return;
      }
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
    this.targetScrollY = Math.max(0, Math.min(this.maxScroll, this.targetScrollY));
    this.scrollY += (this.targetScrollY - this.scrollY) * 0.15;
  }

  render(ctx, time) {
    const w = this.engine.viewWidth;
    const h = this.engine.viewHeight;

    // Background
    ctx.fillStyle = '#06060F';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(0, -this.scrollY);
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
      { icon: '🌍', title: 'LAND:', desc: 'Fly close to a planet or star, then click on it!' },
      { icon: '📚', title: 'LEARN:', desc: 'Fly close to a planet and press [Ctrl + E] or [Cmd + E].' },
      { icon: '💥', title: 'DEFEND:', desc: 'Click meteoroids to shoot them down!' },
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

    // Calculate max scroll so we don't scroll infinitely
    const contentBottom = boxY + boxH + 100;
    this.maxScroll = Math.max(0, contentBottom - h);

    ctx.restore();
  }

  cleanup() {
    window.removeEventListener('click', this._clickHandler);
    window.removeEventListener('keydown', this._keyHandler);
    window.removeEventListener('wheel', this._wheelHandler);
    window.removeEventListener('touchstart', this._touchStartHandler);
    window.removeEventListener('touchmove', this._touchMoveHandler);
  }
}
