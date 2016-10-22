const MovableObject = require("./movable_object");

const DEFAULTS = {
  DIM: 50,
  PATH: 'assets/sprites/powerup',
  RADIUS: 20,
  SPEED: -10
};

class PowerUp extends MovableObject {
  constructor(options = {}) {
    const randPowerUp = Math.floor(Math.random() * 2);
    options.pos = options.pos || options.game.asteroidStartPosition();
    options.radius = DEFAULTS.RADIUS;
    options.xDim = DEFAULTS.DIM;
    options.yDim = DEFAULTS.DIM;
    options.path = DEFAULTS.PATH + `${randPowerUp}.png`;
    options.vel = [DEFAULTS.SPEED, 0];
    super(options);
    this.strongpower = new Audio('./assets/sounds/strongpower.mp3');
    this.powerUpNum = randPowerUp;
  }

  applyPowerUp(game) {
    if (this.powerUpNum === 0) {
      game.ship.blasters++;
    } else {
      this.strongpower.play();
      for (let i = 0; i < game.asteroids.length; i++) {
        game.asteroids[i].path = 'assets/sprites/explosion.png';
        window.setTimeout(() => {
          game.remove(game.asteroids[i]);
        }, 40);
      }
    }
  }
}

module.exports = PowerUp;
