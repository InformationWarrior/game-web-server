const { withFilter } = require("graphql-subscriptions");

const subscriptionResolver = {
  Subscription: {
    gameUpdated: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.subscribe("GAME_UPDATED"),
        (payload, variables) => payload.gameUpdated._id.toString() === String(variables.gameId)
      ),
    },
    playerJoined: {
      subscribe: (_, __, { pubsub }) => pubsub.subscribe("PLAYER_JOINED"),
    },
  },
};

module.exports = subscriptionResolver;
