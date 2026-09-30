/**
 * Astronaut — Player character for walking on planet surfaces.
 * Rendered as a simple animated astronaut sprite drawn with Canvas.
 */

export class Astronaut {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.speed = 120;
    this.facing = 1; // 1 = right, -1 = left
    this.walking = false;
    this.walkFrame = 0;
    this.walkSpeed = 8;
    this.width = 20;
    this.height = 32;
    this.groundY = y;
    this.visible = true;
  }

  update(dt, input, mouseWorldX) {
    this.walking = false;
    this.vx = 0;

    if (input.isMovingLeft()) {
      this.vx = -this.speed;
      this.facing = -1;
      this.walking = true;
    }
    if (input.isMovingRight()) {
      this.vx = this.speed;
      this.facing = 1;
      this.walking = true;
    }

    // Mouse control (desktop)
    if (mouseWorldX !== undefined && input.mouse.clicked && !input.mobile) {
      const dx = mouseWorldX - this.x;
      if (Math.abs(dx) > 5) { // Prevent jitter
        this.vx = Math.sign(dx) * this.speed;
        this.facing = Math.sign(dx);
        this.walking = true;
      }
    }

    this.x += this.vx * dt;

    // Walk animation
    if (this.walking) {
      this.walkFrame += this.walkSpeed * dt;
    } else {
      this.walkFrame = 0;
    }
  }

  render(ctx, time) {
    if (!this.visible) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.facing, 1);

    const bobY = this.walking ? Math.sin(this.walkFrame * 2) * 2 : 0;
    const legSwing = this.walking ? Math.sin(this.walkFrame * 2) * 0.4 : 0;
    const armSwing = this.walking ? Math.sin(this.walkFrame * 2 + Math.PI) * 0.3 : 0;

    // Backpack
    ctx.fillStyle = '#4A5568';
    ctx.fillRect(-12, -20 + bobY, 5, 14);
    ctx.fillStyle = '#2D3748';
    ctx.fillRect(-12, -18 + bobY, 5, 3);

    // Backpack antenna
    ctx.strokeStyle = '#A0AEC0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-10, -20 + bobY);
    ctx.lineTo(-10, -26 + bobY);
    ctx.stroke();
    ctx.fillStyle = '#FF4444';
    ctx.beginPath();
    ctx.arc(-10, -27 + bobY, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.save();
    ctx.translate(0, -4 + bobY);

    // Left leg
    ctx.save();
    ctx.rotate(legSwing);
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(-4, 0, 5, 12);
    // Boot
    ctx.fillStyle = '#4A5568';
    ctx.fillRect(-5, 10, 7, 4);
    ctx.restore();

    // Right leg
    ctx.save();
    ctx.rotate(-legSwing);
    ctx.fillStyle = '#CBD5E0';
    ctx.fillRect(1, 0, 5, 12);
    // Boot
    ctx.fillStyle = '#4A5568';
    ctx.fillRect(0, 10, 7, 4);
    ctx.restore();

    ctx.restore();

    // Body (spacesuit)
    const bodyGrad = ctx.createLinearGradient(-7, -22 + bobY, 7, -6 + bobY);
    bodyGrad.addColorStop(0, '#EDF2F7');
    bodyGrad.addColorStop(1, '#CBD5E0');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.roundRect(-7, -22 + bobY, 16, 18, 3);
    ctx.fill();

    // Suit line
    ctx.strokeStyle = '#A0AEC0';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(1, -22 + bobY);
    ctx.lineTo(1, -6 + bobY);
    ctx.stroke();

    // Life support circle on chest
    ctx.fillStyle = '#00D4FF44';
    ctx.beginPath();
    ctx.arc(1, -14 + bobY, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#00D4FF';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Arms
    ctx.save();
    ctx.translate(8, -18 + bobY);
    ctx.rotate(armSwing);
    // Right arm
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(0, 0, 5, 12);
    // Glove
    ctx.fillStyle = '#4A5568';
    ctx.beginPath();
    ctx.arc(2.5, 12, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Helmet
    const helmetGrad = ctx.createRadialGradient(1, -27 + bobY, 0, 1, -27 + bobY, 9);
    helmetGrad.addColorStop(0, '#FFFFFF');
    helmetGrad.addColorStop(0.6, '#EDF2F7');
    helmetGrad.addColorStop(1, '#CBD5E0');
    ctx.fillStyle = helmetGrad;
    ctx.beginPath();
    ctx.arc(1, -27 + bobY, 9, 0, Math.PI * 2);
    ctx.fill();

    // Visor
    const visorGrad = ctx.createLinearGradient(-2, -31 + bobY, 8, -25 + bobY);
    visorGrad.addColorStop(0, '#1A365D');
    visorGrad.addColorStop(0.5, '#2B6CB0');
    visorGrad.addColorStop(1, '#00D4FF88');
    ctx.fillStyle = visorGrad;
    ctx.beginPath();
    ctx.arc(2, -27 + bobY, 6, -0.6, 0.6);
    ctx.arc(2, -27 + bobY, 6, -0.6, 0.6);
    ctx.closePath();
    ctx.fill();

    // Visor reflection
    ctx.fillStyle = '#FFFFFF44';
    ctx.beginPath();
    ctx.ellipse(4, -29 + bobY, 1.5, 2, 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
