/**
 * Space Scene — Main galaxy navigation scene.
 * Player flies spaceship through the solar system, lands on planets, defends against meteoroids.
 */

import { Camera } from '../utils/camera.js';
import { Starfield, Nebula } from '../utils/starfield.js';
import { ParticleSystem } from '../game/particles.js';
import { Spaceship } from '../entities/spaceship.js';
import { Sun } from '../entities/sun.js';
import { Planet } from '../entities/planet.js';
import { Star } from '../entities/star.js';
import { MeteoroidSpawner } from '../entities/meteoroid.js';
import { solarSystem } from '../data/planets.js';
import { starsData, meteoroidInfo } from '../data/stars.js';
import { distance, pointInCircle } from '../game/physics.js';
import { isMobile } from '../utils/responsive.js';

export class SpaceScene {
  constructor(input, onLandOnPlanet, onGameOver, onShowInfo) {
    this.input = input;
    this.onLandOnPlanet = onLandOnPlanet;
    this.onGameOver = onGameOver;
    this.onShowInfo = onShowInfo;

    this.engine = null;
    this.camera = null;
    this.starfield = new Starfield(4, 300);
    this.nebula = new Nebula(6);
    this.particles = new ParticleSystem();
    this.spaceship = new Spaceship(370, 0); // Start near Earth
    this.sun = null;
    this.planets = [];
    this.stars = [];
    this.meteoroidSpawner = new MeteoroidSpawner();
    this.lives = 5;
    this.nearestPlanet = null;
    this.landingDistance = 50;
    this.message = '';
    this.messageTimer = 0;
    this.score = 0;
    this.mobile = isMobile();
  }

  init(engine) {
    this.engine = engine;
    this.camera = new Camera(engine.viewWidth, engine.viewHeight);

    // Create celestial bodies from data
    const sunData = solarSystem.find(p => p.id === 'sun');
    this.sun = new Sun(sunData);

    this.planets = solarSystem
      .filter(p => p.id !== 'sun')
      .map(d => new Planet(d));
      
    // Add sun to planets array so we can land on it
    this.planets.push(new Planet(sunData)); // Wrap sun in planet class for landing logic

    this.stars = starsData.map(d => new Star(d));

    // Zoom in for a more realistic astronaut perspective
    this.camera.zoom = 1;
    this.camera.setZoom(1);
  }

  onResize(width, height) {
    if (this.camera) {
      this.camera.resize(width, height);
    }
  }

  update(dt, time) {
    const mouseWorld = this.camera.screenToWorld(this.input.mouse.x, this.input.mouse.y);

    // Handle pause
    if (this.input.wasJustPressed('KeyP') || this.input.wasJustPressed('Pause')) {
      this.engine.togglePause();
    }

    if (this.engine.paused) {
      // If paused, allow clicking on meteoroids to learn about them
      if (this.input.wasMouseJustClicked()) {
        for (const m of this.meteoroidSpawner.meteoroids) {
          if (m.isPointOver(mouseWorld.x, mouseWorld.y)) {
            this.onShowInfo(meteoroidInfo);
            break;
          }
        }
      }
      this.input.clearFrame();
      return; // Skip rest of update when paused
    }

    // Update spaceship
    this.spaceship.update(dt, this.input, mouseWorld);

    // Update camera to follow spaceship
    this.camera.follow(this.spaceship.x, this.spaceship.y);
    this.camera.update(dt);

    // Update planets
    for (const planet of this.planets) {
      planet.update(dt);
    }

    // Update particles
    this.particles.update(dt);

    // Thruster particles
    if (this.spaceship.thrusting) {
      const tailX = this.spaceship.x - Math.cos(this.spaceship.angle) * 20;
      const tailY = this.spaceship.y - Math.sin(this.spaceship.angle) * 20;
      this.particles.emitThruster(tailX, tailY, this.spaceship.angle, 120);
    }

    // Find nearest landable planet or star
    this.nearestPlanet = null;
    let nearestDist = Infinity;
    const allLandables = [...this.planets, ...this.stars];
    
    for (const body of allLandables) {
      if (body.destroyed || (body.id === 'sun' && body instanceof Sun)) continue; 
      // Skip the pure Sun entity, use the Planet wrapper for the sun
      const d = distance(this.spaceship.x, this.spaceship.y, body.x, body.y);
      if (d < body.radius + this.landingDistance && d < nearestDist) {
        nearestDist = d;
        this.nearestPlanet = body;
      }
    }

    // Handle dynamic camera zoom and boarding
    if (this.nearestPlanet) {
      this.camera.setZoom(1.4); // Zoom in closer to planets for a realistic tour
      if (this.input.wasJustPressed('BoardShip')) {
        this.onLandOnPlanet(this.nearestPlanet.data);
      }
    } else {
      this.camera.setZoom(1.0); // Reset zoom in deep space
    }

    // Handle explain (Ctrl+E) — show info for nearest planet
    if (this.input.wasJustPressed('Explain') && this.nearestPlanet) {
      this.onShowInfo(this.nearestPlanet.data);
    }

    // Update meteoroids
    this.meteoroidSpawner.update(dt, this.planets, this.spaceship.x, this.spaceship.y);

    // Check meteoroid hover state (for desktop targeting)
    for (const m of this.meteoroidSpawner.meteoroids) {
      m.hovered = m.isPointOver(mouseWorld.x, mouseWorld.y);

      // Desktop: Enter key to blast hovered meteoroid
      if (m.hovered && this.input.wasJustPressed('Enter')) {
        this._blastMeteoroid(m);
      }

      // Mobile: Check touch/click on meteoroid
      if (this.input.wasMouseJustClicked() && m.isPointOver(mouseWorld.x, mouseWorld.y)) {
        this._blastMeteoroid(m);
        this.input.mouse.justClicked = false; // Consume the click so we don't also land
      }

      // Check if meteoroid hits any planet (use current planet position, not stored target)
      for (const planet of this.planets) {
        if (!planet.destroyed && m.alive) {
          const dist = distance(m.x, m.y, planet.x, planet.y);
          if (dist < planet.radius + m.radius) {
            this._meteoroidHitPlanet(m, planet);
          }
        }
      }
    }

    // Update meteoroid fire trails
    for (const m of this.meteoroidSpawner.meteoroids) {
      if (m.alive) {
        this.particles.emitFireTrail(m.x, m.y, m.vx, m.vy);
      }
    }

    // Message timer
    if (this.messageTimer > 0) {
      this.messageTimer -= dt;
      if (this.messageTimer <= 0) this.message = '';
    }

    // Click-to-land interaction
    if (this.input.wasMouseJustClicked() && this.nearestPlanet) {
      const distToClick = distance(mouseWorld.x, mouseWorld.y, this.nearestPlanet.x, this.nearestPlanet.y);
      if (distToClick < this.nearestPlanet.radius + 50) {
        this.onLandOnPlanet(this.nearestPlanet.data);
      }
    }

    this.input.clearFrame();
  }

  _blastMeteoroid(meteoroid) {
    this.particles.emitExplosion(meteoroid.x, meteoroid.y, 30, 100);
    meteoroid.destroy();
    this.score += 100;
    this.camera.addShake(5, 0.2);
    this._showMessage('Meteoroid destroyed! +100', 2);
  }

  _meteoroidHitPlanet(meteoroid, planet) {
    meteoroid.destroy();
    planet.destroy();
    this.particles.emitPlanetExplosion(planet.x, planet.y, planet.color, planet.radius);
    this.camera.addShake(15, 0.5);
    this.lives--;
    this._showMessage(`${planet.name} was destroyed! Lives: ${this.lives}`, 3);

    if (this.lives <= 0) {
      setTimeout(() => this.onGameOver(this.score), 1500);
    }
  }

  _showMessage(msg, duration = 2) {
    this.message = msg;
    this.messageTimer = duration;
  }

  render(ctx, time) {
    const w = this.engine.viewWidth;
    const h = this.engine.viewHeight;

    // Background starfield (screen space, with parallax)
    this.starfield.render(ctx, this.camera.x, this.camera.y, w, h, time);
    this.nebula.render(ctx, this.camera.x, this.camera.y, w, h, time);

    // World-space rendering
    this.camera.applyTransform(ctx);

    // Stars
    for (const star of this.stars) {
      star.render(ctx, time);
    }

    // Sun (pure sun entity for visual, we skip rendering the planet-wrapper sun to avoid duplication)
    this.sun.render(ctx, time);

    // Planets
    for (const planet of this.planets) {
      if (planet.id !== 'sun') {
        planet.render(ctx, time);
      }
    }

    // Landing indicator
    if (this.nearestPlanet) {
      this.nearestPlanet.renderLandingIndicator(ctx, time);
    }

    // Meteoroids
    this.meteoroidSpawner.render(ctx, time);

    // Particles
    this.particles.render(ctx);

    // Spaceship
    this.spaceship.render(ctx, time);

    this.camera.restoreTransform(ctx);

    // HUD (screen space)
    this._renderHUD(ctx, w, h, time);
  }

  _renderHUD(ctx, w, h, time) {
    // Lives
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px "Orbitron", sans-serif';
    ctx.textAlign = 'left';
    const livesText = '❤️ '.repeat(this.lives) + '🖤 '.repeat(Math.max(0, 5 - this.lives));
    ctx.fillText(livesText, 20, 35);

    // Score
    ctx.textAlign = 'right';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(`Score: ${this.score}`, w - 20, 35);

    // Pause button area
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.roundRect(w / 2 - 45, 10, 90, 32, 8);
    ctx.fill();
    ctx.fillStyle = '#FFFFFFCC';
    ctx.font = '12px "Orbitron", sans-serif';
    ctx.fillText(this.engine.paused ? '▶ RESUME' : '⏸ PAUSE', w / 2, 31);

    // Paused overlay
    if (this.engine.paused) {
      ctx.fillStyle = 'rgba(6, 6, 15, 0.7)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#00D4FF';
      ctx.font = '36px "Orbitron", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', w / 2, h / 2 - 20);
      ctx.fillStyle = '#FFFFFF88';
      ctx.font = '14px "Inter", sans-serif';
      ctx.fillText('Press P to resume', w / 2, h / 2 + 20);
    }

    // Message
    if (this.message) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, this.messageTimer)})`;
      ctx.font = '16px "Orbitron", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.message, w / 2, h - 60);
    }

    // Controls help (bottom)
    if (!this.mobile) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '11px "Inter", sans-serif';
      ctx.textAlign = 'center';
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const mod = isMac ? '⌘' : 'Ctrl';
      ctx.fillText(`Arrow Keys: Fly  |  ${mod}+B: Land on Planet  |  ${mod}+E: Planet Info  |  Mouse+Enter: Blast Meteoroid  |  P: Pause`, w / 2, h - 20);
    }

    // Nearest planet name
    if (this.nearestPlanet) {
      ctx.fillStyle = '#00D4FFCC';
      ctx.font = '13px "Orbitron", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Near: ${this.nearestPlanet.name}`, 20, 60);
    }

    ctx.restore();

    // Mobile controls
    if (this.mobile) {
      this._renderMobileControls(ctx, w, h);
    }
  }

  _renderMobileControls(ctx, w, h) {
    const btnSize = 44;
    const padding = 12;
    const baseX = 70;
    const baseY = h - 130;

    // D-pad background
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.arc(baseX, baseY, 65, 0, Math.PI * 2);
    ctx.fill();

    const buttons = [
      { x: baseX, y: baseY - btnSize - padding / 2, label: '▲', dir: 'up' },
      { x: baseX, y: baseY + btnSize + padding / 2, label: '▼', dir: 'down' },
      { x: baseX - btnSize - padding / 2, y: baseY, label: '◀', dir: 'left' },
      { x: baseX + btnSize + padding / 2, y: baseY, label: '▶', dir: 'right' }
    ];

    for (const btn of buttons) {
      const isActive = this.input.dpad[btn.dir];
      ctx.fillStyle = isActive ? 'rgba(0, 212, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)';
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(btn.x - btnSize / 2, btn.y - btnSize / 2, btnSize, btnSize, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFFCC';
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(btn.label, btn.x, btn.y);
    }

    // Action buttons (right side)
    const actionBtns = [
      { x: w - 70, y: h - 170, label: '🚀', action: 'board', text: 'Board' },
      { x: w - 70, y: h - 110, label: '✏️', action: 'explain', text: 'Info' }
    ];

    for (const btn of actionBtns) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(btn.x - 28, btn.y - 28, 56, 56, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(btn.label, btn.x, btn.y - 4);

      ctx.fillStyle = '#FFFFFF88';
      ctx.font = '9px "Inter", sans-serif';
      ctx.fillText(btn.text, btn.x, btn.y + 18);
    }

    ctx.restore();

    // Handle mobile D-pad touches
    this._handleMobileTouches(buttons, actionBtns, btnSize, w, h);
  }

  _handleMobileTouches(dpadBtns, actionBtns, btnSize, w, h) {
    // Reset d-pad
    this.input.dpad = { up: false, down: false, left: false, right: false };

    for (const touch of this.input.touches) {
      // Check D-pad
      for (const btn of dpadBtns) {
        if (Math.abs(touch.x - btn.x) < btnSize / 2 && Math.abs(touch.y - btn.y) < btnSize / 2) {
          this.input.setDpad(btn.dir, true);
        }
      }

      // Check action buttons
      for (const btn of actionBtns) {
        if (Math.abs(touch.x - btn.x) < 28 && Math.abs(touch.y - btn.y) < 28) {
          this.input.pressMobileButton(btn.action);
        }
      }

      // Check pause button
      if (Math.abs(touch.x - w / 2) < 45 && touch.y < 42) {
        this.engine.togglePause();
      }
    }
  }

  /**
   * Restore all planets (for game restart)
   */
  restoreAll() {
    for (const planet of this.planets) {
      planet.restore();
    }
    this.lives = 5;
    this.score = 0;
    this.meteoroidSpawner.clear();
    this.particles.clear();
    this.spaceship.x = 370;
    this.spaceship.y = 0;
    this.spaceship.vx = 0;
    this.spaceship.vy = 0;
  }

  cleanup() {
    this.particles.clear();
  }
}
