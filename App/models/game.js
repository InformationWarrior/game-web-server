const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  currentPlayerIndex: { type: Number, default: 0 },
  moves: [{ playerId: mongoose.Schema.Types.ObjectId, move: String }],
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null }
})

const Game = mongoose.model('Game', gameSchema)

module.exports = Game
