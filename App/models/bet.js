const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
    player: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ["ETH", "BTC", "USDT", "BETS"], required: true },
    usdEquivalent: { type: Number, required: true },
    betOption: { type: String, required: true },
    exchangeRate: { type: Number, required: true },
    transactionHash: { type: String, default: null },
    timestamp: { type: Date, default: Date.now },
    multiBet: { type: Boolean, default: false },
    strategy: { type: String, enum: ["manual", "auto", "martingale"], default: "manual" },
    autoBetSettings: { type: mongoose.Schema.Types.Mixed, default: {} }
});

// ✅ Index for faster queries
betSchema.index({ game: 1, player: 1 });

const Bet = mongoose.model("Bet", betSchema);
module.exports = Bet;
