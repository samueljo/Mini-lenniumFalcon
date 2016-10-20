const Sprite = {
  createImage(imgPath) {
    const image = new Image();
    image.src = imgPath;
    return image;
  }
};

module.exports = Sprite;
