const pubsub = require("../pubsub");
const { BET_PLACED, GAME_STATE_UPDATED } = require("./constants");

const subscriptionResolvers = {
    Subscription: {
        betPlaced: {
            subscribe: () => pubsub.subscribe([BET_PLACED]),
        },
        gameStateUpdated: {
            subscribe: () => pubsub.subscribe(GAME_STATE_UPDATED),
        },
    },
};

module.exports = subscriptionResolvers;
