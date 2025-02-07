const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const wheelSpinResolver = {
  Query: {
    getWheelSpinSelections: async (_, __, { models }) => {
      return await models.Selection.find();
    },
  },

  Mutation: {
    addSelection: async (_, { betAmount, totalPlayerRounds, currency }, { models }) => {
      try {
        const newSelection = new models.Selection({ betAmount, totalPlayerRounds, currency });
        await newSelection.save();

        pubsub.publish("SELECTION_ADDED", { selectionAdded: newSelection });

        return {
          success: true,
          message: "Selection added successfully!",
          selection: newSelection,
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
