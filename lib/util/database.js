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

const populateLeaderboard = (database, sortedLeaders, leaders) => {
  const leaderList = $jo('.leader-list');
  leaderList.empty();

  for (let i = 0; i < sortedLeaders.length; i++) {
    let leaderItem = $jo('<li>');
    let leader = sortedLeaders[i];
    leaderItem.text(`${leader} - ${leaders[leader]}`);
    leaderList.append(leaderItem);
  }
};

const setLowScore = (database, score, leaders, sortedLeaders) => {
  const newLow = leaders[sortedLeaders[0]];
  database.ref(`leaderboard/low`).set(newLow);
};

const renderLeaderForm = (database, score) => {
  $jo('.leader-form').removeClass('hidden');
  $jo('.form-button').on('click', (e) => {
    const name = $jo('.form').htmlElements[0].value;
    const salt1 = Math.floor(Math.random() * 1000);
    const salt2 = Math.floor(Math.random() * 1000);
    const leaderName = `${name}___${salt1 * salt2}`;
    database.ref(`leaderboard/${leaderName}`).set(score);
  });
};

const Database = {
  fetchHighscores(database) {
    let leaders;
    let sortedLeaders;

    database.ref(`leaderboard/`).on('value', (snapshot) => {
      leaders = snapshot.val();
      sortedLeaders = leaderCompare(leaders);
      populateLeaderboard(database, sortedLeaders, leaders);
    });
  },

  setHighscore(database, score) {
    let leaders;
    let sortedLeaders;

    database.ref(`leaderboard/`).on('value', (snapshot) => {
      leaders = snapshot.val();
      sortedLeaders = leaderCompare(leaders);
      const lowScore = leaders['low'];

      if (score > lowScore) {
        renderLeaderForm(database, score);
        setLowScore(database, score, leaders, sortedLeaders);
      }
    });
  },
};

module.exports = Database;
