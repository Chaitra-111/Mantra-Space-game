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
    glow.addColorStop(0, this.glowColor + '33');
    glow.addColorStop(0.5, this.glowColor + '11');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Rings (Saturn, Uranus)
    if (this.hasRings) {
      this._renderRings(ctx, time);
    }

    // Planet body
    ctx.save();
    const planetGrad = ctx.createRadialGradient(
      this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.1,
      this.x, this.y, this.radius
    );
    const colors = this.data.surfaceColors || [this.color, this.color, this.glowColor];
    planetGrad.addColorStop(0, colors[0]);
    planetGrad.addColorStop(0.5, colors[1]);
    planetGrad.addColorStop(1, colors[2]);

    ctx.fillStyle = planetGrad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Surface details
    if (this.id === 'jupiter' || this.id === 'saturn') {
      this._renderBands(ctx);
    }
    if (this.id === 'earth') {
      this._renderEarthDetails(ctx, time);
    }

    // Specular highlight
    const specGrad = ctx.createRadialGradient(
      this.x - this.radius * 0.3, this.y - this.radius * 0.4, 0,
      this.x - this.radius * 0.3, this.y - this.radius * 0.4, this.radius * 0.6
    );
    specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    specGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = specGrad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Name label
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '11px "Orbitron", "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.name, this.x, this.y + this.radius + 16);
    ctx.restore();
  }

  _renderBands(ctx) {
    ctx.save();
    ctx.globalAlpha = 0.2;
    const bandCount = this.id === 'jupiter' ? 6 : 4;
    for (let i = 0; i < bandCount; i++) {
      const yOffset = (i / bandCount - 0.5) * this.radius * 2;
      const bandWidth = this.radius * 0.15;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(139, 105, 20, 0.3)' : 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      const ry = Math.sqrt(Math.max(0, this.radius * this.radius - yOffset * yOffset));
      ctx.ellipse(this.x, this.y + yOffset, ry, bandWidth, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  _renderEarthDetails(ctx, time) {
    // Simple continent shapes
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#2E8B2E';

    // Simplified land masses
    const r = this.radius;
    ctx.beginPath();
    ctx.arc(this.x - r * 0.2, this.y - r * 0.2, r * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x + r * 0.3, this.y + r * 0.1, r * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Cloud wisps
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(this.x, this.y - r * 0.3, r * 0.4, r * 0.08, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  _renderRings(ctx, time) {
    const inner = this.data.ringInnerRadius;
    const outer = this.data.ringOuterRadius;
    const ringColor = this.data.ringColor;

    ctx.save();
    ctx.translate(this.x, this.y);

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
