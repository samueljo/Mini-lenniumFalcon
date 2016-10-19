const Util = require('./util');

const NORMALIZED_TIME_BETWEEN_FRAMES = 1000/60;

class MovableObject {
  constructor(options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.color = options.color;
    this.game = options.game;
    this.isShip = false;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
    );
    ctx.fill();
  }

  isCrash(otherObject) {
    const deltaX = Math.pow(this.pos[0] - otherObject.pos[0], 2);
    const deltaY = Math.pow(this.pos[1] - otherObject.pos[1], 2);
    const distanceBetween = Math.sqrt(deltaX + deltaY);
    const minDistanceBetween = this.radius + otherObject.radius;
    return (distanceBetween < minDistanceBetween);
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
