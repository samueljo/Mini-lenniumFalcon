const DOMNodeCollection = require("./dom_node_collection");

const funcQueue = [];

const $jo = function (arg) {
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

$jo.extend = function (...objects) {
  const result = objects[0];
  objects.slice(1).forEach( (object) => {
    Object.keys(object).forEach( (key) => {
      result[key] = object[key];
    });
  });

  return result;
};

$jo.ajax = function (options) {
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

module.exports = $jo;
