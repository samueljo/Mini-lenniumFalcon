const Asteroid = require('./asteroid');
const Ship = require('./ship');
const Util = require('./util');

class Game {
  constructor() {
    this.asteroids = [];
    this.addAsteroids();
    this.points = 0;
  }

  displayPoints() {
    $jo('.points').text(this.points);
    $jo('.highscore').text(`Highscore: 0`);
    this.points += 1;
  }

  addAsteroids() {
    this.add(new Asteroid({ game: this }));
    const asteroidInterval = window.setInterval(() => {
      this.add(new Asteroid({ game: this }));
    }, 750);
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
        return true;
      }
    }
    return false;
  }

  checkOutOfBounds() {
    const shipPosition = this.ship.pos[1];
    return (shipPosition < 0 || shipPosition > 400);
  }

  checkCrash() {
    if (this.checkCollisions() || this.checkOutOfBounds()) {
      alert('Oh no! You crashed!');
      this.remove(this.ship);
    }
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
    this.displayPoints();
  }
}

Game.DIM_X = 900;
Game.DIM_Y = 400;

module.exports = Game;
