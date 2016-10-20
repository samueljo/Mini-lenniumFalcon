class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.ship = this.game.addShip();
  }

  bindKeyHandlers() {
    $jo(window).on('keypress', function(e) {
      this.handleKeyEvent(e);
    }.bind(this));
  }

  handleKeyEvent(e) {
    if (e.keyCode === 32) {
      this.ship.accelerate(-2.7);
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
