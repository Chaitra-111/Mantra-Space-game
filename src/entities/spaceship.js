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
      ctx.globalAlpha = 0.6 * flicker;
      const thrustGrad = ctx.createRadialGradient(-this.width / 2 - 5, 0, 0, -this.width / 2 - 5, 0, 20);
      thrustGrad.addColorStop(0, '#FF6B00');
      thrustGrad.addColorStop(0.5, '#FF4500');
      thrustGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = thrustGrad;
      ctx.beginPath();
      ctx.arc(-this.width / 2 - 5, 0, 20 * flicker, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Ship body - sleek design
    const bodyGrad = ctx.createLinearGradient(-this.width / 2, -this.height / 2, this.width / 2, this.height / 2);
    bodyGrad.addColorStop(0, '#4A5568');
    bodyGrad.addColorStop(0.3, '#718096');
    bodyGrad.addColorStop(0.7, '#A0AEC0');
    bodyGrad.addColorStop(1, '#4A5568');

    // Main body
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(this.width / 2 + 5, 0); // Nose
    ctx.lineTo(this.width / 4, -this.height / 2 + 2);
    ctx.lineTo(-this.width / 2, -this.height / 3);
    ctx.lineTo(-this.width / 2 - 3, 0);
    ctx.lineTo(-this.width / 2, this.height / 3);
    ctx.lineTo(this.width / 4, this.height / 2 - 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#00D4FF44';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Cockpit window
    const cockpitGrad = ctx.createRadialGradient(this.width / 6, 0, 0, this.width / 6, 0, 6);
    cockpitGrad.addColorStop(0, '#00D4FF');
    cockpitGrad.addColorStop(0.7, '#0088AA');
    cockpitGrad.addColorStop(1, '#004455');
    ctx.fillStyle = cockpitGrad;
    ctx.beginPath();
    ctx.ellipse(this.width / 6, 0, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wing accents
    ctx.fillStyle = '#00D4FF33';
    ctx.beginPath();
    ctx.moveTo(0, -this.height / 2 + 3);
    ctx.lineTo(-this.width / 4, -this.height / 2 + 6);
    ctx.lineTo(-this.width / 3, -this.height / 3);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, this.height / 2 - 3);
    ctx.lineTo(-this.width / 4, this.height / 2 - 6);
    ctx.lineTo(-this.width / 3, this.height / 3);
    ctx.closePath();
    ctx.fill();

    // Engine glow at back
    ctx.fillStyle = this.thrusting ? '#00D4FF88' : '#00D4FF33';
    ctx.beginPath();
    ctx.arc(-this.width / 2 + 2, -this.height / 6, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-this.width / 2 + 2, this.height / 6, 2, 0, Math.PI * 2);
    ctx.fill();

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
