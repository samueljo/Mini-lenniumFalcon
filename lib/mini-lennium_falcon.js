const Game = require('./game');
const GameView = require('./game_view');

document.addEventListener('DOMContentLoaded', function() {
  // const canvas = document.getElementsByTagName('canvas')[0];
  // canvas.width = Game.DIM_X;
  // canvas.height = Game.DIM_Y;
  //
  // const ctx = canvas.getContext("2d");

  const stage = new createjs.Stage('canvas');

  const game = new Game();
  const gameView = new GameView(game, stage);
  gameView.start();
});
