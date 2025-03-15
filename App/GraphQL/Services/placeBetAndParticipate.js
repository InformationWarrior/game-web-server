const Game = require("../../models/game");
const Player = require("../../models/player");
const Round = require("../../models/round");
const Bet = require("../../models/bet");

const placeBetAndParticipate = async (gameId, walletAddress, betAmount, currency, pubsub) => {
    try {
        // 1. Find the game
        const game = await Game.findById(gameId);
        if (!game) throw new Error("Game not found");

        // 2. Find the player
        const player = await Player.findOne({ walletAddress });
        if (!player) throw new Error("Player not found");

        // 3. Get the latest round
        const latestRound = await Round.findById(game.latestRound);
        if (!latestRound) throw new Error("Latest round is missing");

        // 4. Ensure the player hasn't already participated
        if (latestRound.participants.includes(player._id)) throw new Error("Player has already placed a bet");

        // 5. Add player to round participants
        latestRound.participants.push(player._id);

        // 6. Create and save the bet
        const bet = new Bet({
            game: gameId,
            player: player._id,
            round: latestRound._id, // ✅ Link the bet to this round
            amount: betAmount,
            currency,
            betOption: "default",
            usdEquivalent: betAmount * 0.5, // Example conversion
            exchangeRate: 0.5, // Replace with actual exchange rate
            strategy: "manual",
        });
        await bet.save();

        // 🔹 **Push the bet into the `bets` array of the round**
        latestRound.bets.push(bet._id);

        // 7. Save round changes (✅ Now includes bets)
        await latestRound.save();

        // 8. Fetch updated participants and bets
        const participants = await Player.find({ _id: { $in: latestRound.participants } }).select("walletAddress username color");
        const bets = await Bet.find({ round: latestRound._id }).populate("player");

        // 9. Calculate total bet amount
        const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);

        // 11. Prepare the `RoundUpdatedPayload`
        const roundPayload = {
            _id: latestRound._id,
            gameId: game._id.toString(),
            roundNumber: latestRound.roundNumber,
            participants: participants.map((p) => {
                const playerBet = bets.find((b) => b.player.walletAddress === p.walletAddress);
                const playerBetAmount = playerBet ? playerBet.amount : 0;
                const playerWinningChance = totalBetAmount > 0
                    ? ((playerBetAmount / totalBetAmount) * 100).toFixed(2)
                    : "0.00";

                return {
                    walletAddress: p.walletAddress,
                    username: p.username,
                    color: p.color || "#FFFFFF",
                    betAmount: playerBetAmount,
                    currency: playerBet ? playerBet.currency : "ETH",
                    winningChance: playerWinningChance,
                };
            }),
            bets: bets.map((bet) => ({
                id: bet.id,
                game: bet.game,
                player: {
                    walletAddress: bet.player.walletAddress,
                    username: bet.player.username,
                    color: bet.player.color || "#FFFFFF",
                },
                amount: bet.amount,
                currency: bet.currency,
                betOption: bet.betOption,
                usdEquivalent: bet.usdEquivalent,
                exchangeRate: bet.exchangeRate,
                transactionHash: bet.transactionHash || "",
                timestamp: bet.timestamp.toISOString(),
                multiBet: bet.multiBet || false,
                strategy: bet.strategy,
            })),
            totalBetAmount,
            winner: latestRound.winner || null,
            startedAt: latestRound.startedAt.toISOString(),
        };

        // 12. Publish **roundUpdated** subscription
        if (pubsub) {
            pubsub.publish("ROUND_UPDATED", { roundUpdated: roundPayload });
        }

        return roundPayload; // ✅ Return updated round details
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { placeBetAndParticipate };
