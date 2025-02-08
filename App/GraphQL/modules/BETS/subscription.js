const subscriptionResolver = {
  Subscription: {
    playerJoined: {
      subscribe: () => pubsub.subscribe('PLAYER_JOINED'),
    },
    moveMade: {
      subscribe: (_, __, { pubsub }) => pubsub.subscribe('MOVE_MADE'),
    },
    selectionAdded: {
      subscribe: () => pubsub.subscribe("SELECTION_ADDED"),
    }
  },
};

module.exports = subscriptionResolver;
