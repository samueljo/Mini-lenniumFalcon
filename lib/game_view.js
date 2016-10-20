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
