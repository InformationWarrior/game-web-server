class GameState {
    constructor(game) {
        this.game = game;
    }

    async handle() {
        throw new Error("handle() must be implemented in the subclass");
    }
}

module.exports = GameState;