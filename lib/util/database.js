const $jo = require('./../../joQuery/lib/main');

const leaderCompare = (leaders) => {
  const allLeaders = Object.keys(leaders);
  const idx = sortedLeaders.indexOf('lost');
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

  for (let i = 0; i < sortedLeaders.length; i++) {
    let leaderItem = $jo('<li>');
    let leader = sortedLeaders[i];
    leaderItem.text(`${leader} - ${leaders[leader]}`);
    leaderList.append(leaderItem);
  }
};

const removeOldLeaders = (database, sortedLeaders) => {
  if (sortedLeaders.length > 10) {
    for (let i = 10; i < sortedLeaders.length; i++) {
      database.ref(`leaderboard/${sortedLeaders[i]}`).remove();
    }
  }
};

const renderLeaderForm = () => {

};

const Database = {
  fetchHighscores(database) {
    let leaders;
    let sortedLeaders;

    database.ref(`leaderboard/`).on('value', (snapshot) => {
      leaders = snapshot.val();
      sortedLeaders = leaderCompare(leaders);
      populateLeaderboard(sortedLeaders, leaders);
      removeOldLeaders(database, sortedLeaders);
    });

    return [sortedLeaders, leaders];
  },

  setHighscore(database, score) {
    let min;

    database.ref(`leaderboard/low`).on('value', (snapshot) => {
      leaders = snapshot.val();
      sortedLeaders = leaderCompare(leaders);
      populateLeaderboard(sortedLeaders, leaders);
    });
  },
};

module.exports = Database;
