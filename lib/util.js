const Util = {
  inherits (child, parent) {
    const Surrogate = function () {};
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate ();
    child.prototype.constructor = child;
  },

  distanceBetween (objectA, objectB) {
    const deltaX = Math.pow(objectA[0] - objectB.pos[0], 2);
    const deltaY = Math.pow(objectA[1] - objectB.pos[1], 2);
    return Math.sqrt(deltaX + deltaY);
  },

  randomVector (length) {
    const xVector = -(Math.random() + 1) * length;

    return [xVector, 0];
  }
};

module.exports = Util;
