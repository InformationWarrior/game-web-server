const gameState = {
    state: "RESET",
    remainingTime: 10,
};

const queryResolvers = {
    Query: {
        getGameState: () => gameState,
        getPlacedBets: () => [],
    },
};

module.exports = queryResolvers;
