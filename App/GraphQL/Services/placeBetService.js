const Game = require("../../models/game");
const Player = require("../../models/player");
const mongoose = require("mongoose");

const placeBet = async (gameId, walletAddress, amount, currency, totalPlayerRounds, pubsub) => {
    if (!mongoose.Types.ObjectId.isValid(gameId)) {
        throw new Error("Invalid game ID format");
    }

    const game = await Game.findById(gameId);
    if (!game) {
        throw new Error("Game not found");
    }

    const player = await Player.findOne({ walletAddress });
    if (!player) {
        throw new Error("Player not found");
    }

    // Check if player is already a participant
    const isParticipant = game.participants.some(p => p.toString() === player._id.toString());
    if (!isParticipant) {
        throw new Error("Player must participate in the game before placing a bet.");
    }

    // Validate amount and totalPlayerRounds
    if (amount <= 0) {
        throw new Error("Bet amount must be greater than zero.");
    }

    if (totalPlayerRounds <= 0) {
        throw new Error("Total player rounds must be greater than zero.");
    }

    // Deduct balance from player
    if (player.balance < amount) {
        throw new Error("Insufficient balance to place the bet.");
    }
    player.balance -= amount;
    await player.save();

    // Store bet in game object
    game.bets.push({
        walletAddress,
        amount,
        currency,
        totalPlayerRounds,
    });

    await game.save();

    // Fetch the updated game
    const updatedGame = await Game.findById(gameId).populate("participants");

    // Publish bet event (if needed)
    // if (pubsub) {
    //     pubsub.publish("BET_PLACED", {
    //         betPlaced: {
    //             gameId,
    //             walletAddress,
    //             amount,
    //             currency,
    //             totalPlayerRounds,
    //             game: updatedGame
    //         }
    //     });

    //     // ✅ Also publish `PLAYER_PARTICIPATED`
    //     console.log(`📢 Publishing PLAYER_PARTICIPATED for ${walletAddress} in game ${gameId}`);
    //     pubsub.publish("PLAYER_PARTICIPATED", {
    //         playerParticipated: {
    //             gameId,
    //             walletAddress,
    //             game: updatedGame
    //         }
    //     });
    // }



    return {
        gameId,
        walletAddress,
        amount,
        currency,
        totalPlayerRounds,
        game: updatedGame
    };
};

module.exports = { placeBet };
