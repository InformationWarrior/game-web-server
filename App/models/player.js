const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true }, // Crypto wallet as unique identifier
  username: { type: String, default: null }, // Optional username
  profileImage: { type: String, default: null }, // Profile picture URL
  balance: { type: Number, default: 0 }, // Balance in tokens/credits
  totalWins: { type: Number, default: 0 }, // Number of games won
  totalLosses: { type: Number, default: 0 }, // Number of games lost
  gamesPlayed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }], // List of games played
  rank: { type: String, enum: ["bronze", "silver", "gold", "platinum"], default: "bronze" }, // Player rank/tier
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: "Player", default: null }, // Who referred this player
  referralCount: { type: Number, default: 0 }, // Successful referrals count
  transactions: [
    {
      type: { type: String, enum: ["deposit", "withdrawal", "game-bet", "game-win"], required: true }, 
      amount: { type: Number, required: true },
      currency: { type: String, enum: ["ETH", "BTC", "USDT"], default: "ETH" }, // Multi-currency support
      transactionHash: { type: String, default: null }, // Blockchain transaction ID
      timestamp: { type: Date, default: Date.now }
    }
  ],
  sessionToken: { type: String, default: null }, // Token for active sessions
  createdAt: { type: Date, default: Date.now },
});

const Player = mongoose.model("Player", playerSchema);
module.exports = Player;
