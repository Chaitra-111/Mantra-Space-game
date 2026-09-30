/**
 * Particle System — Visual effects for thrusters, explosions, dust, etc.
 */

class Particle {
  constructor(x, y, vx, vy, life, size, color, shrink = true, gravity = 0) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.maxLife = life;
    this.size = size;
    this.color = color;
    this.shrink = shrink;
    this.gravity = gravity;
    this.alpha = 1;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += this.gravity * dt;
    this.life -= dt;
    this.alpha = Math.max(0, this.life / this.maxLife);
    if (this.shrink) {
      this.size *= 0.98;
    }
  }

  get isDead() {
    return this.life <= 0 || this.size < 0.1;
  }
}

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  /**
   * Add a single particle
   */
  add(x, y, vx, vy, life, size, color, shrink = true, gravity = 0) {
    this.particles.push(new Particle(x, y, vx, vy, life, size, color, shrink, gravity));
  }

  /**
   * Engine thruster trail
   */
  emitThruster(x, y, angle, speed = 100) {
    const spread = 0.4;
    for (let i = 0; i < 3; i++) {
      const a = angle + Math.PI + (Math.random() - 0.5) * spread;
      const s = speed * (0.5 + Math.random() * 0.5);
      const colors = ['#FF6B00', '#FFD700', '#FF4500', '#FFA500'];
      this.add(
        x + (Math.random() - 0.5) * 4,
        y + (Math.random() - 0.5) * 4,
        Math.cos(a) * s,
        Math.sin(a) * s,
        0.3 + Math.random() * 0.3,
        2 + Math.random() * 3,
        colors[Math.floor(Math.random() * colors.length)]
      );
    }
  }

  /**
   * Explosion burst
   */
  emitExplosion(x, y, count = 40, radius = 200, colors = null) {
    const defaultColors = ['#FF4500', '#FF6B00', '#FFD700', '#FFA500', '#FF0000', '#FFFFFF'];
    const c = colors || defaultColors;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * radius;
      this.add(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        0.5 + Math.random() * 1.0,
        2 + Math.random() * 5,
        c[Math.floor(Math.random() * c.length)]
      );
    }
  }

  /**
   * Planet destruction explosion
   */
  emitPlanetExplosion(x, y, planetColor, planetRadius) {
    const colors = [planetColor, '#FF4500', '#FF6B00', '#FFD700', '#FFFFFF'];
    // Core explosion
    this.emitExplosion(x, y, 80, planetRadius * 5, colors);
    // Ring of debris
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = planetRadius * (1 + Math.random() * 2);
      this.add(
        x + Math.cos(angle) * dist * 0.3,
        y + Math.sin(angle) * dist * 0.3,
        Math.cos(angle) * dist * 1.5,
        Math.sin(angle) * dist * 1.5,
        1.0 + Math.random() * 1.5,
        3 + Math.random() * 6,
        colors[Math.floor(Math.random() * colors.length)]
      );
    }
  }

  /**
   * Meteoroid fire trail
   */
  emitFireTrail(x, y, vx, vy) {
    for (let i = 0; i < 2; i++) {
      const colors = ['#FF4500', '#FF6B00', '#8B2500', '#FFD700'];
      this.add(
        x + (Math.random() - 0.5) * 6,
        y + (Math.random() - 0.5) * 6,
        -vx * 0.2 + (Math.random() - 0.5) * 30,
        -vy * 0.2 + (Math.random() - 0.5) * 30,
        0.4 + Math.random() * 0.4,
        2 + Math.random() * 4,
        colors[Math.floor(Math.random() * colors.length)]
      );
    }
  }

  /**
   * Landing dust
   */
  emitDust(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI + Math.random() * Math.PI;
      const speed = 30 + Math.random() * 60;
      this.add(
        x + (Math.random() - 0.5) * 20, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed * 0.5 - Math.random() * 20,
        0.5 + Math.random() * 0.5,
        2 + Math.random() * 3,
        '#A0937D',
        true,
        80
      );
    }
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update(dt);
      if (this.particles[i].isDead) {
        this.particles.splice(i, 1);
      }
    }
  }

  render(ctx) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Glow effect for larger particles
      if (p.size > 2) {
        ctx.globalAlpha = p.alpha * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.restore();
    }
  }

  clear() {
    this.particles = [];
  }

  get count() {
    return this.particles.length;
  }
}
