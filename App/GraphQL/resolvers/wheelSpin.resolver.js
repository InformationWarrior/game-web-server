const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const wheelSpinResolver = {
  Query: {
    getWheelSpinSelections: async (_, __, { models }) => {
      return await models.Selection.find();
    },
  },

  Mutation: {
    addSelection: async (_, { betAmount, totalPlayerRounds, currency }) => {
      try {
        console.log("Saving selection:", { betAmount, totalPlayerRounds, currency });
        return {
          success: true,
          message: "Selection added successfully!",
        };
      } catch (error) {
        return {
          success: false,
          message: `Failed to add selection: ${error.message}`,
        };
      }
    },
  },

  Subscription: {
    selectionAdded: {
      subscribe: () => pubsub.asyncIterator(["SELECTION_ADDED"]),
    },
  },
};

module.exports = wheelSpinResolver;
