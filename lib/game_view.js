const Game = require('./game');

class GameView {
  constructor(ctx) {
    this.ctx = ctx;
  }

  bindKeyHandlers() {
    $jo(window).on('keydown', function(e) {
      this.handleKeyEvent(e);
    }.bind(this));

    $jo(window).on('keyup', function(e) {
      this.handleKeyRelease(e);
    }.bind(this));

    $jo('.close').on('click', function(e) {
      this.handleCloseModal(e);
    }.bind(this));

    $jo('.about').on('click', function(e) {
      this.handleOpenModal(e);
    }.bind(this));

    $jo('.start').on('click', function(e) {
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

  unbindKeyHandlers() {
    $jo(window).off('keydown', function(e) {
      this.handleKeyEvent(e);
    }.bind(this));

    $jo(window).off('keyup', function(e) {
      this.handleKeyRelease(e);
    }.bind(this));
  }

  handleCloseModal(e) {
    $jo('.modal').addClass('hidden');
  }

  handleOpenModal(e) {
    $jo('.modal').removeClass('hidden');
  }

  handleKeyEvent(e) {
    if (e.keyCode === 32) {
      this.ship.accel = true;
      this.ship.rot = 150 * Math.PI / 180;
    } else if (e.keyCode === 83) {
      this.toggleSound();
    }
  }

  handleKeyRelease(e) {
    if (e.keyCode === 32) {
      this.ship.accel = false;
      this.ship.rot = 210 * Math.PI / 180;
    }
  }

  start() {
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
    if (this.theme.paused) {
      this.theme.play();
    } else {
      this.theme.pause();
    }
  }

  displayPoints() {
    $jo('.points').text(this.game.points);
    $jo('.highscore').text(`Highscore: 0`);
    this.game.points += 5;
  }

  animate(time) {
    if (this.game.playing) {
      this.game.step();
      this.displayPoints();
      this.game.draw(this.ctx);
    } else {
      this.unbindKeyHandlers();
      window.clearInterval(this.intervalId);
    }

    if (this.game.lost && !this.theme.paused) {
      this.theme.pause();
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
