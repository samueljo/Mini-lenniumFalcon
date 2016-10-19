const Util = require("./utils");
const MovableObject = require("./movable_object");
const Ship = require("./ship");

class SpaceDebris extends MovableObject {
  constructor(options) {
    
  }
}

= function (options) {
  MovingObject.call(this, options);
  this.vel = Util.randomVec(2);
  this.color = Asteroid.COLOR;
  this.radius = Asteroid.RADIUS;
};

Asteroid.RADIUS = 10;
Asteroid.COLOR = "#78281F";

Util.inherits(Asteroid, MovingObject);

Asteroid.prototype.collideWith = function (otherObject) {
  if (otherObject instanceof Ship) {
    otherObject.relocate();
  }
  //
  // if (this.isCollidedWith(otherObject)) {
  //   this.game.remove(otherObject);
  //   this.game.remove(this);
  // }
};

// window.Asteroid = Asteroid;

module.exports = Asteroid;
