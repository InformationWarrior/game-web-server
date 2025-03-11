// const pubsub = require('../pubsub');
// const Game = require("../../models/game");
// const Round = require("../../models/round"); // ✅ Added missing import
// const mongoose = require("mongoose");
// const GAME_ID = process.env.GAME_ID;

// // Define game states with durations
// const GAME_STATES = {
//   RESET: { gameState: 'RESET', duration: 5, mappedState: 'waiting' },
//   BETTING: { gameState: 'BETTING', duration: 10, mappedState: 'in-progress' },
//   RUNNING: { gameState: 'RUNNING', duration: 3, mappedState: 'in-progress' },
//   END: { gameState: 'END', duration: 3, mappedState: 'completed' }
// };

// // Initialize game state
// let currentGameState = {
//   ...GAME_STATES.RESET,
//   remainingTime: GAME_STATES.RESET.duration
// };

// // Start the game state loop
// const gameStateUpdate = () => {
//   updateState();
// };

// // ✅ Update game state in the database
// const updateGameStateInDB = async (gameId, newState, state) => {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(gameId)) return;
//     await Game.findByIdAndUpdate(gameId, { state: newState }, { new: true });
//     console.log(`Game state updated in DB: ${newState} (${state.gameState})`);
//   } catch (error) {
//     console.error("Error updating game state in DB:", error);
//   }
// };

// // ✅ Increment round when transitioning from END → RESET
// const incrementRound = async (gameId) => {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(gameId)) return;

//     const game = await Game.findById(gameId);
//     if (!game) return console.error("Game not found!");

//     // Create a new round
//     const newRound = new Round({
//       game: gameId,
//       roundNumber: game.totalRounds + 1,
//       participants: [],
//       bets: [],
//       winner: null,
//       createdAt: new Date()
//     });

//     await newRound.save();

//     // Update game document with new round reference
//     game.rounds.push(newRound._id);
//     game.latestRound = newRound._id;
//     game.totalRounds += 1;
//     await game.save();

//     console.log(`✅ New Round ${game.totalRounds} started for Game ${gameId}`);
//   } catch (error) {
//     console.error("❌ Error incrementing round:", error);
//   }
// };

// // ✅ Update game state & handle transitions
// const updateState = async () => {
//   pubsub.publish("GAME_STATUS_UPDATED", { gameStatusUpdated: currentGameState });

//   if (currentGameState.remainingTime > 0) {
//     currentGameState.remainingTime--;
//     setTimeout(updateState, 1000);
//   } else {
//     // Transition to the next state
//     switch (currentGameState.gameState) {
//       case 'RESET':
//         console.log("🛑 RESET: Removing participants and bets...");

//         currentGameState = { ...GAME_STATES.BETTING, remainingTime: GAME_STATES.BETTING.duration };
//         break;

//       case 'BETTING':
//         console.log("🟢 BETTING: Accepting bets...");
//         currentGameState = { ...GAME_STATES.RUNNING, remainingTime: GAME_STATES.RUNNING.duration };
//         break;

//       case 'RUNNING':
//         console.log("🎡 RUNNING: Spinning the wheel...");
//         currentGameState = { ...GAME_STATES.END, remainingTime: GAME_STATES.END.duration };
//         break;

//       case 'END':
//         console.log("🏆 END: Determining winner and resetting game...");
//         await incrementRound(GAME_ID);
//         currentGameState = { ...GAME_STATES.RESET, remainingTime: GAME_STATES.RESET.duration };
//         break;

//       default:
//         console.log("⚠️ Unknown state! Resetting game...");
//         currentGameState = { ...GAME_STATES.RESET, remainingTime: GAME_STATES.RESET.duration };
//         break;
//     }

//     // ✅ Update the game schema's `state` field
//     await updateGameStateInDB(GAME_ID, currentGameState.mappedState, currentGameState);

//     // Publish the new state
//     pubsub.publish("GAME_STATUS_UPDATED", { gameStatusUpdated: currentGameState });

//     // Start next state transition immediately
//     setTimeout(updateState, 1000);
//   }
// };

// module.exports = gameStateUpdate;
