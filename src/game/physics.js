/**
 * Physics — Simple collision detection and distance calculations.
 */

/**
 * Distance between two points
 */
export function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check circle-circle collision
 */
export function circleCollision(x1, y1, r1, x2, y2, r2) {
  return distance(x1, y1, x2, y2) < r1 + r2;
}

/**
 * Check if a point is inside a circle
 */
export function pointInCircle(px, py, cx, cy, r) {
  return distance(px, py, cx, cy) < r;
}

/**
 * Angle from point 1 to point 2
 */
export function angleTo(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
}

/**
 * Linear interpolation
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Clamp a value between min and max
 */
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Normalize an angle to [-PI, PI]
 */
export function normalizeAngle(angle) {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

/**
 * Move value toward target at given speed
 */
export function moveToward(current, target, maxDelta) {
  if (Math.abs(target - current) <= maxDelta) return target;
  return current + Math.sign(target - current) * maxDelta;
}
