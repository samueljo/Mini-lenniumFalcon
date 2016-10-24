## Mini-lennium Falcon

### Background

Mini-lennium Falcon is a spin off of the classic game Helicopter crossed over with the beloved, legendary starship the Millennium Falcon from the Star Wars series. Fly Han and Chewbacca through space but be careful to avoid hitting asteroids.

[Delayed bonus: The backend of this game is built using my own MVC framework Laris].

### Functionality & MVP

With Mini-lennium Falcon, users will be able to:
- [ ] Seamlessly navigate through space to avoid asteroids.
- [ ] High scores will be saved in database.
- [ ] Modal to explain directions and rules
- [ ] Production README

### Wireframes

The app will be a single screen with links to the Github repo, my LinkedIn, portfolio, and the About modal. There will also be a button to toggle the sound which can also be toggled with 's'.

<img src="./docs/main.png" />

### Architecture & Technologies

This project will be implemented using the following technologies:

- [Delayed bonus: Laris light-weight MVC framework]
- Vanilla JavaScript
- `Easel.js` with `HTML5 Canvas` for DOM manipulation and rendering
- Webpack to bundle and serve various scripts

Scripts:
`moving_object.js`
`ship.js`
`wormhole.js`
`game.js`
`game_view.js`

Bonus:
- LRU cache for environment objects

### Implementation Timeline

**Day 1**
- Setup Node modules and webpack and install `Easel.js`
- Create basic entry file with all of the necessary script skeletons
- Learn how to use `Easel` and refresh on `Canvas` to figure out logic for rendering an object and being able to move the environment as well as the object.

**Day 2**
- Build out the `game`, `game_view`, `moving_object`, `ship`, and `wormhole`
- Be able to move the ship up and down
- Have environment move at constant speed to the left
- Collisions logic

**Day 3**
- Implement backend for saving high scores
- Refactor to implement LRU cache
- Implement 'About' modal
- Style the frontend

**Day 4**
- Debug & Finish styling
