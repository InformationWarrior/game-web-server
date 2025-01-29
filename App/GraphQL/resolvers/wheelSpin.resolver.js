const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const wheelSpinResolver = {
  Mutation: {
    placeBet: async (_, { currency, betAmount, totalPlayerRounds }) => {
      try {
        const placedBet = {
          _id: new Date().toISOString(), // Replace with actual DB ID
          currency,
          betAmount,
          totalPlayerRounds,
        };

        console.log(placedBet);
        // Publish event for subscriptions
        pubsub.publish("BET_PLACED", { betPlaced: { success: true, message: "Bet placed!", placedBet } });

        return {
          success: true,
          message: "Bet placed successfully!",
          placedBet,
        };
      } catch (error) {
        return {
          success: false,
          message: `Failed to place bet: ${error.message}`,
        };
      }
    },
  },

  Subscription: {
    betPlaced: {
      subscribe: () => pubsub.asyncIterator(["BET_PLACED"]),
    },
  },
};

module.exports = wheelSpinResolver;
