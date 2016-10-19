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
