const Player = require('../../../../App/Games/WheelSpin/models/player');

const playerResolver = {
  Query: {
    players: async () => await Player.find(),
  },
};

module.exports = playerResolver;
