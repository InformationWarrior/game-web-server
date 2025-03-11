const GameState = require("./GameState");
const EndState = require('./EndState');

class RunningState extends GameState {
    async handle(gameContext) {
        // console.log("🎡 RUNNING: Spinning the wheel...");

        gameContext.setState(new EndState(gameContext.game));
    }

    getStateKey() {
        return "RUNNING"; // Matches `GAME_STATES`
    }
}

module.exports = RunningState;