const Util = require("./util");
const MovableObject = require("./movable_object");

const DEFAULTS = {
  COLOR: '#505050',
  RADIUS: 25,
  MAX_SPEED: 4
};

class Asteroid extends MovableObject {
  constructor(options = {}) {
    options.color = DEFAULTS.COLOR;
    options.pos = options.pos || options.game.asteroidStartPosition();
    options.radius = DEFAULTS.RADIUS;
    options.vel = options.vel || Util.randomVector(DEFAULTS.MAX_SPEED);
    super(options);
  }
}

module.exports = Asteroid;
