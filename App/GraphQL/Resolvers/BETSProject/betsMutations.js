const { createGame, enterGame, leaveGame } = require("../../Services/gameService");
const { createPlayer } = require('../../Services/gameService');
const { placeBetAndParticipate } = require("../../Services/placeBetAndParticipate");
const pubsub = require("../../pubsub");

const betsMutations = {
    createGame: async (_, { name, type, maxPlayers }) => {
        return await createGame(name, type, maxPlayers);
    },

    enterGame: async (_, { gameId, walletAddress }) => {
        return await enterGame(gameId, walletAddress, pubsub);
    },

    leaveGame: async (_, { gameId, walletAddress }) => {
        return await leaveGame(gameId, walletAddress);
    },

    createPlayer: async (_, { walletAddress, username, balance, currency }) => {
        return await createPlayer(walletAddress, username, balance, currency);
    },

    placeBetAndParticipate: async (_, { gameId, walletAddress, betAmount, currency }) => {
        return await placeBetAndParticipate(gameId, walletAddress, betAmount, currency, pubsub);
    }
};

module.exports = betsMutations;
