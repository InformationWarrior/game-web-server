const mongoose = require('mongoose');
const Game = require("../../models/game");
const Player = require("../../models/player");
const Bet = require("../../models/bet");
const BetHistory = require("../../models/betHistory");
const Round = require("../../models/round");

const createGame = async (name, type, maxPlayers, maxParticipants) => {
    const normalizedType = type.toLowerCase();

    if (!['single', 'multiplayer'].includes(normalizedType)) {
        throw new Error('Invalid game type. Allowed values: single, multiplayer.');
    }

    if (maxParticipants > maxPlayers) {
        throw new Error('maxParticipants cannot be greater than maxPlayers.');
    }

    // ✅ Step 1: Create Game (but DO NOT save it yet)
    const game = new Game({
        name,
        type: normalizedType,
        maxPlayers,
        maxParticipants,
        state: 'waiting',
        enteredPlayers: [],
        participants: [],
        spectators: [],
        rounds: [],
        totalRounds: 0,
        latestRound: null // Will be set later
    });

    // ✅ Step 2: Save Game First (so it gets an ID)
    await game.save();

    // ✅ Step 3: Create First Round with game._id
    const firstRound = new Round({
        game: game._id,  // ✅ Ensure game ID is assigned
        participants: [],
        bets: [],
        winner: null,
        roundNumber: 1
    });

    await firstRound.save(); // ✅ Save the round first

    // ✅ Step 4: Update Game with latestRound
    game.latestRound = firstRound._id;
    game.totalRounds = 1;
    game.rounds.push(firstRound._id);

    await game.save(); // ✅ Now save the updated game

    return game;
};


// const enterGame = async (gameId, walletAddress, pubsub) => {
//     if (!mongoose.Types.ObjectId.isValid(gameId)) {
//         throw new Error('Invalid game ID format');
//     }

//     const game = await Game.findById(gameId);
//     if (!game) {
//         throw new Error('Game not found');
//     }

//     const player = await Player.findOne({ walletAddress });
//     if (!player) {
//         throw new Error('Player not found');
//     }

//     // Check if player is already in enteredPlayers
//     const isAlreadyEntered = game.enteredPlayers.some((p) => p.toString() === player._id.toString());
//     if (isAlreadyEntered) {
//         throw new Error('Player has already entered this game.');
//     }

//     // Ensure max players limit is not exceeded
//     if (game.enteredPlayers.length >= game.maxPlayers) {
//         throw new Error('Game is full. No more players can enter.');
//     }

//     // Add player to enteredPlayers and update the game
//     game.enteredPlayers.push(player._id);

//     const updatedGame = await Game.findByIdAndUpdate(
//         gameId,
//         { enteredPlayers: game.enteredPlayers },
//         { new: true }
//     ).populate('enteredPlayers participants spectators');

//     // ✅ Publish player entered event for real-time updates
//     const playerEnteredPayload = {
//         playerEntered: {
//             gameId,
//             walletAddress: player.walletAddress, // Required for filtering
//             username: player.username,
//             profileImage: player.profileImage,
//             balance: player.balance,
//         },
//     };

//     console.log("📢 Publishing PLAYER_ENTERED:", playerEnteredPayload);
//     await pubsub.publish('PLAYER_ENTERED', playerEnteredPayload);

//     return updatedGame;
// };

const enterGame = async (gameId, walletAddress, pubsub) => {
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

    // ✅ Check if player is already in enteredPlayers
    const isAlreadyEntered = game.enteredPlayers.some((p) => p.toString() === player._id.toString());

    if (!isAlreadyEntered) {
        // Ensure max players limit is not exceeded
        if (game.enteredPlayers.length >= game.maxPlayers) {
            throw new Error('Game is full. No more players can enter.');
        }

        // Add player to enteredPlayers and update the game
        game.enteredPlayers.push(player._id);
        await game.save(); // Save the updated game state
    }

    // ✅ Fetch updated game with populated players
    const updatedGame = await Game.findById(gameId).populate('enteredPlayers participants spectators');

    // ✅ Publish player entered event for real-time updates (only if newly added)
    if (!isAlreadyEntered) {
        const playerEnteredPayload = {
            playerEntered: {
                gameId,
                walletAddress: player.walletAddress,
                username: player.username,
                profileImage: player.profileImage,
                balance: player.balance,
            },
        };

        console.log("📢 Publishing PLAYER_ENTERED:", playerEnteredPayload);
        await pubsub.publish('PLAYER_ENTERED', playerEnteredPayload);
    }

    return updatedGame; // Always return the updated game state
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

const participateInGame = async (gameId, walletAddress, pubsub) => {
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

    // Check if the player has entered the game
    const isEntered = game.enteredPlayers.some(p => p.toString() === player._id.toString());
    if (!isEntered) {
        throw new Error('Player must enter the game before participating.');
    }

    // Check if the player is already a participant
    const isParticipant = game.participants.some(p => p.toString() === player._id.toString());
    if (isParticipant) {
        throw new Error('Player is already participating in this game.');
    }

    // Ensure max participants limit is not exceeded
    if (game.participants.length >= game.maxParticipants) {
        throw new Error('Game has reached the maximum number of participants.');
    }

    // Move player to participants list
    game.participants.push(player._id);
    await game.save();

    // Populate updated game data
    const updatedGame = await Game.findById(gameId).populate(
        'enteredPlayers participants spectators'
    );

    // Publish `playerParticipated` event
    if (pubsub) {
        pubsub.publish('PLAYER_PARTICIPATED', {
            playerParticipated: {
                gameId,
                walletAddress,
                game: updatedGame,
            },
        });
    }

    return updatedGame;
};

const removeParticipants = async (gameId, pubsub) => {
    try {
        const game = await Game.findById(gameId);
        if (!game) throw new Error("Game not found");

        // Clear participants array
        game.participants = [];
        await game.save();

        // Publish subscription event with empty participants
        if (pubsub) {
            pubsub.publish("PLAYER_PARTICIPATED", { playerParticipated: [] });
        }

        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};

// const removeBets = async (gameId, pubsub) => {
//     try {
//         // Remove all bets for the game
//         const deletedBets = await Bet.deleteMany({ game: gameId });

//         // Reset total bet amount
//         await Game.findByIdAndUpdate(gameId, { totalBetsAmount: 0 });

//         // Publish event to notify clients
//         if (pubsub) {
//             pubsub.publish("BET_PLACED", { betPlaced: [] });
//         }

//         return deletedBets.deletedCount > 0;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };




// const removeBets = async (gameId, pubsub) => {
//     try {
//         // 1. Fetch all bets for the game
//         const bets = await Bet.find({ game: gameId });

//         if (!bets.length) return false; // No bets to archive

//         // 2. Transform bets to BetHistory format
//         const archivedBets = bets.map(bet => ({
//             game: bet.game,
//             player: bet.player,
//             amount: bet.amount,
//             currency: bet.currency,
//             betOption: bet.betOption,
//             usdEquivalent: bet.usdEquivalent,
//             exchangeRate: bet.exchangeRate,
//             strategy: bet.strategy,
//             archivedAt: new Date(), // Timestamp for when it was archived
//         }));

//         // 3. Insert bets into BetHistory
//         await BetHistory.insertMany(archivedBets);

//         // 4. Remove bets from the active `Bet` collection
//         await Bet.deleteMany({ game: gameId });

//         // 5. Reset total bet amount for the game
//         await Game.findByIdAndUpdate(gameId, { totalBetsAmount: 0 });

//         // 6. Publish event to notify clients that all bets were removed
//         if (pubsub) {
//             pubsub.publish("BET_PLACED", { betPlaced: [] });
//         }

//         console.log(`Archived ${bets.length} bets and removed them from active bets.`);
//         return true;
//     } catch (error) {
//         console.error("Error archiving bets:", error);
//         throw new Error("Failed to archive and remove bets.");
//     }
// };


const removeBets = async (gameId, pubsub) => {
    try {
        // 1. Fetch all bets for the game
        const bets = await Bet.find({ game: gameId }).populate("round");

        if (!bets.length) return false; // No bets to archive

        // 2. Transform bets to BetHistory format (Include round and gameStateAtBet)
        const archivedBets = bets.map(bet => ({
            game: bet.game,
            player: bet.player,
            amount: bet.amount,
            currency: bet.currency,
            betOption: bet.betOption,
            usdEquivalent: bet.usdEquivalent,
            exchangeRate: bet.exchangeRate,
            strategy: bet.strategy,
            round: bet.round?._id, // Ensure round is included
            gameStateAtBet: bet.gameStateAtBet || "default_state", // Provide a valid value
            archivedAt: new Date(), // Timestamp for when it was archived
        }));

        // 3. Insert bets into BetHistory
        await BetHistory.insertMany(archivedBets);

        // 4. Remove bets from the active `Bet` collection
        await Bet.deleteMany({ game: gameId });

        // 5. Reset total bet amount for the game
        await Game.findByIdAndUpdate(gameId, { totalBetsAmount: 0 });

        // 6. Publish event to notify clients that all bets were removed
        if (pubsub) {
            pubsub.publish("BET_PLACED", { betPlaced: [] });
        }

        console.log(`Archived ${bets.length} bets and removed them from active bets.`);
        return true;
    } catch (error) {
        console.error("Error archiving bets:", error);
        throw new Error("Failed to archive and remove bets.");
    }
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
        return game.enteredPlayers || [];
    } catch (error) {
        throw new Error("Failed to fetch entered players");
    }
};


const getParticipants = async (gameId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(gameId)) {
            throw new Error("Invalid game ID format");
        }

        const game = await Game.findById(gameId)
            .populate({
                path: "participants",
                select: "walletAddress username",
                populate: { path: "bets", match: { game: gameId }, select: "amount" }
            });
        if (!game) throw new Error("Game not found");

        // Fetch bets for participants to include betAmount
        const bets = await Bet.find({ game: gameId }).select("player amount");
        const betMap = new Map(bets.map(bet => [bet.player.toString(), bet.amount]));

        return game.participants.map((participant) => ({
            walletAddress: participant.walletAddress,
            username: participant.username,
            betAmount: betMap.get(participant._id.toString()) || 0,
        }));
    } catch (error) {
        throw new Error(error.message);
    }
};


const getBets = async (gameId) => {
    try {
        // Find all bets for the game and return only required fields
        const bets = await Bet.find({ game: gameId }).populate("player", "walletAddress username");

        return bets.map((bet) => ({
            id: bet.id,
            game: bet.game,
            player: bet.player ? {
                walletAddress: bet.player.walletAddress || "Unknown",
                username: bet.player.username || "Unknown"
            } : { walletAddress: "Unknown", username: "Unknown" },
            amount: bet.amount,
            currency: bet.currency,
            betOption: bet.betOption,
            usdEquivalent: bet.usdEquivalent,
            exchangeRate: bet.exchangeRate,
            transactionHash: bet.transactionHash,
            timestamp: bet.timestamp,
            multiBet: bet.multiBet,
            strategy: bet.strategy,
        }));
    } catch (error) {
        throw new Error(error.message);
    }
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
            player = new Player({
                walletAddress,
                username,
                balance,
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
    participateInGame,
    removeParticipants,
    removeBets,
    getEnteredPlayers,
    getParticipants,
    getBets,
    getAllGames,
    getBetHistoryByWallet
};