const queryResolvers = {
    Query: {
        getGameStatus: () => currentGameState,
        //getPlacedBets: () => [],
    },
};

module.exports = queryResolvers;
