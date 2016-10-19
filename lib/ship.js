const Util = require("./util");
const MovableObject = require("./movable_object");

const DEFAULTS = {
  RADIUS: 10,
  VELOCITY: [0, 3],
  COLOR: 'red'
};

class Ship extends MovableObject {
  constructor(options = {}) {
    options.radius = DEFAULTS.RADIUS;
    options.vel = options.vel || DEFAULTS.VELOCITY;
    options.color = options.color || DEFAULTS.COLOR;
    super(options);
  }

  isCrash(otherObject) {
    const distanceBetween = Util.distanceBetween(this, otherObject);
    const minDistanceBetween = this.radius + otherObject.radius;
    return (distanceBetween < minDistanceBetween);
  }

  accelerate(impulse) {
    this.vel += this.vel[1] + impulse;
  }
}

module.exports = Ship;
