const MovableObject = require('../lib/objects/movable_object');
const assert = require('assert');

describe('MovableObject', function() {
  describe('#move()', function() {
    const options = {
      pos: [0, 0],
      vel: [Math.random(3), Math.random(3)]
    };
    const object = new MovableObject(options);

    it('should move object by correct distance', function() {
      const initXPos = object.pos[0];
      const initYPos = object.pos[1];
      object.move();
      assert.equal(object.pos[0], initXPos + object.vel[0]);
      assert.equal(object.pos[1], initYPos + object.vel[1]);
    });
  });
});
