const Util = require("./util");
const MovableObject = require("./movable_object");

const DEFAULTS = {
  DIM: 75,
  VELOCITY: [0, 0],
  PATH: 'assets/sprites/powerup',
  RADIUS: 25,
  SPEED: 6
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
  }
}

module.exports = PowerUp;
