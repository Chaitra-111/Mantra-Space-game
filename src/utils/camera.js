/**
 * Camera — Smooth-following camera system for the Mantra game.
 */

export class Camera {
  constructor(viewWidth, viewHeight) {
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
    this.smoothing = 0.08;
    this.zoom = 1;
    this.targetZoom = 1;
    this.zoomSmoothing = 0.05;
    this.shake = { x: 0, y: 0, intensity: 0, duration: 0 };
  }

  follow(targetX, targetY) {
    this.targetX = targetX;
    this.targetY = targetY;
  }

  setZoom(zoom) {
    this.targetZoom = zoom;
  }

  addShake(intensity, duration) {
    this.shake.intensity = intensity;
    this.shake.duration = duration;
  }

  update(dt) {
    // Smooth follow
    this.x += (this.targetX - this.x) * this.smoothing;
    this.y += (this.targetY - this.y) * this.smoothing;

    // Smooth zoom
    this.zoom += (this.targetZoom - this.zoom) * this.zoomSmoothing;

    // Screen shake
    if (this.shake.duration > 0) {
      this.shake.duration -= dt;
      this.shake.x = (Math.random() - 0.5) * this.shake.intensity * 2;
      this.shake.y = (Math.random() - 0.5) * this.shake.intensity * 2;
    } else {
      this.shake.x = 0;
      this.shake.y = 0;
    }
  }

  resize(viewWidth, viewHeight) {
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
  }

  /**
   * Convert world coordinates to screen coordinates
   */
  worldToScreen(worldX, worldY) {
    return {
      x: (worldX - this.x) * this.zoom + this.viewWidth / 2 + this.shake.x,
      y: (worldY - this.y) * this.zoom + this.viewHeight / 2 + this.shake.y
    };
  }

  /**
   * Convert screen coordinates to world coordinates
   */
  screenToWorld(screenX, screenY) {
    return {
      x: (screenX - this.viewWidth / 2 - this.shake.x) / this.zoom + this.x,
      y: (screenY - this.viewHeight / 2 - this.shake.y) / this.zoom + this.y
    };
  }

  /**
   * Apply camera transform to canvas context
   */
  applyTransform(ctx) {
    ctx.save();
    ctx.translate(
      this.viewWidth / 2 + this.shake.x,
      this.viewHeight / 2 + this.shake.y
    );
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.x, -this.y);
  }

  /**
   * Restore canvas context after camera transform
   */
  restoreTransform(ctx) {
    ctx.restore();
  }

  /**
   * Check if a world-space rectangle is visible
   */
  isVisible(worldX, worldY, width, height) {
    const margin = 100;
    const halfW = this.viewWidth / (2 * this.zoom);
    const halfH = this.viewHeight / (2 * this.zoom);
    return (
      worldX + width / 2 > this.x - halfW - margin &&
      worldX - width / 2 < this.x + halfW + margin &&
      worldY + height / 2 > this.y - halfH - margin &&
      worldY - height / 2 < this.y + halfH + margin
    );
  }
}
