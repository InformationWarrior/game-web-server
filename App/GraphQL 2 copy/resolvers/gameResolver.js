const Game = require('../../models/game');
const Player = require('../../models/player');

const gameResolver = {
  Query: {
    games: async () => await Game.find().populate('players'),
    game: async (_, { id }) => {
      const game = await Game.findById(id).populate('players');
      if (!game) throw new Error('Game not found');
      return game;
    },
  },
};

module.exports = gameResolver;
