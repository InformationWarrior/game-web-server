const pubsub = require("../pubsub");
const { GAME_STATE_UPDATED } = require("./constants");

const gameStateUpdate = () => {
  setInterval(() => {
    const states = ["RESET", "BETTING", "RUNNING", "END"];
    const state = states[Math.floor(Math.random() * states.length)];
    const remainingTime = Math.floor(Math.random() * 30) + 5;

    const gameState = { state, remainingTime };

    pubsub.publish(GAME_STATE_UPDATED, { gameStateUpdated: gameState });
    console.log("📢 Game State Update:", gameState);
  }, 2000);
};

module.exports = gameStateUpdate;
