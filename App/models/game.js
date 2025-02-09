const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Game name
  type: { type: String, enum: ["single", "multiplayer"], required: true }, // Single or Multiplayer
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }], // Players in the game
  spectators: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }], // Spectators watching the game
  maxPlayers: { type: Number, default: 1 }, // Maximum players allowed
  state: { type: String, enum: ["waiting", "in-progress", "completed"], default: "waiting" }, // Game state
  entryFee: { type: Number, default: 0 }, // Required fee to join
  prizePool: { type: Number, default: 0 }, // Total reward
  jackpot: { type: Number, default: 0 }, // Bonus prize pool
  betOptions: [{ option: String, odds: Number }], // Betting options and odds
  duration: { type: Number, default: null }, // Duration in seconds
  roundId: { type: String, unique: true }, // Unique game round identifier
  result: { type: mongoose.Schema.Types.Mixed, default: null }, // Stores winner/result details
  rules: { type: [String], default: [] }, // List of game rules
  description: { type: String, default: "" }, // Game instructions
  gameLogs: [
    {
      action: { type: String, required: true }, // e.g., "Player Joined", "Bet Placed"
      player: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  transactionHash: { type: String, default: null }, // Blockchain transaction for game payouts
  currency: { type: String, enum: ["ETH", "BTC", "USDT"], default: "ETH" }, // Multi-currency support
  createdAt: { type: Date, default: Date.now },
});

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
