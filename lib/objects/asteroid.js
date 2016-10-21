const Util = require("../util/util");
const MovableObject = require("./movable_object");

const DEFAULTS = {
  DIM: 100,
  VELOCITY: [0, 0],
  PATH: 'assets/sprites/asteroid',
  RADIUS: 40,
  MAX_SPEED: 6
};

class Asteroid extends MovableObject {
  constructor(options = {}) {
    const randAsteroid = Math.floor(Math.random() * 4);
    options.pos = options.pos || options.game.asteroidStartPosition();
    options.radius = DEFAULTS.RADIUS;
    options.xDim = DEFAULTS.DIM;
    options.yDim = DEFAULTS.DIM;
    options.path = DEFAULTS.PATH + `${randAsteroid}.png`;
    options.vel = options.vel || Util.randomVector(DEFAULTS.MAX_SPEED);
    super(options);
  }
}

module.exports = Asteroid;
