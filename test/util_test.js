const Util = require('../lib/util/util');
const assert = require('assert');

describe('Util', function() {
  describe('#distanceBetween(objectA, objectB)', function() {
    const objectA = { pos: [0, 0] };
    const objectB = { pos: [0, 3] };
    const objectC = { pos: [0, 0] };

    it('should return the distance between two untouching objects', function() {
      assert.equal(Util.distanceBetween(objectA, objectB), 3);
    });
    it('should return the distance between two touching objects', function() {
      assert.equal(Util.distanceBetween(objectA, objectC), 0);
    });
  });

  describe('#isCrash(objectA, objectB)', function() {
    const objectA = { pos: [0, 0], radius: 1 };
    const objectB = { pos: [0, 3], radius: 1 };
    const objectC = { pos: [0, 0], radius: 1 };

    it('should return false if objects are not touching', function() {
      assert.equal(Util.isCrash(objectA, objectB), false);
    });
    it('should return true if objects are touching', function() {
      assert.equal(Util.isCrash(objectA, objectC), true);
    });
  });
});
