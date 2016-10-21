const Asteroid = require('./asteroid');
const Background = require('./background');
const Ship = require('./ship');
const Util = require('./util');

class Game {
  constructor() {
    this.asteroids = [];
    this.points = 0;
    this.refreshAsteroids();
    this.playing = false;
  }

  displayPoints() {
    $jo('.points').text(this.points);
    $jo('.highscore').text(`Highscore: 0`);
    this.points += 5;
  }

  add(object) {
    if (object instanceof Asteroid) {
      this.asteroids.push(object);
    } else if (object instanceof Ship) {
      this.ship = object;
    } else if (object instanceof Background) {
      this.background = object;
    } else {
      throw "UFO!";
    }
  }

  refreshAsteroids() {
    this.add(new Asteroid({ game: this }));
    const asteroidInterval = window.setInterval(() => {
      if (this.playing) {
        this.add(new Asteroid({ game: this }));
        const losteroids = this.removeAsteroids();
        losteroids.forEach((asteroid) => {
          this.remove(asteroid);
        });
      }
    }, 750);
  }

  removeAsteroids() {
    const numAsteroids = this.asteroids.length;
    const losteroids = [];
    for (let i = 0; i < numAsteroids; i++) {
      if (this.checkOutOfBounds(this.asteroids[i])){
        losteroids.push(this.asteroids[i]);
      }
    }
    return losteroids;
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
      if (this.ship.isCrash(asteroids[i])) {
        return true;
      }
    }
    return false;
  }

  checkOutOfBounds(object) {
    const xPosition = object.pos[0];
    const yPosition = object.pos[1];
    if (object instanceof Ship) {
      return (yPosition < 0 || yPosition > 400);
    } else {
      return (xPosition < 0);
    }
  }

  checkCrash() {
    if (this.checkCollisions() || this.checkOutOfBounds(this.ship)) {
      this.renderLost();
    }
  }

  renderLost() {
    this.removeAll();
    const $gameModal = $jo('.game-modal');
    $gameModal.text('You Lose! Play Again?');
    const $modal = $jo('.sub-modal');
    $modal.removeClass('hidden');
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
    } else {
      throw "UFO!";
    }
  }

  removeAll() {
    this.asteroids = [];
    this.ship = undefined;
    this.background = undefined;
  }

  step(delta) {
    if (this.playing) {
      this.moveObjects();
      this.checkCrash();
      this.displayPoints();
    }
  }
}

Game.DIM_X = 900;
Game.DIM_Y = 400;

module.exports = Game;
