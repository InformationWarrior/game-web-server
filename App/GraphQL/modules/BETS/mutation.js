const { createPlayer } = require('./services/playerService')
const {
  createGame,
  enterGame,
  participateInGame
} = require('./services/gameService')
const { saveWalletData } = require('./services/walletService')
const pubsub = require('../../pubsub')

const mutationResolver = {
  Mutation: {
    createPlayer: async (_, { walletAddress, username }) => {
      return await createPlayer(walletAddress, username)
    },

    createGame: async (_, { name, type, maxPlayers, maxParticipants }) => {
      return await createGame(name, type, maxPlayers, maxParticipants)
    },

    enterGame: async (_, { gameId, walletAddress }) => {
      return await enterGame(gameId, walletAddress, pubsub)
    },

    participateInGame: async (_, { gameId, walletAddress }, { pubsub }) => {
      return await participateInGame(gameId, walletAddress, pubsub)
    },

    saveWalletData: async (_, { address, balance, currency }) => {
      return await saveWalletData(address, balance, currency)
    }
  }
}

module.exports = mutationResolver
