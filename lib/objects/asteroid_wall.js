// const Util = require("./util");
// const Asteroid = require("./asteroid");
//
// const DEFAULTS = {
//   UPPER_POS_Y: 5 * Math.random(),
//   LOWER_POS_Y: 400 - (5 * Math.random()),
//   POS_X: 900 * Math.random(),
//   DIM: 10,
//   PATH: 'assets/sprites/asteroid',
//   RADIUS: 5,
//   VELOCITY: [-1, 0]
// };
//
// const AsteroidWall = {
//   createWall(game) {
//     const wall = [];
//     for (let i = 0; i < 2000; i++) {
//       let spriteNum = Math.floor(Math.random() * 4);
//       let yPos = (i % 2 === 0) ? DEFAULTS.UPPER_POS_Y : DEFAULTS.LOWER_POS_Y;
//       let options = {
//         pos: [DEFAULTS.POS_X, yPos],
//         radius: DEFAULTS.RADIUS,
//         dim: DEFAULTS.DIM,
//         path: DEFAULTS.PATH + `${spriteNum}.png`,
//         vel: DEFAULTS.VELOCITY,
//         game: game
//       };
//       let miniAsteroid = new Asteroid(options);
//       wall.push(miniAsteroid);
//     }
//     return wall;
//   }
// };
//
// module.exports = AsteroidWall;
