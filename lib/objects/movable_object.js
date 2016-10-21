const Util = require("../util/util");
const Sprite = require("../util/sprite");

const NORMALIZED_TIME_BETWEEN_FRAMES = 1000/60;

class MovableObject {
  constructor(options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.xDim = options.xDim;
    this.yDim = options.yDim;
    this.path = options.path;
    this.game = options.game;
    this.imgOffsetY = options.imgOffsetY;
  }

  draw(ctx) {
    const image = Sprite.createImage(this.path);
    const imgOffsetX = this.pos[0] - this.xDim / 2;
    const imgOffsetY = this.imgOffsetY || this.pos[1] - this.yDim / 2;

    ctx.drawImage(image, imgOffsetX, imgOffsetY, this.xDim, this.yDim);

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true);
    ctx.fill();
  }

  move() {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
  }

  remove() {
    this.game.remove(this);
  }
}

module.exports = MovableObject;
