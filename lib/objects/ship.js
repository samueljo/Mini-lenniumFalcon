const Util = require("../util/util");
const Blaster = require ('./blaster');
const MovableObject = require('./movable_object');

const DEFAULTS = {
  DIM: 100,
  RADIUS: 28,
  VELOCITY: [0, 0],
  TERMINAL_VEL: 6,
  ACCEL_RATE: -.5,
  BLASTER_VEL: [10, 0]
};

class Ship extends MovableObject {
  constructor(options = {}) {
    options.xDim = DEFAULTS.DIM;
    options.yDim = DEFAULTS.DIM;
    options.radius = DEFAULTS.RADIUS;
    options.vel = options.vel || DEFAULTS.VELOCITY;
    const falcNum = Util.calcFalcNum(options.vel[1]);
    options.path = `falcon${falcNum}`;
    super(options);
    this.blaster = new Audio('./assets/sounds/blaster.mp3');
    this.strongpower = new Audio('./assets/sounds/strongpower.mp3');
    this.accel = false;
    this.rot = 0;
    this.blasters = 1;
    this.gravityInterval = window.setInterval(this.gravity.bind(this), 50);
    this.accelerateInterval = window.setInterval(this.accelerate.bind(this));
  }

  accelerate() {
    if (this.accel && this.vel[1] > -DEFAULTS.TERMINAL_VEL) {
      this.vel[1] += DEFAULTS.ACCEL_RATE;
      const falcNum = Util.calcFalcNum(this.vel[1]);
      this.path = `falcon${falcNum}`;
    }
  }

  gravity() {
    if (this.vel[1] < DEFAULTS.TERMINAL_VEL) {
      this.vel[1] += 2;
      const falcNum = Util.calcFalcNum(this.vel[1]);
      this.path = `falcon${falcNum}`;
    }
  }

  shoot() {
    if (this.blasters > 0) {
      this.blasters--;
      this.blaster.play();
      const blaster = new Blaster({
        pos: this.pos.slice(),
        vel: DEFAULTS.BLASTER_VEL,
        game: this.game
      });

      this.game.add(blaster);
      return;
    } else {
      return;
    }
  }

  static increaseSpeed(points) {
    if (DEFAULTS.ACCEL_RATE > -1.5 && points % 10000 === 0) {
      DEFAULTS.ACCEL_RATE -= 0.25;
    }
  }

  static resetSpeed() {
    DEFAULTS.ACCEL_RATE = -0.5;
  }
}

module.exports = Ship;
