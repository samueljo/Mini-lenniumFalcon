/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const DOMNodeCollection = __webpack_require__(1);

	const funcQueue = [];

	window.$jo = function (arg) {
	  if (arg === window) {
	    return new DOMNodeCollection(
	      [window]
	    );
	  } else if (typeof arg === "string") {
	    if (arg[0] === "<") {
	      const tag = arg.slice(1, -1);
	      return new DOMNodeCollection(
	        [document.createElement(tag)]
	      );

	    } else {
	      return new DOMNodeCollection(
	        Array.from(document.querySelectorAll(arg))
	      );
	    }
	  } else if (arg instanceof HTMLElement) {
	    return new DOMNodeCollection(
	      [arg]
	    );
	  } else if (typeof arg === "function") {
	    if (document.readyState === "complete") {
	      arg();
	    } else {
	      funcQueue.push(arg);
	    }
	  }
	};

	function execute() {
	  funcQueue.forEach( (func) => {
	    func();
	  });
	}

	window.$jo.extend = function (...objects) {
	  const result = objects[0];
	  objects.slice(1).forEach( (object) => {
	    Object.keys(object).forEach( (key) => {
	      result[key] = object[key];
	    });
	  });

	  return result;
	};

	window.$jo.ajax = function (options) {
	  let defaults = {
	    method: "GET",
	    url: "./",
	    data: {},
	    success: function() {},
	    error: function() {},
	  };

	  const xhr = new XMLHttpRequest();
	  this.extend(defaults, options);

	  xhr.open(defaults.method, defaults.url);
	  xhr.onload = function () {
	    if (xhr.status === 200) {
	      defaults.success(JSON.parse(xhr.response));
	    } else {
	      defaults.error(JSON.parse(xhr.response));
	    }
	  };

	  xhr.send(defaults.data);
	};

	document.addEventListener("DOMContentLoaded", execute);


/***/ },
/* 1 */
/***/ function(module, exports) {

	class DOMNodeCollection {
	  constructor(htmlElements) {
	    this.htmlElements = htmlElements;
	  }

	  html(string) {
	    if (string === undefined) {
	      return this.htmlElements[0].innerHTML;
	    } else {
	      this.htmlElements[0].innerHTML = string;
	      return;
	    }
	  }

	  empty() {
	    this.htmlElements.forEach( (htmlElement) => {
	      htmlElement.innerHTML = "";
	    });
	    return;
	  }

	  append(content) {
	    if (content instanceof DOMNodeCollection) {
	      this.htmlElements.forEach( (parentElement) => {
	        content.htmlElements.forEach( (childElement) => {
	          parentElement.innerHTML += childElement.outerHTML;
	        });
	      });
	    } else if (typeof content === 'string') {
	      this.htmlElements.forEach( (htmlElement) => {
	        htmlElement.innerHTML += content;
	      });
	    } else if (content instanceof HTMLElement) {
	      this.htmlElements.forEach( (htmlElement) => {
	        htmlElement.innerHTML += content.outerHTML;
	      });
	    }
	  }

	  attr(name, value) {
	    if (value === undefined) {
	      return this.htmlElements[0].getAttribute(name);
	    } else {
	      this.htmlElements[0].setAttribute(name, value);
	      return;
	    }
	  }

	  addClass(name) {
	    this.htmlElements.forEach( (htmlElement) => {
	      name.split(" ").forEach ( (className) => {
	        htmlElement.classList.add(className);
	      });
	    });
	  }

	  removeClass(name) {
	    this.htmlElements.forEach( (htmlElement) => {
	      htmlElement.classList.remove(name);
	    });
	  }

	  children() {
	    let childrenCollection = [];
	    this.htmlElements.forEach( (htmlElement) => {
	      childrenCollection = childrenCollection.concat(htmlElement.children);
	    });

	    return new DOMNodeCollection(childrenCollection);
	  }

	  parent() {
	    const parentCollection = this.htmlElements.map( (htmlElement) => {
	      return htmlElement.parentElement;
	    });

	    return new DOMNodeCollection(parentCollection);
	  }

	  find(selector) {
	    let queryResult = [];
	    this.htmlElements.forEach( (htmlElement) => {
	      queryResult = queryResult.concat(htmlElement.querySelectorAll(selector));
	    });

	    return new DOMNodeCollection(queryResult);
	  }

	  remove() {
	    this.htmlElements.forEach( (htmlElement) => {
	      htmlElement.innerHTML = "";
	      htmlElement.outerHTML = "";
	    });
	    return;
	  }

	  on(e, cb) {
	    this.htmlElements.forEach( (htmlElement) => {
	      htmlElement.addEventListener(e, cb);
	    });
	    return;
	  }

	  off(e, cb) {
	    this.htmlElements.forEach( (htmlElement) => {
	      htmlElement.removeEventListener(e, cb);
	    });
	    return;
	  }

	  text(textString) {
	    this.htmlElements.forEach( (htmlElement) => {
	      htmlElement.textContent = textString;
	    });
	    return;
	  }

	  get(index) {
	    return this.htmlElements[index];
	  }
	}

	module.exports = DOMNodeCollection;


/***/ }
/******/ ]);