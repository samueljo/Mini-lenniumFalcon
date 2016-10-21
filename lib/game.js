const Asteroid = require('./objects/asteroid');
const Ship = require('./objects/ship');
const Blaster = require('./objects/blaster');
const PowerUp = require('./objects/power_up');
const Background = require('./util/background');
const Util = require('./util/util');

class Game {
  constructor() {
    this.asteroids = [];
    this.blasters = [];
    this.powerUps = [];
    this.points = 0;
    this.refreshObjects();
    this.playing = false;
    this.lost = false;
  }

  add(object) {
    if (object instanceof Asteroid) {
      this.asteroids.push(object);
    } else if (object instanceof Ship) {
      this.ship = object;
    } else if (object instanceof Background) {
      this.background = object;
    } else if (object instanceof Blaster) {
      this.blasters.push(object);
    } else if (object instanceof PowerUp) {
      console.log('powerup');
      this.powerUps.push(object);
    } else {
      throw "UFO!";
    }
  }

  refreshObjects() {
    this.add(new Asteroid({ game: this }));
    this.asteroidInterval = Util.createAsteroidInterval(this);
    this.powerUpInterval = Util.createPowerUpInterval(this);
    console.log(this.asteroidInterval, this.powerUpInterval);
  }

  addShip() {
    const ship = new Ship({
      pos: this.shipStartPosition(),
      game: this
    });
    this.add(ship);
    return ship;
  }

  addBackground() {
    const background = new Background();
    this.add(background);
  }

  allObjects() {
    return [].concat(
      [this.background],
      [this.ship],
      this.powerUps,
      this.blasters,
      this.asteroids
    );
  }

  draw(ctx) {
    if (this.playing) {
      ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
      this.allObjects().forEach((object) => {
        object.draw(ctx);
      });
    }
  }

  moveObjects() {
    this.allObjects().forEach((object) => {
      object.move();
    });
  }

  checkCollisions() {
    const asteroids = this.asteroids;
    for (let i = 0; i < asteroids.length; i++) {
      if (Util.isCrash(this.ship, asteroids[i])) {
        return true;
      }
    }
    Util.checkBlasterHit(this);
    Util.checkPowerUp(this);
    return false;
  }

  checkOutOfBounds(object) {
    const xPosition = object.pos[0];
    const yPosition = object.pos[1];
    if (object instanceof Ship) {
      return (yPosition < 0 || yPosition > 400);
    } else if (object instanceof Asteroid || object instanceof PowerUp) {
      return (xPosition < 0);
    } else if (object instanceof Blaster) {
      return (xPosition > 900);
    }
  }

  checkCrash() {
    if (this.checkCollisions() || this.checkOutOfBounds(this.ship)) {
      this.lost = true;
      console.log(this.asteroidInterval, this.powerUpInterval);
      window.clearInterval(this.asteroidInterval);
      window.clearInterval(this.powerUpInterval);
      window.clearInterval(this.ship.gravityInterval);
      window.clearInterval(this.ship.accelerateInterval);
      this.renderLost();
    }
  }

  renderLost() {
    this.removeAll();
    const $gameModal = $jo('.game-modal');
    $gameModal.removeClass('hidden');
    $gameModal.text('You Lose! Play Again?');
    this.playing = false;
  }

  asteroidStartPosition() {
    return [Game.DIM_X, Game.DIM_Y * Math.random()];
  }

  shipStartPosition() {
    return [225, Game.DIM_Y / 3];
  }

  remove(object) {
    if (object instanceof Asteroid) {
      this.asteroids.splice(this.asteroids.indexOf(object), 1);
    } else if (object instanceof Ship) {
      this.ship = undefined;
    } else if (object instanceof Blaster) {
      this.blasters.splice(this.blasters.indexOf(object), 1);
    } else if (object instanceof PowerUp) {
      this.powerUps.splice(this.powerUps.indexOf(object), 1);
    } else {
      throw "UFO!";
    }
  }

  removeAll() {
    this.asteroids = [];
    this.blasters = [];
    this.powerUps = [];
    this.ship = undefined;
    this.background = undefined;
  }

  step(delta) {
    if (this.playing) {
      this.moveObjects();
      this.checkCrash();
    }
  }
}

Game.DIM_X = 900;
Game.DIM_Y = 400;

module.exports = Game;
