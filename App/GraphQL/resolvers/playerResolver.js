const Player = require('../../models/player');

const playerResolver = {
  Query: {
    players: async () => await Player.find(),
  },
};

module.exports = playerResolver;
