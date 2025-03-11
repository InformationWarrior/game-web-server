const GameState = require("./GameState");
const BettingState  = require('./BettingState');

class ResetState extends GameState {
    async handle(gameContext) {
        // console.log("🛑 RESET: Removing participants and bets...");

        gameContext.setState(new BettingState(gameContext.game));
    }

    getStateKey() {
        return "RESET"; // Matches `GAME_STATES`
    }
}


module.exports = ResetState;