const Asteroid = require('./asteroid');
const Background = require('./background');
const Ship = require('./ship');
const Util = require('./util');
const Blaster = require('./blaster');
const PowerUp = require('./power_up');

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

  createAsteroidInterval() {
    this.asteroidInterval = window.setInterval(() => {
      if (this.playing) {
        this.add(new Asteroid({ game: this }));
        const oldObjects = this.removeObjects();
        oldObjects.forEach((object) => {
          this.remove(object);
        });
      }
    }, 750);
  }

  createPowerUpInterval() {
    this.powerUpInterval = window.setInterval(() => {
      if (this.playing) {
        this.add(new PowerUp({ game: this }));
        const oldObjects = this.removeObjects();
        oldObjects.forEach((object) => {
          this.remove(object);
        });
      }
    }, 10000);
  }

  refreshObjects() {
    this.add(new Asteroid({ game: this }));
    this.createAsteroidInterval();
    this.createPowerUpInterval();
  }

  removeObjects() {
    const oldObjects = [];
    for (let i = 0; i < this.asteroids.length; i++) {
      if (this.checkOutOfBounds(this.asteroids[i])){
        oldObjects.push(this.asteroids[i]);
      }
    }
    for (let i = 0; i < this.blasters.length; i++) {
      if (this.checkOutOfBounds(this.blasters[i])){
        oldObjects.push(this.blasters[i]);
      }
    }
    for (let i = 0; i < this.powerUps.length; i++) {
      if (this.checkOutOfBounds(this.powerUps[i])){
        oldObjects.push(this.powerUps[i]);
      }
    }
    return oldObjects;
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
    this.checkBlasterHit();
    return false;
  }

  checkBlasterHit() {
    for (let i = 0; i < this.blasters.length; i++) {
      for (let j = 0; j < this.asteroids.length; j++) {
        if (Util.isCrash(this.blasters[i], this.asteroids[j])) {
          this.remove(this.asteroids[j]);
        }
      }
    }
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
