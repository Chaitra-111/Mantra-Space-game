/**
 * Sun — The central star with glow and corona effects.
 */

export class Sun {
  constructor(data) {
    this.data = data;
    this.x = 0;
    this.y = 0;
    this.radius = data.radius;
    this.color = data.color;
  }

  update(dt) {
    // Sun stays at center
  }

  render(ctx, time) {
    // Outer corona
    ctx.save();
    const coronaSize = this.radius * 4;
    const corona = ctx.createRadialGradient(this.x, this.y, this.radius * 0.8, this.x, this.y, coronaSize);
    corona.addColorStop(0, 'rgba(255, 165, 0, 0.15)');
    corona.addColorStop(0.3, 'rgba(255, 100, 0, 0.08)');
    corona.addColorStop(0.6, 'rgba(255, 50, 0, 0.03)');
    corona.addColorStop(1, 'transparent');
    ctx.fillStyle = corona;
    ctx.beginPath();
    ctx.arc(this.x, this.y, coronaSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Pulsing glow
    const pulse = Math.sin(time * 1.5) * 0.15 + 0.85;
    ctx.save();
    const glowSize = this.radius * 2.2 * pulse;
    const glow = ctx.createRadialGradient(this.x, this.y, this.radius * 0.5, this.x, this.y, glowSize);
    glow.addColorStop(0, 'rgba(253, 184, 19, 0.4)');
    glow.addColorStop(0.5, 'rgba(255, 107, 0, 0.2)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Sun body
    ctx.save();
    const sunGrad = ctx.createRadialGradient(
      this.x - this.radius * 0.2, this.y - this.radius * 0.2, 0,
      this.x, this.y, this.radius
    );
    sunGrad.addColorStop(0, '#FFFFFF');
    sunGrad.addColorStop(0.2, '#FFF5CC');
    sunGrad.addColorStop(0.5, '#FDB813');
    sunGrad.addColorStop(0.8, '#FF8C00');
    sunGrad.addColorStop(1, '#FF4500');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Surface turbulence
    ctx.save();
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 5; i++) {
      const angle = time * 0.3 + (i * Math.PI * 2) / 5;
      const dist = this.radius * 0.5;
      const sx = this.x + Math.cos(angle) * dist;
      const sy = this.y + Math.sin(angle) * dist;
      const spotGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, this.radius * 0.3);
      spotGrad.addColorStop(0, '#FF4500');
      spotGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.arc(sx, sy, this.radius * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Label
    ctx.save();
    ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
    ctx.font = '13px "Orbitron", "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('The Sun', this.x, this.y + this.radius + 20);
    ctx.restore();
  }
}
