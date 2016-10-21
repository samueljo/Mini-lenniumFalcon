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

  isCrash(objectA, objectB) {
    const distanceBetween = this.distanceBetween(objectA, objectB);
    const minDistanceBetween = objectA.radius + objectB.radius;
    return (distanceBetween < minDistanceBetween);
  },

  checkBlasterHit(game) {
    for (let i = 0; i < game.blasters.length; i++) {
      for (let j = 0; j < game.asteroids.length; j++) {
        if (this.isCrash(game.blasters[i], game.asteroids[j])) {
          game.remove(game.asteroids[j]);
        }
      }
    }
  },

  checkPowerUp(game) {
    for (let i = 0; i < game.powerUps.length; i++) {
      if (this.isCrash(game.ship, game.powerUps[i])) {
        game.powerUps[i].applyPowerUp(game);
        game.remove(game.powerUps[i]);
      }
    }
  },

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
