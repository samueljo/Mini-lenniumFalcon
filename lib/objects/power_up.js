const Util = require("../util/util");
const MovableObject = require("./movable_object");

const DEFAULTS = {
  DIM: 50,
  PATH: 'assets/sprites/powerup',
  RADIUS: 20,
  SPEED: -6
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
    this.powerUpNum = randPowerUp;
  }

  applyPowerUp(game) {
    if (this.powerUpNum === 0) {
      game.ship.blasters++;
    } else {
      game.asteroids = [];
    }
  }
}

module.exports = PowerUp;
