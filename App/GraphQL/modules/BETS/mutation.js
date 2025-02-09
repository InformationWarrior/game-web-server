const { createGame, joinGame } = require("./services/gameService");
const { createPlayer } = require("./services/playerService");
const { saveWalletData } = require('./services/walletService');

const mutationResolver = {
    Mutation: {
        createPlayer: async (_, { walletAddress, username }) => {
            return await createPlayer(walletAddress, username);
        },

        createGame: async (_, { name, type, maxPlayers }) => {
            return await createGame(name, type, maxPlayers);
        },

        joinGame: async (_, { gameId, walletAddress }, { pubsub }) => {
            return await joinGame(gameId, walletAddress, pubsub);
        },

        saveWalletData: async (_, { address, balance, currency }) => {
            return await saveWalletData(address, balance, currency);
        },
    },
};

module.exports = mutationResolver;
