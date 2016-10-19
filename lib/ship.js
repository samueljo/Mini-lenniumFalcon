const Util = require("./util");
const MovableObject = require("./movable_object");

const DEFAULTS = {
  RADIUS: 10,
};

class Ship extends MovableObject {
  constructor(options = {}) {
    options.radius = DEFAULTS.RADIUS;
    options.vel = options.vel || [0, 0];
    options.color = options.color || 'red';
    super(options);
  }
}

module.exports = Ship;
