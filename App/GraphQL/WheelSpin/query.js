const queryResolvers = {
    Query: {
        getGameStatus: () => currentGameState,
    },
};

module.exports = queryResolvers;
