class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.ship = this.game.addShip();
    this.accelerating = false;
  }

  bindKeyHandlers() {
    key("space", () => { this.ship.accelerate(-2.5); });
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
