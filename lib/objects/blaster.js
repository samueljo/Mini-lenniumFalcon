const MovingObject = require('./movable_object');
const Sprite = require("../util/sprite");

const BLASTER = {
  RADIUS: 5,
  X_DIM: 200,
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
    this.image = Sprite.createImage(options.path);
  }

  draw(ctx) {
    const imgOffsetX = this.pos[0] - this.xDim / 2;
    const imgOffsetY = this.imgOffsetY || this.pos[1] - this.yDim / 2;

    ctx.drawImage(this.image, imgOffsetX, imgOffsetY, this.xDim, this.yDim);
  }
}

module.exports = Blaster;
