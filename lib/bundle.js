/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const GameView = __webpack_require__(8);
	
	document.addEventListener('DOMContentLoaded', function() {
	  const canvas = document.getElementsByTagName('canvas')[0];
	  canvas.width = Game.DIM_X;
	  canvas.height = Game.DIM_Y;
	
	  const ctx = canvas.getContext('2d');
	  const gameView = new GameView(ctx);
	
	  gameView.load();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__(2);
	const Background = __webpack_require__(6);
	const Ship = __webpack_require__(7);
	const Util = __webpack_require__(3);
	const Blaster = __webpack_require__(9);
	
	class Game {
	  constructor() {
	    this.asteroids = [];
	    this.blasters = [];
	    this.points = 0;
	    this.refreshAsteroids();
	    this.playing = false;
	    this.lost = false;
	  }
	
	  add(object) {
	    if (object instanceof Asteroid) {
	      this.asteroids.push(object);
	    } else if (object instanceof Ship) {
	      this.ship = object;
	    } else if (object instanceof Background) {
	      this.background = object;
	    } else if (object instanceof Blaster) {
	      this.blasters.push(object);
	    } else {
	      throw "UFO!";
	    }
	  }
	
	  refreshAsteroids() {
	    this.add(new Asteroid({ game: this }));
	    const asteroidInterval = window.setInterval(() => {
	      if (this.playing) {
	        this.add(new Asteroid({ game: this }));
	        const oldObjects = this.removeAsteroidsAndBlasters();
	        oldObjects.forEach((asteroid) => {
	          this.remove(asteroid);
	        });
	      }
	    }, 750);
	  }
	
	  removeAsteroidsAndBlasters() {
	    const oldObjects = [];
	    for (let i = 0; i < this.asteroids.length; i++) {
	      if (this.checkOutOfBounds(this.asteroids[i])){
	        oldObjects.push(this.asteroids[i]);
	      }
	    }
	    for (let i = 0; i < this.blasters.length; i++) {
	      if (this.checkOutOfBounds(this.blasters[i])){
	        oldObjects.push(this.blasters[i]);
	      }
	    }
	    return oldObjects;
	  }
	
	  addShip() {
	    const ship = new Ship({
	      pos: this.shipStartPosition(),
	      game: this
	    });
	    this.add(ship);
	    return ship;
	  }
	
	  addBackground() {
	    const background = new Background();
	    this.add(background);
	  }
	
	  allObjects() {
	    return [].concat(
	      [this.background],
	      [this.ship],
	      this.blasters,
	      this.asteroids
	    );
	  }
	
	  draw(ctx) {
	    if (this.playing) {
	      ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	      this.allObjects().forEach((object) => {
	        object.draw(ctx);
	      });
	    }
	  }
	
	  moveObjects() {
	    this.allObjects().forEach((object) => {
	      object.move();
	    });
	  }
	
	  checkCollisions() {
	    const asteroids = this.asteroids;
	    for (let i = 0; i < asteroids.length; i++) {
	      if (this.ship.isCrash(asteroids[i])) {
	        return true;
	      }
	    }
	    return false;
	  }
	
	  checkOutOfBounds(object) {
	    const xPosition = object.pos[0];
	    const yPosition = object.pos[1];
	    if (object instanceof Ship) {
	      return (yPosition < 0 || yPosition > 400);
	    } else if (object instanceof Asteroid) {
	      return (xPosition < 0);
	    } else if (object instanceof Blaster) {
	      return (xPosition > 900);
	    }
	  }
	
	  checkCrash() {
	    if (this.checkCollisions() || this.checkOutOfBounds(this.ship)) {
	      this.lost = true;
	      this.renderLost();
	    }
	  }
	
	  renderLost() {
	    this.removeAll();
	    const $gameModal = $jo('.game-modal');
	    $gameModal.text('You Lose! Play Again?');
	    const $modal = $jo('.sub-modal');
	    $modal.removeClass('hidden');
	    this.playing = false;
	  }
	
	  asteroidStartPosition() {
	    return [Game.DIM_X, Game.DIM_Y * Math.random()];
	  }
	
	  shipStartPosition() {
	    return [225, Game.DIM_Y / 3];
	  }
	
	  remove(object) {
	    if (object instanceof Asteroid) {
	      this.asteroids.splice(this.asteroids.indexOf(object), 1);
	    } else if (object instanceof Ship) {
	      this.ship = undefined;
	    } else if (object instanceof Blaster) {
	      this.blasters.splice(this.blasters.indexOf(object), 1);
	    } else {
	      throw "UFO!";
	    }
	  }
	
	  removeAll() {
	    this.asteroids = [];
	    this.blasters = [];
	    this.ship = undefined;
	    this.background = undefined;
	  }
	
	  step(delta) {
	    if (this.playing) {
	      this.moveObjects();
	      this.checkCrash();
	    }
	  }
	}
	
	Game.DIM_X = 900;
	Game.DIM_Y = 400;
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const MovableObject = __webpack_require__(4);
	
	const DEFAULTS = {
	  DIM: 100,
	  VELOCITY: [0, 0],
	  PATH: 'assets/sprites/asteroid',
	  RADIUS: 40,
	  MAX_SPEED: 6
	};
	
	class Asteroid extends MovableObject {
	  constructor(options = {}) {
	    const randAsteroid = Math.floor(Math.random() * 4);
	    options.pos = options.pos || options.game.asteroidStartPosition();
	    options.radius = DEFAULTS.RADIUS;
	    options.dim = DEFAULTS.DIM;
	    options.path = DEFAULTS.PATH + `${randAsteroid}.png`;
	    options.vel = options.vel || Util.randomVector(DEFAULTS.MAX_SPEED);
	    super(options);
	    this.rot = 0;
	  }
	}
	
	module.exports = Asteroid;


/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const Sprite = __webpack_require__(5);
	
	const NORMALIZED_TIME_BETWEEN_FRAMES = 1000/60;
	
	class MovableObject {
	  constructor(options) {
	    this.pos = options.pos;
	    this.vel = options.vel;
	    this.radius = options.radius;
	    this.dim = options.dim;
	    this.path = options.path;
	    this.game = options.game;
	  }
	
	  draw(ctx) {
	    const image = Sprite.createImage(this.path);
	    const imgOffsetX = this.pos[0] - this.dim / 2;
	    const imgOffsetY = this.pos[1] - this.dim / 2;
	
	    ctx.drawImage(image, imgOffsetX, imgOffsetY, this.dim, this.dim);
	  }
	
	  move() {
	    this.pos[0] += this.vel[0];
	    this.pos[1] += this.vel[1];
	  }
	
	  remove() {
	    this.game.remove(this);
	  }
	}
	
	module.exports = MovableObject;


/***/ },
/* 5 */
/***/ function(module, exports) {

	const Sprite = {
	  createImage(imgPath) {
	    const image = new Image();
	    image.src = imgPath;
	    return image;
	  }
	};
	
	module.exports = Sprite;


/***/ },
/* 6 */
/***/ function(module, exports) {

	const DEFAULTS = {
	  POS_X: 0,
	  POS_Y: 0,
	  WIDTH: 1900,
	  HEIGHT: 400,
	  PATH: 'assets/space.png',
	  SPEED: -1.5
	};
	
	class Background {
	  constructor() {
	    this.posX = DEFAULTS.POS_X;
	    this.posY = DEFAULTS.POS_Y;
	    this.width = DEFAULTS.WIDTH;
	    this.height = DEFAULTS.HEIGHT;
	    this.speed = DEFAULTS.SPEED;
	    this.path = DEFAULTS.PATH;
	  }
	
	  draw(ctx) {
	    if (this.posX < -1000) {
	      this.posX = 0;
	    }
	    const image = new Image();
	    image.src = this.path;
	    ctx.drawImage(image, this.posX, this.posY, this.width, this.height);
	    this.move();
	  }
	
	  move() {
	    this.posX += this.speed;
	  }
	}
	
	module.exports = Background;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const Blaster = __webpack_require__ (9);
	const MovableObject = __webpack_require__(4);
	
	const DEFAULTS = {
	  DIM: 125,
	  RADIUS: 20,
	  VELOCITY: [0, 0],
	  TERMINAL_VEL: 6,
	  PATH: 'assets/sprites/falcon',
	  ACCEL_RATE: -.5
	};
	
	class Ship extends MovableObject {
	  constructor(options = {}) {
	    options.dim = DEFAULTS.DIM;
	    options.radius = DEFAULTS.RADIUS;
	    options.vel = options.vel || DEFAULTS.VELOCITY;
	    const falcNum = Util.calcFalcNum(options.vel[1]);
	    options.path = DEFAULTS.PATH + `${falcNum}.png`;
	    super(options);
	    this.accel = false;
	    this.rot = 0;
	    this.blasters = 0;
	    window.setInterval(this.gravity.bind(this), 50);
	    window.setInterval(this.accelerate.bind(this));
	  }
	
	  accelerate() {
	    if (this.accel && this.vel[1] > -DEFAULTS.TERMINAL_VEL) {
	      this.vel[1] += DEFAULTS.ACCEL_RATE;
	      const falcNum = Util.calcFalcNum(this.vel[1]);
	      this.path = DEFAULTS.PATH + `${falcNum}.png`;
	    }
	  }
	
	  gravity() {
	    if (this.vel[1] < DEFAULTS.TERMINAL_VEL) {
	      this.vel[1] += 1.5;
	      const falcNum = Util.calcFalcNum(this.vel[1]);
	      this.path = DEFAULTS.PATH + `${falcNum}.png`;
	    }
	  }
	
	  isCrash(otherObject) {
	    const distanceBetween = Util.distanceBetween(this, otherObject);
	    const minDistanceBetween = this.radius + otherObject.radius;
	    return (distanceBetween < minDistanceBetween);
	  }
	
	  shoot() {
	    const blasterVel = [
	      [-Blaster.SPEED, 0]
	    ];
	
	    if (this.blasters > 0) {
	      const blaster = new Blaster({
	        pos: this.pos,
	        vel: blasterVel,
	        color: 'red',
	        game: this.game
	      });
	
	      this.game.add(blaster);
	
	      this.blasters--;
	    } else {
	      return;
	    }
	  }
	}
	
	module.exports = Ship;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	
	class GameView {
	  constructor(ctx) {
	    this.ctx = ctx;
	  }
	
	  bindKeyHandlers() {
	    $jo(window).on('keydown', function(e) {
	      this.handleKeyEvent(e);
	    }.bind(this));
	
	    $jo(window).on('keyup', function(e) {
	      this.handleKeyRelease(e);
	    }.bind(this));
	
	    $jo('.close').on('click', function(e) {
	      this.handleCloseModal(e);
	    }.bind(this));
	
	    $jo('.about').on('click', function(e) {
	      this.handleOpenModal(e);
	    }.bind(this));
	
	    $jo('.start').on('click', function(e) {
	      this.handleCloseModal(e);
	      let count = 3;
	      this.counter = setInterval(() => {
	        this.timer(count);
	        count--;
	      }, 1000);
	      window.setTimeout(() => {
	        this.start();
	      }, 4000);
	    }.bind(this));
	  }
	
	  timer(count) {
	    const timer = $jo('.timer');
	    if (count === 0) {
	      timer.addClass('hidden');
	      clearInterval(this.counter);
	      return;
	    }
	    timer.removeClass('hidden');
	    timer.text(count);
	  }
	
	  unbindKeyHandlers() {
	    $jo(window).off('keydown', function(e) {
	      this.handleKeyEvent(e);
	    }.bind(this));
	
	    $jo(window).off('keyup', function(e) {
	      this.handleKeyRelease(e);
	    }.bind(this));
	  }
	
	  handleCloseModal(e) {
	    $jo('.modal').addClass('hidden');
	  }
	
	  handleOpenModal(e) {
	    $jo('.modal').removeClass('hidden');
	  }
	
	  handleKeyEvent(e) {
	    if (e.keyCode === 32) {
	      this.ship.accel = true;
	      this.ship.rot = 150 * Math.PI / 180;
	    } else if (e.keyCode === 83) {
	      this.toggleSound();
	    }
	  }
	
	  handleKeyRelease(e) {
	    if (e.keyCode === 32) {
	      this.ship.accel = false;
	      this.ship.rot = 210 * Math.PI / 180;
	    }
	  }
	
	  start() {
	    this.theme.play();
	    this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	    this.game = null;
	    this.game = new Game();
	    this.ship = this.game.addShip();
	    this.background = this.game.addBackground();
	    this.prevTime = 0;
	    this.game.playing = true;
	    this.intervalId = window.setInterval(() => {
	      this.animate();
	    }, 20);
	  }
	
	  toggleSound() {
	    if (this.theme.paused) {
	      this.theme.play();
	    } else {
	      this.theme.pause();
	    }
	  }
	
	  displayPoints() {
	    $jo('.points').text(this.game.points);
	    $jo('.highscore').text(`Highscore: 0`);
	    this.game.points += 5;
	  }
	
	  animate(time) {
	    if (this.game.playing) {
	      this.game.step();
	      this.displayPoints();
	      this.game.draw(this.ctx);
	    } else {
	      this.unbindKeyHandlers();
	      window.clearInterval(this.intervalId);
	    }
	
	    if (this.game.lost && !this.theme.paused) {
	      this.theme.pause();
	      this.chewy.play();
	    }
	  }
	
	  load() {
	    this.theme = new Audio('./assets/sounds/starwars.mp3');
	    this.chewy = new Audio('./assets/sounds/chewbacca.mp3');
	    this.theme.addEventListener('ended', () => {
	      this.theme.currentTime = 0;
	      this.theme.play();
	    }, false);
	
	    this.ctx.beginPath();
	    this.ctx.rect(0, 0, Game.DIM_X, Game.DIM_Y);
	    this.ctx.fillStyle = 'black';
	    this.ctx.fill();
	    this.bindKeyHandlers();
	  }
	}
	
	module.exports = GameView;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	
	const BLASTER = {
	  RADIUS: 2,
	  SPEED: 4,
	  PATH: 'assets/sprites/falcon'
	};
	
	class Blaster extends MovingObject {
	  constructor(options) {
	    options.radius = BLASTER.RADIUS;
	    super(options);
	  }
	}
	
	module.exports = Blaster;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map