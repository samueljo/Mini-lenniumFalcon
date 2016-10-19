const Util = require("./util");
const MovableObject = require("./movable_object");

const DEFAULTS = {
  RADIUS: 10,
  VELOCITY: [0, 0],
  COLOR: 'red',
  TERMINAL_VEL: 3
};

class Ship extends MovableObject {
  constructor(options = {}) {
    options.radius = DEFAULTS.RADIUS;
    options.vel = options.vel || DEFAULTS.VELOCITY;
    options.color = options.color || DEFAULTS.COLOR;
    super(options);
    window.setInterval(this.gravity.bind(this), 75);
  }

  accelerate(impulse) {
    if (this.vel[1] > -DEFAULTS.TERMINAL_VEL) {
      this.vel[1] += impulse;
    }
  }

  gravity() {
    if (this.vel[1] < DEFAULTS.TERMINAL_VEL) {
      this.vel[1] += .5;
    }
  }

  isCrash(otherObject) {
    const distanceBetween = Util.distanceBetween(this, otherObject);
    const minDistanceBetween = this.radius + otherObject.radius;
    return (distanceBetween < minDistanceBetween);
  }
}

module.exports = Ship;
