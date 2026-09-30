/**
 * Mantra — Space Exploration & Learning Game
 * Main application entry point.
 */

import './styles/index.css';
import { GameEngine } from './game/engine.js';
import { InputManager } from './game/input.js';
import { HeroScene } from './scenes/hero.js';
import { InstructionsScene } from './scenes/instructions.js';
import { SpaceScene } from './scenes/space.js';
import { PlanetSurfaceScene } from './scenes/planet-surface.js';
import { InfoPanelScene } from './scenes/info-panel.js';
import { GameOverScene } from './scenes/game-over.js';

class MantraApp {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.engine = new GameEngine(this.canvas);
    this.input = new InputManager();
    this.spaceScene = null;
    this.currentPlanetData = null;

    this._init();
  }

  _init() {
    // Start with hero scene
    this._showHero();
    this.engine.start();
  }

  _showHero() {
    const hero = new HeroScene(() => {
      this._showInstructions();
    });
    this.engine.setScene(hero);
  }

  _showInstructions() {
    const instructions = new InstructionsScene(() => {
      this._startGame();
    });
    this.engine.setScene(instructions);
  }

  _startGame() {
    this.spaceScene = new SpaceScene(
      this.input,
      // On land on planet
      (planetData) => {
        this.currentPlanetData = planetData;
        this._showPlanetSurface(planetData);
      },
      // On game over
      (score) => {
        this._showGameOver(score);
      },
      // On show info (in space, near planet)
      (planetData) => {
        this._showInfoPanel(planetData);
      }
    );
    this.engine.setScene(this.spaceScene);
  }

  _showPlanetSurface(planetData) {
    const surface = new PlanetSurfaceScene(
      this.input,
      planetData,
      // On board ship (return to space)
      () => {
        this.engine.setScene(this.spaceScene);
      },
      // On explain (show info)
      (data) => {
        this._showInfoPanel(data);
      }
    );
    this.engine.setScene(surface);
  }

  _showInfoPanel(planetData) {
    // Save current scene to restore after closing info
    const previousScene = this.engine.currentScene;

    const infoPanel = new InfoPanelScene(
      planetData,
      // On close
      () => {
        this.engine.setScene(previousScene);
      }
    );
    this.engine.setScene(infoPanel);
  }

  _showGameOver(score) {
    const gameOver = new GameOverScene(
      score,
      // On restart
      () => {
        if (this.spaceScene) {
          this.spaceScene.restoreAll();
        }
        this._startGame();
      }
    );
    this.engine.setScene(gameOver);
  }
}

// Boot the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new MantraApp();
});
