const Util = require("./util");
const MovableObject = require("./movable_object");

const DEFAULTS = {
  DIM: 125,
  RADIUS: 30,
  VELOCITY: [0, 0],
  TERMINAL_VEL: 3,
  PATH: 'assets/sprites/falcon.png',
};

class Ship extends MovableObject {
  constructor(options = {}) {
    options.path = DEFAULTS.PATH;
    options.dim = DEFAULTS.DIM;
    options.radius = DEFAULTS.RADIUS;
    options.vel = options.vel || DEFAULTS.VELOCITY;
    super(options);
    window.setInterval(this.gravity.bind(this), 50);
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
