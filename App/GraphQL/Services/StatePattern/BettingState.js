const GameState = require("./GameState");
const RunningState = require('./RunningState');

class BettingState extends GameState {
    async handle(gameContext) {
        // console.log("🟢 BETTING: Accepting bets...");
        gameContext.setState(new RunningState(gameContext.game));
    }

    getStateKey() {
        return "BETTING"; // Matches `GAME_STATES`
    }
}

module.exports = BettingState;