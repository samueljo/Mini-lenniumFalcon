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
    ctx.drawImage(image, this.pos[0], this.pos[1], this.dim, this.dim);
  }

  move(timeBetween) {
    const timeElapsed = timeBetween / NORMALIZED_TIME_BETWEEN_FRAMES;
    const xDelta = this.vel[0] * timeElapsed;
    const yDelta = this.vel[1] * timeElapsed;

    this.pos = [this.pos[0] + xDelta, this.pos[1] + yDelta];
  }

  remove() {
    this.game.remove(this);
  }
}

module.exports = MovableObject;
