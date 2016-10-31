const Game = require('./game');
const GameView = require('./game_view');

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementsByTagName('canvas')[0];
  canvas.width = Game.DIM_X;
  canvas.height = Game.DIM_Y;

  const ctx = canvas.getContext('2d');

  const manifest = [
    {src: "sprites/falcon0b.png", id: "falcon0"},
    {src: "sprites/falcon1b.png", id: "falcon1"},
    {src: "sprites/falcon3b.png", id: "falcon3"},
    {src: "sprites/falcon4b.png", id: "falcon4"},

    {src: "sprites/asteroid0.png", id: "asteroid0"},
    {src: "sprites/asteroid1.png", id: "asteroid1"},
    {src: "sprites/asteroid2.png", id: "asteroid2"},
    {src: "sprites/asteroid3.png", id: "asteroid3"},

    {src: "sprites/explosion.png", id: "explosion"},

    {src: "sprites/powerup0.png", id: "powerup0"},

    {src: "sprites/powerup1.png", id: "powerup1"},

    {src: "space.png", id: "background"}
  ];

  const loader = new createjs.LoadQueue(false);
  loader.loadManifest(manifest, true, "./assets/");

  const gameView = new GameView(ctx, loader);

  const loadGame = () => {
    gameView.load();
  };

  loader.addEventListener("complete", loadGame);
});
