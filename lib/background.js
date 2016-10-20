const Util = require("./util");

const DEFAULTS = {
  POS_X: 0,
  POS_Y: 0,
  WIDTH: 1900,
  HEIGHT: 400,
  PATH: 'assets/space.png',
  SPEED: -1
};

class Background {
  constructor() {
    this.posX = DEFAULTS.POS_X;
    this.posY = DEFAULTS.POS_Y;
    this.width = DEFAULTS.WIDTH;
    this.height = DEFAULTS.HEIGHT;
    this.speed = DEFAULTS.SPEED;
    this.path = DEFAULTS.PATH;
  }

  draw(ctx) {
    if (this.posX < -1000) {
      this.posX = 0;
    }
    const image = new Image();
    image.src = this.path;
    ctx.drawImage(image, this.posX, this.posY, this.width, this.height);
    this.move();
  }

  move() {
    this.posX += this.speed;
  }
}

module.exports = Background;
