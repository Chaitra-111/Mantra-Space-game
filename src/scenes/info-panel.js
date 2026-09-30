/**
 * Info Panel Scene — Glassmorphism overlay showing planet educational data.
 */

export class InfoPanelScene {
  constructor(planetData, onClose) {
    this.planetData = planetData;
    this.onClose = onClose;
    this.engine = null;
    this.scrollY = 0;
    this.targetScrollY = 0;
    this.maxScroll = 0;
    this.fadeIn = 0;
    this.closing = false;

    // Setup scroll handling
    this._wheelHandler = (e) => {
      e.preventDefault();
      this.targetScrollY += e.deltaY * 0.5;
      this.targetScrollY = Math.max(0, Math.min(this.maxScroll, this.targetScrollY));
    };
    window.addEventListener('wheel', this._wheelHandler, { passive: false });
  }

  init(engine) {
    this.engine = engine;
    this.fadeIn = 0;
    this.scrollY = 0;
    this.targetScrollY = 0;

    // Setup close on Escape or Ctrl+E
    this._keyHandler = (e) => {
      if (e.code === 'Escape') {
        this.close();
      }
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyE') {
        e.preventDefault();
        this.close();
      }
    };
    window.addEventListener('keydown', this._keyHandler);

    this.canClose = false;
    setTimeout(() => { this.canClose = true; }, 100);

    // Click handler for close button
    this._clickHandler = (e) => {
      if (!this.canClose) return;

      const w = this.engine.viewWidth;
      const h = this.engine.viewHeight;
      const panelW = Math.min(600, w - 40);
      const panelX = (w - panelW) / 2;
      const closeX = panelX + panelW - 40;
      const closeY = 15;

      // Close button click
      if (e.clientX >= closeX && e.clientX <= closeX + 28 &&
          e.clientY >= closeY + 30 && e.clientY <= closeY + 58) {
        this.close();
        return;
      }

      // Click outside panel
      if (e.clientX < panelX || e.clientX > panelX + panelW ||
          e.clientY < 30 || e.clientY > h - 30) {
        this.close();
      }
    };
    window.addEventListener('click', this._clickHandler);
  }

  onResize() {}

  close() {
    if (!this.closing) {
      this.closing = true;
      setTimeout(() => {
        this.onClose();
      }, 200);
    }
  }

  update(dt, time) {
    this.fadeIn = Math.min(1, this.fadeIn + dt * 4);
    this.scrollY += (this.targetScrollY - this.scrollY) * 0.15;
  }

  render(ctx, time) {
    const w = this.engine.viewWidth;
    const h = this.engine.viewHeight;
    const d = this.planetData;

    // Background dim
    ctx.save();
    ctx.fillStyle = `rgba(6, 6, 15, ${0.75 * this.fadeIn})`;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    // Panel dimensions
    const panelW = Math.min(600, w - 40);
    const panelH = h - 60;
    const panelX = (w - panelW) / 2;
    const panelY = 30;

    // Panel background (glassmorphism)
    ctx.save();
    ctx.globalAlpha = this.fadeIn;

    ctx.fillStyle = 'rgba(15, 15, 35, 0.85)';
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelW, panelH, 16);
    ctx.fill();
    ctx.stroke();

    // Clip to panel
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelW, panelH, 16);
    ctx.clip();

    // Content area
    const contentX = panelX + 30;
    const contentW = panelW - 60;
    let y = panelY + 30 - this.scrollY;

    // Planet color header bar
    ctx.fillStyle = d.color + '33';
    ctx.fillRect(panelX, panelY, panelW, 80 - this.scrollY);

    // Planet icon (circle)
    const iconSize = 25;
    ctx.save();
    const iconGrad = ctx.createRadialGradient(
      contentX + iconSize, y + 25, 0,
      contentX + iconSize, y + 25, iconSize
    );
    iconGrad.addColorStop(0, d.color);
    iconGrad.addColorStop(1, d.glowColor);
    ctx.fillStyle = iconGrad;
    ctx.beginPath();
    ctx.arc(contentX + iconSize, y + 25, iconSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Planet name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px "Orbitron", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(d.name, contentX + iconSize * 2 + 15, y + 22);

    // Type
    ctx.fillStyle = d.color;
    ctx.font = '13px "Inter", sans-serif';
    ctx.fillText(d.type, contentX + iconSize * 2 + 15, y + 42);

    // Tagline
    ctx.fillStyle = '#FFFFFF88';
    ctx.font = 'italic 12px "Inter", sans-serif';
    ctx.fillText(d.tagline, contentX + iconSize * 2 + 15, y + 58);

    y += 90;

    // Section: Orbital Data
    y = this._renderSection(ctx, contentX, y, contentW, 'ORBITAL DATA', [
      { label: 'Orbit', value: d.orbit },
      { label: 'Rotation', value: d.rotation }
    ]);

    // Section: Atmosphere
    if (d.atmosphere) {
      y = this._renderSection(ctx, contentX, y, contentW, 'ATMOSPHERE', [
        { label: '', value: d.atmosphere }
      ]);
    }

    // Section: Composition
    y = this._renderComposition(ctx, contentX, y, contentW, d.composition);

    // Section: Moons
    if (d.moons && d.moons.length > 0) {
      y = this._renderMoons(ctx, contentX, y, contentW, d.moons, d.extraMoons);
    }

    // Section: Fun Facts
    y = this._renderFacts(ctx, contentX, y, contentW, d.facts);

    // Calculate max scroll
    this.maxScroll = Math.max(0, y + this.scrollY - panelY - panelH + 40);

    ctx.restore();

    // Close button
    ctx.save();
    ctx.globalAlpha = this.fadeIn;
    const closeX = panelX + panelW - 40;
    const closeY = panelY + 15;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.roundRect(closeX, closeY, 28, 28, 8);
    ctx.fill();

    ctx.fillStyle = '#FFFFFFCC';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✕', closeX + 14, closeY + 14);

    ctx.restore();

    // Scroll indicator
    if (this.maxScroll > 0) {
      ctx.save();
      ctx.globalAlpha = 0.3;
      const scrollBarH = panelH * (panelH / (panelH + this.maxScroll));
      const scrollBarY = panelY + (this.scrollY / this.maxScroll) * (panelH - scrollBarH);
      ctx.fillStyle = '#00D4FF';
      ctx.beginPath();
      ctx.roundRect(panelX + panelW - 6, scrollBarY, 3, scrollBarH, 2);
      ctx.fill();
      ctx.restore();
    }

    // Handle close click
    this._handleCloseClick(closeX, closeY);
  }

  _renderSection(ctx, x, y, w, title, items) {
    // Section title
    ctx.fillStyle = '#00D4FF';
    ctx.font = '11px "Orbitron", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(title, x, y);
    ctx.letterSpacing = '0px';

    // Divider
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y + 6);
    ctx.lineTo(x + w, y + 6);
    ctx.stroke();

    y += 22;

    for (const item of items) {
      if (item.label) {
        ctx.fillStyle = '#FFFFFF88';
        ctx.font = '12px "Inter", sans-serif';
        ctx.fillText(item.label + ':', x, y);
        y += 16;
      }

      // Word wrap the value
      ctx.fillStyle = '#FFFFFFCC';
      ctx.font = '12px "Inter", sans-serif';
      const lines = this._wrapText(ctx, item.value, w);
      for (const line of lines) {
        ctx.fillText(line, x, y);
        y += 17;
      }
      y += 6;
    }

    y += 10;
    return y;
  }

  _renderComposition(ctx, x, y, w, composition) {
    ctx.fillStyle = '#00D4FF';
    ctx.font = '11px "Orbitron", sans-serif';
    ctx.fillText('COMPOSITION', x, y);

    ctx.strokeStyle = 'rgba(0, 212, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y + 6);
    ctx.lineTo(x + w, y + 6);
    ctx.stroke();

    y += 24;

    const entries = Object.entries(composition);
    const barHeight = 18;
    const colors = ['#00D4FF', '#7B2FF7', '#FF006E', '#06D6A0', '#FFD700', '#FF6B6B', '#3A86FF', '#8338EC', '#FF8C00'];

    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];
      const color = colors[i % colors.length];

      // Label
      ctx.fillStyle = '#FFFFFFCC';
      ctx.font = '11px "Inter", sans-serif';
      ctx.fillText(`${key} (${value}%)`, x, y);
      y += 14;

      // Bar background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.roundRect(x, y, w, barHeight, 4);
      ctx.fill();

      // Bar fill
      const barW = (value / 100) * w;
      const barGrad = ctx.createLinearGradient(x, y, x + barW, y);
      barGrad.addColorStop(0, color);
      barGrad.addColorStop(1, color + '88');
      ctx.fillStyle = barGrad;
      ctx.beginPath();
      ctx.roundRect(x, y, Math.max(4, barW), barHeight, 4);
      ctx.fill();

      y += barHeight + 8;
    }

    y += 10;
    return y;
  }

  _renderMoons(ctx, x, y, w, moons, extraMoons) {
    ctx.fillStyle = '#00D4FF';
    ctx.font = '11px "Orbitron", sans-serif';
    ctx.fillText('MOONS', x, y);

    ctx.strokeStyle = 'rgba(0, 212, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y + 6);
    ctx.lineTo(x + w, y + 6);
    ctx.stroke();

    y += 22;

    for (const moon of moons) {
      // Moon name
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.fillText('● ' + moon.name, x, y);
      y += 17;

      // Orbit
      ctx.fillStyle = '#FFFFFF88';
      ctx.font = '11px "Inter", sans-serif';
      const orbitLines = this._wrapText(ctx, moon.orbit, w - 10);
      for (const line of orbitLines) {
        ctx.fillText(line, x + 12, y);
        y += 15;
      }

      // Composition
      const compLines = this._wrapText(ctx, moon.composition, w - 10);
      for (const line of compLines) {
        ctx.fillText(line, x + 12, y);
        y += 15;
      }
      y += 6;
    }

    if (extraMoons) {
      ctx.fillStyle = '#FFFFFF55';
      ctx.font = 'italic 11px "Inter", sans-serif';
      const extraLines = this._wrapText(ctx, extraMoons, w);
      for (const line of extraLines) {
        ctx.fillText(line, x, y);
        y += 15;
      }
      y += 4;
    }

    y += 10;
    return y;
  }

  _renderFacts(ctx, x, y, w, facts) {
    ctx.fillStyle = '#00D4FF';
    ctx.font = '11px "Orbitron", sans-serif';
    ctx.fillText('DID YOU KNOW?', x, y);

    ctx.strokeStyle = 'rgba(0, 212, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y + 6);
    ctx.lineTo(x + w, y + 6);
    ctx.stroke();

    y += 22;

    for (let i = 0; i < facts.length; i++) {
      ctx.fillStyle = '#06D6A0';
      ctx.font = '11px "Inter", sans-serif';
      ctx.fillText(`★`, x, y);

      ctx.fillStyle = '#FFFFFFCC';
      const lines = this._wrapText(ctx, facts[i], w - 18);
      for (const line of lines) {
        ctx.fillText(line, x + 18, y);
        y += 16;
      }
      y += 4;
    }

    return y;
  }

  _wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let current = '';

    for (const word of words) {
      const test = current ? current + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  _handleCloseClick() {
    // Check for click on close button or anywhere outside panel
    // Handled via keyboard (Escape or Ctrl+E)
  }

  cleanup() {
    window.removeEventListener('wheel', this._wheelHandler);
    window.removeEventListener('keydown', this._keyHandler);
    if (this._clickHandler) window.removeEventListener('click', this._clickHandler);
  }
}
