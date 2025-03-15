const GameState = require("./GameState");
const EndState = require("./EndState");

class RunningState extends GameState {
    async handle(gameContext) {
        console.log("🎡 RUNNING: Determining the winner...");

        // Determine the winner before transitioning to END state
        await gameContext.determineWinner(gameContext.game._id);

        // Move to the next state (END)
        gameContext.setState(new EndState(gameContext.game));
    }

    getStateKey() {
        return "RUNNING"; // Matches `GAME_STATES`
    }
}

module.exports = RunningState;
