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

	const Asteroid = __webpack_require__(3);
	const Ship = __webpack_require__(6);
	const Util = __webpack_require__(5);
	
	class Game {
	  constructor() {
	    this.asteroids = [];
	    this.ships = [];
	
	    this.addAsteroids();
	  }
	
	  addAsteroids() {
	    this.add(new Asteroid({ game: this }));
	    const asteroidInterval = window.setInterval(() => {
	      this.add(new Asteroid({ game: this }));
	    }, 1000);
	  }
	
	  add(object) {
	    if (object instanceof Asteroid) {
	      this.asteroids.push(object);
	    } else if (object instanceof Ship) {
	      this.ship = object;
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
	
	  allObjects() {
	    return [].concat([this.ship], this.asteroids);
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
	    return (shipPosition < 0 && shipPosition > 400);
	  }
	
	  checkCrash() {
	    return (this.checkCollisions() && this.checkOutOfBounds());
	  }
	
	  asteroidStartPosition() {
	    return [Game.DIM_X, Game.DIM_Y * Math.random()];
	  }
	
	  shipStartPosition() {
	    return [225, Game.DIM_Y / 2];
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
	  }
	}
	
	Game.DIM_X = 900;
	Game.DIM_Y = 400;
	Game.MAX_ASTEROIDS = 3;
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	//     keymaster.js
	//     (c) 2011-2012 Thomas Fuchs
	//     keymaster.js may be freely distributed under the MIT license.
	
	;(function(global){
	  var k,
	    _handlers = {},
	    _mods = { 16: false, 18: false, 17: false, 91: false },
	    _scope = 'all',
	    // modifier keys
	    _MODIFIERS = {
	      '⇧': 16, shift: 16,
	      '⌥': 18, alt: 18, option: 18,
	      '⌃': 17, ctrl: 17, control: 17,
	      '⌘': 91, command: 91
	    },
	    // special keys
	    _MAP = {
	      backspace: 8, tab: 9, clear: 12,
	      enter: 13, 'return': 13,
	      esc: 27, escape: 27, space: 32,
	      left: 37, up: 38,
	      right: 39, down: 40,
	      del: 46, 'delete': 46,
	      home: 36, end: 35,
	      pageup: 33, pagedown: 34,
	      ',': 188, '.': 190, '/': 191,
	      '`': 192, '-': 189, '=': 187,
	      ';': 186, '\'': 222,
	      '[': 219, ']': 221, '\\': 220
	    },
	    code = function(x){
	      return _MAP[x] || x.toUpperCase().charCodeAt(0);
	    },
	    _downKeys = [];
	
	  for(k=1;k<20;k++) _MODIFIERS['f'+k] = 111+k;
	
	  // IE doesn't support Array#indexOf, so have a simple replacement
	  function index(array, item){
	    var i = array.length;
	    while(i--) if(array[i]===item) return i;
	    return -1;
	  }
	
	  var modifierMap = {
	      16:'shiftKey',
	      18:'altKey',
	      17:'ctrlKey',
	      91:'metaKey'
	  };
	  function updateModifierKey(event) {
	      for(k in _mods) _mods[k] = event[modifierMap[k]];
	  };
	
	  // handle keydown event
	  function dispatch(event, scope){
	    var key, handler, k, i, modifiersMatch;
	    key = event.keyCode;
	
	    if (index(_downKeys, key) == -1) {
	        _downKeys.push(key);
	    }
	
	    // if a modifier key, set the key.<modifierkeyname> property to true and return
	    if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
	    if(key in _mods) {
	      _mods[key] = true;
	      // 'assignKey' from inside this closure is exported to window.key
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
	      return;
	    }
	    updateModifierKey(event);
	
	    // see if we need to ignore the keypress (filter() can can be overridden)
	    // by default ignore key presses if a select, textarea, or input is focused
	    if(!assignKey.filter.call(this, event)) return;
	
	    // abort if no potentially matching shortcuts found
	    if (!(key in _handlers)) return;
	
	    // for each potential shortcut
	    for (i = 0; i < _handlers[key].length; i++) {
	      handler = _handlers[key][i];
	
	      // see if it's in the current scope
	      if(handler.scope == scope || handler.scope == 'all'){
	        // check if modifiers match if any
	        modifiersMatch = handler.mods.length > 0;
	        for(k in _mods)
	          if((!_mods[k] && index(handler.mods, +k) > -1) ||
	            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
	        // call the handler and stop the event if neccessary
	        if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
	          if(handler.method(event, handler)===false){
	            if(event.preventDefault) event.preventDefault();
	              else event.returnValue = false;
	            if(event.stopPropagation) event.stopPropagation();
	            if(event.cancelBubble) event.cancelBubble = true;
	          }
	        }
	      }
	    }
	  };
	
	  // unset modifier keys on keyup
	  function clearModifier(event){
	    var key = event.keyCode, k,
	        i = index(_downKeys, key);
	
	    // remove key from _downKeys
	    if (i >= 0) {
	        _downKeys.splice(i, 1);
	    }
	
	    if(key == 93 || key == 224) key = 91;
	    if(key in _mods) {
	      _mods[key] = false;
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
	    }
	  };
	
	  function resetModifiers() {
	    for(k in _mods) _mods[k] = false;
	    for(k in _MODIFIERS) assignKey[k] = false;
	  }
	
	  // parse and assign shortcut
	  function assignKey(key, scope, method){
	    var keys, mods, i, mi;
	    if (method === undefined) {
	      method = scope;
	      scope = 'all';
	    }
	    key = key.replace(/\s/g,'');
	    keys = key.split(',');
	
	    if((keys[keys.length-1])=='')
	      keys[keys.length-2] += ',';
	    // for each shortcut
	    for (i = 0; i < keys.length; i++) {
	      // set modifier keys if any
	      mods = [];
	      key = keys[i].split('+');
	      if(key.length > 1){
	        mods = key.slice(0,key.length-1);
	        for (mi = 0; mi < mods.length; mi++)
	          mods[mi] = _MODIFIERS[mods[mi]];
	        key = [key[key.length-1]];
	      }
	      // convert to keycode and...
	      key = key[0]
	      key = code(key);
	      // ...store handler
	      if (!(key in _handlers)) _handlers[key] = [];
	      _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });
	    }
	  };
	
	  // Returns true if the key with code 'keyCode' is currently down
	  // Converts strings into key codes.
	  function isPressed(keyCode) {
	      if (typeof(keyCode)=='string') {
	        keyCode = code(keyCode);
	      }
	      return index(_downKeys, keyCode) != -1;
	  }
	
	  function getPressedKeyCodes() {
	      return _downKeys.slice(0);
	  }
	
	  function filter(event){
	    var tagName = (event.target || event.srcElement).tagName;
	    // ignore keypressed in any elements that support keyboard data input
	    return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
	  }
	
	  // initialize key.<modifier> to false
	  for(k in _MODIFIERS) assignKey[k] = false;
	
	  // set current scope (default 'all')
	  function setScope(scope){ _scope = scope || 'all' };
	  function getScope(){ return _scope || 'all' };
	
	  // delete all handlers for a given scope
	  function deleteScope(scope){
	    var key, handlers, i;
	
	    for (key in _handlers) {
	      handlers = _handlers[key];
	      for (i = 0; i < handlers.length; ) {
	        if (handlers[i].scope === scope) handlers.splice(i, 1);
	        else i++;
	      }
	    }
	  };
	
	  // cross-browser events
	  function addEvent(object, event, method) {
	    if (object.addEventListener)
	      object.addEventListener(event, method, false);
	    else if(object.attachEvent)
	      object.attachEvent('on'+event, function(){ method(window.event) });
	  };
	
	  // set the handlers globally on document
	  addEvent(document, 'keydown', function(event) { dispatch(event, _scope) }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
	  addEvent(document, 'keyup', clearModifier);
	
	  // reset modifiers to false whenever the window is (re)focused.
	  addEvent(window, 'focus', resetModifiers);
	
	  // store previously defined key
	  var previousKey = global.key;
	
	  // restore previously defined key and return reference to our key object
	  function noConflict() {
	    var k = global.key;
	    global.key = previousKey;
	    return k;
	  }
	
	  // set window.key and window.key.set/get/deleteScope, and the default filter
	  global.key = assignKey;
	  global.key.setScope = setScope;
	  global.key.getScope = getScope;
	  global.key.deleteScope = deleteScope;
	  global.key.filter = filter;
	  global.key.isPressed = isPressed;
	  global.key.getPressedKeyCodes = getPressedKeyCodes;
	  global.key.noConflict = noConflict;
	
	  if(true) module.exports = key;
	
	})(this);


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
	  constructor(options = {}) {
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
	    const deltaX = Math.pow(objectA.pos[0] - objectB.pos[0], 2);
	    const deltaY = Math.pow(objectA.pos[1] - objectB.pos[1], 2);
	    return Math.sqrt(deltaX + deltaY);
	  },
	
	  randomVector (length) {
	    const xVector = -(Math.random() + 1) * length;
	
	    return [xVector, 0];
	  }
	};
	
	module.exports = Util;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(5);
	const MovableObject = __webpack_require__(4);
	
	const DEFAULTS = {
	  RADIUS: 10,
	  VELOCITY: [0, 3],
	  COLOR: 'red'
	};
	
	class Ship extends MovableObject {
	  constructor(options = {}) {
	    options.radius = DEFAULTS.RADIUS;
	    options.vel = options.vel || DEFAULTS.VELOCITY;
	    options.color = options.color || DEFAULTS.COLOR;
	    super(options);
	  }
	
	  isCrash(otherObject) {
	    const distanceBetween = Util.distanceBetween(this, otherObject);
	    const minDistanceBetween = this.radius + otherObject.radius;
	    return (distanceBetween < minDistanceBetween);
	  }
	
	  accelerate(impulse) {
	    this.vel += this.vel[1] + impulse;
	  }
	}
	
	module.exports = Ship;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map