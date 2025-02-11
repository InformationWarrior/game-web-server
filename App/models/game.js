const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Game name
  type: { type: String, enum: ["single", "multiplayer"], required: true }, // Single or Multiplayer

  enteredPlayers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }], // Players who enter the game
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }], // Players who actually bet & play
  spectators: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }], // Players who just watch

  maxPlayers: { type: Number, default: 500 }, // Max total players (entered + participants)
  maxParticipants: { type: Number, default: 10 }, // Max actual players who can bet & play

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
      action: { type: String, required: true }, // "Player Entered", "Bet Placed"
      player: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
      timestamp: { type: Date, default: Date.now }
    }
  ],

  transactionHash: { type: String, default: null }, // Blockchain transaction for game payouts
  currency: { type: String, enum: ["ETH", "BTC", "USDT", "BETS"], default: "ETH" }, // Multi-currency support
  createdAt: { type: Date, default: Date.now },
});

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
