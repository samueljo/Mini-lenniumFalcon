const leaderCompare = (leaders) => {
  const sortedLeaders = Object.keys(leaders);

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

const Database = {
  fetchHighscores(database) {
    let leaders;
    let sortedLeaders;

    database.ref(`leaderboard/`).on('value', (snapshot) => {
      leaders = snapshot.val();
      sortedLeaders = leaderCompare(leaders);
      populateLeaderboard(sortedLeaders, leaders);
    });

    return [sortedLeaders, leaders];
  },

  setHighscore(database, score) {

  },
};

module.exports = Database;
