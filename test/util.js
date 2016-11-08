const Util = require('../lib/util/util');

describe('Util', function() {
  describe('#distanceBetween(objectA, objectB)', function() {
    const objectA = { pos: [0, 0] };
    const objectB = { pos: [0, 3] };
    const objectC = { pos: [0, 0] };

    it('should return the distance between two untouching objects', function() {
      Util.distanceBetween(objectA, objectB).should.equal(3);
    });
    it('should return the distance between two untouching objects', function() {
      Util.distanceBetween(objectA, objectC).should.equal(0);
    });
  });
});
