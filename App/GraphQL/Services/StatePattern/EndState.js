const GameState = require("./GameState");

class EndState extends GameState {
    async handle(gameContext) {
        // console.log("🏆 END: Determining winner and resetting game...");

        await gameContext.incrementRound(gameContext.game._id);

        // Lazy import to avoid circular dependency
        const ResetState = require("./ResetState");
        gameContext.setState(new ResetState(gameContext.game));
    }

    getStateKey() {
        return "END"; // Matches `GAME_STATES`
    }
}

module.exports = EndState;
