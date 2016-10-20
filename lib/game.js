const Asteroid = require('./asteroid');
// const AsteroidWall = require('./asteroid_wall');
const Ship = require('./ship');
const Background = require('./background');
const Util = require('./util');

class Game {
  constructor() {
    this.asteroids = [];
    this.addAsteroids();
    // this.addAsteroidWall();
    this.points = 0;
  }

  displayPoints() {
    $jo('.points').text(this.points);
    $jo('.highscore').text(`Highscore: 0`);
    this.points += 1;
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

  addAsteroids() {
    this.add(new Asteroid({ game: this }));
    const asteroidInterval = window.setInterval(() => {
      this.add(new Asteroid({ game: this }));
    }, 750);
  }

  // addAsteroidWall() {
  //   const wall = AsteroidWall.createWall(this);
  //   for (let i = 0; i < wall.length; i++) {
  //     this.add(wall[i]);
  //   }
  // }

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
    return (shipPosition < -55 || shipPosition > 325);
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
    return [225, Game.DIM_Y / 3];
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
