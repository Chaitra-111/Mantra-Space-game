/**
 * Spaceship — Player's vessel for navigating through space.
 * Rendered as a sleek geometric spaceship with thruster effects.
 */

export class Spaceship {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = -Math.PI / 2; // Pointing up initially
    this.targetAngle = this.angle;
    this.speed = 0;
    this.maxSpeed = 250;
    this.acceleration = 300;
    this.friction = 0.97;
    this.rotationSpeed = 4;
    this.width = 40;
    this.height = 24;
    this.thrusting = false;
    this.visible = true;
  }

  update(dt, input, mouseWorld) {
    this.thrusting = false;
    let ax = 0, ay = 0;

    if (input.isMovingUp()) { ay = -1; this.thrusting = true; }
    if (input.isMovingDown()) { ay = 1; this.thrusting = true; }
    if (input.isMovingLeft()) { ax = -1; this.thrusting = true; }
    if (input.isMovingRight()) { ax = 1; this.thrusting = true; }

    // Mouse control (desktop)
    if (mouseWorld && input.mouse.clicked && !input.mobile) {
      const dx = mouseWorld.x - this.x;
      const dy = mouseWorld.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Only thrust if we are not right on top of the mouse (prevents jitter)
      if (dist > 10) {
        ax = dx / dist;
        ay = dy / dist;
        this.thrusting = true;
      }
    }

    // Normalize diagonal movement
    if (ax !== 0 && ay !== 0 && !input.mouse.clicked) {
      const len = Math.sqrt(ax * ax + ay * ay);
      ax /= len;
      ay /= len;
    }

    // Update facing angle based on movement direction
    if (ax !== 0 || ay !== 0) {
      this.targetAngle = Math.atan2(ay, ax);
    }

    // Smooth rotation
    let angleDiff = this.targetAngle - this.angle;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    this.angle += angleDiff * this.rotationSpeed * dt;

    // Apply acceleration
    this.vx += ax * this.acceleration * dt;
    this.vy += ay * this.acceleration * dt;

    // Apply friction
    this.vx *= this.friction;
    this.vy *= this.friction;

    // Clamp speed
    const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (spd > this.maxSpeed) {
      this.vx = (this.vx / spd) * this.maxSpeed;
      this.vy = (this.vy / spd) * this.maxSpeed;
    }

    // Update position
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    this.speed = spd;
  }

  render(ctx, time) {
    if (!this.visible) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Thruster glow
    if (this.thrusting) {
      const flicker = Math.sin(time * 20) * 0.3 + 0.7;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const thrustGrad = ctx.createRadialGradient(-this.width / 2, 0, 0, -this.width * 1.5, 0, 35);
      thrustGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      thrustGrad.addColorStop(0.2, 'rgba(0, 212, 255, 0.8)');
      thrustGrad.addColorStop(0.6, 'rgba(123, 47, 247, 0.4)');
      thrustGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = thrustGrad;
      ctx.beginPath();
      ctx.arc(-this.width / 2, 0, 35 * flicker, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Space Shuttle - Main Fuselage
    const fuselageGrad = ctx.createLinearGradient(0, -this.height / 2, 0, this.height / 2);
    fuselageGrad.addColorStop(0, '#FFFFFF'); // White top
    fuselageGrad.addColorStop(0.5, '#E2E8F0');
    fuselageGrad.addColorStop(0.9, '#4A5568'); // Dark underbelly shadow
    fuselageGrad.addColorStop(1, '#1A202C');

    ctx.fillStyle = fuselageGrad;
    ctx.beginPath();
    ctx.moveTo(this.width / 2 + 10, 0); // Nose cone
    ctx.bezierCurveTo(this.width / 4, -this.height / 3, -this.width / 4, -this.height / 3, -this.width / 2, -this.height / 3);
    ctx.lineTo(-this.width / 2, this.height / 3);
    ctx.bezierCurveTo(-this.width / 4, this.height / 3, this.width / 4, this.height / 3, this.width / 2 + 10, 0);
    ctx.closePath();
    ctx.fill();

    // Delta Wings
    const wingGrad = ctx.createLinearGradient(-this.width / 2, -this.height, -this.width / 2, this.height);
    wingGrad.addColorStop(0, '#CBD5E0');
    wingGrad.addColorStop(0.5, '#FFFFFF');
    wingGrad.addColorStop(1, '#CBD5E0');

    ctx.fillStyle = wingGrad;
    ctx.beginPath();
    // Left Wing
    ctx.moveTo(-this.width / 4, -this.height / 3.5);
    ctx.lineTo(-this.width / 2, -this.height * 1.2); // Swept back tip
    ctx.lineTo(-this.width / 2 - 5, -this.height / 3.5);
    // Right Wing
    ctx.moveTo(-this.width / 4, this.height / 3.5);
    ctx.lineTo(-this.width / 2, this.height * 1.2);
    ctx.lineTo(-this.width / 2 - 5, this.height / 3.5);
    ctx.fill();
    
    // Wing dark heat shields (leading edges)
    ctx.fillStyle = '#1A202C';
    ctx.beginPath();
    ctx.moveTo(-this.width / 4, -this.height / 3.5);
    ctx.lineTo(-this.width / 2, -this.height * 1.2);
    ctx.lineTo(-this.width / 2 + 4, -this.height * 1.15);
    ctx.lineTo(-this.width / 4 + 4, -this.height / 3.5);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-this.width / 4, this.height / 3.5);
    ctx.lineTo(-this.width / 2, this.height * 1.2);
    ctx.lineTo(-this.width / 2 + 4, this.height * 1.15);
    ctx.lineTo(-this.width / 4 + 4, this.height / 3.5);
    ctx.fill();

    // Cockpit Window (black glass)
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.moveTo(this.width / 2.5, -4);
    ctx.lineTo(this.width / 4, -6);
    ctx.lineTo(this.width / 4, 6);
    ctx.lineTo(this.width / 2.5, 4);
    ctx.closePath();
    ctx.fill();
    
    // Glass reflection
    ctx.fillStyle = 'rgba(0, 212, 255, 0.4)';
    ctx.beginPath();
    ctx.moveTo(this.width / 2.5, -4);
    ctx.lineTo(this.width / 4 + 2, -5);
    ctx.lineTo(this.width / 4 + 2, 0);
    ctx.lineTo(this.width / 2.5, 0);
    ctx.fill();

    // Engine thruster nozzles
    ctx.fillStyle = '#2D3748';
    ctx.fillRect(-this.width / 2 - 4, -8, 4, 16);
    ctx.fillStyle = '#1A202C';
    ctx.fillRect(-this.width / 2 - 6, -6, 2, 12);

    ctx.restore();

    // Shield/selection glow
    if (this.thrusting) {
      ctx.save();
      ctx.globalAlpha = 0.1;
      const shieldGrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.width);
      shieldGrad.addColorStop(0, '#00D4FF');
      shieldGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = shieldGrad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /**
   * Render spaceship on the planet surface (parked, side view)
   */
  renderParked(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Landing gear
    ctx.strokeStyle = '#4A5568';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-12, 10);
    ctx.lineTo(-16, 18);
    ctx.moveTo(8, 10);
    ctx.lineTo(12, 18);
    ctx.stroke();

    // Ship body (horizontal)
    const bodyGrad = ctx.createLinearGradient(-25, -10, 25, 10);
    bodyGrad.addColorStop(0, '#4A5568');
    bodyGrad.addColorStop(0.5, '#A0AEC0');
    bodyGrad.addColorStop(1, '#4A5568');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(30, 0);
    ctx.lineTo(15, -12);
    ctx.lineTo(-25, -8);
    ctx.lineTo(-28, 0);
    ctx.lineTo(-25, 8);
    ctx.lineTo(15, 12);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#00D4FF44';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Cockpit
    ctx.fillStyle = '#00D4FF88';
    ctx.beginPath();
    ctx.ellipse(12, 0, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
