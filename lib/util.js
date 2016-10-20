const Util = {
  distanceBetween(objectA, objectB) {
    const deltaX = Math.pow(objectA.pos[0] - objectB.pos[0], 2);
    const deltaY = Math.pow(objectA.pos[1] - objectB.pos[1], 2);
    return Math.sqrt(deltaX + deltaY);
  },

  randomVector(length) {
    const xVector = -(Math.random() + 1) * length;

    return [xVector, 0];
  },

  // randomPos(xDim, yDim) {
  //   return [
  //     xDim * Math.random(),
  //     yDim * Math.random()
  //   ];
  // }

  calcFalcNum(vel) {
    if (vel <= 0 && vel > -2.5) {
      return 3;
    } else if (vel <= -2.5) {
      return 4;
    } else if (vel > 2.5) {
      return 0;
    } else {
      return 1;
    }
  }
};

module.exports = Util;
