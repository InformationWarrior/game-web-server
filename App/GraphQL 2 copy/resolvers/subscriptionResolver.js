const subscriptionResolver = {
    Subscription: {
      playerJoined: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['PLAYER_JOINED']),
      },
      moveMade: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['MOVE_MADE']),
      },
    },
  };
  
  module.exports = subscriptionResolver;
  