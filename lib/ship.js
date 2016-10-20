const Util = require("./util");
const MovableObject = require("./movable_object");

const DEFAULTS = {
  DIM: 125,
  RADIUS: 20,
  VELOCITY: [0, 0],
  TERMINAL_VEL: 6,
  PATH: 'assets/sprites/falcon',
  ACCEL_RATE: -.5
};

class Ship extends MovableObject {
  constructor(options = {}) {
    options.dim = DEFAULTS.DIM;
    options.radius = DEFAULTS.RADIUS;
    options.vel = options.vel || DEFAULTS.VELOCITY;
    const falcNum = Util.calcFalcNum(options.vel[1]);
    options.path = DEFAULTS.PATH + `${falcNum}.png`;
    super(options);
    this.accel = false;
    this.rot = 0;
    window.setInterval(this.gravity.bind(this), 50);
    window.setInterval(this.accelerate.bind(this));
  }

  accelerate() {
    if (this.accel && this.vel[1] > -DEFAULTS.TERMINAL_VEL) {
      this.vel[1] += DEFAULTS.ACCEL_RATE;
      const falcNum = Util.calcFalcNum(this.vel[1]);
      this.path = DEFAULTS.PATH + `${falcNum}.png`;
    }
  }

  gravity() {
    if (this.vel[1] < DEFAULTS.TERMINAL_VEL) {
      this.vel[1] += 1.5;
      const falcNum = Util.calcFalcNum(this.vel[1]);
      this.path = DEFAULTS.PATH + `${falcNum}.png`;
    }
  }

  isCrash(otherObject) {
    const distanceBetween = Util.distanceBetween(this, otherObject);
    const minDistanceBetween = this.radius + otherObject.radius;
    return (distanceBetween < minDistanceBetween);
  }
}

module.exports = Ship;
