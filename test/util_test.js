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
});
