const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    player: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true },
    type: {
        type: String,
        enum: ["deposit", "withdrawal", "game-bet", "game-win", "referral-bonus"],
        required: true
    },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ["ETH", "BTC", "USDT", "BETS"], required: true },
    transactionHash: { type: String, default: null },
    status: { type: String, enum: ["pending", "confirmed", "failed"], default: "pending" },
    timestamp: { type: Date, default: Date.now }
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
