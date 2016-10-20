const Util = require("./util");
const MovableObject = require("./movable_object");


const DEFAULTS = {
  DIM: 100,
  VELOCITY: [0, 0],
  TERMINAL_VEL: 3,
  PATH: 'assets/sprites/asteroid',
  RADIUS: 35,
  MAX_SPEED: 4
};

class Asteroid extends MovableObject {
  constructor(options = {}) {
    const randAsteroid = Math.floor(Math.random() * (4));
    options.pos = options.pos || options.game.asteroidStartPosition();
    options.radius = DEFAULTS.RADIUS;
    options.dim = DEFAULTS.DIM;
    options.path = DEFAULTS.PATH + `${randAsteroid}.png`;
    options.vel = options.vel || Util.randomVector(DEFAULTS.MAX_SPEED);
    super(options);
  }
}

module.exports = Asteroid;
