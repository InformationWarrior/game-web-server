const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema({
    game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true }, // Game reference
    roundNumber: { type: Number, required: true }, // Unique round number per game
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }], // Players in this round
    bets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bet" }], // Bets placed in this round
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "Player", default: null }, // Round winner
    winningBetOption: { type: String, default: null }, // Winning bet option
    prizeDistributed: { type: Boolean, default: false }, // Has prize been distributed?
    startedAt: { type: Date, default: Date.now }, // Round start time
    endedAt: { type: Date, default: null }, // Round end time
    state: { type: String, enum: ["waiting", "in-progress", "completed"], default: "waiting" } // Round state
});

// Ensures unique round numbers per game
roundSchema.index({ game: 1, roundNumber: 1 }, { unique: true });

const Round = mongoose.model("Round", roundSchema);
module.exports = Round;
