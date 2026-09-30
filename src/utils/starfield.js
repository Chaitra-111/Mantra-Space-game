/**
 * Starfield — Animated parallax star background for the Mantra game.
 * Creates multiple layers of stars with different speeds for depth effect.
 */

export class Starfield {
  constructor(layerCount = 3, starsPerLayer = 200) {
    this.layers = [];
    this.width = 4000;
    this.height = 4000;

    for (let i = 0; i < layerCount; i++) {
      const stars = [];
      const depth = (i + 1) / layerCount; // 0.33, 0.66, 1.0
      for (let j = 0; j < starsPerLayer; j++) {
        stars.push({
          x: Math.random() * this.width - this.width / 2,
          y: Math.random() * this.height - this.height / 2,
          size: Math.random() * (1.5 + depth * 1.5) + 0.3,
          brightness: Math.random() * 0.5 + 0.3 + depth * 0.2,
          twinkleSpeed: Math.random() * 2 + 0.5,
          twinkleOffset: Math.random() * Math.PI * 2,
          color: this.randomStarColor()
        });
      }
      this.layers.push({ stars, depth, parallaxFactor: depth * 0.6 + 0.2 });
    }
  }

  randomStarColor() {
    const colors = [
      '#FFFFFF', '#FFFFFF', '#FFFFFF',
      '#FFE4C4', '#FFD700',
      '#ADD8E6', '#87CEEB',
      '#FFB6C1', '#E6E6FA'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  render(ctx, cameraX, cameraY, viewWidth, viewHeight, time) {
    for (const layer of this.layers) {
      const px = cameraX * layer.parallaxFactor;
      const py = cameraY * layer.parallaxFactor;

      for (const star of layer.stars) {
        // Wrap stars around
        let sx = ((star.x - px) % this.width + this.width) % this.width - this.width / 2;
        let sy = ((star.y - py) % this.height + this.height) % this.height - this.height / 2;

        // Convert to screen coords
        const screenX = sx + viewWidth / 2;
        const screenY = sy + viewHeight / 2;

        // Skip if off screen
        if (screenX < -5 || screenX > viewWidth + 5 || screenY < -5 || screenY > viewHeight + 5) continue;

        // Twinkle
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
        const alpha = star.brightness * twinkle;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow for brighter stars
        if (star.size > 1.5) {
          ctx.globalAlpha = alpha * 0.3;
          ctx.beginPath();
          ctx.arc(screenX, screenY, star.size * 3, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(
            screenX, screenY, 0,
            screenX, screenY, star.size * 3
          );
          grad.addColorStop(0, star.color);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.fill();
        }
        ctx.restore();
      }
    }
  }

  /**
   * Render a static decorative starfield for the hero section (no camera)
   */
  renderStatic(ctx, viewWidth, viewHeight, time) {
    this.render(ctx, 0, 0, viewWidth, viewHeight, time);
  }
}

/**
 * Nebula — Renders colorful nebula clouds in the background
 */
export class Nebula {
  constructor(count = 5) {
    this.clouds = [];
    for (let i = 0; i < count; i++) {
      this.clouds.push({
        x: Math.random() * 3000 - 1500,
        y: Math.random() * 3000 - 1500,
        radius: Math.random() * 300 + 150,
        color: this.randomNebulaColor(),
        opacity: Math.random() * 0.08 + 0.03,
        drift: { x: (Math.random() - 0.5) * 0.05, y: (Math.random() - 0.5) * 0.05 }
      });
    }
  }

  randomNebulaColor() {
    const colors = [
      '#7B2FF7', '#4A00E0', '#00D4FF',
      '#FF006E', '#8338EC', '#3A86FF',
      '#06D6A0', '#FF6B6B'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  render(ctx, cameraX, cameraY, viewWidth, viewHeight, time) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (const cloud of this.clouds) {
      // Parallax effect for nebula
      const px = cloud.x - cameraX * 0.05 + Math.sin(time * 0.05 + cloud.x) * 10;
      const py = cloud.y - cameraY * 0.05 + Math.cos(time * 0.05 + cloud.y) * 10;

      // Wrap around so nebula is infinite
      const wrapW = 4000;
      const wrapH = 4000;
      let sx = ((px) % wrapW + wrapW) % wrapW - wrapW / 2;
      let sy = ((py) % wrapH + wrapH) % wrapH - wrapH / 2;

      const screenX = sx + viewWidth / 2;
      const screenY = sy + viewHeight / 2;

      // Draw massive sweeping clouds
      const rad = cloud.radius * 2.5; // Make them huge
      if (screenX < -rad || screenX > viewWidth + rad) continue;
      if (screenY < -rad || screenY > viewHeight + rad) continue;

      ctx.save();
      ctx.translate(screenX, screenY);
      // Give them a slight rotation so they look like sweeping gas bands
      ctx.rotate(cloud.x * 0.01); 
      
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rad);
      grad.addColorStop(0, cloud.color + Math.floor(cloud.opacity * 255).toString(16).padStart(2, '0'));
      grad.addColorStop(0.4, cloud.color + Math.floor(cloud.opacity * 100).toString(16).padStart(2, '0'));
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      // Draw stretched ellipse for sweeping effect
      ctx.beginPath();
      ctx.ellipse(0, 0, rad, rad * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }
}
