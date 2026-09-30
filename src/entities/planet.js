/**
 * Planet — Renders planets in the solar system with orbits, glow, and rings.
 */

export class Planet {
  constructor(data) {
    this.data = data;
    this.id = data.id;
    this.name = data.name;
    this.radius = data.radius;
    this.orbitRadius = data.orbitRadius;
    this.orbitSpeed = data.orbitSpeed;
    this.orbitAngle = data.orbitAngle;
    this.color = data.color;
    this.glowColor = data.glowColor;
    this.hasRings = data.hasRings || false;
    this.destroyed = false;
    this.destroyedTimer = 0;

    // Calculate initial position
    this.x = Math.cos(this.orbitAngle) * this.orbitRadius;
    this.y = Math.sin(this.orbitAngle) * this.orbitRadius;

    this._generateTexture();
  }

  _generateTexture() {
    this.textureCanvas = document.createElement('canvas');
    const size = this.radius * 2;
    // Scale up for high-res texture
    const scale = 2; 
    this.textureCanvas.width = size * scale;
    this.textureCanvas.height = size * scale;
    const ctx = this.textureCanvas.getContext('2d');
    const r = this.radius * scale;

    // Base Sphere
    ctx.beginPath();
    ctx.arc(r, r, r, 0, Math.PI * 2);
    ctx.clip();

    // Fill base gradient
    const colors = this.data.surfaceColors || [this.color, this.color, this.glowColor];
    const baseGrad = ctx.createRadialGradient(r * 0.7, r * 0.7, r * 0.1, r, r, r);
    baseGrad.addColorStop(0, colors[0]);
    baseGrad.addColorStop(0.6, colors[1]);
    baseGrad.addColorStop(1, colors[2]);
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, r * 2, r * 2);

    // Planet-specific procedural textures
    ctx.globalCompositeOperation = 'overlay';
    
    if (this.id === 'earth') {
      // Continents
      ctx.fillStyle = '#228B22'; // Forest green
      ctx.globalAlpha = 0.8;
      for (let i = 0; i < 15; i++) {
        const cx = r + (Math.random() - 0.5) * r * 1.5;
        const cy = r + (Math.random() - 0.5) * r * 1.5;
        const cr = r * (0.1 + Math.random() * 0.4);
        ctx.beginPath();
        ctx.ellipse(cx, cy, cr, cr * 0.6, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
      // Desert
      ctx.fillStyle = '#DAA520';
      ctx.globalAlpha = 0.5;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(r + (Math.random() - 0.5) * r, r + (Math.random() - 0.5) * r, r * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      // Clouds
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#FFFFFF';
      ctx.globalAlpha = 0.6;
      for (let i = 0; i < 25; i++) {
        ctx.beginPath();
        ctx.ellipse(r + (Math.random() - 0.5) * r * 1.8, r + (Math.random() - 0.5) * r * 1.8, r * 0.4, r * 0.1, Math.random() * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (this.id === 'jupiter' || this.id === 'saturn') {
      // Gas Giant Bands
      ctx.globalAlpha = 0.4;
      const bands = this.id === 'jupiter' ? 12 : 8;
      for (let i = 0; i < bands; i++) {
        const yOffset = (i / bands - 0.5) * r * 2;
        const bandW = r * (0.1 + Math.random() * 0.1);
        ctx.fillStyle = Math.random() > 0.5 ? '#8B4513' : '#F5DEB3'; // Brown or Wheat
        ctx.beginPath();
        const rx = r * 1.2;
        const ry = Math.sqrt(Math.max(0, r * r - yOffset * yOffset));
        ctx.ellipse(r, r + yOffset, rx, bandW, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      if (this.id === 'jupiter') {
        // Great Red Spot
        ctx.fillStyle = '#A52A2A';
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.ellipse(r * 1.2, r * 1.3, r * 0.3, r * 0.15, -0.1, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (this.id === 'mars' || this.id === 'mercury' || this.id === 'moon') {
      // Craters
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#000000';
      const craters = this.id === 'mercury' ? 30 : 15;
      for (let i = 0; i < craters; i++) {
        const cx = r + (Math.random() - 0.5) * r * 1.5;
        const cy = r + (Math.random() - 0.5) * r * 1.5;
        const cr = r * (0.05 + Math.random() * 0.15);
        
        // Crater shadow
        ctx.fillStyle = '#000000';
        ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.fill();
        
        // Crater highlight
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath(); ctx.arc(cx - cr*0.2, cy - cr*0.2, cr * 0.8, 0, Math.PI * 2); ctx.fill();
      }
    } else if (this.id === 'venus') {
      // Venus thick atmosphere clouds
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#FFDEAD';
      ctx.globalAlpha = 0.4;
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.ellipse(r + (Math.random() - 0.5) * r * 1.5, r + (Math.random() - 0.5) * r * 1.5, r * 0.8, r * 0.2, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3D Shadow Overlay (Terminator line)
    ctx.globalCompositeOperation = 'source-over';
    const shadow = ctx.createRadialGradient(r * 0.6, r * 0.6, r * 0.1, r, r, r * 1.2);
    shadow.addColorStop(0, 'rgba(0,0,0,0)');
    shadow.addColorStop(0.7, 'rgba(0,0,0,0.5)');
    shadow.addColorStop(1, 'rgba(0,0,0,0.95)');
    ctx.fillStyle = shadow;
    ctx.fillRect(0, 0, r * 2, r * 2);
  }

  update(dt) {
    if (this.destroyed) {
      this.destroyedTimer += dt;
      return;
    }

    // Orbit around sun
    this.orbitAngle += this.orbitSpeed * dt;
    this.x = Math.cos(this.orbitAngle) * this.orbitRadius;
    this.y = Math.sin(this.orbitAngle) * this.orbitRadius;
  }

  render(ctx, time) {
    if (this.destroyed) return;

    // Draw orbit path
    if (this.orbitRadius > 0) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, this.orbitRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Glow effect
    ctx.save();
    const glowSize = this.radius * 2.5;
    const glow = ctx.createRadialGradient(this.x, this.y, this.radius * 0.8, this.x, this.y, glowSize);
    glow.addColorStop(0, this.glowColor + '44');
    glow.addColorStop(0.5, this.glowColor + '11');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Rings (Saturn, Uranus) (Behind planet half)
    if (this.hasRings) {
      this._renderRings(ctx, time, true);
    }

    // Draw cached high-res planet texture
    ctx.drawImage(this.textureCanvas, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);

    // Rings (Saturn, Uranus) (Front planet half)
    if (this.hasRings) {
      this._renderRings(ctx, time, false);
    }

    // Name label
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '11px "Orbitron", "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.name, this.x, this.y + this.radius + 16);
    ctx.restore();
  }

  _renderRings(ctx, time, behind) {
    const inner = this.data.ringInnerRadius;
    const outer = this.data.ringOuterRadius;
    const ringColor = this.data.ringColor;

    ctx.save();
    ctx.translate(this.x, this.y);

    // Clip half of the rendering context
    ctx.beginPath();
    if (behind) {
      // Draw top half (behind planet)
      ctx.rect(-outer * 2, -outer * 2, outer * 4, outer * 2);
    } else {
      // Draw bottom half (in front of planet)
      ctx.rect(-outer * 2, 0, outer * 4, outer * 2);
    }
    ctx.clip();

    // Draw rings as an ellipse
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = ringColor;
    ctx.lineWidth = (outer - inner) * 0.6;
    ctx.beginPath();
    ctx.ellipse(0, 0, (inner + outer) / 2, (inner + outer) / 6, 0.15, 0, Math.PI * 2);
    ctx.stroke();

    // Inner ring detail
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(0, 0, inner, inner / 4, 0.15, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Render landing indicator when spaceship is nearby
   */
  renderLandingIndicator(ctx, time) {
    if (this.destroyed) return;

    const pulse = Math.sin(time * 3) * 0.3 + 0.7;
    ctx.save();
    ctx.strokeStyle = `rgba(0, 212, 255, ${0.4 * pulse})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // "Land" text
    ctx.fillStyle = `rgba(0, 212, 255, ${0.8 * pulse})`;
    ctx.font = '10px "Orbitron", sans-serif';
    ctx.textAlign = 'center';
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    ctx.fillText(`[${isMac ? '⌘' : 'Ctrl'}+B] Land`, this.x, this.y + this.radius + 32);

    ctx.restore();
  }

  destroy() {
    this.destroyed = true;
    this.destroyedTimer = 0;
  }

  restore() {
    this.destroyed = false;
    this.destroyedTimer = 0;
  }
}
