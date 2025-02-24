const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
    player: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    round: { type: mongoose.Schema.Types.ObjectId, ref: "Round", required: true }, // ✅ Added round for efficient tracking
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

    // ✅ Auto-delete bets after a certain time to avoid manual cleanup
    // expiresAt: { type: Date, index: { expires: "10m" } }, // 10 minutes after round ends
});

// ✅ Optimized Indexing Strategy
betSchema.index({ game: 1, round: 1, player: 1 }); // Queries related to game, round, and player
betSchema.index({ timestamp: -1 }); // Queries sorting by time

const Bet = mongoose.model("Bet", betSchema);
module.exports = Bet;
