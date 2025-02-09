const Game = require("../../../../models/game");
const Player = require("../../../../models/player");
const mongoose = require("mongoose");

const createGame = async (name, type, maxPlayers) => {
    if (!["single", "multiplayer"].includes(type)) {
        throw new Error("Invalid game type. Allowed values: single, multiplayer.");
    }

    const game = new Game({
        name,
        type,
        maxPlayers,
        state: "waiting",
        players: [],
    });

    await game.save();
    return game;
};

const getGames = async () => {
    const games = await Game.find().populate("players").lean();
    return games.map(game => ({
        id: game._id.toString(),
        name: game.name,
        type: game.type,
        state: game.state,
        players: game.players,
    }));
};

const getGameById = async (id) => {
    const game = await Game.findById(id).populate("players");
    if (!game) throw new Error("Game not found");

    return {
        id: game._id.toString(),
        name: game.name,
        type: game.type,
        state: game.state,
        players: game.players,
    };
};

const joinGame = async (gameId, walletAddress, pubsub) => {
    if (!mongoose.Types.ObjectId.isValid(gameId)) {
        throw new Error("Invalid game ID format");
    }

    const game = await Game.findById(new mongoose.Types.ObjectId(gameId));
    if (!game) {
        throw new Error("Game not found");
    }

    const player = await Player.findOne({ walletAddress });
    if (!player) {
        throw new Error("Player not found");
    }

    if (game.players.length >= game.maxPlayers) {
        throw new Error("Game is full. Cannot join.");
    }

    if (game.players.some(id => id.equals(player._id))) {
        throw new Error("Player already joined the game");
    }

    game.players.push(player._id);
    await game.save();

    const updatedGame = await Game.findById(game._id).populate("players");

    pubsub.publish("PLAYER_JOINED", { playerJoined: player });

    return updatedGame;
};

module.exports = {
    createGame,
    getGames,
    getGameById,
    joinGame,
};
