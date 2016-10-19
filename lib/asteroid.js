const Util = require("./utils");
const MovableObject = require("./movable_object");
const Ship = require("./ship");

const DEFAULTS = {
  COLOR: '#505050',
  RADIUS: 25,
  MAX_SPEED: 4
};

class Asteroid extends MovableObject {
  constructor(options={}) {
    options.color = DEFAULTS.COLOR;
    options.pos = options.pos || options.game.startPosition();
    options.radius = DEFAULTS.RADIUS;
    options.vel = options.vel || Util.randomVector(DEFAULTS.MAX_SPEED);
    super(options);
  }
}

module.exports = Asteroid;
