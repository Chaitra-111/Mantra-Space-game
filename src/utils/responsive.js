/**
 * Responsive — Device detection and responsive utilities for Mantra.
 */

export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || (window.innerWidth <= 768 && 'ontouchstart' in window);
}

export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function getDevicePixelRatio() {
  return window.devicePixelRatio || 1;
}

/**
 * Resize a canvas to fill its container with proper pixel ratio
 */
export function resizeCanvas(canvas) {
  const dpr = getDevicePixelRatio();
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { width: rect.width, height: rect.height, dpr };
}
