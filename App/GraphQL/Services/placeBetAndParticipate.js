const Game = require("../../models/game");
const Player = require("../../models/player");
const Bet = require("../../models/bet");


const placeBetAndParticipate = async (gameId, walletAddress, betAmount, currency, pubsub) => {
    try {
        // 1. Find the game
        const game = await Game.findById(gameId);
        if (!game) throw new Error("Game not found");

        // 2. Find the player
        const player = await Player.findOne({ walletAddress });
        if (!player) throw new Error("Player not found");

        // 3. Validate balance
        // if (player.balance < betAmount) throw new Error("Insufficient balance");

        // 4. Get current round
        const latestRound = game.latestRound; // Ensure this field exists in the Game model
        if (!latestRound) throw new Error("Latest round is missing");

        // 4. Check if player is already a participant
        if (game.participants.includes(player._id)) throw new Error("Player has already placed a bet");

        // 5. Deduct bet amount & save player
        // player.balance -= betAmount;
        await player.save();

        // 6. Add player as a participant (store reference)
        game.participants.push(player._id);

        // 7. Create & save bet
        const bet = new Bet({
            game: gameId,
            player: player._id,
            round: latestRound, // 🔥 **Adding required round**
            amount: betAmount,
            currency: currency, // Assuming default currency
            betOption: "default", // Add logic to pass actual bet option
            usdEquivalent: betAmount * 0.5, // Example conversion, replace with actual rate
            exchangeRate: 0.5, // Replace with actual rate
            strategy: "manual",
        });
        await bet.save();

        // 8. Update total bet amount
        // game.totalBetsAmount += betAmount;
        await game.save();

        // 9. Publish subscription events
        const participantPayload = { walletAddress, username: player.username, betAmount, currency };
        if (pubsub) {
            pubsub.publish("PLAYER_PARTICIPATED", { playerParticipated: participantPayload });

            pubsub.publish("BET_PLACED", { betPlaced: bet });
        }

        return participantPayload;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { placeBetAndParticipate };