const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["single", "multiplayer"], required: true },

  // ✅ Only tracks players who entered but haven't placed a bet yet
  enteredPlayers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
  spectators: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],

  maxPlayers: { type: Number, default: 500 },

  // Use a game-wide state if needed (e.g., "active", "paused", "ended").
  state: { type: String, enum: ["active", "paused", "ended"], default: "active" },
  entryFee: { type: Number, default: 0 },
  prizePool: { type: Number, default: 0 },
  jackpot: { type: Number, default: 0 },
  betOptions: [{ option: String, odds: Number }], // Betting choices

  duration: { type: Number, default: null },
  expiresAt: { type: Date, default: null },
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

  // ✅ Only references rounds; does not store participants/bets
  rounds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Round" }],
  latestRound: { type: mongoose.Schema.Types.ObjectId, ref: "Round", default: null },
  totalRounds: { type: Number, default: 0 }, // Count total rounds for this game

  startTime: { type: Date, default: null },
  endTime: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
  autoStart: { type: Boolean, default: false },

  leaderboard: [
    {
      player: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
      score: Number
    }
  ],
  topWinners: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player", default: [] }],
  betLimits: { min: Number, max: Number },
  houseEdge: { type: Number, default: 0.05 },
  jackpotWinners: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
  mode: { type: String, enum: ["standard", "tournament", "practice"], default: "standard" },
  customRules: { type: [String], default: [] },
  config: { type: mongoose.Schema.Types.Mixed, default: {} } // Game-specific settings
});

// ✅ Indexing for performance
gameSchema.index({ state: 1, createdAt: -1 });

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
