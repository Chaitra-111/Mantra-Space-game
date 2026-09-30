/**
 * Input Manager — Handles keyboard (desktop) and touch (mobile) input.
 */

import { isMobile } from '../utils/responsive.js';

export class InputManager {
  constructor() {
    this.keys = {};
    this.justPressed = {};
    this.mouse = { x: 0, y: 0, clicked: false, justClicked: false };
    this.touches = [];
    this.mobile = isMobile();
    
    // Mobile D-pad state
    this.dpad = { up: false, down: false, left: false, right: false };
    this.mobileButtons = { board: false, explain: false, pause: false };

    this._setupKeyboard();
    this._setupMouse();
    if (this.mobile || true) { // Always set up touch for tablets
      this._setupTouch();
    }
  }

  _setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Prevent default for game keys
      const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'KeyP', 'Space'];
      if (gameKeys.includes(e.code)) {
        e.preventDefault();
      }

      if (!this.keys[e.code]) {
        this.justPressed[e.code] = true;
      }
      this.keys[e.code] = true;

      // Handle Ctrl/Cmd + key combos
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyB') {
        e.preventDefault();
        this.justPressed['BoardShip'] = true;
      }
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyE') {
        e.preventDefault();
        this.justPressed['Explain'] = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  _setupMouse() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mousedown', (e) => {
      // Prevent browser from capturing drags for text selection or swipe navigation
      if (e.target.tagName.toLowerCase() === 'canvas') {
        e.preventDefault();
      }
      this.mouse.clicked = true;
      this.mouse.justClicked = true;
    });

    window.addEventListener('mouseup', (e) => {
      this.mouse.clicked = false;
    });
  }

  _setupTouch() {
    window.addEventListener('touchstart', (e) => {
      this.touches = Array.from(e.touches).map(t => ({
        x: t.clientX,
        y: t.clientY,
        id: t.identifier
      }));
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      this.touches = Array.from(e.touches).map(t => ({
        x: t.clientX,
        y: t.clientY,
        id: t.identifier
      }));
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      this.touches = Array.from(e.touches).map(t => ({
        x: t.clientX,
        y: t.clientY,
        id: t.identifier
      }));
    }, { passive: true });
  }

  /**
   * Set mobile button state (called by HUD touch buttons)
   */
  setDpad(direction, active) {
    this.dpad[direction] = active;
  }

  pressMobileButton(name) {
    this.mobileButtons[name] = true;
    this.justPressed[name === 'board' ? 'BoardShip' : name === 'explain' ? 'Explain' : 'Pause'] = true;
  }

  /**
   * Check if a direction is active (works for both keyboard and mobile)
   */
  isMovingUp() { return this.keys['ArrowUp'] || this.keys['KeyW'] || this.dpad.up; }
  isMovingDown() { return this.keys['ArrowDown'] || this.keys['KeyS'] || this.dpad.down; }
  isMovingLeft() { return this.keys['ArrowLeft'] || this.keys['KeyA'] || this.dpad.left; }
  isMovingRight() { return this.keys['ArrowRight'] || this.keys['KeyD'] || this.dpad.right; }

  /**
   * Check if a key was just pressed this frame
   */
  wasJustPressed(code) {
    return !!this.justPressed[code];
  }

  /**
   * Check if mouse was just clicked
   */
  wasMouseJustClicked() {
    return this.mouse.justClicked;
  }

  /**
   * Clear per-frame state — call at end of each update
   */
  clearFrame() {
    this.justPressed = {};
    this.mouse.justClicked = false;
    this.mobileButtons = { board: false, explain: false, pause: false };
  }

  destroy() {
    // Cleanup if needed
  }
}
