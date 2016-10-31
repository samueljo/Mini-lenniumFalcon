const MovableObject = require("./movable_object");

const DEFAULTS = {
  DIM: 50,
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
    options.path = `powerup${randPowerUp}`;
    options.vel = [DEFAULTS.SPEED, 0];
    super(options);
    this.powerUpNum = randPowerUp;
  }

  applyPowerUp(game) {
    if (this.powerUpNum === 0) {
      game.ship.blasters += 3;
    } else {
      game.ship.strongpower.play();
      for (let i = 0; i < game.asteroids.length; i++) {
        game.asteroids[i].path = 'explosion';
      }
      window.setTimeout(() => {
        game.asteroids = [];
      }, 100);
    }
  }
}

module.exports = PowerUp;
