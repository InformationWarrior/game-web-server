const pubsub = require("../pubsub");
const { GAME_STATUS_UPDATED } = require("./constants");

const gameStateUpdate = () => {
  setInterval(() => {
    const states = ["RESET", "BETTING", "RUNNING", "END"];
    const state = states[Math.floor(Math.random() * states.length)];
    const remainingTime = Math.floor(Math.random() * 30) + 5;

    const gameStatus = { state, remainingTime };

    pubsub.publish(GAME_STATUS_UPDATED, { gameStatusUpdated: gameStatus });
    console.log("📢 Game State Update:", gameStatus);
  }, 2000);
};

module.exports = gameStateUpdate;
