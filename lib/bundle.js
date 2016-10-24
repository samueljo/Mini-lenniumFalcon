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
	const GameView = __webpack_require__(10);
	
	document.addEventListener('DOMContentLoaded', function() {
	  const canvas = document.getElementsByTagName('canvas')[0];
	  canvas.width = Game.DIM_X;
	  canvas.height = Game.DIM_Y;
	
	  const ctx = canvas.getContext('2d');
	  const gameView = new GameView(ctx);
	
	  const manifest = [
	    {src: "sprites/falcon0b.png", id: "falcon0"},
	    {src: "sprites/falcon1b.png", id: "falcon1"},
	    {src: "sprites/falcon3b.png", id: "falcon3"},
	    {src: "sprites/falcon4b.png", id: "falcon4"},
	    {src: "space.png", id: "background"}
	  ];
	
	  const loadGame = () => {
	    gameView.load();
	  };
	
	  const loader = new createjs.LoadQueue(false);
	  loader.addEventListener("complete", loadGame);
	  loader.loadManifest(manifest, true, "./assets/");
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__(2);
	const Ship = __webpack_require__(5);
	const Blaster = __webpack_require__(8);
	const PowerUp = __webpack_require__(7);
	const Background = __webpack_require__(9);
	const Util = __webpack_require__(6);
	
	class Game {
	  constructor() {
	    this.explosion = new Audio('./assets/sounds/explosion1.mp3');
	    this.hanSounds = [
	      new Audio('./assets/sounds/han0.mp3'),
	      new Audio('./assets/sounds/han1.mp3'),
	      new Audio('./assets/sounds/han2.mp3'),
	      new Audio('./assets/sounds/han3.mp3'),
	      new Audio('./assets/sounds/han4.mp3'),
	      new Audio('./assets/sounds/han5.mp3')
	    ];
	    this.asteroids = [];
	    this.blasters = [];
	    this.powerUps = [];
	    this.points = 0;
	    this.refreshObjects();
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
	    } else if (object instanceof PowerUp) {
	      this.powerUps.push(object);
	    } else {
	      throw "UFO!";
	    }
	  }
	
	  refreshObjects() {
	    this.add(new Asteroid({ game: this }));
	    this.asteroidInterval = Util.createAsteroidInterval(this);
	    this.powerUpInterval = Util.createPowerUpInterval(this);
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
	      this.powerUps,
	      this.blasters,
	      this.asteroids
	    );
	  }
	
	  draw(ctx) {
	    if (this.playing) {
	      if (this.explosions) {
	        Util.renderExplosions(ctx, this);
	      }
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
	      if (Util.isCrash(this.ship, asteroids[i])) {
	        return true;
	      }
	    }
	    Util.checkBlasterHit(this);
	    Util.checkPowerUp(this);
	    return false;
	  }
	
	  checkOutOfBounds(object) {
	    const xPosition = object.pos[0];
	    const yPosition = object.pos[1];
	    if (object instanceof Ship) {
	      return (yPosition < 0 || yPosition > 400);
	    } else if (object instanceof Asteroid || object instanceof PowerUp) {
	      return (xPosition < 0);
	    } else if (object instanceof Blaster) {
	      return (xPosition > 900);
	    }
	  }
	
	  checkCrash() {
	    if (this.checkCollisions() || this.checkOutOfBounds(this.ship)) {
	      this.lost = true;
	      window.clearInterval(this.asteroidInterval);
	      window.clearInterval(this.powerUpInterval);
	      window.clearInterval(this.ship.gravityInterval);
	      window.clearInterval(this.ship.accelerateInterval);
	      this.renderLost();
	    }
	  }
	
	  renderLost() {
	    $jo('.chewy').removeClass('hidden');
	    window.setTimeout(() => {
	      $jo('.chewy').addClass('hidden');
	    }, 2000);
	    this.removeAll();
	    const $gameModal = $jo('.game-modal');
	    $gameModal.removeClass('hidden');
	    $gameModal.text("You crashed! Press 'SPACE' to play again");
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
	    } else if (object instanceof PowerUp) {
	      this.powerUps.splice(this.powerUps.indexOf(object), 1);
	    } else {
	      throw "UFO!";
	    }
	  }
	
	  removeAll() {
	    this.asteroids = [];
	    this.blasters = [];
	    this.powerUps = [];
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

	const MovableObject = __webpack_require__(3);
	
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
	    const randomXVector = -(Math.random() + 1) * DEFAULTS.MAX_SPEED;
	    options.pos = options.pos || options.game.asteroidStartPosition();
	    options.radius = DEFAULTS.RADIUS;
	    options.xDim = DEFAULTS.DIM;
	    options.yDim = DEFAULTS.DIM;
	    options.path = DEFAULTS.PATH + `${randAsteroid}.png`;
	    options.vel = options.vel || [randomXVector, 0];
	    super(options);
	  }
	}
	
	module.exports = Asteroid;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Sprite = __webpack_require__(4);
	
	const NORMALIZED_TIME_BETWEEN_FRAMES = 1000/60;
	
	class MovableObject {
	  constructor(options) {
	    this.pos = options.pos;
	    this.vel = options.vel;
	    this.radius = options.radius;
	    this.xDim = options.xDim;
	    this.yDim = options.yDim;
	    this.path = options.path;
	    this.game = options.game;
	    this.imgOffsetY = options.imgOffsetY;
	  }
	
	  draw(ctx) {
	    const image = Sprite.createImage(this.path);
	    const imgOffsetX = this.pos[0] - this.xDim / 2;
	    const imgOffsetY = this.imgOffsetY || this.pos[1] - this.yDim / 2;
	
	    ctx.drawImage(image, imgOffsetX, imgOffsetY, this.xDim, this.yDim);
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
/* 4 */
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(6);
	const Blaster = __webpack_require__ (8);
	const MovableObject = __webpack_require__(3);
	
	const DEFAULTS = {
	  DIM: 100,
	  RADIUS: 30,
	  VELOCITY: [0, 0],
	  TERMINAL_VEL: 6,
	  PATH: 'assets/sprites/falcon',
	  ACCEL_RATE: -.5,
	  BLASTER_VEL: [10, 0]
	};
	
	class Ship extends MovableObject {
	  constructor(options = {}) {
	    options.xDim = DEFAULTS.DIM;
	    options.yDim = DEFAULTS.DIM;
	    options.radius = DEFAULTS.RADIUS;
	    options.vel = options.vel || DEFAULTS.VELOCITY;
	    const falcNum = Util.calcFalcNum(options.vel[1]);
	    options.path = DEFAULTS.PATH + `${falcNum}b.png`;
	    super(options);
	    this.blaster = new Audio('./assets/sounds/blaster.mp3');
	    this.strongpower = new Audio('./assets/sounds/strongpower.mp3');
	    this.accel = false;
	    this.rot = 0;
	    this.blasters = 1;
	    this.gravityInterval = window.setInterval(this.gravity.bind(this), 50);
	    this.accelerateInterval = window.setInterval(this.accelerate.bind(this));
	  }
	
	  accelerate() {
	    if (this.accel && this.vel[1] > -DEFAULTS.TERMINAL_VEL) {
	      this.vel[1] += DEFAULTS.ACCEL_RATE;
	      const falcNum = Util.calcFalcNum(this.vel[1]);
	      this.path = DEFAULTS.PATH + `${falcNum}b.png`;
	    }
	  }
	
	  gravity() {
	    if (this.vel[1] < DEFAULTS.TERMINAL_VEL) {
	      this.vel[1] += 1.5;
	      const falcNum = Util.calcFalcNum(this.vel[1]);
	      this.path = DEFAULTS.PATH + `${falcNum}b.png`;
	    }
	  }
	
	  shoot() {
	    if (this.blasters > 0) {
	      this.blasters--;
	      this.blaster.play();
	      const blaster = new Blaster({
	        pos: this.pos.slice(),
	        vel: DEFAULTS.BLASTER_VEL,
	        color: 'red',
	        game: this.game
	      });
	
	      this.game.add(blaster);
	      return;
	    } else {
	      return;
	    }
	  }
	}
	
	module.exports = Ship;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__(2);
	const PowerUp = __webpack_require__(7);
	const Sprite = __webpack_require__(4);
	
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
	          game.asteroids[j].path = 'assets/sprites/explosion.png';
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
	
	  createPowerUpInterval(game) {
	    return window.setInterval(() => {
	      if (game.playing) {
	        let playHan = Math.round(Math.random());
	        if (playHan) {
	          let hanNum = Math.floor(Math.random() * 6);
	          game.hanSounds[hanNum].play();
	        }
	        game.add(new PowerUp({ game: game }));
	        const oldObjects = this.oldObjects(game, game.powerUps);
	        oldObjects.forEach((object) => {
	          game.remove(object);
	        });
	      }
	    }, 10000);
	  },
	
	  createAsteroidInterval(game) {
	    return window.setInterval(() => {
	      if (game.playing) {
	        game.add(new Asteroid({ game: game }));
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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const MovableObject = __webpack_require__(3);
	
	const DEFAULTS = {
	  DIM: 50,
	  PATH: 'assets/sprites/powerup',
	  RADIUS: 20,
	  SPEED: -10
	};
	
	class PowerUp extends MovableObject {
	  constructor(options = {}) {
	    const randPowerUp = Math.floor(Math.random() * 2);
	    options.pos = options.pos || options.game.asteroidStartPosition();
	    options.radius = DEFAULTS.RADIUS;
	    options.xDim = DEFAULTS.DIM;
	    options.yDim = DEFAULTS.DIM;
	    options.path = DEFAULTS.PATH + `${randPowerUp}.png`;
	    options.vel = [DEFAULTS.SPEED, 0];
	    super(options);
	    this.powerUpNum = randPowerUp;
	  }
	
	  applyPowerUp(game) {
	    if (this.powerUpNum === 0) {
	      game.ship.blasters++;
	    } else {
	      game.ship.strongpower.play();
	      for (let i = 0; i < game.asteroids.length; i++) {
	        game.asteroids[i].path = 'assets/sprites/explosion.png';
	      }
	      window.setTimeout(() => {
	        game.asteroids = [];
	      }, 100);
	    }
	  }
	}
	
	module.exports = PowerUp;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(3);
	
	const BLASTER = {
	  RADIUS: 5,
	  X_DIM: 200,
	  Y_DIM: 50,
	  PATH: 'assets/sprites/blaster.png'
	};
	
	class Blaster extends MovingObject {
	  constructor(options) {
	    options.radius = BLASTER.RADIUS;
	    options.path = BLASTER.PATH;
	    options.xDim = BLASTER.X_DIM;
	    options.yDim = BLASTER.Y_DIM;
	    super(options);
	  }
	}
	
	module.exports = Blaster;


/***/ },
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


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const Util = __webpack_require__(6);
	
	class GameView {
	  constructor(ctx) {
	    this.ctx = ctx;
	    this.isMuted = false;
	  }
	
	  bindKeyHandlers() {
	    $jo(window).on('keydown', function(e) {
	      this.handleKeyEvent(e);
	    }.bind(this));
	
	    $jo(window).on('keyup', function(e) {
	      this.handleKeyRelease(e);
	    }.bind(this));
	
	    $jo('.about').on('click', function(e) {
	      this.handleOpenModal(e);
	    }.bind(this));
	
	    $jo('.start').on('click', function(e) {
	      this.newGame = false;
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
	
	  handleCloseModal(e) {
	    $jo('.modal').addClass('hidden');
	  }
	
	  handleOpenModal(e) {
	    $jo('.modal').removeClass('hidden');
	  }
	
	  handleKeyEvent(e) {
	    if (e.keyCode === 32 && this.newGame) {
	      this.newGame = false;
	      this.handleCloseModal(e);
	      let count = 3;
	      this.counter = setInterval(() => {
	        this.timer(count);
	        count--;
	      }, 1000);
	      window.setTimeout(() => {
	        this.start();
	      }, 4000);
	    } else if (e.keyCode === 32) {
	      this.ship.accel = true;
	      this.ship.rot = 150 * Math.PI / 180;
	    } else if (e.keyCode === 83) {
	      this.toggleSound();
	    } else if (e.keyCode === 13) {
	      this.ship.shoot();
	    }
	  }
	
	  handleKeyRelease(e) {
	    if (e.keyCode === 32) {
	      this.ship.accel = false;
	      this.ship.rot = 210 * Math.PI / 180;
	    }
	  }
	
	  start() {
	    this.theme.currentTime = 0;
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
	    if (this.isMuted) {
	      this.isMuted = false;
	      Util.renderSound(this.isMuted);
	    } else {
	      this.isMuted = true;
	      Util.renderSound(this.isMuted);
	    }
	    this.theme.muted = this.isMuted;
	    this.game.hanSounds.forEach((hanSound) => {
	      hanSound.muted = this.isMuted;
	    });
	    this.game.explosion.muted = this.isMuted;
	    this.ship.blaster.muted = this.isMuted;
	    this.ship.strongpower.muted = this.isMuted;
	  }
	
	  displayPoints() {
	    $jo('.points').text(this.game.points);
	    $jo('.highscore').text(`Highscore: ${localStorage.getItem('highScore')}`);
	    this.game.points += 5;
	  }
	
	  displayBlasterCount() {
	    if (this.game.ship) {
	      $jo('.blasters').text(`Blaster Cannons: ${this.game.ship.blasters}`);
	    }
	  }
	
	  animate(time) {
	    if (this.game.playing) {
	      this.displayPoints();
	      this.displayBlasterCount();
	      this.game.draw(this.ctx);
	      this.game.step();
	    } else {
	      this.newGame = true;
	      let isNewHighScore = (this.game.points > localStorage.getItem('highScore'));
	      if (!localStorage.getItem('highScore') || isNewHighScore) {
	        localStorage.setItem('highScore', this.game.points);
	      }
	      $jo('.highscore').text(`Highscore: ${localStorage.getItem('highScore')}`);
	      window.clearInterval(this.intervalId);
	    }
	    if (this.game.lost && !this.isMuted) {
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map