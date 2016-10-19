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
	const GameView = __webpack_require__(2);
	
	document.addEventListener('DOMContentLoaded', function() {
	  // const canvas = document.getElementsByTagName('canvas')[0];
	  // canvas.width = Game.DIM_X;
	  // canvas.height = Game.DIM_Y;
	  //
	  // const
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__(3);
	const Ship = __webpack_require__(6);
	const Util = __webpack_require__(5);
	
	class Game {
	  constructor() {
	    this.asteroids = [];
	    this.ships = [];
	
	    this.add(new Asteroid({ game: this }));
	    // this.addAsteroids();
	  }
	
	  add(object) {
	    if (object instanceof Asteroid) {
	      this.asteroids.push(object);
	    } else if (object instanceof Ship) {
	      this.ships.push(object);
	    } else {
	      throw "UFO!";
	    }
	  }
	
	  addShip() {
	    const ship = new Ship({
	      pos: this.shipStartPosition(),
	      game: this
	    });
	    this.add(ship);
	    return ship;
	  }
	
	  draw() {
	
	  }
	
	  clearRect() {
	
	  }
	
	  moveObjects() {
	
	  }
	
	  move() {
	
	  }
	
	  // addAsteroids() {
	  //
	  // }
	
	  asteroidStartPosition() {
	    return [Game.DIM_X, Game.DIM_Y * Math.random()];
	  }
	
	  shipStartPosition() {
	    return [50, Game.DIM_Y / 2];
	  }
	}
	
	Game.DIM_X = 900;
	Game.DIM_Y = 400;
	Game.MAX_ASTEROIDS = 3;
	Game.FPS = 32;
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports) {

	class GameView {
	
	}
	
	module.exports = GameView;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(5);
	const MovableObject = __webpack_require__(4);
	
	const DEFAULTS = {
	  COLOR: '#505050',
	  RADIUS: 25,
	  MAX_SPEED: 4
	};
	
	class Asteroid extends MovableObject {
	  constructor(options={}) {
	    options.color = DEFAULTS.COLOR;
	    options.pos = options.pos || options.game.asteroidStartPosition();
	    options.radius = DEFAULTS.RADIUS;
	    options.vel = options.vel || Util.randomVector(DEFAULTS.MAX_SPEED);
	    super(options);
	  }
	}
	
	module.exports = Asteroid;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(5);
	
	const NORMALIZED_TIME_BETWEEN_FRAMES = 1000/60;
	
	class MovableObject {
	  constructor(options) {
	    this.pos = options.pos;
	    this.vel = options.vel;
	    this.radius = options.radius;
	    this.color = options.color;
	    this.game = options.game;
	    this.isShip = false;
	  }
	
	  draw(ctx) {
	    ctx.fillStyle = this.color;
	    ctx.beginPath();
	    ctx.arc(
	      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
	    );
	    ctx.fill();
	  }
	
	  isCrash(otherObject) {
	    const distanceBetween = Util.distanceBetween(this, otherObject);
	    const minDistanceBetween = this.radius + otherObject.radius;
	    return (distanceBetween < minDistanceBetween);
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
	    const xVector = ((Math.random() * 2) - 1) * length;
	
	    return [xVector, 0];
	  }
	};
	
	module.exports = Util;


/***/ },
/* 6 */
/***/ function(module, exports) {



/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map