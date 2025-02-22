const mongoose = require('mongoose');
const Game = require("../../models/game");
const Player = require("../../models/player");
const Bet = require("../../models/bet");

const createGame = async (name, type, maxPlayers, maxParticipants) => {
    const normalizedType = type.toLowerCase();

    if (!['single', 'multiplayer'].includes(normalizedType)) {
        throw new Error('Invalid game type. Allowed values: single, multiplayer.');
    }

    if (maxParticipants > maxPlayers) {
        throw new Error('maxParticipants cannot be greater than maxPlayers.');
    }

    const game = new Game({
        name,
        type: normalizedType,
        maxPlayers,
        maxParticipants,
        state: 'waiting',
        enteredPlayers: [],
        participants: [],
        spectators: []
    });

    await game.save();
    return game;
};

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

    // Check if player is already in enteredPlayers
    const isAlreadyEntered = game.enteredPlayers.some((p) => p.toString() === player._id.toString());
    if (isAlreadyEntered) {
        throw new Error('Player has already entered this game.');
    }

    // Ensure max players limit is not exceeded
    if (game.enteredPlayers.length >= game.maxPlayers) {
        throw new Error('Game is full. No more players can enter.');
    }

    // Add player to enteredPlayers and update the game
    game.enteredPlayers.push(player._id);

    const updatedGame = await Game.findByIdAndUpdate(
        gameId,
        { enteredPlayers: game.enteredPlayers },
        { new: true }
    ).populate('enteredPlayers participants spectators');

    // ✅ Publish player entered event for real-time updates
    const playerEnteredPayload = {
        playerEntered: {
            gameId,
            walletAddress: player.walletAddress, // Required for filtering
            username: player.username,
            profileImage: player.profileImage,
            balance: player.balance,
        },
    };

    console.log("📢 Publishing PLAYER_ENTERED:", playerEnteredPayload);
    await pubsub.publish('PLAYER_ENTERED', playerEnteredPayload);

    return updatedGame;
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

const removeParticipants = async (gameId) => {
    try {
        const game = await Game.findById(gameId);
        if (!game) {
            throw new Error("Game not found");
        }

        // ✅ Clear all participants
        game.participants = [];

        // ✅ Clear all bets for this game
        await Bet.deleteMany({ game: gameId });

        // ✅ Reset totalBetsAmount in the game
        game.totalBetsAmount = 0;

        await game.save();

        console.log(`✅ Participants and bets removed for game: ${gameId}`);

        return { participants: [], totalBetsAmount: 0 };
    } catch (error) {
        console.error("❌ Error removing participants and bets:", error.message);
        throw new Error("Failed to remove participants and bets");
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
    if (!mongoose.Types.ObjectId.isValid(gameId)) {
        throw new Error("Invalid game ID format");
    }

    const game = await Game.findById(gameId).populate("participants");
    if (!game) {
        throw new Error("Game not found");
    }

    return game.participants;
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

module.exports = {
    createGame,
    createPlayer,
    enterGame,
    leaveGame,
    participateInGame,
    removeParticipants,
    getEnteredPlayers,
    getParticipants,
};