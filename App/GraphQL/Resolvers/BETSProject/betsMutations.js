const { createGame, enterGame, leaveGame, removeParticipants, removeBets } = require("../../Services/gameService");
const { createPlayer } = require('../../Services/gameService');
const { placeBetAndParticipate } = require("../../Services/placeBetAndParticipate");
const pubsub = require("../../pubsub");

const betsMutations = {
    createGame: async (_, { name, type, maxPlayers, maxParticipants }) => {
        return await createGame(name, type, maxPlayers, maxParticipants);
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

    removeParticipants: async (_, { gameId }) => {
        return await removeParticipants(gameId, pubsub);
    },

    removeBets: async (_, { gameId }) => {
        return await removeBets(gameId, pubsub);
    },

    placeBetAndParticipate: async (_, { gameId, walletAddress, betAmount, currency }) => {
        return await placeBetAndParticipate(gameId, walletAddress, betAmount, currency, pubsub);
    }
};

module.exports = betsMutations;
