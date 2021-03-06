const Game = require('./game');
const Util = require('./util/util');
const Database = require('./util/database');
const $jo = require('./../joQuery/lib/main');

class GameView {
  constructor(ctx, loader, database) {
    this.ctx = ctx;
    this.loader = loader;
    this.isMuted = false;
    this.database = database;
    this.notHighscore = true;
    Database.fetchHighscores(this, database);
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

    $jo('.leaderboard').on('click', function(e) {
      this.handleOpenLeaderBoard(e);
    }.bind(this));

    $jo('.close').on('click', function(e) {
      this.handleCloseLeaderBoard(e);
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
    e.preventDefault();
    $jo('.modal').addClass('hidden');
    $jo('.about-modal').addClass('hidden');
  }

  handleOpenModal(e) {
    e.preventDefault();
    $jo('.about-modal').removeClass('hidden');
  }

  handleOpenLeaderBoard(e) {
    e.preventDefault();
    $jo('.leader').removeClass('hidden');
  }

  handleCloseLeaderBoard(e) {
    e.preventDefault();
    $jo('.leader').addClass('hidden');
    this.notHighscore = true;
    e.stopPropagation();
  }

  handleKeyEvent(e) {
    if (e.keyCode === 32 && this.newGame && this.notHighscore) {
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
    this.game = new Game(this.loader);
    this.ship = this.game.addShip();
    this.game.addBackground();
    this.prevTime = 0;
    this.game.playing = true;
    this.setSound();
    this.intervalId = window.setInterval(() => {
      this.animate();
    }, 20);
  }

  setSound() {
    Util.renderSound(this.isMuted);
    this.theme.muted = this.isMuted;
    this.game.hanSounds.forEach((hanSound) => {
      hanSound.muted = this.isMuted;
    });
    this.game.explosion.muted = this.isMuted;
    this.ship.blaster.muted = this.isMuted;
    this.ship.strongpower.muted = this.isMuted;
  }

  toggleSound() {
    if (this.isMuted) {
      this.isMuted = false;
      this.setSound();
    } else {
      this.isMuted = true;
      this.setSound();
    }
  }

  displayPoints() {
    $jo('.points').text(this.game.points);
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
      if (this.currentLow < this.game.points) {
        this.notHighscore = false;
        Database.setHighscore(this.database, this.game.points);
      }
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
