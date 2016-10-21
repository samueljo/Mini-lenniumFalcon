const MovingObject = require('./movable_object');

const BLASTER = {
  RADIUS: 5,
  X_DIM: 125,
  Y_DIM: 50,
  PATH: 'assets/sprites/blaster.png'
};

class Blaster extends MovingObject {
  constructor(options) {
    options.radius = BLASTER.RADIUS;
    options.path = BLASTER.PATH;
    options.xDim = BLASTER.X_DIM;
    options.yDim = BLASTER.Y_DIM;
    super(options);
  }
}

module.exports = Blaster;
