const pubsub = require('../../pubsub');
const mongoose = require("mongoose");
const ResetState = require('./ResetState');
const Game = require("../../../models/game");
const Round = require("../../../models/round");
const Bet = require("../../../models/bet");

const GAME_STATES = {
    RESET: { gameState: 'RESET', duration: 2, mappedState: 'waiting' },
    BETTING: { gameState: 'BETTING', duration: 30, mappedState: 'in-progress' },
    RUNNING: { gameState: 'RUNNING', duration: 2, mappedState: 'in-progress' },
    END: { gameState: 'END', duration: 2, mappedState: 'completed' }
};

class GameContext {
    constructor(game) {
        this.game = game;
        this.state = new ResetState(game);
    }

    async setState(newState) {
        this.state = newState;
        const stateKey = this.state.getStateKey();
        const mappedState = GAME_STATES[stateKey]?.mappedState || "waiting";

        console.log(`🔄 setState called with: ${stateKey}, mappedState: ${mappedState}`);

        await this.updateRoundStateInDB(this.game._id, mappedState);

        if (pubsub) {
            console.log(`📢 Publishing event: GAME_STATUS_UPDATED with state: ${stateKey}`);
            pubsub.publish("GAME_STATUS_UPDATED", {
                gameStatusUpdated: {
                    gameState: stateKey,
                    remainingTime: GAME_STATES[stateKey]?.duration
                }
            });
        }

        if (GAME_STATES[stateKey]) {
            const duration = GAME_STATES[stateKey].duration * 1000;
            setTimeout(() => this.state.handle(this), duration);
        } else {
            console.error(`⚠️ Unknown game state: ${stateKey}`);
        }
    }

    async updateRoundStateInDB(gameId, newState) {
        try {
            if (!mongoose.Types.ObjectId.isValid(gameId)) return;

            const game = await Game.findById(gameId);
            if (!game || !game.latestRound) {
                console.error("⚠️ No latest round found for this game.");
                return;
            }

            const latestRound = await Round.findById(game.latestRound);
            if (!latestRound) return console.error("⚠️ Latest round not found in Round collection.");

            latestRound.state = newState;

            if (newState === "in-progress") {
                latestRound.startedAt = new Date();
            } else if (newState === "completed") {
                latestRound.endedAt = new Date();
            }

            await latestRound.save();

            console.log(`✅ Round ${latestRound.roundNumber} state updated to: ${newState}`);

        } catch (error) {
            console.error("❌ Error updating round state in DB:", error);
        }
    }

    async incrementRound() {
        try {
            if (!mongoose.Types.ObjectId.isValid(this.game._id)) return;

            const game = await Game.findById(this.game._id);
            if (!game) return console.error("Game not found!");

            const existingRound = await Round.findOne({
                game: this.game._id,
                roundNumber: game.totalRounds + 1
            });

            if (existingRound) {
                console.warn(`⚠️ Round ${game.totalRounds + 1} already exists. Skipping duplicate creation.`);
                return;
            }

            const newRound = new Round({
                game: this.game._id,
                roundNumber: game.totalRounds + 1,
                participants: [],
                bets: [],
                winner: null,
                state: "waiting",
                startedAt: new Date()
            });

            await newRound.save();

            game.rounds.push(newRound._id);
            game.latestRound = newRound._id;
            game.totalRounds += 1;
            await game.save();

            console.log(`✅ New Round ${game.totalRounds} started for Game ${this.game._id}`);

            // Publish new round data
            pubsub.publish("ROUND_UPDATED", {
                roundUpdated: {
                    _id: newRound._id,
                    gameId: this.game._id.toString(),
                    roundNumber: newRound.roundNumber,
                    participants: [],
                    bets: [],
                    totalBetAmount: 0,
                    winner: null,
                    startedAt: newRound.startedAt ? newRound.startedAt.toISOString() : null,
                },
            });

        } catch (error) {
            console.error("❌ Error incrementing round:", error);
        }
    }

    start() {
        this.state.handle(this);
    }
}

module.exports = GameContext;
