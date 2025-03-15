const mongoose = require('mongoose');
const Game = require("../../models/game");
const Player = require("../../models/player");
const Bet = require("../../models/bet");
const BetHistory = require("../../models/betHistory");
const Round = require("../../models/round");
const { generateUniqueColor } = require("../Utils/colorUtils");

const createGame = async (name, type, maxPlayers) => {
    const normalizedType = type.toLowerCase();

    if (!['single', 'multiplayer'].includes(normalizedType)) {
        throw new Error('Invalid game type. Allowed values: single, multiplayer.');
    }

    // ✅ Step 1: Create Game instance
    const game = new Game({
        name,
        type: normalizedType,
        maxPlayers,
        enteredPlayers: [],
        spectators: [],
        state: "active", // Default game state
        prizePool: 0,
        jackpot: 0,
        gameLogs: [],
        rounds: [],
        latestRound: null,
        totalRounds: 0,
        startTime: new Date(),
        isActive: true,
        leaderboard: [],
        topWinners: [],
        betLimits: { min: 0, max: 0 }, // Default values, can be updated later
        houseEdge: 0.05, // Default house edge
        mode: "standard",
        customRules: [],
        config: {},
    });

    // ✅ Step 2: Save Game First (to generate an ID)
    await game.save();

    // ✅ Step 3: Create the First Round and Link to Game
    const firstRound = new Round({
        game: game._id,  // ✅ Link to game
        roundNumber: 1,
        participants: [],
        bets: [],
        winner: null,
        createdAt: new Date(),
    });

    await firstRound.save(); // ✅ Save the first round

    // ✅ Step 4: Update Game with First Round
    game.latestRound = firstRound._id;
    game.totalRounds = 1;
    game.rounds.push(firstRound._id);

    await game.save(); // ✅ Save the updated game with the round reference

    const payload = {
        _id: game._id,
        name: game.name,
        type: game.type,
        state: game.state,
        enteredPlayers: game.enteredPlayers,
        maxPlayers: game.maxPlayers,
    };

    return payload;
};

const createPlayer = async (walletAddress, username, balance, currency) => {
    try {
        let player = await Player.findOne({ walletAddress });

        // ✅ Player exists → Update username & save
        if (player) {
            console.log(`[INFO] Player exists. Updating player: ${walletAddress} -> ${username}`);
            player.username = username;
            player.balance = balance;
            player.transactions.push({
                type: "deposit",
                amount: balance,
                currency,
            });
            await player.save();
        }
        // ✅ Player does not exist → Create new player
        else {
            console.log(`[INFO] Creating new player: ${walletAddress}, Username: ${username}`);

            const uniqueColor = await generateUniqueColor();

            player = new Player({
                walletAddress,
                username,
                balance,
                color: uniqueColor,
                transactions: [
                    {
                        type: "deposit",
                        amount: balance,
                        currency,
                    },
                ],
            });
            await player.save();
        }

        console.log(`[SUCCESS] Player saved: ${walletAddress}`);

        return {
            success: true,
            message: player ? 'Player updated successfully' : 'Player created successfully',
            player,
        };
    } catch (error) {
        console.error(`[ERROR] Failed to create/update player: ${error.message}`);
        throw new Error(`Error creating player: ${error.message}`);
    }
};

const enterGame = async (gameId, walletAddress, pubsub) => {
    if (!mongoose.Types.ObjectId.isValid(gameId)) {
        throw new Error("Invalid game ID format");
    }

    // ✅ Fetch Game and Player concurrently for better performance
    const [game, player] = await Promise.all([
        Game.findById(gameId),
        Player.findOne({ walletAddress }),
    ]);

    if (!game) throw new Error("Game not found");
    if (!player) throw new Error("Player not found");

    // ✅ Check if player is already in enteredPlayers
    const isAlreadyEntered = game.enteredPlayers.includes(player._id);

    if (isAlreadyEntered) {
        console.warn(`⚠️ Player ${walletAddress} already entered Game ${gameId}`);
    } else {
        if (game.enteredPlayers.length >= game.maxPlayers) {
            throw new Error(`Game has reached the maximum player limit: ${game.maxPlayers}.`);
        }

        // ✅ Add player to enteredPlayers and update the game
        game.enteredPlayers.push(player._id);
        await game.save(); // Save only if player was newly added

        // ✅ Publish player entered event for real-time updates
        const playerEnteredPayload = {
            playerEntered: {
                gameId,
                walletAddress: player.walletAddress,
                username: player.username,
            },
        };

        console.log("📢 Publishing PLAYER_ENTERED:", playerEnteredPayload);
        await pubsub.publish("PLAYER_ENTERED", playerEnteredPayload);
    }

    // ✅ Return `PlayerEnteredPayload` instead of `Game`
    return {
        gameId,
        walletAddress: player.walletAddress,
        username: player.username,
    };
};

const leaveGame = async (gameId, walletAddress, pubsub) => {
    if (!mongoose.Types.ObjectId.isValid(gameId)) {
        throw new Error('Invalid game ID format');
    }

    const game = await Game.findById(gameId);
    if (!game) {
        throw new Error('Game not found');
    }

    const player = await Player.findOne({ walletAddress });
    if (!player) {
        throw new Error('Player not found');
    }

    // Check if the player is in the game
    const isEntered = game.enteredPlayers.some((p) => p.toString() === player._id.toString());
    if (!isEntered) {
        throw new Error('Player is not in this game.');
    }

    // Remove player from all categories
    game.enteredPlayers = game.enteredPlayers.filter((p) => p.toString() !== player._id.toString());
    game.participants = game.participants.filter((p) => p.toString() !== player._id.toString());
    game.spectators = game.spectators.filter((p) => p.toString() !== player._id.toString());

    // Save changes
    await game.save();

    // Populate updated game data
    const updatedGame = await Game.findById(gameId).populate(
        'enteredPlayers participants spectators'
    );

    return updatedGame;
};

const getBetHistoryByWallet = async (walletAddress) => {
    try {
        // Step 1: Find the player using wallet address
        const player = await Player.findOne({ walletAddress });
        if (!player) {
            throw new Error("Player not found");
        }
        console.log("Player found >>>>>> ", player);
        // Step 2: Fetch bet history based on player ID
        const betHistory = await BetHistory.find({ player: player._id })
            .populate("player", "username") // Populate only the username from Player
            .select("amount winAmount player");
        console.log("Bet History >>>>> ", betHistory);
        // Step 3: Format the response
        return betHistory.map(bet => ({
            amount: bet.amount,
            winAmount: bet.winAmount,
            username: bet.player?.username || "Unknown", // Handle missing username
        }));
    } catch (error) {
        console.error("Error fetching bet history:", error);
        throw new Error("Failed to fetch bet history.");
    }
};

const getEnteredPlayers = async (gameId) => {
    if (!mongoose.Types.ObjectId.isValid(gameId)) {
        throw new Error("Invalid game ID format");
    }
    try {
        const game = await Game.findById(gameId).populate("enteredPlayers");

        if (!game) {
            throw new Error("Game not found");
        }

        const payload = game.enteredPlayers.map(player => ({
            gameId: gameId,
            walletAddress: player.walletAddress,
            username: player.username
        }));

        return payload || [];
    } catch (error) {
        throw new Error("Failed to fetch entered players");
    }
};

const getParticipantsAndBets = async (gameId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(gameId)) {
            throw new Error("Invalid game ID format");
        }

        // ✅ Fetch the latest round for the game
        const latestRound = await Round.findOne({ game: gameId })
            .sort({ roundNumber: -1 })
            .populate("participants", "walletAddress username")
            .populate({
                path: "bets",
                populate: { path: "player", select: "walletAddress username" },
            });

        if (!latestRound) throw new Error("No rounds found for this game");

        // ✅ Create a map of bet amounts for participants
        const betMap = new Map(
            latestRound.bets.map((bet) => [
                bet.player._id.toString(),
                { amount: bet.amount, currency: bet.currency },
            ])
        );

        // ✅ Format participants response
        const participants = latestRound.participants.map((participant) => ({
            walletAddress: participant.walletAddress,
            username: participant.username,
            betAmount: betMap.get(participant._id.toString())?.amount || 0,
            currency: betMap.get(participant._id.toString())?.currency || "ETH",
        }));

        // ✅ Format bets response
        const formattedBets = latestRound.bets.map((bet) => ({
            id: bet.id,
            game: bet.game,
            player: {
                walletAddress: bet.player.walletAddress || "Unknown",
                username: bet.player.username || "Unknown",
            },
            amount: bet.amount,
            currency: bet.currency,
            betOption: bet.betOption || "default",
            usdEquivalent: bet.usdEquivalent || 0,
            exchangeRate: bet.exchangeRate || 0,
            transactionHash: bet.transactionHash || "",
            timestamp: bet.timestamp.toISOString(),
            multiBet: bet.multiBet || false,
            strategy: bet.strategy || "manual",
        }));

        return { participants, bets: formattedBets };
    } catch (error) {
        throw new Error(error.message);
    }
};

const getAllGames = async () => {
    try {
        const games = await Game.find()
        return games
    } catch (error) {
        throw new Error('Error fetching games')
    }
}

module.exports = {
    createGame,
    createPlayer,
    enterGame,
    leaveGame,
    getParticipantsAndBets,
    getEnteredPlayers,
    getAllGames,
    getBetHistoryByWallet
};