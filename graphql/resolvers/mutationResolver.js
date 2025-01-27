const Game = require('../../App/Games/WheelSpin/models/game');
const Player = require('../../App/Games/WheelSpin/models/player');

const mutationResolver = {
  Mutation: {
    joinGame: async (_, { gameId, name }, { io }) => {
      if (!name) throw new Error('Name is required');

      const game = await Game.findById(gameId);
      if (!game) throw new Error('No available game found');

      const player = new Player({ name, gameId: game._id });
      await player.save();

      game.players.push(player);
      await game.save();

      const gameData = await Game.findById(gameId).populate('players');
      io.emit('playerJoined', player);

      return gameData;
    },

    createGame: async (_, { name }) => {
      const game = new Game();
      await game.save();

      const player = new Player({ name, gameId: game._id });
      await player.save();

      game.players.push(player);
      await game.save();

      return game;
    },

    makeMove: async (_, { gameId, move }, { io }) => {
      const game = await Game.findById(gameId).populate('players');
      if (!game) throw new Error('Game not found');

      const currentPlayer = game.players[game.currentPlayerIndex];
      const nextPlayerIndex =
        (game.currentPlayerIndex + 1) % game.players.length;

      game.moves.push({ playerId: currentPlayer._id, move });
      game.currentPlayerIndex = nextPlayerIndex;
      await game.save();

      io.emit('moveMade', game);
      return game;
    },
  },
};

module.exports = mutationResolver;
