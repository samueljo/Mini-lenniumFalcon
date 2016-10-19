const Asteroid = require('./asteroid');
const Ship = require('./ship');
const Util = require('./util');

class Game {
  constructor() {
    this.asteroids = [];
    this.ships = [];

    this.addAsteroids();
  }

  addAsteroids() {
    const asteroidInterval = window.setInterval(() => {
      this.add(new Asteroid({ game: this }));
    }, 1000);
  }

  add(object) {
    if (object instanceof Asteroid) {
      this.asteroids.push(object);
    } else if (object instanceof Ship) {
      this.ship = object;
    } else {
      throw "UFO!";
    }
  }

  addShip() {
    const ship = new Ship({
      pos: this.shipStartPosition(),
      game: this
    });
    this.add(ship);
    return ship;
  }

  allObjects() {
    return [].concat([this.ship], this.asteroids);
  }

  draw(ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.allObjects().forEach((object) => {
      object.draw(ctx);
    });
  }

  moveObjects(timeDelta) {
    this.allObjects().forEach((object) => {
      object.move(timeDelta);
    });
  }

  checkCollisions() {
    const asteroids = this.asteroids;
    for (let i = 0; i < asteroids.length; i++) {
      if (this.ship.isCrash(asteroids[i])) {
        console.log("crash");
        return true;
      }
    }
    return false;
  }

  checkOutOfBounds() {
    const shipPosition = this.ship.pos[1];
    return (shipPosition < 0 && shipPosition > 400);
  }

  checkCrash() {
    return (this.checkCollisions() && this.checkOutOfBounds());
  }

  asteroidStartPosition() {
    return [Game.DIM_X, Game.DIM_Y * Math.random()];
  }

  shipStartPosition() {
    return [225, Game.DIM_Y / 2];
  }

  remove(object) {
    if (object instanceof Asteroid) {
      this.asteroids.splice(this.asteroids.indexOf(object, 1));
    } else {
      throw "UFO!";
    }
  }

  step(delta) {
    this.moveObjects(delta);
    this.checkCrash();
  }
}

Game.DIM_X = 900;
Game.DIM_Y = 400;
Game.MAX_ASTEROIDS = 3;

module.exports = Game;
