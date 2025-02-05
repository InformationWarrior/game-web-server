const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({

    //Check unique
    walletAddress: { type: String, required: true, unique: true },
    score: { type: Number, default: 0 },
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' }
})

const Player = mongoose.model('Player', playerSchema)

module.exports = Player
