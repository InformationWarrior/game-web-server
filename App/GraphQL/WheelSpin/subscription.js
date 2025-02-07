const pubsub = require("../pubsub");
const { BET_PLACED, GAME_STATUS_UPDATED } = require("./constants");

const subscriptionResolvers = {
    Subscription: {
        // betPlaced: {
        //     subscribe: () => pubsub.subscribe([BET_PLACED]),
        // },
        gameStatusUpdated: {
            subscribe: () => pubsub.subscribe(GAME_STATUS_UPDATED),
        },
    },
};

module.exports = subscriptionResolvers;
