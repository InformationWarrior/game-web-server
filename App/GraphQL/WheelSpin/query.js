const queryResolvers = {
    Query: {
        getGameStatus: () => ({
            state: "RESET",
            remainingTime: 10,
        }),
        //getPlacedBets: () => [],
    },
};

module.exports = queryResolvers;
