const pubsub = require("../pubsub");
const { GAME_STATUS_UPDATED } = require("./constants");

const GAME_STATES = {
  RESET: { gameState: "RESET", remainingTime: 300 },
  BETTING: { gameState: "BETTING", remainingTime: 300 },
  RUNNING: { gameState: "RUNNING", remainingTime: 300 },
  END: { gameState: "END", remainingTime: 300 },
};

let currentGameState = GAME_STATES.RESET;

const gameStateUpdate = () => {
  updateState();
};

const updateState = () => {
  pubsub.publish(GAME_STATUS_UPDATED, { gameStatusUpdated: currentGameState });
  console.log("📢 Game State Update:", currentGameState);

  switch (currentGameState.gameState) {
    case "RESET":
      currentGameState = GAME_STATES.BETTING;
      break;
    case "BETTING":
      currentGameState = GAME_STATES.RUNNING;
      break;
    case "RUNNING":
      currentGameState = GAME_STATES.END;
      break;
    case "END":
      currentGameState = GAME_STATES.RESET;
      break;
  }

  setTimeout(updateState, currentGameState.remainingTime * 1000);
};

module.exports = gameStateUpdate;
