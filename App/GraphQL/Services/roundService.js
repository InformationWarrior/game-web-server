const pubsub = require('../pubsub');
const Game = require("../../models/game");
const Round = require("../../models/round");
const Bet = require("../../models/bet");
const Player = require("../../models/player");
const mongoose = require("mongoose");

const getRound = async (gameId, walletAddress) => {
    try {
        const latestRound = await Round.findOne({ game: gameId })
            .sort({ roundNumber: -1 })
            .populate("participants")
            .populate({
                path: "bets",
                populate: { path: "player" }
            })
            .populate("winner");

        if (!latestRound) {
            throw new Error("No round found for this game.");
        }

        const totalBetAmount = latestRound.bets.reduce((sum, bet) => sum + (bet.amount || 0), 0);

        const myBet = latestRound.bets.find((bet) => bet.player.walletAddress === walletAddress);
        const myBetAmount = myBet ? myBet.amount : 0;

        const winChance = totalBetAmount > 0 ? (myBetAmount / totalBetAmount) * 100 : 0;

        return {
            _id: latestRound._id,
            gameId: latestRound.game.toString(),
            roundNumber: latestRound.roundNumber,
            participants: latestRound.participants,
            bet: myBet || null,
            bets: latestRound.bets,
            totalBetAmount,
            winChance,
            winner: latestRound.winner,
            startedAt: latestRound.startedAt ? latestRound.startedAt.toISOString() : null,
        };
    } catch (error) {
        console.error("Error fetching latest round:", error);
        throw new Error("Failed to fetch round.");
    }
};

module.exports = {
    getRound,
};
