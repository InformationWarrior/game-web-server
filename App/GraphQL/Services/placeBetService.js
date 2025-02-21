const Game = require("../../models/game");
const Player = require("../../models/player");
const Bet = require("../../models/bet");
const mongoose = require("mongoose");

const placeBet = async (gameId, walletAddress, amount, currency, totalPlayerRounds, pubsub) => {
    if (!mongoose.Types.ObjectId.isValid(gameId)) {
        throw new Error("Invalid game ID format");
    }

    const game = await Game.findById(gameId).populate("participants"); // ✅ Populate participants
    if (!game) {
        throw new Error("Game not found");
    }

    const player = await Player.findOne({ walletAddress });
    if (!player) {
        throw new Error("Player not found");
    }

    // Check if player is already a participant
    const isParticipant = game.participants.some(p => p && p._id.toString() === player._id.toString());
    if (!isParticipant) {
        throw new Error("Player must participate in the game before placing a bet.");
    }

    // Deduct balance from player
    player.balance -= amount;
    player.totalBetAmount += amount;
    await player.save();

    // Create and save the bet
    const bet = new Bet({
        player: player._id,
        game: game._id,
        amount,
        currency,
        usdEquivalent: amount * 1.2,
        betOption: "someOption",
        exchangeRate: 1.2,
    });

    await bet.save();

    // Update game total bet amount
    game.totalBetsAmount += amount;
    await game.save();

    // **Re-populate participants before returning the game**
    const updatedGame = await Game.findById(gameId).populate("participants"); // ✅ Re-populate

    // Publish bet event
    if (pubsub) {
        console.log("📢 Publishing BET_PLACED event:", {
            gameId: game._id.toString(),
            walletAddress,
            amount,
            currency,
            totalPlayerRounds,
            game: updatedGame,
        });

        pubsub.publish("BET_PLACED", {
            betPlaced: {
                gameId: game._id.toString(),
                walletAddress,
                amount,
                currency,
                totalPlayerRounds,
                game: updatedGame // ✅ Return populated game
            }
        });
    }

    return {
        gameId: game._id.toString(),
        walletAddress,
        amount: bet.amount,
        currency: bet.currency,
        totalPlayerRounds,
        game: updatedGame // ✅ Ensure participants are fully populated
    };
};

module.exports = { placeBet };
