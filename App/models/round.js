const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema({
    game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    roundNumber: { type: Number, required: true },

    // ✅ Tracks players who have placed bets in this round
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],

    // ✅ Bets are now part of rounds instead of games
    bets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bet" }],
    totalBetAmount: { type: Number, default: 0 }, // Total amount wagered in this round
    profitForHouse: { type: Number, default: 0 }, // (Total Bets * House Edge %)

    winner: { type: mongoose.Schema.Types.ObjectId, ref: "Player", default: null },
    winningBetOption: { type: String, default: null },
    prizeDistributed: { type: Boolean, default: false },

    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date, default: null },

    state: { type: String, enum: ["waiting", "in-progress", "completed"], default: "waiting" }
});

// ✅ Ensures unique round numbers per game
roundSchema.index({ game: 1, roundNumber: 1 }, { unique: true });

const Round = mongoose.model("Round", roundSchema);
module.exports = Round;
