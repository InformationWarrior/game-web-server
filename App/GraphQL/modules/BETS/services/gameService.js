const Game = require('../../../../models/game')
const Player = require('../../../../models/player')
const Bet = require('../../../../models/bet')
const { getExchangeRates } = require('./exchangeRateService')

const mongoose = require('mongoose')

const getGames = async () => {
  const games = await Game.find().lean()
  return games.map(game => ({
    id: game._id.toString(),
    name: game.name,
    type: game.type,
    state: game.state,
    players: game.players
  }))
}

const getGameById = async id => {
  const game = await Game.findById(id).populate('players')
  if (!game) throw new Error('Game not found')

  return {
    id: game._id.toString(),
    name: game.name,
    type: game.type,
    state: game.state,
    players: game.players
  }
}

const createGame = async (name, type, maxPlayers, maxParticipants) => {
  if (!['single', 'multiplayer'].includes(type)) {
    throw new Error('Invalid game type. Allowed values: single, multiplayer.')
  }

  const game = new Game({
    name,
    type,
    maxPlayers,
    maxParticipants,
    state: 'waiting',
    enteredPlayers: [],
    participants: [],
    spectators: []
  })

  await game.save()
  return game
}

const enterGame = async (gameId, walletAddress, pubsub) => {
  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    throw new Error('Invalid game ID format')
  }

  const game = await Game.findById(gameId)
  if (!game) {
    throw new Error('Game not found')
  }

  const player = await Player.findOne({ walletAddress })
  if (!player) {
    throw new Error('Player not found')
  }

  // Check if player is already in enteredPlayers
  if (!game.enteredPlayers.some(id => id.equals(player._id))) {
    game.enteredPlayers.push(player._id)
    await game.save()
  }

  const updatedGame = await Game.findById(game._id).populate(
    'enteredPlayers participants spectators'
  )

  const allPlayers = await Player.find()
  pubsub.publish('PLAYER_JOINED', { playerJoined: allPlayers })

  pubsub.publish('GAME_UPDATED', { gameUpdated: updatedGame })

  return updatedGame
}

const participateInGame = async (gameId, walletAddress, pubsub) => {
  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    throw new Error('Invalid game ID format')
  }

  const game = await Game.findById(gameId)
  if (!game) {
    throw new Error('Game not found')
  }

  const player = await Player.findOne({ walletAddress })
  if (!player) {
    throw new Error('Player not found')
  }

  // Check if player has entered the game
  if (!game.enteredPlayers.some(id => id.equals(player._id))) {
    throw new Error('Player must enter the game before participating.')
  }

  // Check if player is already a participant
  if (game.participants.some(id => id.equals(player._id))) {
    throw new Error('Player is already participating.')
  }

  // Check if max participants limit is reached
  if (game.participants.length >= game.maxParticipants) {
    throw new Error('Max participants limit reached.')
  }

  game.participants.push(player._id)
  await game.save()

  const updatedGame = await Game.findById(game._id).populate(
    'enteredPlayers participants spectators'
  )

  pubsub.publish('GAME_UPDATED', { gameUpdated: updatedGame })

  return updatedGame
}

module.exports = {
  getGames,
  getGameById,
  createGame,
  enterGame,
  participateInGame
}
