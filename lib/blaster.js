const MovingObject = require('./movable_object');

const BLASTER = {
  RADIUS: 2,
  SPEED: 4,
  PATH: 'assets/sprites/falcon'
};

class Blaster extends MovingObject {
  constructor(options) {
    options.radius = BLASTER.RADIUS;
    super(options);
  }
}

module.exports = Blaster;
