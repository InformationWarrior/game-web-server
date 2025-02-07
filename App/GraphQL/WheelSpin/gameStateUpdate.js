const pubsub = require("../pubsub");
const { GAME_STATUS_UPDATED } = require("./constants");

// Define your game states with a duration (full time) for each
const GAME_STATES = {
  RESET: { gameState: "RESET", duration: 5 },
  BETTING: { gameState: "BETTING", duration: 7 },
  RUNNING: { gameState: "RUNNING", duration: 3 },
  END: { gameState: "END", duration: 3 },
};

// Start with the RESET state and initialize remainingTime to its full duration
let currentGameState = {
  ...GAME_STATES.RESET,
  remainingTime: GAME_STATES.RESET.duration
};

const gameStateUpdate = () => {
  updateState();
};

const updateState = () => {
  // Publish the current state with the current remainingTime
  pubsub.publish(GAME_STATUS_UPDATED, { gameStatusUpdated: currentGameState });
  console.log("📢 Game State Update:", currentGameState);

  // If remaining time is greater than 0, decrement and schedule the next update in 1 second
  if (currentGameState.remainingTime > 0) {
    currentGameState.remainingTime--;
    setTimeout(updateState, 1000);
  } else {
    // When the countdown reaches 0, transition to the next state
    switch (currentGameState.gameState) {
      case "RESET":
        currentGameState = {
          ...GAME_STATES.BETTING,
          remainingTime: GAME_STATES.BETTING.duration
        };
        break;
      case "BETTING":
        currentGameState = {
          ...GAME_STATES.RUNNING,
          remainingTime: GAME_STATES.RUNNING.duration
        };
        break;
      case "RUNNING":
        currentGameState = {
          ...GAME_STATES.END,
          remainingTime: GAME_STATES.END.duration
        };
        break;
      case "END":
        currentGameState = {
          ...GAME_STATES.RESET,
          remainingTime: GAME_STATES.RESET.duration
        };
        break;
      default:
        // In case of an unknown state, fallback to RESET
        currentGameState = {
          ...GAME_STATES.RESET,
          remainingTime: GAME_STATES.RESET.duration
        };
        break;
    }
    // Publish the new state immediately and then continue the countdown
    pubsub.publish(GAME_STATUS_UPDATED, { gameStatusUpdated: currentGameState });
    setTimeout(updateState, 1000);
  }
};

module.exports = gameStateUpdate;
