const pubsub = require("../pubsub");
const { GAME_STATUS_UPDATED } = require("./services/constants");

const subscriptionResolvers = {
    Subscription: {
        gameStatusUpdated: {
            subscribe: () => pubsub.subscribe(GAME_STATUS_UPDATED),
        },
    },
};

module.exports = subscriptionResolvers;
