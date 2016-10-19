const Asteroid = require('./asteroid');
const Ship = require('./ship');
const Util = require('./util');

class Game {
  constructor() {
    this.asteroids = [];
    this.ships = [];

    this.add(new Asteroid({ game: this }));
    // this.addAsteroids();
  }

  add(object) {
    if (object instanceof Asteroid) {
      this.asteroids.push(object);
    } else if (object instanceof Ship) {
      this.ships.push(object);
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

  draw() {

  }

  clearRect() {

  }

  moveObjects() {

  }

  move() {

  }

  // addAsteroids() {
  //
  // }

  asteroidStartPosition() {
    return [Game.DIM_X, Game.DIM_Y * Math.random()];
  }

  shipStartPosition() {
    return [50, Game.DIM_Y / 2];
  }
}

Game.DIM_X = 900;
Game.DIM_Y = 400;
Game.MAX_ASTEROIDS = 3;
Game.FPS = 32;

module.exports = Game;
