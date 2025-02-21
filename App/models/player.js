const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  username: { type: String, default: null },
  profileImage: { type: String, default: null },
  balance: { type: Number, default: 0 },
  totalWins: { type: Number, default: 0 },
  totalLosses: { type: Number, default: 0 },
  totalBetAmount: { type: Number, default: 0 },
  lastActiveAt: { type: Date, default: Date.now },
  gamesPlayed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
  rank: { type: String, enum: ["bronze", "silver", "gold", "platinum"], default: "bronze" },
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: "Player", default: null },
  referralCount: { type: Number, default: 0 },

  transactions: [
    {
      type: { type: String, enum: ["deposit", "withdrawal", "game-bet", "game-win"], required: true },
      amount: { type: Number, required: true },
      currency: { type: String, enum: ["ETH", "BTC", "USDT", "BETS"], default: "ETH" },
      transactionHash: { type: String, default: null },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  sessionToken: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },

  // 🔹 NEW ADDITIONS FOR FUTURE-PROOFING
  highestWin: { type: Number, default: 0 },
  longestWinStreak: { type: Number, default: 0 },
  averageBetAmount: { type: Number, default: 0 },
  achievements: [
    {
      title: String,
      description: String,
      earnedAt: { type: Date, default: Date.now }
    }
  ],
  preferences: {
    sound: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: false }
  }
});

const Player = mongoose.model("Player", playerSchema);
module.exports = Player;
