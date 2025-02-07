const pubsub = require("../pubsub");
const { BET_PLACED, GAME_STATUS_UPDATED } = require("./constants");

const subscriptionResolvers = {
    Subscription: {
        gameStatusUpdated: {
            subscribe: () => pubsub.subscribe(GAME_STATUS_UPDATED),
        },
    },
};

module.exports = subscriptionResolvers;
