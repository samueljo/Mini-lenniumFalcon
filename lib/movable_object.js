const Util = require('./util');
const Sprite = require("./sprite");

const NORMALIZED_TIME_BETWEEN_FRAMES = 1000/60;

class MovableObject {
  constructor(options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.dim = options.dim;
    this.path = options.path;
    this.game = options.game;
  }

  draw(ctx) {
    const image = Sprite.createImage(this.path);
    const imgOffsetX = this.pos[0] - this.dim / 2;
    const imgOffsetY = this.pos[1] - this.dim / 2;

    ctx.drawImage(image, imgOffsetX, imgOffsetY, this.dim, this.dim);
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
