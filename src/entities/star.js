/**
 * Star — Renders distant stars that the player can visit.
 */

export class Star {
  constructor(data) {
    this.data = data;
    this.id = data.id;
    this.name = data.name;
    this.radius = data.radius;
    this.color = data.color;
    this.glowColor = data.glowColor;
    this.x = data.gameX;
    this.y = data.gameY;
    this.destroyed = false;
  }

  update(dt) {
    // Stars don't move in our local simulation
  }

  render(ctx, time) {
    // Pulsing glow
    const pulse = Math.sin(time * 2 + this.x) * 0.2 + 0.8;
    ctx.save();
    const glowSize = this.radius * 3 * pulse;
    const glow = ctx.createRadialGradient(this.x, this.y, this.radius * 0.5, this.x, this.y, glowSize);
    glow.addColorStop(0, this.glowColor + '66');
    glow.addColorStop(0.5, this.glowColor + '22');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Star body
    ctx.save();
    const starGrad = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius
    );
    starGrad.addColorStop(0, '#FFFFFF');
    starGrad.addColorStop(0.3, this.color);
    starGrad.addColorStop(1, this.glowColor);
    ctx.fillStyle = starGrad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Cross spikes for bright stars
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(time * 0.1);
    ctx.fillStyle = this.color + '44';
    ctx.beginPath();
    ctx.ellipse(0, 0, this.radius * 4, this.radius * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, 0, this.radius * 4, this.radius * 0.2, Math.PI / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Label
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '11px "Orbitron", "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.name, this.x, this.y + this.radius + 16);
    ctx.restore();
  }

  renderLandingIndicator(ctx, time) {
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
    ctx.fillText(`[${isMac ? '⌘' : 'Ctrl'}+B] Explore`, this.x, this.y + this.radius + 32);

    ctx.restore();
  }

  destroy() {}
  restore() {}
}
