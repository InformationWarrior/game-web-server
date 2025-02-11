const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["single", "multiplayer"], required: true },
  
  enteredPlayers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
  spectators: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],

  maxPlayers: { type: Number, default: 500 },
  maxParticipants: { type: Number, default: 10 },

  state: { type: String, enum: ["waiting", "in-progress", "completed"], default: "waiting" },
  entryFee: { type: Number, default: 0 },
  prizePool: { type: Number, default: 0 },
  jackpot: { type: Number, default: 0 },
  betOptions: [{ option: String, odds: Number }],  
  totalBetsAmount: { type: Number, default: 0 }, // New: Track total bets
  winningBetOption: { type: String, default: null }, // New: Store winning option

  duration: { type: Number, default: null },
  roundId: { type: String, unique: true },
  expiresAt: { type: Date, default: null }, // New: Set expiry for auto-closing games
  result: { type: mongoose.Schema.Types.Mixed, default: null },
  rules: { type: [String], default: [] },
  description: { type: String, default: "" },

  gameLogs: [
    {
      action: { type: String, required: true },
      player: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
      timestamp: { type: Date, default: Date.now }
    }
  ],

  transactionHash: { type: String, default: null },
  currency: { type: String, enum: ["ETH", "BTC", "USDT", "BETS"], default: "ETH" },
  createdAt: { type: Date, default: Date.now },
});


const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
