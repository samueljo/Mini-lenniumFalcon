const $jo = require('./../../joQuery/lib/main');

const leaderCompare = (leaders) => {
  const allLeaders = Object.keys(leaders);
  const idx = allLeaders.indexOf('low');
  const sortedLeaders =
    allLeaders.slice(0, idx).concat(allLeaders.slice(idx + 1));

  sortedLeaders.sort((a, b) => {
    if (leaders[a] < leaders[b]) {
      return 1;
    } else {
      return -1;
    }
  });

  return sortedLeaders;
};

const populateLeaderboard = (sortedLeaders, leaders) => {
  const leaderList = $jo('.leader-list');
  leaderList.empty();

  for (let i = 0; i < sortedLeaders.length; i++) {
    let leaderItem = $jo('<li>');
    let leader = sortedLeaders[i].split('___')[0];
    leaderItem.text(`${leader} - ${leaders[sortedLeaders[i]]}`);
    leaderList.append(leaderItem);
  }
};

const setLowScore = (database, score, leaders, sortedLeaders) => {
  const newLow = leaders[sortedLeaders[9]];
  const oldLow = leaders[sortedLeaders[10]];
  database.ref(`leaderboard/low`).set(newLow);
  console.log('old');
  console.log(sortedLeaders[10], oldLow);
  console.log('new');
  console.log(sortedLeaders[9], newLow);
  if (oldLow) {
    database.ref(`leaderboard/${sortedLeaders[10]}`).remove();
  }
};

const renderLeaderForm = (database, score, newHighScoreCB) => {
  $jo('.leader-form').removeClass('hidden');
  $jo('.form').htmlElements[0].value = '';
  $jo('.l-form').on('submit', (e) => {
    e.preventDefault();
    const name = $jo('.form').htmlElements[0].value;
    const salt1 = Math.floor(Math.random() * 1000);
    const salt2 = Math.floor(Math.random() * 1000);
    const leaderName = `${name}___${salt1 * salt2}`;
    database.ref(`leaderboard/${leaderName}`).set(score);
    $jo('.leader-form').addClass('hidden');
    $jo('.leader').removeClass('hidden');
    newHighScoreCB();
  });
};

const Database = {
  fetchHighscores(GameView, database) {
    let leaders;
    let sortedLeaders;

    database.ref(`leaderboard/`).on('value', (snapshot) => {
      leaders = snapshot.val();
      sortedLeaders = leaderCompare(leaders);
      GameView.currentLow = leaders['low'];
      populateLeaderboard(sortedLeaders, leaders);
    });
  },

  setHighscore(database, score) {
    console.log('outer fn');
    console.log(score);
    const newHighScoreCB = () => {
      console.log('highscoreCB');
      console.log(score);
      database.ref(`leaderboard/`).once('value').then((snapshot) => {
        const leaders = snapshot.val();
        const sortedLeaders = leaderCompare(leaders);
        setLowScore(database, score, leaders, sortedLeaders);
      });
    };

    renderLeaderForm(database, score, newHighScoreCB);
  },
};

module.exports = Database;
