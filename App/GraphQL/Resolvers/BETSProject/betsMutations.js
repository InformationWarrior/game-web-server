const { createGame, enterGame, leaveGame } = require("../../Services/gameService");
const { createPlayer } = require('../../Services/gameService');
const { participateInGame, removeParticipants } = require("../../Services/gameService");
const { placeBet } = require("../../Services/placeBetService");
const pubsub = require("../../pubsub");

const betsMutations = {
    createGame: async (_, { name, type, maxPlayers, maxParticipants }) => {
        return await createGame(name, type, maxPlayers, maxParticipants);
    },

    enterGame: async (_, { gameId, walletAddress }) => {
        return await enterGame(gameId, walletAddress);
    },

    leaveGame: async (_, { gameId, walletAddress }) => {
        return await leaveGame(gameId, walletAddress);
    },

    createPlayer: async (_, { walletAddress, username, balance, currency }) => {
        return await createPlayer(walletAddress, username, balance, currency);
    },

    participateInGame: async (_, { gameId, walletAddress }) => {
        return await participateInGame(gameId, walletAddress, pubsub);
    },

    removeParticipants: async (_, { gameId }) => {
        return await removeParticipants(gameId);
    },

    placeBet: async (_, { gameId, walletAddress, amount, currency, totalPlayerRounds }) => {
        return await placeBet(gameId, walletAddress, amount, currency, totalPlayerRounds, pubsub);
    }
};

module.exports = betsMutations;
