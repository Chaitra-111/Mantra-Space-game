/**
 * Meteoroid — Threats that approach planets and must be blasted by the player.
 */

import { distance, angleTo } from '../game/physics.js';

export class Meteoroid {
  constructor(x, y, targetX, targetY, speed = 40) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.speed = speed + Math.random() * 20;
    this.angle = angleTo(x, y, targetX, targetY);
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
    this.radius = 8 + Math.random() * 6;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 3;
    this.alive = true;
    this.hovered = false;

    // Generate irregular shape vertices
    this.vertices = [];
    const numVerts = 7 + Math.floor(Math.random() * 4);
    for (let i = 0; i < numVerts; i++) {
      const a = (i / numVerts) * Math.PI * 2;
      const r = this.radius * (0.7 + Math.random() * 0.3);
      this.vertices.push({ angle: a, radius: r });
    }
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.rotation += this.rotSpeed * dt;
  }

  render(ctx, time) {
    if (!this.alive) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Meteoroid body - irregular shape
    const bodyGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
    bodyGrad.addColorStop(0, '#8B7355');
    bodyGrad.addColorStop(0.5, '#6B5A42');
    bodyGrad.addColorStop(1, '#4A3C2A');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    const v0 = this.vertices[0];
    ctx.moveTo(Math.cos(v0.angle) * v0.radius, Math.sin(v0.angle) * v0.radius);
    for (let i = 1; i < this.vertices.length; i++) {
      const v = this.vertices[i];
      ctx.lineTo(Math.cos(v.angle) * v.radius, Math.sin(v.angle) * v.radius);
    }
    ctx.closePath();
    ctx.fill();

    // Craters
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(this.radius * 0.2, -this.radius * 0.1, this.radius * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-this.radius * 0.3, this.radius * 0.2, this.radius * 0.15, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Hover indicator (for mouse targeting)
    if (this.hovered) {
      ctx.save();
      ctx.strokeStyle = '#FF4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Crosshair
      ctx.strokeStyle = '#FF4444CC';
      ctx.lineWidth = 1;
      const ch = this.radius + 12;
      ctx.beginPath();
      ctx.moveTo(this.x - ch, this.y);
      ctx.lineTo(this.x - this.radius - 4, this.y);
      ctx.moveTo(this.x + this.radius + 4, this.y);
      ctx.lineTo(this.x + ch, this.y);
      ctx.moveTo(this.x, this.y - ch);
      ctx.lineTo(this.x, this.y - this.radius - 4);
      ctx.moveTo(this.x, this.y + this.radius + 4);
      ctx.lineTo(this.x, this.y + ch);
      ctx.stroke();

      ctx.restore();
    }
  }

  /**
   * Check if this meteoroid has reached its target planet
   */
  hasReachedTarget(planetRadius) {
    return distance(this.x, this.y, this.targetX, this.targetY) < planetRadius + this.radius;
  }

  /**
   * Check if a screen-space point is hovering over this meteoroid (world coords)
   */
  isPointOver(worldX, worldY) {
    return distance(worldX, worldY, this.x, this.y) < this.radius + 10;
  }

  destroy() {
    this.alive = false;
  }
}

/**
 * Meteoroid Spawner — Manages meteoroid creation and targeting logic.
 */
export class MeteoroidSpawner {
  constructor() {
    this.meteoroids = [];
    this.spawnTimer = 0;
    this.spawnInterval = 12; // seconds between spawns
    this.minInterval = 5;
    this.difficultyTimer = 0;
    this.active = true;
  }

  update(dt, planets, shipX, shipY) {
    if (!this.active) return;

    this.spawnTimer += dt;
    this.difficultyTimer += dt;

    // Gradually increase difficulty
    if (this.difficultyTimer > 30) {
      this.spawnInterval = Math.max(this.minInterval, this.spawnInterval - 0.5);
      this.difficultyTimer = 0;
    }

    // Spawn new meteoroid
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this._spawnMeteoroid(planets, shipX, shipY);
    }

    // Update existing meteoroids
    for (const m of this.meteoroids) {
      m.update(dt);
    }

    // Remove dead meteoroids
    this.meteoroids = this.meteoroids.filter(m => m.alive);
  }

  _spawnMeteoroid(planets, shipX, shipY) {
    // Find nearest non-destroyed planet to the ship (excluding the sun)
    const landable = planets.filter(p => !p.destroyed && p.id !== 'sun');
    if (landable.length === 0) return;

    // Sort by distance to ship and pick the nearest
    landable.sort((a, b) => {
      const da = distance(a.x, a.y, shipX, shipY);
      const db = distance(b.x, b.y, shipX, shipY);
      return da - db;
    });

    const target = landable[0];
    const distToShip = distance(target.x, target.y, shipX, shipY);

    // Only spawn if the spaceship is near the planet (within 350 units)
    if (distToShip > 350) return;

    // Spawn from a random edge far from the target
    const spawnAngle = Math.random() * Math.PI * 2;
    const spawnDist = 600 + Math.random() * 400;
    const sx = target.x + Math.cos(spawnAngle) * spawnDist;
    const sy = target.y + Math.sin(spawnAngle) * spawnDist;

    this.meteoroids.push(new Meteoroid(sx, sy, target.x, target.y));
  }

  render(ctx, time) {
    for (const m of this.meteoroids) {
      m.render(ctx, time);
    }
  }

  clear() {
    this.meteoroids = [];
    this.spawnTimer = 0;
    this.spawnInterval = 12;
    this.difficultyTimer = 0;
  }
}
