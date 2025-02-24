const mongoose = require("mongoose");

const betHistorySchema = new mongoose.Schema({
    player: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    round: { type: mongoose.Schema.Types.ObjectId, ref: "Round", required: true }, // ✅ Keeps track of the specific round
    amount: { type: Number, required: true },
    currency: { type: String, enum: ["ETH", "BTC", "USDT", "BETS"], required: true },
    usdEquivalent: { type: Number, required: true },
    betOption: { type: String, required: true },
    exchangeRate: { type: Number, required: true },
    transactionHash: { type: String, default: null },
    strategy: { type: String, enum: ["manual", "auto", "martingale"], default: "manual" },
    multiBet: { type: Boolean, default: false },
    autoBetSettings: { type: mongoose.Schema.Types.Mixed, default: {} },

    // ✅ Additional fields for efficient history tracking
    gameStateAtBet: { type: String, required: true }, // "pre-spin", "in-progress", "completed"
    winAmount: { type: Number, default: 0 }, // Stores winnings if bet wins
    isWin: { type: Boolean, default: false }, // Flag to mark if bet was successful
    archivedAt: { type: Date, default: Date.now }, // When the bet was moved to history
});

// ✅ Indexing for efficient retrieval
betHistorySchema.index({ game: 1, round: 1, player: 1, isWin: 1 }); // Fast lookup of bets by round & game
betHistorySchema.index({ player: 1, archivedAt: -1 }); // Sorting bets by time for player

const BetHistory = mongoose.model("BetHistory", betHistorySchema);
module.exports = BetHistory;
