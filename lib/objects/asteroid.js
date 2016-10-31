const MovableObject = require("./movable_object");

const DEFAULTS = {
  DIM: 100,
  VELOCITY: [0, 0],
  RADIUS: 40,
  MIN_SPEED: 1,
  MAX_SPEED: 6
};

class Asteroid extends MovableObject {
  constructor(options = {}) {
    const randAsteroid = Math.floor(Math.random() * 4);
    const randomXVector = -(Math.random() + DEFAULTS.MIN_SPEED) * DEFAULTS.MAX_SPEED;
    options.pos = options.pos || options.game.asteroidStartPosition();
    options.radius = DEFAULTS.RADIUS;
    options.xDim = DEFAULTS.DIM;
    options.yDim = DEFAULTS.DIM;
    options.path = `asteroid${randAsteroid}`;
    options.vel = options.vel || [randomXVector, 0];
    super(options);
  }

  static increaseSpeed(points) {
    if (DEFAULTS.MIN_SPEED < 3 && points % 10000 === 0) {
      DEFAULTS.MIN_SPEED += 0.5;
    }
  }

  static resetSpeed() {
    DEFAULTS.MIN_SPEED = 1;
  }
}

module.exports = Asteroid;
