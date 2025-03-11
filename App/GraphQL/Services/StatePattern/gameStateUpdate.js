const Game = require("../../../models/game");
const GameContext = require("./GameContext");
const GAME_ID = process.env.GAME_ID;

const gameStateUpdate = async () => {
    try {
        const game = await Game.findById(GAME_ID);
        if (!game) throw new Error("Game not found");

        const gameContext = new GameContext(game);
        gameContext.start();
    } catch (error) {
        console.error("Error starting game state update:", error);
    }
};

module.exports = gameStateUpdate;
