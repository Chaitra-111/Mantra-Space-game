/**
 * Planet Surface Scene — Side-scrolling planet exploration view.
 * Astronaut walks around the planet, can view information and reboard spaceship.
 */

import { Astronaut } from '../entities/astronaut.js';
import { Spaceship } from '../entities/spaceship.js';
import { Starfield } from '../utils/starfield.js';
import { ParticleSystem } from '../game/particles.js';
import { isMobile } from '../utils/responsive.js';

export class PlanetSurfaceScene {
  constructor(input, planetData, onBoardShip, onExplain) {
    this.input = input;
    this.planetData = planetData;
    this.onBoardShip = onBoardShip;
    this.onExplain = onExplain;

    this.engine = null;
    this.astronaut = null;
    this.spaceship = null;
    this.starfield = new Starfield(2, 100);
    this.particles = new ParticleSystem();
    this.groundY = 0;
    this.worldWidth = 2000;
    this.cameraX = 0;
    this.landed = false;
    this.landingProgress = 0;
    this.mobile = isMobile();

    // Terrain generation
    this.terrain = [];
    this.terrainFeatures = [];
  }

  init(engine) {
    this.engine = engine;
    this.groundY = engine.viewHeight * 0.7;

    this.astronaut = new Astronaut(engine.viewWidth / 2, this.groundY - 14);
    this.spaceship = new Spaceship(engine.viewWidth / 2 - 100, 0);

    // Ensure the world is at least 2x the screen width
    this.worldWidth = Math.max(2400, engine.viewWidth * 2.5);

    this._generateTerrain(engine.viewWidth, engine.viewHeight);
    this._generateFeatures();

    // Landing animation
    this.landed = false;
    this.landingProgress = 0;

    // Emit landing dust
    setTimeout(() => {
      this.particles.emitDust(engine.viewWidth / 2 - 100, this.groundY, 25);
      this.landed = true;
    }, 800);
  }

  onResize(width, height) {
    this.groundY = height * 0.7;
    if (this.astronaut) {
      this.astronaut.y = this.groundY - 14;
      this.astronaut.groundY = this.groundY - 14;
    }
  }

  _generateTerrain(w, h) {
    this.terrain = [];
    const segments = Math.ceil(this.worldWidth / 20);
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * this.worldWidth;
      const baseHeight = this.groundY;
      // Add some terrain variation
      const variation = Math.sin(i * 0.3) * 8 + Math.sin(i * 0.7) * 4 + Math.sin(i * 0.1) * 15;
      this.terrain.push({ x, y: baseHeight + variation });
    }
  }

  _generateFeatures() {
    this.terrainFeatures = [];
    const featureType = this.planetData.surfaceFeatures;

    for (let i = 0; i < 8; i++) {
      const x = Math.random() * this.worldWidth;
      this.terrainFeatures.push({
        x,
        type: featureType,
        size: 10 + Math.random() * 30,
        seed: Math.random() * 1000
      });
    }
  }

  update(dt, time) {
    // Landing animation
    if (!this.landed) {
      this.landingProgress += dt * 1.2;
      this.input.clearFrame();
      return;
    }

    // Update astronaut
    const mouseWorldX = this.input.mouse.x + this.cameraX;
    this.astronaut.update(dt, this.input, mouseWorldX);

    // Clamp astronaut position
    this.astronaut.x = Math.max(30, Math.min(this.worldWidth - 30, this.astronaut.x));

    // Camera follows astronaut
    const targetCamX = this.astronaut.x - this.engine.viewWidth / 2;
    this.cameraX += (targetCamX - this.cameraX) * 0.08;
    this.cameraX = Math.max(0, Math.min(this.worldWidth - this.engine.viewWidth, this.cameraX));

    // Handle controls
    if (this.input.wasJustPressed('BoardShip')) {
      this.onBoardShip();
    }
    if (this.input.wasJustPressed('Explain')) {
      this.onExplain(this.planetData);
    }

    // Update particles
    this.particles.update(dt);

    this.input.clearFrame();
  }

  render(ctx, time) {
    const w = this.engine.viewWidth;
    const h = this.engine.viewHeight;

    // Sky gradient based on planet
    this._renderSky(ctx, w, h);

    // Stars (visible through thin atmospheres)
    this.starfield.renderStatic(ctx, w, h, time);

    // Planet in the sky
    this._renderSkyBody(ctx, w, h, time);

    // Apply camera offset
    ctx.save();
    ctx.translate(-this.cameraX, 0);

    // Terrain
    this._renderTerrain(ctx, w, h, time);

    // Terrain features
    this._renderFeatures(ctx, time);

    // Spaceship (parked)
    const shipX = w / 2 - 100 + this.cameraX * 0.1;
    const shipLandY = this.landed ? this.groundY - 20 :
      -50 + (this.groundY - 20 + 50) * Math.min(1, this.landingProgress);

    this.spaceship.renderParked(ctx, w / 2 - 100, shipLandY, 1.5);

    // Astronaut
    if (this.landed) {
      this.astronaut.render(ctx, time);
    }

    // Particles
    this.particles.render(ctx);

    ctx.restore();

    // HUD
    this._renderHUD(ctx, w, h, time);

    // Mobile controls
    if (this.mobile) {
      this._renderMobileControls(ctx, w, h);
    }
  }

  _renderSky(ctx, w, h) {
    const colors = this.planetData.surfaceGradient || [this.planetData.color, this.planetData.glowColor, '#000000'];
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);

    // Different sky based on planet type
    if (this.planetData.id === 'earth') {
      skyGrad.addColorStop(0, '#0B1026');
      skyGrad.addColorStop(0.4, '#1B2A4A');
      skyGrad.addColorStop(0.7, '#2D4A6A');
      skyGrad.addColorStop(1, colors[2] || '#87CEEB');
    } else if (this.planetData.id === 'mars') {
      skyGrad.addColorStop(0, '#1A0A00');
      skyGrad.addColorStop(0.5, '#4A2010');
      skyGrad.addColorStop(1, '#8B4020');
    } else if (this.planetData.id === 'venus') {
      skyGrad.addColorStop(0, '#2A1A00');
      skyGrad.addColorStop(0.5, '#6B4A14');
      skyGrad.addColorStop(1, '#8B6914');
    } else {
      skyGrad.addColorStop(0, '#06060F');
      skyGrad.addColorStop(0.6, '#0A0A1F');
      skyGrad.addColorStop(1, colors[0] + '44');
    }

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);
  }

  _renderSkyBody(ctx, w, h, time) {
    // Render a celestial body in the sky (depends on planet)
    if (this.planetData.id === 'earth') {
      // Moon
      ctx.save();
      const moonGrad = ctx.createRadialGradient(w * 0.8, h * 0.15, 0, w * 0.8, h * 0.15, 25);
      moonGrad.addColorStop(0, '#FFFFFF');
      moonGrad.addColorStop(0.5, '#E8E8E0');
      moonGrad.addColorStop(1, '#C0C0B0');
      ctx.fillStyle = moonGrad;
      ctx.beginPath();
      ctx.arc(w * 0.8, h * 0.15, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      // Distant Sun
      ctx.save();
      const sunSize = this.planetData.id === 'neptune' ? 8 :
        this.planetData.id === 'uranus' ? 10 :
        this.planetData.id === 'saturn' ? 14 :
        this.planetData.id === 'jupiter' ? 18 : 30;

      const sunGlow = ctx.createRadialGradient(w * 0.15, h * 0.12, 0, w * 0.15, h * 0.12, sunSize * 3);
      sunGlow.addColorStop(0, '#FDB81388');
      sunGlow.addColorStop(0.5, '#FDB81322');
      sunGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(w * 0.15, h * 0.12, sunSize * 3, 0, Math.PI * 2);
      ctx.fill();

      const sunGrad = ctx.createRadialGradient(w * 0.15, h * 0.12, 0, w * 0.15, h * 0.12, sunSize);
      sunGrad.addColorStop(0, '#FFFFFF');
      sunGrad.addColorStop(0.5, '#FDB813');
      sunGrad.addColorStop(1, '#FF8C00');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(w * 0.15, h * 0.12, sunSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  _renderTerrain(ctx, w, h, time) {
    const colors = this.planetData.surfaceGradient || [this.planetData.color, this.planetData.glowColor, '#000000'];

    // Ground
    ctx.save();
    const groundGrad = ctx.createLinearGradient(0, this.groundY - 10, 0, h);
    groundGrad.addColorStop(0, colors[1] || colors[0]);
    groundGrad.addColorStop(0.3, colors[0]);
    groundGrad.addColorStop(1, this._darkenColor(colors[0], 0.5));

    ctx.fillStyle = groundGrad;
    ctx.beginPath();
    ctx.moveTo(0, h);

    if (this.terrain.length > 0) {
      ctx.lineTo(this.terrain[0].x, this.terrain[0].y);
      for (let i = 1; i < this.terrain.length; i++) {
        const prev = this.terrain[i - 1];
        const curr = this.terrain[i];
        const cpx = (prev.x + curr.x) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, cpx, (prev.y + curr.y) / 2);
      }
      ctx.lineTo(this.worldWidth, this.terrain[this.terrain.length - 1].y);
    }

    ctx.lineTo(this.worldWidth, h);
    ctx.closePath();
    ctx.fill();

    // Surface line
    ctx.strokeStyle = colors[2] || colors[1] || colors[0];
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    if (this.terrain.length > 0) {
      ctx.moveTo(this.terrain[0].x, this.terrain[0].y);
      for (let i = 1; i < this.terrain.length; i++) {
        const prev = this.terrain[i - 1];
        const curr = this.terrain[i];
        const cpx = (prev.x + curr.x) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, cpx, (prev.y + curr.y) / 2);
      }
    }
    ctx.stroke();
    ctx.restore();
  }

  _renderFeatures(ctx, time) {
    for (const feature of this.terrainFeatures) {
      const x = feature.x;
      const y = this.groundY - 2;

      ctx.save();
      switch (feature.type) {
        case 'craters':
          ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
          ctx.beginPath();
          ctx.ellipse(x, y + 2, feature.size * 0.8, feature.size * 0.2, 0, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'rocky':
        case 'volcanic':
          ctx.fillStyle = this.planetData.surfaceGradient[0] + '88';
          ctx.beginPath();
          ctx.moveTo(x - feature.size / 2, y);
          ctx.lineTo(x - feature.size / 4, y - feature.size * 0.6);
          ctx.lineTo(x + feature.size / 6, y - feature.size * 0.4);
          ctx.lineTo(x + feature.size / 3, y - feature.size * 0.7);
          ctx.lineTo(x + feature.size / 2, y);
          ctx.closePath();
          ctx.fill();
          break;
        case 'earth':
          // Trees
          ctx.fillStyle = '#1A5E1A88';
          ctx.beginPath();
          ctx.moveTo(x, y - feature.size);
          ctx.lineTo(x - feature.size * 0.4, y);
          ctx.lineTo(x + feature.size * 0.4, y);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#4A2800';
          ctx.fillRect(x - 2, y, 4, 6);
          break;
        default:
          // Generic rock
          ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
          ctx.beginPath();
          ctx.arc(x, y, feature.size * 0.3, Math.PI, 0);
          ctx.closePath();
          ctx.fill();
      }
      ctx.restore();
    }
  }

  _renderHUD(ctx, w, h, time) {
    // Planet name banner
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.roundRect(w / 2 - 160, 12, 320, 44, 12);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = this.planetData.color;
    ctx.font = '18px "Orbitron", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.planetData.name, w / 2, 32);

    ctx.fillStyle = '#FFFFFF88';
    ctx.font = '11px "Inter", sans-serif';
    ctx.fillText(this.planetData.tagline, w / 2, 48);
    ctx.restore();

    // Controls hint
    if (!this.mobile && this.landed) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '11px "Inter", sans-serif';
      ctx.textAlign = 'center';
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const mod = isMac ? '⌘' : 'Ctrl';
      ctx.fillText(`Arrow Keys: Walk  |  ${mod}+B: Board Spaceship  |  ${mod}+E: Planet Info`, w / 2, h - 20);
      ctx.restore();
    }
  }

  _renderMobileControls(ctx, w, h) {
    if (!this.landed) return;

    const btnSize = 44;
    const baseX = 70;
    const baseY = h - 90;

    // Left/Right only on planet surface
    const buttons = [
      { x: baseX - btnSize - 6, y: baseY, label: '◀', dir: 'left' },
      { x: baseX + btnSize + 6, y: baseY, label: '▶', dir: 'right' }
    ];

    ctx.save();
    for (const btn of buttons) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
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

    // Action buttons
    const actionBtns = [
      { x: w - 70, y: h - 130, label: '🚀', action: 'board', text: 'Board' },
      { x: w - 70, y: h - 70, label: '✏️', action: 'explain', text: 'Info' }
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

    // Handle touches
    this.input.dpad = { up: false, down: false, left: false, right: false };
    for (const touch of this.input.touches) {
      for (const btn of buttons) {
        if (Math.abs(touch.x - btn.x) < btnSize / 2 && Math.abs(touch.y - btn.y) < btnSize / 2) {
          this.input.setDpad(btn.dir, true);
        }
      }
      for (const btn of actionBtns) {
        if (Math.abs(touch.x - btn.x) < 28 && Math.abs(touch.y - btn.y) < 28) {
          this.input.pressMobileButton(btn.action);
        }
      }
    }
  }

  _darkenColor(hex, factor) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${Math.floor(r * factor)}, ${Math.floor(g * factor)}, ${Math.floor(b * factor)})`;
  }

  cleanup() {
    this.particles.clear();
  }
}
