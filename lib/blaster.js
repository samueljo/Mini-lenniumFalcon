const MovingObject = require('./movable_object');

const BLASTER = {
  RADIUS: 2,
  LENGTH: 10,
  SPEED: 4,
  PATH: 'assets/sprites/blaster.png'
};

class Blaster extends MovingObject {
  constructor(options) {
    options.radius = BLASTER.RADIUS;
    options.path = BLASTER.PATH;
    options.xDim = BLASTER.LENGTH;
    options.yDim = BLASTER.RADIUS;
    super(options);
  }
}

module.exports = Blaster;
