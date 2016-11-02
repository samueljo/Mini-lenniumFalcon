const Asteroid = require('../objects/asteroid');
const PowerUp = require('../objects/power_up');
const Sprite = require('./sprite');
const $jo = require('./../../joQuery/lib/main');

const Util = {
  distanceBetween(objectA, objectB) {
    const deltaX = Math.pow(objectA.pos[0] - objectB.pos[0], 2);
    const deltaY = Math.pow(objectA.pos[1] - objectB.pos[1], 2);
    return Math.sqrt(deltaX + deltaY);
  },

  isCrash(objectA, objectB) {
    if (objectA && objectB) {
      const distanceBetween = this.distanceBetween(objectA, objectB);
      const minDistanceBetween = objectA.radius + objectB.radius;
      return (distanceBetween < minDistanceBetween);
    } else {
      return false;
    }
  },

  checkBlasterHit(game) {
    for (let i = 0; i < game.blasters.length; i++) {
      for (let j = 0; j < game.asteroids.length; j++) {
        if (this.isCrash(game.blasters[i], game.asteroids[j])) {
          game.explosion.play();
          game.remove(game.blasters[i]);
          game.asteroids[j].path = 'explosion';
          window.setTimeout(() => {
            game.remove(game.asteroids[j]);
          }, 40);
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
  },

  oldObjects(game, objects) {
    const oldObjects = [];
    for (let i = 0; i < objects.length; i++) {
      if (game.checkOutOfBounds(objects[i])){
        oldObjects.push(objects[i]);
      }
    }
    return oldObjects;
  },

  createPowerUpInterval(game, loader) {
    return window.setInterval(() => {
      if (game.playing) {
        let playHan = Math.round(Math.random());
        if (playHan) {
          let hanNum = Math.floor(Math.random() * 6);
          game.hanSounds[hanNum].play();
        }
        game.add(new PowerUp({ game: game, loader: loader }));
        const oldObjects = this.oldObjects(game, game.powerUps);
        oldObjects.forEach((object) => {
          game.remove(object);
        });
      }
    }, 10000);
  },

  createAsteroidInterval(game, loader) {
    return window.setInterval(() => {
      if (game.playing) {
        game.add(new Asteroid({ game: game, loader: loader }));
        const asteroidsAndBlasters = [].concat(game.asteroids, game.blasters);
        const oldObjects = this.oldObjects(game, asteroidsAndBlasters);
        oldObjects.forEach((object) => {
          game.remove(object);
        });
      }
    }, 750);
  },

  renderSound(isMuted) {
    if (isMuted) {
      $jo('.sound').addClass('muted');
    } else {
      $jo('.sound').removeClass('muted');
    }
  }
};

module.exports = Util;
