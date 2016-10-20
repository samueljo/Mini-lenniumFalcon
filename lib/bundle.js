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
	const GameView = __webpack_require__(7);
	
	document.addEventListener('DOMContentLoaded', function() {
	  const canvas = document.getElementsByTagName('canvas')[0];
	  canvas.width = Game.DIM_X;
	  canvas.height = Game.DIM_Y;
	
	  const ctx = canvas.getContext("2d");
	  const game = new Game();
	  const gameView = new GameView(game, ctx);
	  gameView.start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__(2);
	// const AsteroidWall = require('./asteroid_wall');
	const Ship = __webpack_require__(6);
	const Background = __webpack_require__(9);
	const Util = __webpack_require__(3);
	
	class Game {
	  constructor() {
	    this.asteroids = [];
	    this.addAsteroids();
	    // this.addAsteroidWall();
	    this.points = 0;
	  }
	
	  displayPoints() {
	    $jo('.points').text(this.points);
	    $jo('.highscore').text(`Highscore: 0`);
	    this.points += 1;
	  }
	
	  add(object) {
	    if (object instanceof Asteroid) {
	      this.asteroids.push(object);
	    } else if (object instanceof Ship) {
	      this.ship = object;
	    } else if (object instanceof Background) {
	      this.background = object;
	    } else {
	      throw "UFO!";
	    }
	  }
	
	  addAsteroids() {
	    this.add(new Asteroid({ game: this }));
	    const asteroidInterval = window.setInterval(() => {
	      this.add(new Asteroid({ game: this }));
	    }, 750);
	  }
	
	  // addAsteroidWall() {
	  //   const wall = AsteroidWall.createWall(this);
	  //   for (let i = 0; i < wall.length; i++) {
	  //     this.add(wall[i]);
	  //   }
	  // }
	
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
	      this.asteroids
	    );
	  }
	
	  draw(ctx) {
	    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	    this.allObjects().forEach((object) => {
	      object.draw(ctx);
	    });
	  }
	
	  moveObjects(timeDelta) {
	    this.allObjects().forEach((object) => {
	      object.move(timeDelta);
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
	
	  checkOutOfBounds() {
	    const shipPosition = this.ship.pos[1];
	    return (shipPosition < 0 || shipPosition > 400);
	  }
	
	  checkCrash() {
	    if (this.checkCollisions() || this.checkOutOfBounds()) {
	      alert('Oh no! You crashed!');
	      this.remove(this.ship);
	    }
	  }
	
	  asteroidStartPosition() {
	    return [Game.DIM_X, Game.DIM_Y * Math.random()];
	  }
	
	  shipStartPosition() {
	    return [225, Game.DIM_Y / 3];
	  }
	
	  remove(object) {
	    if (object instanceof Asteroid) {
	      this.asteroids.splice(this.asteroids.indexOf(object, 1));
	    } else {
	      throw "UFO!";
	    }
	  }
	
	  step(delta) {
	    this.moveObjects(delta);
	    this.checkCrash();
	    this.displayPoints();
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
	  TERMINAL_VEL: 3,
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
	
	  move(timeBetween) {
	    const timeElapsed = timeBetween / NORMALIZED_TIME_BETWEEN_FRAMES;
	    const xDelta = this.vel[0] * timeElapsed;
	    const yDelta = this.vel[1] * timeElapsed;
	
	    this.pos = [this.pos[0] + xDelta, this.pos[1] + yDelta];
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
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
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
	}
	
	module.exports = Ship;


/***/ },
/* 7 */
/***/ function(module, exports) {

	class GameView {
	  constructor(game, ctx) {
	    this.ctx = ctx;
	    this.game = game;
	    this.ship = this.game.addShip();
	    this.background = this.game.addBackground();
	  }
	
	  bindKeyHandlers() {
	    $jo(window).on('keydown', function(e) {
	      this.handleKeyEvent(e);
	    }.bind(this));
	
	    $jo(window).on('keyup', function(e) {
	      this.handleKeyRelease(e);
	    }.bind(this));
	  }
	
	  handleKeyEvent(e) {
	    if (e.keyCode === 32) {
	      this.ship.accel = true;
	      this.ship.rot = 150 * Math.PI / 180;
	    }
	  }
	
	  handleKeyRelease(e) {
	    if (e.keyCode === 32) {
	      this.ship.accel = false;
	      this.ship.rot = 210 * Math.PI / 180;
	    }
	  }
	
	  start() {
	    this.bindKeyHandlers();
	    this.prevTime = 0;
	
	    window.requestAnimationFrame(this.animate.bind(this));
	  }
	
	  animate(time) {
	    const timeDelta = time - this.prevTime;
	    this.game.step(timeDelta);
	    this.game.draw(this.ctx);
	    this.prevTime = time;
	
	    window.requestAnimationFrame(this.animate.bind(this));
	  }
	}
	
	module.exports = GameView;


/***/ },
/* 8 */,
/* 9 */
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map