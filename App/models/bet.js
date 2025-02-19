const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
    player: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true },  
    game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },  
    amount: { type: Number, required: true },  // Bet amount
    currency: { type: String, enum: ["ETH", "BTC", "USDT", "BETS"], required: true },  
    usdEquivalent: { type: Number, required: true },  // Converted amount in USD
    betOption: { type: String, required: true },  // Betting option chosen by the player
    exchangeRate: { type: Number, required: true },  // Store exchange rate at the time of bet
    transactionHash: { type: String, default: null }, // If using blockchain transactions
    timestamp: { type: Date, default: Date.now },
});


const Bet = mongoose.model("Bet", betSchema);
module.exports = Bet;
