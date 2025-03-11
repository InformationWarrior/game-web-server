const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
    player: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    round: { type: mongoose.Schema.Types.ObjectId, ref: "Round", required: true }, // Tracks the specific round
    amount: { type: Number, required: true },
    currency: { type: String, enum: ["ETH", "BTC", "USDT", "BETS"], required: true },
    usdEquivalent: { type: Number, required: true },
    betOption: { type: String, required: true },
    exchangeRate: { type: Number, required: true },
    transactionHash: { type: String, default: null },
    strategy: { type: String, enum: ["manual", "auto", "martingale"], default: "manual" },
    multiBet: { type: Boolean, default: false },
    autoBetSettings: { type: mongoose.Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now },

    // ✅ History fields (previously in BetHistory)
    gameStateAtBet: { type: String, required: false }, // "pre-spin", "in-progress", "completed"
    winAmount: { type: Number, default: 0 }, // Stores winnings if bet wins
    isWin: { type: Boolean, default: false }, // Marks if the bet was successful
    archivedAt: { type: Date, default: null }, // When the bet was considered historical (null for active bets)
});

// ✅ Optimized Indexing Strategy
betSchema.index({ game: 1, round: 1, player: 1 }); // Fast lookup of bets by round & game
betSchema.index({ timestamp: -1 }); // Sorting by time for active bets
betSchema.index({ player: 1, archivedAt: -1 }); // Sorting historical bets for players

const Bet = mongoose.model("Bet", betSchema);
module.exports = Bet;
